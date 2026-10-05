from django.urls import path

from .views import (
    get_cart,
    add_to_cart,
    update_cart_quantity
)

urlpatterns = [

    path(
        "add/",
        add_to_cart,
        name="add-to-cart"
    ),

    path(
        "update/",
        update_cart_quantity,
        name="update-cart"
    ),

    path(
        "<str:username>/",
        get_cart,
        name="get-cart"
    ),

]