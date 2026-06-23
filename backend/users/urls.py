from django.urls import path
from .views import RegisterView, ProfileView, ProfileImageView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile-image/", ProfileImageView.as_view(), name="profile-image"),
]
