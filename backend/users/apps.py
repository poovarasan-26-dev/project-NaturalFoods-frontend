from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        from django.db.models.signals import post_migrate
        from django.core.management import call_command

        def ensure_admin(sender, **kwargs):
            try:
                call_command("ensureadmin", verbosity=0)
            except Exception:
                pass

        post_migrate.connect(ensure_admin, sender=self)
