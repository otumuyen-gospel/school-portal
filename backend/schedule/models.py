# Create your models here.
from django.db import models
from account.models import User

# Create your models here.
class Schedule(models.Model):
    detail = models.TextField(blank=False)
    title = models.CharField(blank=False)
    dateTime = models.DateTimeField(auto_now_add=True,blank=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    