from django.urls import path
from .views import AddEventToGroupView, AddUserToGroupView, RemoveUserFromGroupView, CreateGroupView, DeleteGroupView, GetAllGroupsByTypeView, GetGroupViaUserView, GetGroupDataView, GetAllGroupsView, GetMembersFromGroupView, GetGroupViaIdView

urlpatterns = [
    path("addEventToGroup", AddEventToGroupView.as_view()),
    path("addUserToGroup", AddUserToGroupView.as_view()),
    path("removeUserFromGroup", RemoveUserFromGroupView.as_view()),
    path("createGroup", CreateGroupView.as_view()),
    path("deleteGroupView", DeleteGroupView.as_view()),
    path("getAllGroupsByType", GetAllGroupsByTypeView.as_view()),
    path("getGroupViaUser", GetGroupViaUserView.as_view()),
    path("getGroupData",  GetGroupDataView.as_view()),
    path("getAllGroups", GetAllGroupsView.as_view()),
    path("getMembersFromGroup", GetMembersFromGroupView.as_view()),
    path("getGroupViaId", GetGroupViaIdView.as_view())
]
