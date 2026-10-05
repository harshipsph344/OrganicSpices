from django.urls import path

from .views import (create_order,get_orders)


urlpatterns = [

    path(
        "create/",
        create_order,
        name="create-order"
    ),
    path(
    "<str:username>/",
    get_orders,
    name="get-orders"
),

]