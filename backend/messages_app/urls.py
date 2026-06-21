from django.urls import path
from . import views

urlpatterns = [
    path("inbox/", views.MessageInboxView.as_view(), name="message-inbox"),
    path("sent/", views.MessageSentView.as_view(), name="message-sent"),
    path("compose/", views.MessageCreateView.as_view(), name="message-compose"),
    path("<int:pk>/", views.MessageDetailView.as_view(), name="message-detail"),
    path("<int:pk>/read/", views.MessageReadView.as_view(), name="message-read"),
    path("<int:pk>/reply/", views.MessageReplyView.as_view(), name="message-reply"),
    path("<int:pk>/delete/", views.MessageDeleteView.as_view(), name="message-delete"),
    path("mark-all-read/", views.MarkAllMessagesReadView.as_view(), name="message-mark-all-read"),
    path("unread-count/", views.MessageUnreadCountView.as_view(), name="message-unread-count"),
    path("my-conversations/", views.MyConversationView.as_view(), name="my-conversations"),
    path("conversations/", views.AdminConversationListView.as_view(), name="admin-conversations"),
]
