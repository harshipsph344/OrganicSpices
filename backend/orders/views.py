from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .models import Order, OrderItem

from cart.models import CartItem


@api_view(["POST"])
def create_order(request):

    username = request.data.get("username")

    if not username:

        return Response(
            {
                "message": "Username is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

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

    if not cart_items.exists():

        return Response(
            {
                "message": "Your cart is empty."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    total_amount = 0

    for item in cart_items:

        total_amount += (
            item.product.price * item.quantity
        )

    order = Order.objects.create(
        user=user,
        total_amount=total_amount
    )

    for item in cart_items:

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart_items.delete()

    return Response(
        {
            "message": "Order placed successfully.",
            "order_id": order.id,
            "total_amount": float(order.total_amount),
            "status": order.status
        },
        status=status.HTTP_201_CREATED
    )
@api_view(["GET"])
def get_orders(request, username):

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

    orders = Order.objects.filter(
        user=user
    ).order_by("-created_at")

    data = []

    for order in orders:

        items = []

        for item in order.items.all():

            items.append({
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": float(item.price)
            })

        data.append({
            "order_id": order.id,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "created_at": order.created_at,
            "items": items
        })

    return Response(
        data,
        status=status.HTTP_200_OK
    )
