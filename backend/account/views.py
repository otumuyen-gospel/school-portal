from django.shortcuts import render
from rest_framework import status
from .models import User
from .serializers import UserSerializers
from rest_framework.reverse import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from django_filters import AllValuesFilter, DateTimeFilter, NumberFilter

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
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    name = 'list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('userId','childId','classId',
                     'firstName','lastName','email',
                     'role', 'gender') 

     #you can search using the "search" keyword
    search_fields = ('userId','childId','classId',
                     'firstName','lastName','email',
                     'role', 'gender') 

    #you can order using the "ordering" keyword
    ordering_fields = ('userId','childId','classId',
                     'firstName','lastName','email',
                     'role', 'gender')  

    
#this generic class will handle GET(list 1 item), PUT(new class) and DELETE(1 item) Request
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    name = 'detail'

class ApiRoot(generics.GenericAPIView):
    name = 'api-root'
    def get(self, request, *args, **kwargs):
        return Response({'list': reverse(UserList.name,
            request=request)})
