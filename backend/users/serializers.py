from rest_framework import serializers
from .models import User
from leads.models import Lead


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "phone"]
        read_only_fields = ["role"]

    def create(self, validated_data):
        user = User.objects.create_user(role="user", **validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "phone", "role", "date_joined", "is_active", "profile_image"]
        read_only_fields = ["role", "date_joined", "is_active"]
