from django.urls import path
from .views import LoginView, UserView, LogoutView, UserToUserView

urlpatterns = [
    path("login", LoginView.as_view()),
    path("user/<str:details>", UserView.as_view(), name="user"),
    path('logout', LogoutView.as_view()),
    path("userToUser", UserToUserView.as_view())
]
 