from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Lead
from .serializers import LeadSerializer
from messages_app.models import Message
from users.services import get_primary_admin
from users.models import User


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
        return obj.created_by == request.user


class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Lead.objects.all()
        return Lead.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ContactSubmissionView(APIView):
    """Handle public contact form submissions from frontend"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            # Get form data
            name = request.data.get("name", "").strip()
            email = request.data.get("email", "").strip()
            phone = request.data.get("phone", "").strip()
            message_text = request.data.get("message", "").strip()

            # Validate required fields
            if not all([name, email, message_text]):
                return Response(
                    {"error": "Name, email, and message are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get primary admin
            admin = get_primary_admin()
            if not admin:
                return Response(
                    {"error": "No admin user configured"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Get or create a system user for contact submissions
            contact_user, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": name.replace(" ", "_").lower()[:30],
                    "role": "customer"
                }
            )

            # Create a Lead from the contact submission
            lead, _ = Lead.objects.get_or_create(
                email=email,
                defaults={
                    "name": name,
                    "phone": phone,
                    "company": "",
                    "status": "new",
                    "notes": f"Contact form submission: {message_text}",
                    "created_by": contact_user,
                }
            )

            # Create a Message to the admin
            Message.objects.create(
                sender=contact_user,
                recipient=admin,
                subject=f"Contact from {name}",
                body=f"Phone: {phone}\n\n{message_text}",
                is_read=False
            )

            return Response(
                {
                    "success": True,
                    "message": "Your message has been sent successfully. We'll get back to you soon!"
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
