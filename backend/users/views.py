from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from .serializers import UserSerializer, UserRelationshipSerializer, SetNewPasswordSeralizer, EmailVerificationCodeSeralizer
from .models import User, UserRelationships, EmailVerificationCode
from functions.getUser import getUser

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util

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

# email password reset


class RequestPasswordResetEmailView(APIView):
            
    # seralizerClass = PasswordResetSerializer
    #method_decorator(csrf_exempt)
    def post(self, request):
        # data = {'data':request.data, 'request':request}
        # seralizer = self.seralizerClass(data=data)
        # seralizer.is_valid(raise_exception=True)
        # return Response({'success':'An email has been sent with a link to reset your password'}
        #                  , status=200)
        email = request.data['email']
        
        # not making a else condition so the end user cannot abuse the service to find
        # which emails have an account. 
        print(email, User.objects.filter(email=email).exists())
        if User.objects.filter(email=email).exists():
            user = User.objects.filter(email=email).first()
            uidb64 = user.id
            token = PasswordResetTokenGenerator().make_token(user)
            
            # currentSite = "exp://127.0.0.1:8081"#get_current_site(request=request ).domain # due to dev invornment redirect needs to goto apps localhost
            # relativeLink = reverse('passwordResetConfrim', kwargs={'uidb64':uidb64, 'token':token})
            # absUrl = f'{currentSite}{relativeLink}' 

            # create token model
            # random number for code not in db
            ranNum = User.objects.make_random_password(length=6, allowed_chars='123456789')
            while EmailVerificationCode.objects.filter(code=ranNum).exists():
                print(ranNum)
                ranNum = User.objects.make_random_password(length=6, allowed_chars='123456789')

            seralizer = EmailVerificationCodeSeralizer(data={'code':ranNum, 'uidb64':uidb64, 'token':token})
            seralizer.is_valid(raise_exception=True)
            seralizer.save()
            
            emailBody = f'Hello from Communovo, Use the verification code below in the app to reset your password \n {ranNum}'
            data = {'emailBody':emailBody, 'emailSubject':'Communovo password reset',
                    'emailTo':[user.email]}
            Util.SendEmail(data)
                
        return Response({'success':'An email has been sent with a code to reset your password'}
                    , status=200)
class PasswordTokenValidateView(APIView):
    def post(self, request):
        
        code = request.data['code']
        if not EmailVerificationCode.objects.exists(code=code):
            return Response({'success':False, 'error':'code was not found'},  status=401)
        
        codeObj = EmailVerificationCode.objects.filter(code=code).first()
        uidb64 = codeObj.uidb64
        token = codeObj.token
        
        try:
            userId = uidb64
            user = User.objects.filter(id = userId).first()
            
            if not PasswordResetTokenGenerator().check_token(user, token=token):
                return Response({'error':'Token is not valid, please request a new token'},
                                status=401)
            
            return Response({'success':True, 'message':"Credentails Validated", 'uidb64':uidb64, 'token':token},
                            status=200)
        except DjangoUnicodeDecodeError as identifier:
            if not PasswordResetTokenGenerator().check_token(user, token=token):
                return Response({'error':'Token is not valid, please request a new token'},
                                status=401)
        return Response(None)
    
class SetNewPasswordView(APIView): # code, password
    serializerClass=SetNewPasswordSeralizer
    
    def post(self, request):

        if not EmailVerificationCode.objects.filter(code=request.data['code']).exists() :
            return Response( {'message':'unsuccessful request'}, status=401)
        codeObj = EmailVerificationCode.objects.filter(code=request.data['code']).first()
        uidb64 = codeObj.uidb64
        token = codeObj.token
        password = request.data['password']
        
        userId = uidb64
        user = User.objects.filter(id=userId).first()
        
        if not PasswordResetTokenGenerator().check_token(user, token=token):
            # make sure link has not already been used
            raise AuthenticationFailed('The reset code is invalid', 401)
        
        print(user)
        user.set_password(password)
        user.save()
        # serializer = SetNewPasswordSeralizer(data={'uidb64':uidb64, 'token':token, 'password':request.data['password']})
        # serializer.is_valid(raise_exception=True)
        
        
        return Response({'success':True, 'message':'Password Reset Successful'},
                        status=200)
        
