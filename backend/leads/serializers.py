from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source="created_by.email", read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id", "name", "email", "phone", "company",
            "status", "notes", "created_by", "created_by_email",
            "assigned_to", "created_at", "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]
