from django.core.management.base import BaseCommand
from dashboard.models import Product, Order, Customer, Notification
from decimal import Decimal
import datetime
import random

FRUITS = [
    {"name": "Apple", "category": "Fruits", "price": 120, "stock": 50},
    {"name": "Orange", "category": "Fruits", "price": 80, "stock": 45},
    {"name": "Banana", "category": "Fruits", "price": 40, "stock": 80},
    {"name": "Grapes", "category": "Fruits", "price": 90, "stock": 0},
    {"name": "Mango", "category": "Fruits", "price": 200, "stock": 35},
    {"name": "Strawberry", "category": "Fruits", "price": 150, "stock": 25},
    {"name": "Pomegranate", "category": "Fruits", "price": 110, "stock": 30},
    {"name": "Watermelon", "category": "Fruits", "price": 30, "stock": 20},
    {"name": "Papaya", "category": "Fruits", "price": 50, "stock": 40},
    {"name": "Pineapple", "category": "Fruits", "price": 60, "stock": 0},
    {"name": "Cherry", "category": "Fruits", "price": 250, "stock": 15},
    {"name": "Kiwi", "category": "Fruits", "price": 180, "stock": 20},
]

NUTRITIONS = [
    {"name": "Whey Protein", "category": "Nutritions", "price": 1200, "stock": 30},
    {"name": "Organic Spirulina", "category": "Nutritions", "price": 800, "stock": 25},
    {"name": "Moringa Powder", "category": "Nutritions", "price": 350, "stock": 40},
    {"name": "Vitamin C Complex", "category": "Nutritions", "price": 600, "stock": 10},
    {"name": "Omega 3 Capsules", "category": "Nutritions", "price": 750, "stock": 35},
    {"name": "Plant Protein", "category": "Nutritions", "price": 1500, "stock": 20},
    {"name": "Probiotic Complex", "category": "Nutritions", "price": 900, "stock": 15},
    {"name": "Organic Ashwagandha", "category": "Nutritions", "price": 450, "stock": 28},
]

CUSTOMERS = [
    {"name": "Priya Sharma", "email": "priya.sharma@example.com", "valid": True, "address": "12, Green Park Colony, New Delhi"},
    {"name": "Amit Verma", "email": "amit.verma@example.com", "valid": True, "address": "45, MG Road, Mumbai"},
    {"name": "Sneha Patel", "email": "sneha.patel@example.com", "valid": False, "address": "78, Lake View Apartments, Bangalore"},
    {"name": "Rajesh Gupta", "email": "rajesh.gupta@example.com", "valid": True, "address": "23/5, Civil Lines, Jaipur"},
    {"name": "Ananya Reddy", "email": "ananya.reddy@example.com", "valid": True, "address": "9, Jubilee Hills, Hyderabad"},
    {"name": "Vikram Singh", "email": "vikram.singh@example.com", "valid": False, "address": "67, Sector 14, Chandigarh"},
    {"name": "Arun Kumar", "email": "arun.kumar@example.com", "valid": True, "address": "34, Anna Nagar, Chennai"},
    {"name": "Deepika Nair", "email": "deepika.nair@example.com", "valid": True, "address": "56, BTM Layout, Bangalore"},
    {"name": "Karthik Rajan", "email": "karthik.rajan@example.com", "valid": True, "address": "18, T Nagar, Chennai"},
    {"name": "Meera Joshi", "email": "meera.joshi@example.com", "valid": False, "address": "3, FC Road, Pune"},
    {"name": "Ravi Shankar", "email": "ravi.shankar@example.com", "valid": True, "address": "22, Indiranagar, Bangalore"},
    {"name": "Lakshmi Prasad", "email": "lakshmi.prasad@example.com", "valid": True, "address": "11, Kalyani Nagar, Pune"},
]

NOTIFICATIONS = [
    "Organic farming workshop scheduled for next weekend. Register now!",
    "New seasonal fruits arriving from Himachal farms this week.",
    "Customer feedback survey: 94% satisfaction rate this quarter.",
    "Flash sale: 20% off on all Nutritions products this weekend.",
    "New supplier partnership confirmed with Tamil Nadu organic farms.",
    "Delivery fleet upgraded with 5 new refrigerated vans.",
    "Warehouse expansion completed at Coimbatore distribution center.",
    "Monthly sales target exceeded by 12% for April.",
    "New organic certification received for premium fruit range.",
    "System maintenance scheduled for Sunday 2 AM - 4 AM.",
]

PRODUCTS_FOR_ORDERS = [
    ("Apple", 120, "Fruits"), ("Orange", 80, "Fruits"),
    ("Banana", 40, "Fruits"), ("Mango", 200, "Fruits"),
    ("Strawberry", 150, "Fruits"), ("Pomegranate", 110, "Fruits"),
    ("Watermelon", 30, "Fruits"), ("Papaya", 50, "Fruits"),
    ("Cherry", 250, "Fruits"), ("Kiwi", 180, "Fruits"),
    ("Whey Protein", 1200, "Nutritions"), ("Organic Spirulina", 800, "Nutritions"),
    ("Moringa Powder", 350, "Nutritions"), ("Vitamin C Complex", 600, "Nutritions"),
    ("Omega 3 Capsules", 750, "Nutritions"), ("Plant Protein", 1500, "Nutritions"),
    ("Probiotic Complex", 900, "Nutritions"), ("Organic Ashwagandha", 450, "Nutritions"),
]

QTY_OPTIONS = [0.5, 1, 1, 1, 2, 2, 3, 5]
STATUSES = ["win", "win", "win", "win", "loss", "pending"]
CUSTOMER_NAMES = [c["name"] for c in CUSTOMERS]


class Command(BaseCommand):
    help = "Seed database with frontend-matching products, orders, customers, and notifications"

    def seed_products(self):
        Product.objects.all().delete()
        created = []
        for item in FRUITS + NUTRITIONS:
            p = Product.objects.create(
                name=item["name"],
                category=item["category"],
                price=item["price"],
                price_unit="kg" if item["category"] == "Fruits" else "gram",
                stock=item["stock"],
                image_3d=item["name"].lower(),
            )
            created.append(p)
        self.stdout.write(f"  Seeded {len(created)} products")
        return created

    def seed_customers(self):
        existing_emails = set(Customer.objects.values_list("email", flat=True))
        created = 0
        for c in CUSTOMERS:
            if c["email"] not in existing_emails:
                Customer.objects.create(
                    name=c["name"],
                    email=c["email"],
                    address=c.get("address", ""),
                    is_valid=c["valid"],
                )
                created += 1
        return created

    def seed_orders(self):
        today = datetime.date.today()
        year = today.year
        month = today.month

        existing_count = Order.objects.filter(date__year=year).count()
        if existing_count >= 80:
            self.stdout.write(f"  Orders: {existing_count} already exist - skipping")
            return 0

        Order.objects.filter(date__year=year).delete()
        random.seed(42)
        order_start = 1
        created = 0

        for m in range(1, month + 1):
            num_orders = random.randint(8, 18)
            for _ in range(num_orders):
                prod_name, price, cat = random.choice(PRODUCTS_FOR_ORDERS)
                qty = random.choice(QTY_OPTIONS)
                amount = Decimal(str(price)) * Decimal(str(qty))
                day = random.randint(1, 28)
                try:
                    d = datetime.date(year, m, day)
                except ValueError:
                    d = datetime.date(year, m, min(day, 28))
                cust_name = random.choice(CUSTOMER_NAMES)
                status = random.choice(STATUSES)
                Order.objects.create(
                    order_id=f"#ORD-{order_start:04d}",
                    customer_name=cust_name,
                    product_name=prod_name,
                    quantity=qty,
                    date=d,
                    amount=amount,
                    status=status,
                )
                order_start += 1
                created += 1

        return created

    def seed_notifications(self):
        Notification.objects.all().delete()
        for msg in NOTIFICATIONS:
            Notification.objects.create(message=msg)
        return len(NOTIFICATIONS)

    def handle(self, *args, **options):
        products = self.seed_products()
        self.stdout.write(self.style.SUCCESS(f"[OK] Products: {len(products)} created"))

        cust_count = self.seed_customers()
        total_cust = Customer.objects.count()
        self.stdout.write(self.style.SUCCESS(f"[OK] Customers: {cust_count} new (total: {total_cust})"))

        order_count = self.seed_orders()
        total_orders = Order.objects.count()
        self.stdout.write(self.style.SUCCESS(f"[OK] Orders: {order_count} created (total: {total_orders})"))

        notif_count = self.seed_notifications()
        self.stdout.write(self.style.SUCCESS(f"[OK] Notifications: {notif_count} created"))

        self.stdout.write(self.style.SUCCESS("\nSeed complete! Visit /api/dashboard/stats/ to verify analytics."))
