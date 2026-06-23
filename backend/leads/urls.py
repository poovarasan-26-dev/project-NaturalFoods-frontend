from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, ContactSubmissionView

router = DefaultRouter()
router.register("", LeadViewSet, basename="lead")

urlpatterns = [
    path("", include(router.urls)),
    path("contact/submit/", ContactSubmissionView.as_view(), name="contact-submit"),
]
