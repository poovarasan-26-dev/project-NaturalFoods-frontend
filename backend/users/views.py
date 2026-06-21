import os
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.db.models import Q
from django.conf import settings
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from .services import ensure_frontend_customer_records


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class FrontendTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove dynamically generated fields to avoid conflict
        self.fields.pop("username", None)
        self.fields.pop("email", None)
        self.fields.pop("password", None)
        self.fields["username"] = serializers.CharField(required=False, write_only=True, allow_blank=True)
        self.fields["email"] = serializers.CharField(required=False, write_only=True, allow_blank=True)
        self.fields["password"] = serializers.CharField(required=False, write_only=True, allow_blank=True)

    def validate(self, attrs):
        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")

        identifier = username or email
        if not identifier and not password:
            # Auto-login mode: get primary admin user
            user = User.objects.filter(role="admin").order_by("id").first() or User.objects.first()
            if user:
                self.user = user
            else:
                raise serializers.ValidationError("No users found in the system to auto-login.")
        else:
            if not identifier:
                raise serializers.ValidationError("Either username or email is required.")

            try:
                user = User.objects.get(Q(email__iexact=identifier) | Q(username__iexact=identifier))
            except User.DoesNotExist:
                user = None

            if user is not None:
                authenticate_kwargs = {
                    "username": user.email,
                    "password": password,
                }
                try:
                    authenticate_kwargs["request"] = self.context["request"]
                except KeyError:
                    pass
                self.user = authenticate(**authenticate_kwargs)
            else:
                self.user = None

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )

        # Generate tokens
        refresh = self.get_token(self.user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        # Inject user details and run onboarding checks
        onboarding = ensure_frontend_customer_records(self.user)
        data["user"] = {
            "email": self.user.email,
            "username": self.user.username,
            "role": self.user.role,
            "redirect_to": "/dashboard/" if self.user.role == "admin" else "/storefront/",
        }
        data["onboarding"] = onboarding
        return data


class FrontendTokenObtainPairView(TokenObtainPairView):
    serializer_class = FrontendTokenObtainPairSerializer


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ProfileImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("profile_image")
        if not file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user.profile_image:
            old_path = user.profile_image.path
            if os.path.isfile(old_path):
                os.remove(old_path)
        user.profile_image = file
        user.save(update_fields=["profile_image"])
        return Response({
            "profile_image": request.build_absolute_uri(user.profile_image.url)
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        if user.profile_image:
            old_path = user.profile_image.path
            if os.path.isfile(old_path):
                os.remove(old_path)
            user.profile_image = None
            user.save(update_fields=["profile_image"])
            return Response({"message": "Profile image removed."}, status=status.HTTP_200_OK)
        return Response({"error": "No profile image to delete."}, status=status.HTTP_400_BAD_REQUEST)
