from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = "Ensures at least one admin user exists in the database."

    def handle(self, *args, **options):
        if User.objects.filter(role="admin").exists():
            self.stdout.write(self.style.SUCCESS("Admin user already exists."))
            return

        User.objects.create_user(
            email="admin@crm.com",
            username="admin",
            password="admin123",
            role="admin",
            is_staff=True,
        )
        self.stdout.write(self.style.SUCCESS("Default admin user created: admin / admin123"))
