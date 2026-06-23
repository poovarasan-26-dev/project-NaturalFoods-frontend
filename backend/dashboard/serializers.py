from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Order, Customer, Notification, SiteSetting

User = get_user_model()

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "phone", "profile_image"]
        extra_kwargs = {
            "email": {"required": True},
            "username": {"required": True},
            "phone": {"required": False},
            "profile_image": {"required": False},
        }

    def validate_email(self, value):
        # Allow the current user to keep their existing email
        instance = self.instance
        qs = User.objects.filter(email__iexact=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        # Allow the current user to keep their existing username
        instance = self.instance
        qs = User.objects.filter(username__iexact=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "role", "is_active", "date_joined"]
        read_only_fields = ["id", "role", "date_joined"]


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone", "password", "is_active"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.role = "admin"
        user.is_staff = True
        user.save()
        return user


class StorefrontOrderCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=100)


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ["id", "key", "label", "value", "setting_type", "is_active", "updated_at"]
