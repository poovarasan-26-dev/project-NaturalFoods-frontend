from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import generics, permissions, status
from .models import Message
from .serializers import MessageSerializer, MessageWriteSerializer, AdminConversationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from dashboard.models import Notification
from leads.models import Lead
from users.permissions import IsAdminUser


def send_email_notification(message):
    recipient = message.recipient
    subject = f"New message: {message.subject}"
    html_message = render_to_string("emails/message_notification.html", {
        "recipient_name": recipient.username,
        "sender_name": message.sender.username,
        "sender_email": message.sender.email,
        "subject": message.subject,
        "body": message.body,
        "message_id": message.id,
        "site_url": "http://127.0.0.1:8000",
    })
    try:
        send_mail(
            subject=subject,
            message=f"From: {message.sender.username} ({message.sender.email})\nSubject: {message.subject}\n\n{message.body}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception:
        pass


class MessageInboxView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            recipient=self.request.user, parent=None, deleted_by_recipient=False
        ).order_by("-created_at")


class MessageSentView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            sender=self.request.user, parent=None, deleted_by_sender=False
        ).order_by("-created_at")


class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageWriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)

        action = "Reply" if message.parent_id else "New message"
        Notification.objects.create(
            message=(
                f"{action} from {self.request.user.username} to {message.recipient.email}: "
                f"{message.subject}"
            )
        )

        if self.request.user.role != "admin":
            lead = Lead.objects.filter(email=self.request.user.email).order_by("-id").first()
            if lead and lead.status == "new":
                lead.status = "contacted"
                lead.notes = (
                    f"{lead.notes}\nFrontend message sent: {message.subject}"
                ).strip()
                lead.save(update_fields=["status", "notes", "updated_at"])

        send_email_notification(message)


class MessageDetailView(generics.RetrieveAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            models.Q(recipient=self.request.user, deleted_by_recipient=False)
            | models.Q(sender=self.request.user, deleted_by_sender=False)
        )


class MessageReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            msg = Message.objects.get(pk=pk, recipient=request.user)
            msg.is_read = True
            msg.save()
            return Response({"status": "marked as read"})
        except Message.DoesNotExist:
            return Response({"error": "not found"}, status=404)


class MessageUnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"unread_count": count})


class MyConversationView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            models.Q(sender=self.request.user, deleted_by_sender=False)
            | models.Q(recipient=self.request.user, deleted_by_recipient=False)
        ).order_by("-created_at")


class AdminConversationListView(generics.ListAPIView):
    serializer_class = AdminConversationSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Message.objects.filter(parent=None).order_by("-created_at")


class MessageReplyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            original = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

        body = request.data.get("body", "").strip()
        if not body:
            return Response({"error": "Body is required"}, status=400)

        reply = Message.objects.create(
            sender=request.user,
            recipient=original.sender,
            subject=f"Re: {original.subject}",
            body=body,
            parent=original,
        )

        Notification.objects.create(
            message=f"Admin reply to {original.sender.email}: {original.subject}"
        )

        send_email_notification(reply)

        return Response(MessageSerializer(reply).data, status=status.HTTP_201_CREATED)


class MessageDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            msg = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

        if request.user == msg.sender:
            msg.deleted_by_sender = True
            msg.save()
            return Response({"status": "deleted"}, status=200)
        elif request.user == msg.recipient:
            msg.deleted_by_recipient = True
            msg.save()
            return Response({"status": "deleted"}, status=200)

        return Response({"error": "Not authorized"}, status=403)


class MarkAllMessagesReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Message.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"status": "ok"})
