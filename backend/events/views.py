from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime
from django.db.models import Q

from .serializers import EventSerializer, User2EventSerialzier, UserEventPreferencesSerializer
from .models import Event, UserEventPreferences, User2Event
from users.models import User
from groups.models import Group, Event2Group
from users.serializers import UserSerializer
from functions.getUser import getUser

# This makes sure that every event that is being pulled is not past its date and will
# return none if this is true and set it to be expired, this functin utilzes recursion to
# handle list cases, avoiding the need for loops and returning the non-expired events.
@staticmethod
def ExireEventIfPastDate(event, isList):
    now = datetime.datetime.utcnow() 
    if isList:
        events = []
        for i in event:
            eventExpiredFiltered = ExireEventIfPastDate(i, isList=False)
            if eventExpiredFiltered == None:
                continue
            events.append(eventExpiredFiltered)
        return events
    else: 
        if event == None:
            return None
        if event.isExpired:
            return None
        if now.date() > event.date:
            Event.objects.filter(id=event.id).update(isExpired=True)
            return None
        else:
            return event

#------------------------------------------------- Event View ---------
#   
#     Purpose:  
#             - post
#             Create a new validated row inside of the event_events table in the db
#             
#             - get
#             Pull data from a specific filtered row or rows of the affirmentioned table
#             
#             - delete
#             Remove a reow from the event table via a filter.
#             
#     Input / Params:  
#             - post
#             time -> number, title -> string, location -> string / name, date -> time / string
#             eventType -> string, eventGroup -> title / string, coverImg -> string, regionCords -> string / dict
#
#             - get
#             requType -> enum / string, 
#               ID: id -> string / number 
#               COLLECTION: isBaisedOnGroup -> bool, groupTitle -> string, 
#             exculdeDisliked -> bool, isOnlyDisliked -> bool, isOnlyLiked -> bool,
#             excludeDisliked -> bool
#               TITLE: title -> string
#
#             - delete
#             eventId -> number / string
#              
#     Output / Response:  
#             - post
#             the data that has been entered in the api endpoint in a seralized form.
#             
#             - get  (NOT COLLECTION / COLLECTION)
#             either a single events data or a array / list of event data objects.
#             
#             - delete
#             message of success or error
#              
#-------------------------------------------------------------------------

class EventView(APIView):
    
    # make a new event
    def post(self, request): #time, title', 'location', 'date', 'eventType', 'eventGroup', 'coverImg', 'regionCords']
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
            return Response(status=401)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get(self, request): # requType
        if request.query_params.get('requType') == "ID": # id
            requId = request.query_params.get('eventId')
            event = Event.objects.filter(id = requId).first()
            event = ExireEventIfPastDate(event, False)
            if event == None:
                return Response(status=401)
            serializer = EventSerializer(event, many=False)
            return Response(data=serializer.data)
        
        elif request.query_params['requType'] == "COLLECTION": # isBaisedOnGroup, groupTitle, exculdeDisliked, isOnlyDisliked, isOnlyLiked, excludeDisliked
            user = getUser(request)
            if user == None:
                return Response(status=400)
            filterEvents = None
            
            if (request.query_params.get('isBaisedOnGroup') == 'true'):
                groupTitle = request.query_params.get('groupTitle')
                group = Group.objects.filter(title=groupTitle).first()
                if group == None:
                    return Response({"message":"group could not be found."}, status=401)
                
                event2Groups = Event2Group.objects.filter(group=group.id)
                
                ids = []
                for e in event2Groups:
                    ids.append(e.event.id)
            else:
                if (request.query_params.get('excludeDisliked' == 'true')):
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                elif (request.query_params.get('isOnlyDisliked') == 'true'):
                    filterEvents = UserEventPreferences.objects.filter(user=user.id).filter(isDisliked=True)
                elif (request.query_params.get('isOnlyLiked') == 'true'):
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
            
            if (request.query_params.get('excludeDisliked') == 'true'):
                events = Event.objects.exclude(id__in=ids)
            else:
                events = Event.objects.filter(id__in=ids)
                
            event = ExireEventIfPastDate(events, True)
            serializer = EventSerializer(event, many=True)
            return Response(data=serializer.data)
        
        elif request.query_params['requType'] == "TITLE": # title
            title = request.query_params['title']
            event = Event.objects.filter(title = title).first()
            
            ExireEventIfPastDate(event, False)
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
    
#------------------------------------------------- Event 2 User View -
#   
#     Purpose:  
#             - post
#             create a new user 2 event relationship mostly for when creating a new event and 
#             setting a owner, or a user signing up for / off a event.
#             
#             - get
#             let the user / app know if this user is indeed an owner or not
#             get all of the users for the said event.
#             
#     Input / Params:  
#             - post
#             eventTitle, viaEmail, email, isOwner, isCoOwner, isGuest
#             
#             - get
#             requType -> enum / string
#              SELFOWNER: eventId -> string / number
#              EVENTUSERS: id -> string / number, isStaffOnly -> boolean / status 
#              
#     Output / Response:  
#             - post
#             the inputed data in the seralizer data format if not errored
#             
#             - get
#             SELFOWNER: returns a boolean that displays if the user is indeed the owner
#             EVENTUSERS: returns a list of user objects that belong to a specified event
#             
#-------------------------------------------------------------------------

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
            if (request.query_params.get('isStaffOnly', 'false') == 'true'):
                rawGroupsRelations = User2Event.objects.filter(event=eventId)
            else:
                rawGroupsRelations = User2Event.objects.filter(event=eventId).filter(Q(isOwner=True) | Q(isCoOwner=True))
            
            
            peopleIds = []
            for relation in rawGroupsRelations:
                peopleIds.append(relation.user.id)
            
            rawMembers = User.objects.filter(id__in=peopleIds)
            serializer = UserSerializer(rawMembers, many=True)
            return Response(serializer.data)

#------------------------------------------------- User Preference View -
#   
#     Purpose:  
#             - post
#             make a new preference for the event type to in the future load events
#             that the user is intended to like via a weighted algorythm.
#             
#     Input / Params:  
#             - post
#               isLiked -> boolean / status, isDisliked -> boolean / staus, eventTitle ->
#               string / filter
#              
#     Output / Response:  
#             - post
#             the inputed seralizer data for further possible frontend use (future).
#             
#-------------------------------------------------------------------------

class UserPreferenceView(APIView):
    
    # make a new userPreference
    def post(self, request): #  isLiked, isDisliked, eventTitle
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
        
        return Response(serializer.data, status=200)
    