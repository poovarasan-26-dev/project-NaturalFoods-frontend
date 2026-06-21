import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from dashboard.models import Product
products = Product.objects.all().values('id', 'name', 'image', 'image_3d')[:10]
for p in products:
    print(f"ID={p['id']}, name={p['name']}, image_3d={p['image_3d']}, image={p['image']}")
print(f"Total products: {Product.objects.count()}")
