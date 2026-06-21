from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True)
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    recipient_email = serializers.EmailField(source="recipient.email", read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "id", "sender", "sender_email", "sender_name",
            "recipient", "recipient_email",
            "subject", "body", "parent", "is_read", "created_at", "replies",
        ]
        read_only_fields = ["sender", "is_read", "created_at", "replies"]

    def get_replies(self, obj):
        replies = obj.replies.all()
        return MessageSerializer(replies, many=True).data


class AdminConversationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="sender.username", read_only=True)
    user_email = serializers.EmailField(source="sender.email", read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            "id", "user_name", "user_email",
            "subject", "body", "is_read", "created_at", "replies",
        ]

    def get_replies(self, obj):
        replies = obj.replies.all()
        return MessageSerializer(replies, many=True).data


class MessageWriteSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Message
        fields = ["recipient_email", "subject", "body", "parent"]

    def validate_recipient_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return user

    def create(self, validated_data):
        validated_data["recipient"] = validated_data.pop("recipient_email")
        return super().create(validated_data)
