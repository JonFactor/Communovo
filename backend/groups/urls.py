from django.urls import path
from .views import GroupView, EventToGroupView, UserToGroupView

urlpatterns = [
    path("Group", GroupView.as_view()),
    path("EventToGroup", EventToGroupView.as_view()),
    path("UserToGroup", UserToGroupView.as_view())
]
