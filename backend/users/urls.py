from django.urls import path, include
from .views import RegisterView, RequestPasswordResetEmailView,SearchDatabaseView, SetNewPasswordView, PasswordTokenValidateView, LoginView, UserView, LogoutView, LoginViaCookiesView, SetProfileView,  RelationshipCreateView, RelationshipViewView, UserViaIdView

urlpatterns = [
    path("login", LoginView.as_view()),
    path("user", UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path("cookieLogin", LoginViaCookiesView.as_view()),
    path("viewRelationships", RelationshipViewView.as_view()),
    path("createRelationship",RelationshipCreateView.as_view() ),
    path("userViaId", UserViaIdView.as_view()),
    path("register", RegisterView.as_view()),
    path("setProfile", RegisterView.as_view()),
    # password resset
    path("passwordReset", PasswordTokenValidateView.as_view(),
         name='passwordResetConfrim'),
    path("requestPasswordReset", RequestPasswordResetEmailView.as_view(),
         name="requestPasswordReset"),
    path("passwordResetComplete", SetNewPasswordView.as_view(), name="SetNewPasswordView"),
    path("searchAll", SearchDatabaseView.as_view())
   # path("passwordResetForm", )
    #path("passwordReset", include('django_rest_passwordreset.urls', namespace='password_reset'))
]
 