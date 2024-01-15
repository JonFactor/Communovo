from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.views.decorators.csrf import csrf_exempt
import datetime

from .serializers import Event2GroupSerializer, User2GroupSerialzier, GroupSerializer
from users.models import User
from users.serializers import UserSerializer
from events.models import Event
from .models import Group, User2Group
from events.serializers import EventSerializer
from django.db.models import Q
from functions.getUser import getUser

#------------------------------------------------- Group View ---------
#   
#     Purpose:  
#             
#             
#             
#     Input / Params:  
#             
#             
#              
#     Output / Response:  
#             
#             
#             
#-------------------------------------------------------------------------

class GroupView(APIView):
    def post(self, request): # title, description, image, owner, groupType
        userId = getUser(request).id
        request.data.update({'owner':userId})
        
        serializer = GroupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get(self, request): # requType
        if request.query_params['requType'] == "VIATYPE": # groupType
            groupType = request.query_params['groupType']
            groups = Group.objects.filter(groupType = groupType)
            serializer = GroupSerializer(groups, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer)
        
        elif request.query_params['requType'] == "TITLE": # title
            requTitle = request.query_params.get('title')
            group = Group.objects.filter(title=requTitle).first()
            serialzier = GroupSerializer(group)
            
            #serialzier.is_valid(raise_exception=True)
            return Response(serialzier.data)
        
        elif request.query_params['requType'] == "ALL":
            groups = Group.objects.all()
            serializer = GroupSerializer(groups, many=True)
            return Response(serializer.data)
        
        elif request.query_params['requType'] == "ID": # id
            groupId = request.query_params.get("id")
            group = Group.objects.filter(id=groupId).first()
            serializer = GroupSerializer(group)
            #serializer.is_valid(raise_exception=True)
            return Response(serializer.data)
        
        return Response({"message":"incorrect enum requType"}, staus=401)
    
#------------------------------------------------- Group 2 User View --
#   
#     Purpose:  
#             
#             
#             
#     Input / Params:  
#             
#             
#              
#     Output / Response:  
#             
#             
#             
#-------------------------------------------------------------------------
        
class Group2UserView(APIView):
    def post(self, request): # email, title
        user = request.data.get('email')
        group = request.data.get('title')
        
        userRaw = User.objects.filter(email=user).first()
        userData = UserSerializer(userRaw).data
        userId = userData.get("id")
        
        groupRaw = Group.objects.filter(title=group).first()
        group = GroupSerializer(groupRaw)
        groupId = group.data.get("id")
        
        request.data.update({"user":userId})
        request.data.update({"group":groupId})
        
        request.data.pop("title")
        request.data.pop("email")
        
        serializer = User2GroupSerialzier(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get(self, request): # requType
        if request.query_params['requType'] == "TITLE": # title, isStaffOnly
            title = request.query_params.get('title')
            groupId = Group.objects.filter(title=title).first().id
            
            rawGroupsRelations = None
            if request.query_params.get('isStaffOnly'):
                rawGroupsRelations = User2Group.objects.filter(group=groupId)
            else:
                rawGroupsRelations = User2Group.objects.filter(group=groupId).filter(Q(isOwner=True) | Q(isCoOwner=True))
            
            
            peopleIds = []
            for relation in rawGroupsRelations:
                peopleIds.append(relation.user.id)
            
            rawMembers = User.objects.filter(id__in=peopleIds)
            serializer = UserSerializer(rawMembers, many=True)
            return Response(serializer.data)
        
        elif request.query_params['requType'] == "USER": 
            user = getUser(request).id

            groups = User2Group.objects.filter(user=user)   
            ids = []
            for g in groups:
                ids.append(g.id)
                
            
            groupsfilter = Group.objects.filter(id__in=ids)
            serializer = GroupSerializer(groupsfilter, many=True)
            
            return Response(serializer.data)
        
        return Response({"message":"incorrect enum requType"}, staus=401)
    def delete(self, request):
        email = request.data['email']
        title = request.data['title']
        
        userRaw = User.objects.filter(email=email).first()
        userId = UserSerializer(userRaw).data.id
        
        groupRaw = Group.objects.filter(title=title).first()
        groupId = GroupSerializer(groupRaw).data.id
        
        userToGroupRaw = User2Group.objects.filter(user=userId, group=groupId)
        userToGroupSerializer = User2GroupSerialzier(userToGroupRaw)
        userToGroupSerializer.is_valid(raise_exception=True)
        userToGroupSerializer.save()
        
        User2Group.objects.filter(user=userId, group=groupId).delete()
        
        return Response(userToGroupSerializer.data)
        
#------------------------------------------------- Group 2 Event View --
#   
#     Purpose:  
#             
#             
#             
#     Input / Params:  
#             
#             
#              
#     Output / Response:  
#             
#             
#             
#-------------------------------------------------------------------------
        
class Group2EventView(APIView):
    
    # make a new group 2 user relationship, mostly used when creating events with groups
    def post(self, request): # groupName, eventName, isPromoted
        
        group = request.data["groupName"]
        event = request.data["eventName"]
        isPromo = request.data["isPromoted"]
        
        eventData = Event.objects.filter(title = event).first()
        eventSerializer = EventSerializer(eventData)
        
        groupData = Group.objects.filter(title = group).first()
        groupSerializer = GroupSerializer(groupData)
        
        requestData = {
            "group": groupSerializer.data.id,
            "event": eventSerializer.data.id,
            "isPromo": isPromo
        }
        
        serializer = Event2GroupSerializer(requestData)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer)     
