from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = "Add default OrganicSpices products"

    def handle(self, *args, **kwargs):

        products = [
            {
                "name": "Turmeric",
                "price": 120,
                "category": "spices",
                "image": "images/turmeric.jpg",
                "description": "Pure and natural turmeric powder.",
                "stock": 50,
            },
            {
                "name": "Red Chilli",
                "price": 150,
                "category": "spices",
                "image": "images/chilli.webp",
                "description": "Fresh and spicy red chilli.",
                "stock": 50,
            },
            {
                "name": "Black Pepper",
                "price": 180,
                "category": "spices",
                "image": "images/pepper.webp",
                "description": "Premium quality black pepper.",
                "stock": 50,
            },
            {
                "name": "Capsicum",
                "price": 100,
                "category": "vegetables",
                "image": "images/capsi.jpg",
                "description": "Fresh green capsicum.",
                "stock": 50,
            },
            {
                "name": "Garlic",
                "price": 130,
                "category": "vegetables",
                "image": "images/Garlic.jpg",
                "description": "Fresh and organic garlic.",
                "stock": 50,
            },
            {
                "name": "Onion",
                "price": 90,
                "category": "vegetables",
                "image": "images/Onion.webp",
                "description": "Fresh quality onions.",
                "stock": 50,
            },
            {
                "name": "Neem",
                "price": 80,
                "category": "herbs",
                "image": "images/Neem.jpg",
                "description": "Natural neem product.",
                "stock": 50,
            },
            {
                "name": "Tulsi",
                "price": 70,
                "category": "herbs",
                "image": "images/Tulsi.jpg",
                "description": "Fresh and natural tulsi.",
                "stock": 50,
            },
        ]

        for product_data in products:
            product, created = Product.objects.get_or_create(
                name=product_data["name"],
                defaults=product_data
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Added: {product.name}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Already exists: {product.name}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS("Product seeding completed!")
        )
        