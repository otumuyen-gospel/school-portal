from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import status
from .models import Homework
from .serializers import HomeworkSerializers
from rest_framework.reverse import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from django_filters import AllValuesFilter, DateTimeFilter, NumberFilter
from account.permissions import IsInGroup


'''
NOTE: that a global pagination has been set on this generic api 
      classes below you can find the settings in global settings for
      the project under REST_FRAMEWORK dictionaries.
      this pagination settings are working because of the generic
      API class used below it may not work on other API view that
      not from the generic classes. Also added is the django filters
      app for ordering, search and filtering
'''

#this generic class will handle GET(to list all class) and POST(new class) Request
class HomeworkList(generics.ListCreateAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializers
    permission_classes = [IsAuthenticated, IsInGroup, IsAdminUser,]
    required_groups = ['admin']
    name = 'list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('pk','userId','title','submission') 

     #you can search using the "search" keyword
    search_fields =  ('pk','userId','title','submission') 

    #you can order using the "ordering" keyword
    ordering_fields = ('pk','userId','title','submission') 

    
#this generic class will handle GET(list 1 item), PUT(new class) and DELETE(1 item) Request
class HomeworkDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializers
    permission_classes = [IsAuthenticated, IsInGroup, IsAdminUser,]
    required_groups = ['admin']
    name = 'detail'

class ApiRoot(generics.GenericAPIView):
    name = 'api-root'
    def get(self, request, *args, **kwargs):
        return Response({'list': reverse(HomeworkList.name,
            request=request)})
