from django.urls import path

from .views import (
    get_wishlist,
    add_to_wishlist,
    remove_from_wishlist
)

urlpatterns = [

    path(
        "add/",
        add_to_wishlist,
        name="add-to-wishlist"
    ),

    path(
        "remove/",
        remove_from_wishlist,
        name="remove-from-wishlist"
    ),

    path(
        "<str:username>/",
        get_wishlist,
        name="get-wishlist"
    ),

]