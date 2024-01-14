from django.urls import path
from .views import GroupView, Group2EventView, Group2UserView

urlpatterns = [
    path("group/", GroupView.as_view()),
    path("group2Event/", Group2EventView.as_view()),
    path("group2User/", Group2UserView.as_view())
]