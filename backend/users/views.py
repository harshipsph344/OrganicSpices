from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import UserProfile


# =================================
# REGISTER USER
# =================================

@api_view(["POST"])
def register_user(request):

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    phone = request.data.get("phone", "")
    address = request.data.get("address", "")

    if not username or not email or not password:
        return Response(
            {
                "message": "Username, email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {
                "message": "Username already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {
                "message": "Email already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    UserProfile.objects.create(
        user=user,
        phone=phone,
        address=address
    )

    return Response(
        {
            "message": "Account created successfully."
        },
        status=status.HTTP_201_CREATED
    )


# =================================
# LOGIN USER
# =================================

@api_view(["POST"])
def login_user(request):

    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {
                "message": "Username and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {
                "message": "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(
        {
            "message": "Login successful.",
            "username": user.username
        },
        status=status.HTTP_200_OK
    )
# =================================
# USER PROFILE
# =================================

@api_view(["GET"])
def user_profile(request, username):

    try:

        user = User.objects.get(
            username=username
        )

        profile = UserProfile.objects.get(
            user=user
        )

        return Response(
            {
                "username": user.username,
                "email": user.email,
                "phone": profile.phone,
                "address": profile.address
            },
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    except UserProfile.DoesNotExist:

        return Response(
            {
                "message": "Profile not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )