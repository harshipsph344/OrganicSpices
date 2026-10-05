from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Product


# =================================
# GET ALL PRODUCTS
# =================================

@api_view(["GET"])
def get_products(request):

    products = Product.objects.all()

    data = []

    for product in products:

        data.append({

            "id": product.id,

            "name": product.name,

            "price": float(product.price),

            "category": product.category,

            "image": product.image,

            "description": product.description,

            "stock": product.stock

        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )