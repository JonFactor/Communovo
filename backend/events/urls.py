from django.urls import path
from .views import UserPreferenceView, EventView, Event2UserView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("event/", EventView.as_view(), name="event"),
    path("event2user/", Event2UserView.as_view()),
    path("userEventPreference/", UserPreferenceView.as_view())

] 