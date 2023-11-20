from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .serializers import EventSerializer, User2EventSerialzier, UserEventPreferencesSerializer
from .models import Event, UserEventPreferences, User2Event
from users.models import User
from groups.models import Group, Event2Group
from groups.serializers import GroupSerializer, Event2GroupSerializer
from users.serializers import UserSerializer
from functions.getUser import getUser


# Create your views here.

class EventCreationView(APIView):
    def post(self, request):
        user = getUser(request)
        if user == None:
            return Response(status=400)
        userId = user.id
        request.data.update({"owner":userId})   
        
        eventGroupName = request.data.get('eventGroup')
        eventGroup = Group.objects.filter(title = eventGroupName).first()
        eventGroupId = eventGroup.id
        
        request.data.pop("eventGroup")
        request.data.update({"eventGroup": eventGroupId})
        
        print(request.data) #['id', 'title', 'location', 'owner', 'date', 'eventType', 'eventGroup', 'coverImg']
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid() == False:
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class EventSingularGetViaIdView(APIView):
    def post(self, request):
        requId = request.data['id']
        event = Event.objects.filter(id = requId).first()
        serializer = EventSerializer(event, many=False)
        return Response(data=serializer.data)

class EventCollectionView(APIView):
    def post(self, request): # credentails
        user = getUser(request)
        if user == None:
            return Response(status=400)
        filterEvents = None
        
        if request.data.get('isBaisedOnGroup'):
            groupTitle = request.data.get('groupTitle')
            group = Group.objects.filter(title=groupTitle).first()
            print(group)
            
            event2Groups = Event2Group.objects.filter(group=group.id)
            
            ids = []
            for e in event2Groups:
                ids.append(e.event.id)
        else:
            if request.data.get('excludeDisliked'):
                filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                print(filterEvents)
            elif request.data.get('isOnlyDisliked'):
                filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
            elif request.data.get('isOnlyLiked'):
                filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isLiked=True)
            else:
                events = Event.objects.all()
                serializer = EventSerializer(events, many=True)
                return Response(data=serializer.data)
            ids = []
            if filterEvents != None:
                for e in filterEvents:
                    ids.append(e.event.id)
        
        events = None
        
        if request.data.get('excludeDisliked'):
            events = Event.objects.exclude(id__in=ids)
        else:
            events = Event.objects.filter(id__in=ids)
        serializer = EventSerializer(events, many=True)
        return Response(data=serializer.data)
    
class EventSingularGetViaTitleView(APIView):
    def post(self, request):
        title = request.data['title']
        event = Event.objects.filter(title = title).first()
        serializer = EventSerializer(event)
        return Response(data=serializer.data)
    
class EventUserAssignmentView(APIView):
    # eventTitle, viaEmail, email, isOwner, isCoOwner, isGuest
    def post(self, request):
        
        userId = None
        if request.data['viaEmail'] == True:
            userId = User.objects.filter(email=request.data['email']).first().id
        else:
            user = getUser(request)
            if user == None:
                return Response(status=400)
            userId = user.id
            
        event = Event.objects.filter(title = request.data["eventTitle"]).first()
        if event == None:
            raise "No Event With that title found"
        
        
        finalData = {
            "event":event.id,
            "user":userId,
            "isOwner":request.data['isOwner'],
            "isCoOwner":request.data['isCoOwner'],
            "isGuest":request.data["isGuest"]
        }
        
        seralizer = User2EventSerialzier(data=finalData)
        seralizer.is_valid(raise_exception=True)
        seralizer.save()
        return Response(seralizer.data)
            
class UserPreferenceSetView(APIView): # credentails, isLiked, isDisliked, eventTitle
    def post(self, request):
        user = getUser(request)
        if user == None:
            return Response(status=400)
        userId = user.id
        user = User.objects.filter(id=userId).first()
        
        eventTitle = request.data.get('eventTitle')
        request.data.pop('eventTitle')
        event = Event.objects.filter(title=eventTitle).first()
        
        request.data.update({'user': user.id})
        request.data.update({'event': event.id})
        
        serializer = UserEventPreferencesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        token = request.COOKIES.get('jwt').split("=")[1].split(";")[0]
        print(token)
        
        return Response()#serializer.data)
    
class GetMembersFromEvent(APIView):
    def post(self, request):
        eventId = request.data.get('id')
        
        rawGroupsRelations = None
        if request.data.get('isStaffOnly'):
            rawGroupsRelations = User2Event.objects.filter(event=eventId)
        else:
            rawGroupsRelations = User2Event.objects.filter(event=eventId).filter(Q(isOwner=True) | Q(isCoOwner=True))
        
        
        peopleIds = []
        for relation in rawGroupsRelations:
            peopleIds.append(relation.user.id)
        
        rawMembers = User.objects.filter(id__in=peopleIds)
        serializer = UserSerializer(rawMembers, many=True)
        return Response(serializer.data)
