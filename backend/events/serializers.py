from rest_framework import serializers
from .models import Event, User2Event, UserEventPreferences


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'location', 'owner', 'date', 'eventType', 'eventGroup', 'coverImg', 'description']
 
class User2EventSerialzier(serializers.ModelSerializer):
    class Meta:
        model = User2Event
        fields = ['event', 'user', 'isOwner', 'isCoOwner', 'isGuest']
        
class UserEventPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEventPreferences
        fields = ['user', 'event', 'isLiked', 'isDisliked']
