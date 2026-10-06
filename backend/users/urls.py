from django.urls import path

from .views import (
    register_user,
    login_user,
    user_profile,
    update_profile
)


urlpatterns = [

    path(
        "register/",
        register_user,
        name="register"
    ),

    path(
        "login/",
        login_user,
        name="login"
    ),

    path(
        "profile/<str:username>/",
        user_profile,
        name="profile"
    ),

    path(
        "profile/update/<str:username>/",
        update_profile,
        name="update-profile"
    ),

]