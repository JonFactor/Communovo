from django.urls import path
from .views import RegisterView, ResetUserPasswordView, LoginView, UserView, LogoutView, LoginViaCookiesView, SetProfileView,  RelationshipCreateView, RelationshipViewView, UserViaIdView

urlpatterns = [
    path("login", LoginView.as_view()),
    path("user", UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path("cookieLogin", LoginViaCookiesView.as_view()),
    path("viewRelationships", RelationshipViewView.as_view()),
    path("createRelationship",RelationshipCreateView.as_view() ),
    path("userViaId", UserViaIdView.as_view()),
    path("passwordReset", ResetUserPasswordView.as_view())
]
 