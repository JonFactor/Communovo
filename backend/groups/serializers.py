from rest_framework import serializers
from .models import Event2Group, User2Group, Group

class Event2GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event2Group
        fields = ['group', 'event', 'isPromoted']
    
class User2GroupSerialzier(serializers.ModelSerializer):
    class Meta:
        model = User2Group
        fields = ['user', 'group', 'isOwner', 'isCoOwner', 'isMember', 'isBanned']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'title', 'description', 'image', 'owner', 'groupType']
