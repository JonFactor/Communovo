from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime

from .serializers import UserSerializer, UserRelationshipSerializer
from .models import User, UserRelationships
from functions.getUser import getUser

class RegisterView(APIView):
    def post(self, request):
        
        request.data.update({"description":"nothing to see here"})
        request.data.update({"profilePic":"http://www.gravatar.com/avatar"})
        print(request.data)
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class SetProfileView(APIView):
    def post(self, request):
        reqId = request.data['id']
        profileUriKey = request.data['profilePicUrl']
        User.objects.filter(id = reqId).update(profilePic=profileUriKey)
        
        response = Response()
        return response

class LoginViaCookiesView(APIView):
    def post(self, request):
        
        token = request.data['jwt']
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)

        response.data = {
            "jwt": token
        }
        
        return response
    
class UserViaIdView(APIView):
    def post(self, request):
        id = request.data["id"]
        
        user = User.objects.filter(id=id).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LoginView(APIView): 
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret',
                           algorithm='HS256')

        response = Response()

        response.set_cookie(key="jwt", value=token, httponly=True)

        response.data = {
            "jwt": token
        }

        return response



class UserView(APIView):
    def get(self, request):
        user = getUser(request)
        if user == None:
            return Response(status=400)
        serializer = UserSerializer(user)

        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }

        return response

class RelationshipCreateView(APIView):
    def post(self, request):
        # secondUserEmail, isBlocked, isFollowed
        token = request.COOKIES.get('jwt')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('jwt expired signature')

        user = User.objects.filter(id=payload['id']).first()
        secondUser = User.objects.filter(email=request.data['secondUserEmail']).first()
        completeData = {"firstUser": user.id, "secondUser": secondUser.id, "isBlocked": request.data['isBlocked'], "isFollowed": request.data['isFollowed']}
        
        serializer = UserRelationshipSerializer(data=completeData)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    # return nothing | take in user cookies (default), relationship-Type, secondUserId

class RelationshipViewView(APIView):
    def post(self, request):
        # userEmail, checkFollow, checkBlocked
        token = request.COOKIES.get('jwt')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('jwt expired signature')

        user = User.objects.filter(email=request.data['userEmail']).first()
        
        if request.data['checkFollow'] == True and request.data['checkBlocked'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isBlocked=True, isFollowed=True)
        elif request.data['checkFollow'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isFollowed=True)
        elif request.data['checkBlocked'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isBlocked=True)
        else:
            listOfFollowing = UserRelationships.objects.all()
            
        serializer = UserRelationshipSerializer(listOfFollowing, many=True)
        return(Response(data=serializer.data))
    # return a list of all the ids of who the user is following | take in user cookies (defualt)