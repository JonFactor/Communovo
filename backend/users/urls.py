from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, LoginViaCookiesView, SetProfileView,  RelationshipCreateView, RelationshipViewView, UserViaIdView

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("setProfile", SetProfileView.as_view()),
    path("login", LoginView.as_view()),
    path("user", UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path("cookieLogin", LoginViaCookiesView.as_view()),
    path("viewRelationships", RelationshipViewView.as_view()),
    path("createRelationship",RelationshipCreateView.as_view() ),
    path("userViaId", UserViaIdView.as_view())
]
 