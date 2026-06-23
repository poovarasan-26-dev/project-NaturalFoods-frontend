from dashboard.models import Customer, Notification
from leads.models import Lead
from users.models import User


def get_primary_admin(exclude_user=None):
    admins = User.objects.filter(role="admin").order_by("id")
    if exclude_user is not None:
        admins = admins.exclude(pk=exclude_user.pk)
    return admins.first()


def ensure_frontend_customer_records(user):
    if user.role == "admin":
        return {
            "customer_created": False,
            "lead_created": False,
            "notification_created": False,
        }

    customer, customer_created = Customer.objects.get_or_create(
        email=user.email,
        defaults={
            "name": user.username,
            "is_valid": True,
        },
    )
    if not customer_created and customer.name != user.username:
        customer.name = user.username
        customer.save(update_fields=["name"])

    assigned_admin = get_primary_admin(exclude_user=user)
    lead, lead_created = Lead.objects.get_or_create(
        email=user.email,
        defaults={
            "name": user.username,
            "company": "Natural Foods Frontend",
            "status": "new",
            "notes": "Created automatically from the first frontend login.",
            "created_by": user,
            "assigned_to": assigned_admin,
        },
    )

    if not lead_created:
        updated_fields = []
        if lead.name != user.username:
            lead.name = user.username
            updated_fields.append("name")
        if not lead.assigned_to and assigned_admin:
            lead.assigned_to = assigned_admin
            updated_fields.append("assigned_to")
        if updated_fields:
            lead.save(update_fields=updated_fields)

    notification_created = False
    if customer_created or lead_created:
        Notification.objects.create(
            message=(
                f"New frontend user {user.username} ({user.email}) completed first login. "
                "Lead and customer records were created automatically."
            )
        )
        notification_created = True

    return {
        "customer_created": customer_created,
        "lead_created": lead_created,
        "notification_created": notification_created,
    }
