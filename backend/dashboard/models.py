from django.db import models
from django.utils.text import slugify
from users.models import User


class SiteSetting(models.Model):
    SETTING_TYPES = [
        ("text", "Text"),
        ("textarea", "Textarea"),
        ("image", "Image"),
        ("video", "Video"),
        ("button", "Button"),
        ("css", "CSS"),
        ("html", "HTML"),
        ("color", "Color"),
        ("font", "Font"),
    ]

    key = models.CharField(max_length=100, unique=True)
    label = models.CharField(max_length=255)
    value = models.TextField(blank=True, default="")
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default="text")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]

    def __str__(self):
        return self.label or self.key

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = slugify(self.label)[:100]
        super().save(*args, **kwargs)

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.CharField(max_length=10, choices=[("kg", "Per Kg"), ("gram", "Per Gram")], default="kg")
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_3d = models.CharField(max_length=100, default="leaf")  # Key for custom 3D organic mockup illustration

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ("win", "Win"),
        ("loss", "Loss"),
        ("pending", "Pending"),
    ]
    DELIVERY_CHOICES = [
        ("order_processing", "Order Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]
    order_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    customer_name = models.CharField(max_length=255)
    product_name = models.CharField(max_length=255, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    delivery_status = models.CharField(max_length=30, choices=DELIVERY_CHOICES, default="order_processing")
    delivery_person_name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    address = models.TextField(blank=True, default="")
    upload = models.FileField(upload_to="customer_uploads/", blank=True, null=True)
    is_valid = models.BooleanField(default=True)  # True = valid, False = "not valid"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Notification(models.Model):
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:50]
