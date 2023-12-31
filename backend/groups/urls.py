from django.urls import path
from .views import GroupView, EventToGroupView, UserToGroupView

urlpatterns = [
    path("group", GroupView.as_view()),
    path("eventToGroup", EventToGroupView.as_view()),
    path("userToGroup", UserToGroupView.as_view())
]
