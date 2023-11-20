from django.urls import path
from .views import EventCreationView, EventCollectionView, GetMembersFromEvent, EventSingularGetViaIdView, EventSingularGetViaTitleView, EventUserAssignmentView, UserPreferenceSetView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("eventCreate", EventCreationView.as_view()),
    path("eventCollection", EventCollectionView.as_view()),
    path("eventData", EventSingularGetViaIdView.as_view()),
    path("eventDataViaName", EventSingularGetViaTitleView.as_view()),
    path("event2userCreate", EventUserAssignmentView.as_view()),
    path("eventUserPreferencesSet", UserPreferenceSetView.as_view()),
    path("getMembersFromEvent", GetMembersFromEvent.as_view())
] 
