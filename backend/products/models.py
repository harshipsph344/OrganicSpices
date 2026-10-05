from django.db import models


class Product(models.Model):

    name = models.CharField(
        max_length=100
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    category = models.CharField(
        max_length=50
    )

    image = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return self.name