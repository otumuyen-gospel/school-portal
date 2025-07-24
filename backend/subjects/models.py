# Create your models here.
from django.db import models
from classes.models import Class

# Create your models here.
class Subject(models.Model):
    subjectName = models.CharField(max_length=100, 
                                  blank=False, null=False)
    subjectCode = models.CharField(max_length=7, 
                                  blank=False, null=False)
    classId = models.ForeignKey(Class, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ('subjectName',)
    def __str__(self):
        return self.subjectName