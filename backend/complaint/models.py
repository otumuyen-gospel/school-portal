# Create your models here.
from django.db import models
from account.models import User

# Create your models here.
class Complaint(models.Model):
    title = models.CharField(blank=False)
    complaint = models.TextField(blank=False)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    