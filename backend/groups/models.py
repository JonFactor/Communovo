from django.db import models
from users.models import User

# Create your models here.

class Group(models.Model):
    title = models.CharField(max_length=200, unique=True)
    description = models.CharField(max_length=1000)
    image = models.CharField(max_length=1000)
    groupType = models.CharField(max_length=1000, default="misc")
    owner = models.ForeignKey("users.User",on_delete=models.CASCADE, related_name="owner", default="communtiy")
    
class User2Group(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    group = models.ForeignKey("Group", on_delete=models.CASCADE)
    isOwner = models.BooleanField()
    isCoOwner = models.BooleanField()
    isMember = models.BooleanField()
    isBanned = models.BooleanField()
    
class Event2Group(models.Model):
    group = models.ForeignKey("Group", on_delete=models.CASCADE)
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE)
    isPromoted = models.BooleanField()
    