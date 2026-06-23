from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView, RedirectView
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import FrontendTokenObtainPairView

urlpatterns = [
    path("favicon.ico", RedirectView.as_view(url="/static/images/dention.png")),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/auth/login/", FrontendTokenObtainPairView.as_view(), name="token-obtain"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("api/leads/", include("leads.urls")),
    path("api/messages/", include("messages_app.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("", RedirectView.as_view(url="/dashboard/"), name="home"),
    path("storefront/", TemplateView.as_view(template_name="storefront.html"), name="storefront-page"),
    path("register/", TemplateView.as_view(template_name="registration/register.html"), name="register-page"),
    path("login/", TemplateView.as_view(template_name="registration/login.html"), name="login-page"),
    path("logout/", LogoutView.as_view(next_page="/"), name="logout"),
    path("profile/", TemplateView.as_view(template_name="profile.html"), name="profile-page"),
    path("leads/", TemplateView.as_view(template_name="leads/lead_list.html"), name="leads-page"),
    path("leads/create/", TemplateView.as_view(template_name="leads/lead_form.html"), name="lead-create-page"),
    path("leads/<int:pk>/", TemplateView.as_view(template_name="leads/lead_detail.html"), name="lead-detail-page"),
    path("leads/<int:pk>/edit/", TemplateView.as_view(template_name="leads/lead_form.html"), name="lead-edit-page"),
    path("messages/", TemplateView.as_view(template_name="messages/message_list.html"), name="messages-page"),
    path("messages/compose/", TemplateView.as_view(template_name="messages/message_form.html"), name="message-compose-page"),
    path("messages/<int:pk>/", TemplateView.as_view(template_name="messages/message_detail.html"), name="message-detail-page"),
    path("dashboard/", TemplateView.as_view(template_name="dashboard/dashboard.html"), name="dashboard-page"),
    path("dashboard/messages/", TemplateView.as_view(template_name="dashboard/messages.html"), name="dashboard-messages"),
    path("dashboard/orders/", TemplateView.as_view(template_name="dashboard/orders.html"), name="dashboard-orders"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
