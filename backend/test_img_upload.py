"""Test image upload via PATCH and verify persistence."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

from dashboard.models import Product
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory, force_authenticate
from dashboard.views import ProductViewSet
from users.models import User
import json

# Get admin user
admin = User.objects.filter(role="admin").first()
print(f"Admin: {admin.username} ({admin.email})")

# Get product 10 (has no image)
prod = Product.objects.get(id=10)
print(f"Before - Product {prod.id}: image={prod.image}, image_3d={prod.image_3d}")

# Test PATCH with image
factory = APIRequestFactory()
fake_img = SimpleUploadedFile("test.jpg", b"fake-image-data", content_type="image/jpeg")
data = {"name": "Apple Test", "image": fake_img}
request = factory.patch(f"/api/dashboard/products/{prod.id}/", data, format="multipart")
force_authenticate(request, admin)

view = ProductViewSet.as_view({"patch": "partial_update"})
response = view(request, pk=prod.id)
print(f"PATCH status: {response.status_code}")
if response.status_code == 200:
    result = json.loads(json.dumps(response.data, default=str))
    print(f"Response image: {result.get('image')}")

# Re-fetch from DB
prod.refresh_from_db()
print(f"After - Product {prod.id}: image={prod.image}, image_3d={prod.image_3d}")

# Verify file exists
if prod.image:
    full_path = prod.image.path
    print(f"File path: {full_path}")
    print(f"File exists: {os.path.exists(full_path)}")

# Cleanup: restore original name
prod.name = "Apple"
prod.image = None
prod.save()
print("Restored original state")
