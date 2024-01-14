from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
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
class EventView(APIView):
    
    # make a new event
    def post(self, request): #time, 'title', 'location', 'date', 'eventType', 'eventGroup', 'coverImg', 'regionCords']
        user = getUser(request)
        if user == None:
            return Response({"message":"user not found."},status=400)
        userId = user.id
        request.data.update({"owner":userId})   
        
        eventGroupName = request.data.get('eventGroup')
        eventGroup = Group.objects.filter(title = eventGroupName).first()
        if Group.objects.filter(title = eventGroupName).exists():
            eventGroupId = eventGroup.id
        else:
            eventGroupId = 1
        
        request.data.pop("eventGroup")
        request.data.update({"eventGroup": eventGroupId})
        
        splitTime = request.data['time'].split(":")
        formatedTime = datetime.time(int(splitTime[0]), int(splitTime[1]))
        
        request.data.pop("time")
        request.data.update({"time":formatedTime})
        
        print(request.data) 
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid() == False:
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    # get requests / request data
    def get(self, request): # requType
        if request.query_params.get('requType') == "ID": # id
            requId = request.query_params.get('id')
            event = Event.objects.filter(id = requId).first()
            serializer = EventSerializer(event, many=False)
            return Response(data=serializer.data)
        
        elif request.query_params['requType'] == "COLLECTION": # isBaisedOnGroup, groupTitle, exculdeDisliked, isOnlyDisliked, isOnlyLiked, excludeDisliked
            user = getUser(request)
            
            if user == None:
                return Response(status=400)
            filterEvents = None
            
            if int(request.query_params.get('isBaisedOnGroup')):
                groupTitle = request.query_params.get('groupTitle')
                group = Group.objects.filter(title=groupTitle).first()
                if group == None:
                    return Response({"message":"group could not be found."}, status=401)
                
                event2Groups = Event2Group.objects.filter(group=group.id)
                
                ids = []
                for e in event2Groups:
                    ids.append(e.event.id)
            else:
                if int(request.query_params.get('excludeDisliked')):
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                    print(filterEvents)
                elif int(request.query_params.get('isOnlyDisliked')):
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                elif int(request.query_params.get('isOnlyLiked')):
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
            
            if int(request.query_params.get('excludeDisliked')):
                events = Event.objects.exclude(id__in=ids)
            else:
                events = Event.objects.filter(id__in=ids)
            serializer = EventSerializer(events, many=True)
            return Response(data=serializer.data)
        
        elif request.query_params['requType'] == "TITLE": # title
            title = request.query_params['title']
            event = Event.objects.filter(title = title).first()
            serializer = EventSerializer(event)
            return Response(data=serializer.data)
        return Response({"message":"Did not specify any correct enum of requType"}, status=401)
    # delete made event
    def delete(self, request): #eventId
        user = getUser(request)
        event = request.data['eventId']
        
        isOwner = User2Event.objects.filter(event=event, user=user,isOwner=True ).exists()
        if not isOwner:
            return Response({"message":"you are not autorized to delete this event."}, status=200)
    
        Event.objects.filter(id=event).delete()
        return Response({"message": "success"}, status=200)
    
class Event2UserView(APIView):

    # mk a new relationship
    def post(self, request): # eventTitle, viaEmail, email, isOwner, isCoOwner, isGuest
        
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
    
    # get users from event / get self is owner
    def get(self, request): #requType
        
        if request.query_params['requType'] == 'SELFOWNER': # eventId
            user = getUser(request)
            event = request.query_params['eventId']
            
            isOwner = User2Event.objects.filter(event=event, user=user,isOwner=True ).exists()
            return Response(isOwner, status=200)
        
        elif request.query_params['requType'] == 'EVENTUSERS': # id, isStaffOnly, 
            eventId = request.query_params.get('id')
            
            rawGroupsRelations = None
            if int(request.query_params.get('isStaffOnly', 0)):
                rawGroupsRelations = User2Event.objects.filter(event=eventId)
            else:
                rawGroupsRelations = User2Event.objects.filter(event=eventId).filter(Q(isOwner=True) | Q(isCoOwner=True))
            
            
            peopleIds = []
            for relation in rawGroupsRelations:
                peopleIds.append(relation.user.id)
            
            rawMembers = User.objects.filter(id__in=peopleIds)
            serializer = UserSerializer(rawMembers, many=True)
            return Response(serializer.data)
    
class UserPreferenceView(APIView):
    
    # make a new userPreference
    def post(self, request): # credentails, isLiked, isDisliked, eventTitle
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
        
        token = request.COOKIES.get('jwt')
        print(token)
        
        return Response(serializer.data, status=200)
    