from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
from django.db.models import Q 

from .serializers import UserSerializer, UserRelationshipSerializer, SetNewPasswordSeralizer, EmailVerificationCodeSeralizer
from .models import User, UserRelationships, EmailVerificationCode
from functions.getUser import getUser

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import  DjangoUnicodeDecodeError
from .utils import Util

from events.models import Event, User2Event
from groups.models import Group

from braces.views import CsrfExemptMixin

#------------------------------------------------- Search DB View ---------
#   
#     Purpose:  
#             - get
#              let the users search for anything that is inside of the db providing a centeralized
#              discovery lookup page.
#
#     Input / Params:  
#             - get
#             search -> string / filter
#              
#     Output / Response:  
#             - get
#             dict of userList, eventList, and groupList each being an array of their respective objects
#             is returned from this function, sometimes being nothing at all
#             
#-------------------------------------------------------------------------

# this view is for all the apps but has no other place to be put but the main app
class SearchDatabaseView(APIView): # search | returns a list of ids for the given models
    def get(self, request):
        keywords = str(request.query_params["search"])
            
        queryKeywords = Q()
        for word in keywords.split(" "):
            queryKeywords |= (Q(title__icontains=word))
            
        queryKeywords2 = Q()
        for word in keywords.split(" "):
            queryKeywords2 |= (Q(name__icontains=word))
            

        groups = Group.objects.filter(queryKeywords)
        events = Event.objects.filter(queryKeywords)
        users = User.objects.filter(queryKeywords2)
        
        userList = []
        eventList = []
        groupList = []
        
        # mapped to object
        modelObjs = [groups, events, users]
        dataObjs = [groupList, eventList, userList]
        
        for i in modelObjs:
            dataObj = dataObjs[modelObjs.index(i)]
            if len(i) < 1:
                continue

            for ii in i:
                dataObj.append(ii.id)
                print(i, dataObj)
                i = dataObj

        for i in dataObjs:
            if len(i) < 1:
                i = "None"
        
        
        return Response(data={"user":userList, "event":eventList, "group":groupList})

#------------------------------------------------- User View ---------
#   
#     Purpose:  
#             to maintain user accounts through post, delete, and patch requests with the little
#             access granted to these endpoints as is allowed via making the viewing of data not
#             being able to alter the table through get requests.
#              
#     Input / Params:  
#             - post
#             'name', 'firstName', 'lastName', 'email', 'password', 'profilePic', 'description', 'phoneNum'
#              
#             - get
#             requType: SELF / ID: id -> string / number / filter
#
#              - patch
#             id -> string / number / filter, profilePicUrl -> string / input data
#              
#              - delete
#              NONE
#
#     Output / Response:  
#             - post
#             the inputed data, in addition to any automated information.
#             
#             
#             - get
#             a user seralized for data output
#              
#              - patch
#              a empty response.
#                        
#              - delete
#              status of deletion.
#             
#-------------------------------------------------------------------------

class UserView(CsrfExemptMixin, APIView):
    def post(self, request): # 'name', 'firstName', 'lastName', 'email', 'password', 'profilePic', 'description', 'phoneNum']
        request.data.update({"description":"nothing to see here"})
        request.data.update({"profilePic":"http://www.gravatar.com/avatar"})
    
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def get(self, request): # requType
        
        if request.query_params["requType"] == "SELF":
            user = getUser(request)
            if user == None:
                return Response(status=400)
            serializer = UserSerializer(user)

            return Response(serializer.data)
        
        elif request.query_params["requType"] == "ID":
            id = request.query_params["id"] # id
            
            user = User.objects.filter(id=id).first()
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        return Response({"message":"incorrect enum requType"}, staus=401)
    def patch(self, request): # id profilePicUrl
        reqId = request.data['id']
        profileUriKey = request.data['profilePicUrl']
        User.objects.filter(id = reqId).update(profilePic=profileUriKey)
        
        response = Response()
        return response
    
    def delete(self, request):
        user = getUser(request=request)
        if user == None:
            return Response({"message":"user not found"}, status=401)
        user.delete()
        
        return Response(status=200)        
    
#------------------------------------------------- Login View ---------
#   
#     Purpose:  
#             - post
#             To authorize the user to access the database.
#             
#     Input / Params:  
#             - post
#             requType -> COOKIES: jwt -> string, CREDENTIALS -> email / password -> string / filters
#                
#-------------------------------------------------------------------------
    
class LoginView(APIView):
    def post(self, request): # requType
        
        if request.data['requType'] == "COOKIES": #JWT
            token = request.data['jwt']
            response = Response()
            response.set_cookie(key="jwt", value=token, httponly=True)

            response.data = {
                "jwt": token
            }
            
            return response
        
        elif request.data['requType'] == 'CREDENTIALS':
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
        
        return Response({"message":"incorrect enum requType"}, staus=401)

#------------------------------------------------- Logout View ---------
#   
#     Purpose:  
#             - post
#             remove cookies from the user.
#             
#-------------------------------------------------------------------------

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }

        return response

#------------------------------------------------- Relationship View ---------
#
#     Input / Params:  
#             - post
#             secondUserEmail, isBlocked, isFollowed
#              
#             - get
#             userEmail, checkFollow, checkBlocked
#             
#     Output / Response:  
#             - post
#             inputed data back to the frontend
#             
#             - get
#             a list of all users that did not get filtered out and have realtionships with the user.
#              
#-------------------------------------------------------------------------

class RelationshipView(APIView):
    def post(self, request): # secondUserEmail, isBlocked, isFollowed
        
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
    
    def get(self, request): # userEmail, checkFollow, checkBlocked
        token = request.COOKIES.get('jwt')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('jwt expired signature')

        user = User.objects.filter(email=request.query_params['userEmail']).first()
        
        if request.query_params['checkFollow'] == True and request.query_params['checkBlocked'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isBlocked=True, isFollowed=True)
        elif request.query_params['checkFollow'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isFollowed=True)
        elif request.query_params['checkBlocked'] == True:
            listOfFollowing = UserRelationships.objects.filter(firstUser=user.id, isBlocked=True)
        else:
            listOfFollowing = UserRelationships.objects.all()

        serializer = UserRelationshipSerializer(listOfFollowing, many=True)
        
        return(Response(data=serializer.data))

#------------------------------------------------- Password Reset Views --
#   
#     Purpose:  
#             Provide a seperated class for different levels of access that the user should
#             not be able to have while still making it possible to validate their new password.
#               
#-------------------------------------------------------------------------

class RequestPasswordResetEmailView(APIView):
            
    def post(self, request):
        email = request.data['email']
        
        if User.objects.filter(email=email).exists():
            user = User.objects.filter(email=email).first()
            uidb64 = user.id
            token = PasswordResetTokenGenerator().make_token(user)
            
            ranNum = User.objects.make_random_password(length=6, allowed_chars='123456789')
            while EmailVerificationCode.objects.filter(code=ranNum).exists():
                
                ranNum = User.objects.make_random_password(length=6, allowed_chars='123456789')

            seralizer = EmailVerificationCodeSeralizer(data={'code':ranNum, 'uidb64':uidb64, 'token':token})
            seralizer.is_valid(raise_exception=True)
            seralizer.save()
            
            emailBody = f'Hello from Communovo, Use the verification code below in the app to reset your password \n {ranNum}'
            data = {'emailBody':emailBody, 'emailSubject':'noreply',
                    'emailTo':[user.email]}
            
            Util.SendEmail(data)
                
        return Response({'success':'An email has been sent with a code to reset your password'}
                    , status=200)
        
class PasswordTokenValidateView(APIView): # code
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
            raise AuthenticationFailed('The reset code is invalid', 401)
        
        
        user.set_password(password)
        user.save()
        
        
        return Response({'success':True, 'message':'Password Reset Successful'},
                        status=200)
        
#------------------------------------------------- User Add Phone View -
#   
#     Purpose:  
#             - post
#             Get required information for sending sms reminders, while sending the user a reminder
#             to an event in the process.
#
#     Input / Params:  
#             - post
#             number, eventTitle, eventDate
#             
#     Output / Response:  
#             - post
#             the success of a request or failure.
#
#-------------------------------------------------------------------------
        
class UserAddPhoneView(APIView):
    def post(self, request): # number, eventTitle, eventDate
        # update users phone number
        user = getUser(request=request)
        if user == None:
            return Response({"message":"Could Not Find User. Please Login and Try Again."}, status=401)
        
        User.objects.filter(id=user.id).update(phoneNum=request.data['number'])
        
        # send message to phone number
        sentMessage = Util.SendSMS(user.phoneNum, f"An event occuring on: {request.data['eventDate']}, by the name of: {request.data['eventTitle']}. Has registered you for SMS notifications. REPLY CANCEL to stop notifications.")
        if (not sentMessage):    
            return Response({"message":"Confrimation message has not been sent but is still scheduled."},status=401)
        
        return Response(status=200)
    
#------------------------------------------------- User Notify Views ---------
#   
#     Purpose:  
#             - post
#             Send a message to the user via TWILLO and the utils class defined in the utils file.
#             wether this be theough TWILLOS messages or djangos built in email sending.
#
#     Input / Params:  
#             - post
#             eventTitle, eventDate
#
#     Output / Response:  
#             - post
#             response status
#
#-------------------------------------------------------------------------
    
class UserNotifyPhoneView(APIView):
    def post(self, request): # eventTitle, eventDate TWILLO CAPS THE REQUESTS
        # update users phone number
        user = getUser(request=request)
        if user == None:
            return Response({"message":"Could Not Find User. Please Login and Try Again."}, status=401)
        
        hasAlreadyBeenReminded = User2Event.objects.filter(user=user.id, event=Event.objects.filter(title=request.data["eventTitle"]).first()).first().hasBeenNotified
        if hasAlreadyBeenReminded:
            return Response(status=401)
        # send message to phone number
        sentMessage = Util.SendSMS(user.phoneNum, f"An event occuring on: {request.data['eventDate']}, by the name of: {request.data['eventTitle']}. Has registered you for SMS notifications. REPLY CANCEL to stop notifications.")
        if (not sentMessage):    
            return Response({"message":"Confrimation message has not been sent but is still scheduled."},status=401)
        
        User2Event.objects.filter(user=user.id, event=Event.objects.filter(title=request.data["eventTitle"]).first()).update({"hasBeenNotified":True})
        return Response(status=200)
    
class SendSelfEmailView(APIView):
    def post(self, request):
        user = getUser(request=request)
        
        emailSent = Util.SendEmail({"emailSubject":request.data["emailHeader"], 'emailBody':request.data["emailBody"], "emailTo":[user.email]})
        
        return Response({"message":"Email has been sent"}, status=200)
    
    
class User2userStatusChangeView(APIView):
    def post(self, request):
        user = getUser(request=request)
        
        isFollow = request.data['isFollow']
        userId = request.data['userId']
        
        hasRecord = UserRelationships.objects.filter(firstUser=user.id, secondUser=userId).exists()
        if hasRecord:
            # update relationship
            UserRelationships.objects.filter(firstUser=user.id, secondUser=userId).update(isFollow=isFollow)
        else:
            # create relationship
            data = {"firstUser":user.id,"secondUser":userId, "isBlocked":False, "isFollowed":isFollow}
            seralizer = UserRelationshipSerializer(data=data)
            seralizer.is_valid(raise_exception=True)
            seralizer.save()
        return Response(status=200)
    