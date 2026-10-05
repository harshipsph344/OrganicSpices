from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .models import WishlistItem


@api_view(["GET"])
def get_wishlist(request, username):

    try:

        user = User.objects.get(
            username=username
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist_items = WishlistItem.objects.filter(
        user=user
    )

    data = []

    for item in wishlist_items:

        data.append({

            "id": item.id,

            "product_id": item.product.id,

            "name": item.product.name,

            "price": float(item.product.price),

            "image": item.product.image

        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )
@api_view(["POST"])
def add_to_wishlist(request):

    username = request.data.get("username")
    product_id = request.data.get("product_id")

    if not username or not product_id:

        return Response(
            {
                "message": "Username and product ID are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        user = User.objects.get(
            username=username
        )

        from products.models import Product

        product = Product.objects.get(
            id=product_id
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except Product.DoesNotExist:

        return Response(
            {
                "message": "Product not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist_item, created = WishlistItem.objects.get_or_create(
        user=user,
        product=product
    )

    if not created:

        return Response(
            {
                "message": "Product already in wishlist."
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {
            "message": "Product added to wishlist.",
            "wishlist_item_id": wishlist_item.id
        },
        status=status.HTTP_201_CREATED
    )
@api_view(["POST"])
def remove_from_wishlist(request):

    username = request.data.get("username")
    product_id = request.data.get("product_id")

    if not username or not product_id:
        return Response(
            {
                "message": "Username and product ID are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(
            username=username
        )

        wishlist_item = WishlistItem.objects.get(
            user=user,
            product_id=product_id
        )

    except User.DoesNotExist:
        return Response(
            {
                "message": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except WishlistItem.DoesNotExist:
        return Response(
            {
                "message": "Product not found in wishlist."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist_item.delete()

    return Response(
        {
            "message": "Product removed from wishlist."
        },
        status=status.HTTP_200_OK
    )