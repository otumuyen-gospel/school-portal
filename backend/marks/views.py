from django.shortcuts import render
from rest_framework import status
from .models import Mark
from .serializers import MarkSerializers
from rest_framework.reverse import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from urllib.parse import urlparse
from rest_framework.permissions import IsAuthenticated, IsAdminUser,AllowAny
from django_filters import AllValuesFilter, DateTimeFilter, NumberFilter
from account.permissions import IsInGroup
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

#this generic class for listing users attendance in a class 
class ClassMark(generics.ListAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['admin','teacher']
    name = 'class-mark'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    #you can filter by field names specified here keyword e.g url?className='primary one'
    filterset_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',) 

     #you can search using the "search" keyword
    search_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',)

    #you can order using the "ordering" keyword
    ordering_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',)

    def get_url_values(self):
        url = self.request.build_absolute_uri()
        pathList = urlparse(url).path.split('/')
        if pathList[len(pathList)-1].isspace():
            return  pathList[len(pathList)-2]   #second to last word
        
        return pathList[len(pathList)-2] #last word

    def get_queryset(self):

        # Example: Filter by classId
        val = int(self.get_url_values())
        userClass = self.request.user.classId
        if (userClass != None and val == userClass.id) or \
        self.request.user.is_superuser:
            return self.queryset.filter(classId=val)
        else:
            raise PermissionDenied("You don't have access right")
    

#this generic class will handle GET method to be used by the admin alone
class MarkList(generics.ListAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated, IsInGroup, ]
    required_groups = ['admin',]
    name = 'mark-list'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    #you can filter by field names specified here keyword e.g url?className='primary one'
    filterset_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',) 

     #you can search using the "search" keyword
    search_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',)

    #you can order using the "ordering" keyword
    ordering_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',)
    
#this generic class will handle UPDATE(list 1 item) by admin and teacher only 
class MarkUpdate(generics.UpdateAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated,IsInGroup,]
    required_groups = ['admin','teacher']
    name = 'Mark-update'
    lookup_field = 'id'
    def get_object(self):
        obj = super().get_object()
        if self.request.user.is_superuser or \
            obj.classId.id == self.request.user.classId.id:
             return obj
        else:
            raise PermissionDenied("You do not have permission to edit this object.")


#this generic class will handle DELETE(list 1 item) ONly Admin and teacher
class MarkDelete(generics.DestroyAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated,IsInGroup,]
    required_groups = ['admin','teacher']
    name = 'remove-mark'
    lookup_field = 'id'
    def get_object(self):
        obj = super().get_object()
        if self.request.user.is_superuser or \
            obj.classId.id == self.request.user.classId.id:
             return obj
        else:
            raise PermissionDenied("You do not have permission to edit this object.")

#this generic class will handle Creation(list 1 item) only admin and teacher
class MarkCreate(generics.CreateAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated,IsInGroup, IsAdminUser]
    required_groups = ['admin','teacher']
    name = 'create-mark'
    
#this generic class will handle GET(list 1 item) - can be accessed by all user
class UserMark(generics.ListAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated,IsInGroup,]
    required_groups = ['student','parent',]
    name = 'user-mark'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    #you can filter by field names specified here keyword e.g url?className='primary one'
    filterset_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',) 

     #you can search using the "search" keyword
    search_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',)

    #you can order using the "ordering" keyword
    ordering_fields = ('examScore','test_score1','test_score2',
                     'test_score3','subjectId', 'userId',) 
    

    def get_url_values(self):
        url = self.request.build_absolute_uri()
        pathList = urlparse(url).path.split('/')
        if pathList[len(pathList)-1].isspace():
            return  pathList[len(pathList)-2]   #second to last word
        
        return pathList[len(pathList)-2] #last word

    def get_queryset(self):
         # Example: Filter by classId
        val = int(self.get_url_values())
        userId = self.request.user.id
        childId = self.request.user.childId
        if (userId != None and val == userId) or \
         (childId != None and val == childId):
            return self.queryset.filter(userId=val)
        else:
            raise PermissionDenied("You don't have access right")
   
   