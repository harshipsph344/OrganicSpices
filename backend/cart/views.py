from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .models import CartItem
from products.models import Product


# =================================
# GET USER CART
# =================================

@api_view(["GET"])
def get_cart(request, username):

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

    cart_items = CartItem.objects.filter(
        user=user
    )

    data = []

    for item in cart_items:

        data.append({

            "id": item.id,

            "product_id": item.product.id,

            "name": item.product.name,

            "price": float(item.product.price),

            "quantity": item.quantity,

            "image": item.product.image

        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )


# =================================
# ADD PRODUCT TO CART
# =================================

@api_view(["POST"])
def add_to_cart(request):

    username = request.data.get("username")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if not username or not product_id:

        return Response(
            {
                "message":
                "Username and product ID are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        user = User.objects.get(
            username=username
        )

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

    cart_item, created = CartItem.objects.get_or_create(

        user=user,

        product=product,

        defaults={
            "quantity": quantity
        }

    )

    if not created:

        cart_item.quantity += int(quantity)

        cart_item.save()

    return Response(
        {
            "message": "Product added to cart.",
            "cart_item_id": cart_item.id,
            "quantity": cart_item.quantity
        },
        status=status.HTTP_200_OK
    )
@api_view(["POST"])
def update_cart_quantity(request):

    username = request.data.get("username")
    cart_item_id = request.data.get("cart_item_id")
    quantity = request.data.get("quantity")

    if not username or not cart_item_id or quantity is None:
        return Response(
            {"message": "Username, cart item ID and quantity are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=username)

        cart_item = CartItem.objects.get(
            id=cart_item_id,
            user=user
        )

    except User.DoesNotExist:
        return Response(
            {"message": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    except CartItem.DoesNotExist:
        return Response(
            {"message": "Cart item not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    quantity = int(quantity)

    if quantity < 1:

        cart_item.delete()

        return Response(
            {"message": "Product removed from cart."},
            status=status.HTTP_200_OK
        )

    cart_item.quantity = quantity
    cart_item.save()

    return Response(
        {
            "message": "Cart quantity updated.",
            "quantity": cart_item.quantity
        },
        status=status.HTTP_200_OK
    )