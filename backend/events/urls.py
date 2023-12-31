from django.urls import path
from .views import EventCollectionView,  EventToUserView, UserPreferenceView, EventView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("event", EventView.as_view()),
    path("eventCollection", EventCollectionView.as_view()),
    path("eventTouser", EventToUserView.as_view()),
    path("eventUserPreference", UserPreferenceView.as_view()),
] 
