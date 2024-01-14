from django.urls import path, include
from .views import UserView, LoginView, LogoutView, RelationshipView, UserAddPhoneView, SendSelfEmailView, SearchDatabaseView, SetNewPasswordView, UserNotifyPhoneView, PasswordTokenValidateView, User2userStatusChangeView, RequestPasswordResetEmailView

urlpatterns = [
     path("user/", UserView.as_view()),
     path("login/", LoginView.as_view()),
     path("logout/", LogoutView.as_view()),
     path("relationship/", RelationshipView.as_view()),
     path("userAddPhone/", UserAddPhoneView.as_view()),
     path("searchAll/", SearchDatabaseView.as_view()),
     path("notifyPhone/", UserNotifyPhoneView.as_view()),
     path("selfEmail/", SendSelfEmailView.as_view()),
     path("user2UserStatusChange/", User2userStatusChangeView.as_view()),
     path("passwordReset", PasswordTokenValidateView.as_view(),
          name='passwordResetConfrim'),
     path("requestPasswordReset", RequestPasswordResetEmailView.as_view(),
          name="requestPasswordReset"),
     path("passwordResetComplete", SetNewPasswordView.as_view(), name="SetNewPasswordView")
]
