from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    name = models.CharField(max_length=255)
    firstName = models.CharField(max_length=225, default="John")
    lastName = models.CharField(max_length=225, default="Doe")
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    profilePic = models.CharField(max_length=225, blank=True)
    description = models.CharField(max_length=225, default="nothing to see here")
    favColor = models.CharField(max_length=225, null="black")
    
    username = None         # uses none due to login wanting to be handled by email not username

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = [email, password]

class UserRelationships(models.Model):
    firstUser = models.ForeignKey("User", on_delete=models.CASCADE, related_name="first")
    secondUser = models.ForeignKey("User", on_delete=models.CASCADE, related_name="second")
    isBlocked = models.BooleanField()
    isFollowed = models.BooleanField()
    # isMutual = models.BooleanField()
