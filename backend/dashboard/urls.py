from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardStatsView,
    GlobalSearchView,
    ProductViewSet,
    OrderViewSet,
    CustomerViewSet,
    NotificationViewSet,
    AdminUserViewSet,
    SiteSettingViewSet,
    PublicSiteSettingsView,
    OrderReceiptView,
    SendCustomerEmailView,
    StorefrontOrderCancelView,
    StorefrontOrderCreateView,
    StorefrontOrderListView,
    StorefrontProductListView,
    StorefrontSummaryView,
    UserProfileUpdateView,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")
router.register("customers", CustomerViewSet, basename="customer")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("admins", AdminUserViewSet, basename="admin")
router.register("site-settings", SiteSettingViewSet, basename="site-setting")

urlpatterns = [
    path("search/", GlobalSearchView.as_view(), name="global-search"),
    path("site-settings/public/", PublicSiteSettingsView.as_view(), name="site-settings-public"),
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("profile/", UserProfileUpdateView.as_view(), name="dashboard-profile-update"),
    path("storefront/summary/", StorefrontSummaryView.as_view(), name="storefront-summary"),
    path("storefront/products/", StorefrontProductListView.as_view(), name="storefront-products"),
    path("storefront/orders/", StorefrontOrderListView.as_view(), name="storefront-orders"),
    path("storefront/orders/place/", StorefrontOrderCreateView.as_view(), name="storefront-order-place"),
    path("storefront/orders/cancel/", StorefrontOrderCancelView.as_view(), name="storefront-order-cancel"),
    path("customers/<int:customer_id>/send-email/", SendCustomerEmailView.as_view(), name="customer-send-email"),
    path("customers/send-email/", SendCustomerEmailView.as_view(), name="customer-send-email-email"),
    path("orders/<int:order_id>/receipt/", OrderReceiptView.as_view(), name="order-receipt"),
    path("", include(router.urls)),
]
