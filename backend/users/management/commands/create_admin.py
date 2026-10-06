from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Create admin user"

    def handle(self, *args, **kwargs):
        username = "admin"
        email = "admin@organicspices.com"
        password = "Admin@12345"

        user, created = User.objects.get_or_create(
            username=username
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    "Admin user created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    "Admin user already exists. Password updated."
                )
            )