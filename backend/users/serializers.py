from rest_framework import serializers

from .models import User, UserRelationships, EmailVerificationCode

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util
from rest_framework.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'firstName', 'lastName', 'email', 'password', 'profilePic', 'description', 'phoneNum']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # set everything but password
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRelationships
        fields = '__all__'

# email not passed through (find a way to pass it though to impliment)
# class PasswordResetSerializer(serializers.Serializer): # requires the request to be passed
#     email=serializers.EmailField(min_length=2)
    
#     class Meta:
#         feilds = ['email']
        
#     # def validate(self, attrs):

#     #         email=attrs['data'].get('email', '')
#     #         if User.objects.filter(email=email).exists():
#     #             user = User.objects.filter(email=email).first()
#     #             uidb64 = urlsafe_base64_encode(user.id)
#     #             token = PasswordResetTokenGenerator().make_token(user)
                
#     #             currentSite = get_current_site(request=attrs['data'].get('request')).domain
#     #             relativeLink = reverse('passwordResetConfrim', kwargs={'uidb64':uidb64, 'token':token})
#     #             absUrl = f'http://{currentSite}{relativeLink}'
#     #             emailBody = f'Hello from Communovo, Use the link below to reset your password \n {absUrl}'
#     #             data = {'emailBody':emailBody, 'emailSubject':'Communovo password reset',
#     #                     'emailTo':user.email}
#     #             Util.SendEmail(data)
        
#     #         return super().validate(attrs)
    
class SetNewPasswordSeralizer(serializers.Serializer):
    # uses write only so nothing can view this feild
    password = serializers.CharField(min_length=6, max_length=50, write_only=True)
    token = serializers.CharField(min_length=1, max_length=100, write_only=True)
    uidb64 = serializers.CharField(min_length=1, max_length=100, write_only=True)
    
    class Meta:
        feilds = ['password', 'token', 'uidb64']
        
    def validate(self, attrs):
        print(password)
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            
            userId = uidb64
            user = User.objects.filter(id=userId).first()
            
            if not PasswordResetTokenGenerator().check_token(user, token=token):
                # make sure link has not already been used
                raise AuthenticationFailed('The reset code is invalid', 401)
            
            user.set_password(password)
            user.save()
            
            return user
        except Exception as ex:
            raise AuthenticationFailed('The reset code is invalid', 401)
        return super().validate(attrs)

class EmailVerificationCodeSeralizer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerificationCode
        fields = '__all__'