from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import status
from .models import User
from .serializers import UserSerializers
from rest_framework.reverse import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from urllib.parse import urlparse
from rest_framework.permissions import IsAuthenticated, IsAdminUser,AllowAny
from django_filters import AllValuesFilter, DateTimeFilter, NumberFilter
from .permissions import IsInGroup
from rest_framework.exceptions import PermissionDenied


'''
NOTE: that a global pagination has been set on this generic api 
      classes below you can find the settings in global settings for
      the project under REST_FRAMEWORK dictionaries.
      this pagination settings are working because of the generic
      API class used below it may not work on other API view that
      not from the generic classes. Also added is the django filters
      app for ordering, search and filtering
'''

#this generic class for listing users in a class 
class ClassUsers(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated, IsInGroup, IsAdminUser,]
    required_groups = ['admin','teacher','student']
    name = 'class-users'
    def get_url_values(self):
        url = self.request.build_absolute_uri()
        pathList = urlparse(url).path.split('/')
        if pathList[len(pathList)-1].isspace():
            return  pathList[len(pathList)-2]   #second to last word
        
        return pathList[len(pathList)-2] #last word

    def get_queryset(self):

        # Example: Filter by a query parameter from the request
        val = self.get_url_values()
        if val:
            self.queryset = self.queryset.filter(classId=val)
        
        return self.queryset
    

#this generic class will handle GET method to be used by the admin alone
class UsersList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated, IsInGroup, IsAdminUser,]
    required_groups = ['admin',]
    name = 'users-list'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    #you can filter by field names specified here keyword e.g url?className='primary one'
    filterset_fields = ('id','childId','classId',
                     'firstName','lastName','email','gender') 

     #you can search using the "search" keyword
    search_fields = ('id','childId','classId',
                     'firstName','lastName','email','gender') 

    #you can order using the "ordering" keyword
    ordering_fields = ('id','childId','classId',
                     'firstName','lastName','email','gender')  


    
#this generic class will handle UPDATE(list 1 item) by admin alone
class AnyUserUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated,IsInGroup, IsAdminUser]
    required_groups = ['admin',]
    name = 'any-user-update'
    lookup_field = 'id'

    
#this generic class will handle UPDATE(list 1 item) by users for their account alone
class UserUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated,IsInGroup,IsAdminUser]
    required_groups = ['admin','teacher','student','parent']
    name = 'user-update'
    lookup_field = 'id'
    def get_object(self):
        obj = super().get_object()
        # Assuming 'owner' is a ForeignKey to User in MyModel
        if obj != self.request.user:
            raise PermissionDenied("You do not have permission to edit this object.")
        return obj


#this generic class will handle DELETE(list 1 item) ONly Admin
class UserDelete(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated,IsInGroup, IsAdminUser]
    required_groups = ['admin',]
    name = 'remove-user'
    lookup_field = 'id'

#this generic class will handle Creation(list 1 item) only admin
class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated,IsInGroup, IsAdminUser]
    required_groups = ['admin',]
    name = 'create-user'
    
#this generic class will handle GET(list 1 item)
class UserRetrieve(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated,IsInGroup, IsAdminUser]
    required_groups = ['admin','teacher','student','parent']
    name = 'retrieve-user'
    lookup_field = 'id'