from django.shortcuts import render
from rest_framework import status
from account.models import User
from account.serializers import UserSerializers
from attendance.models import Attendance
from attendance.serializers import AttendanceSerializers
from marks.models import Mark
from marks.serializers import MarkSerializers
from schedule.models import Schedule
from schedule.serializers import ScheduleSerializers
from complaint.models import Complaint
from complaint.serializers import ComplaintSerializers
from homework.models import Homework
from homework.serializers import HomeworkSerializers
from classes.models import Class
from classes.serializers import ClassSerializers
from subjects.models import Subject
from subjects.serializers import SubjectSerializers
from quizzes.serializers import QuizSerializers
from quizzes.models import Quiz
from rest_framework.reverse import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from django_filters import AllValuesFilter, DateTimeFilter, NumberFilter
from account.permissions import IsInGroup


# Create your views here.
class StudentUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'profile'

class ClassView(generics.RetrieveAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'class'


class QuizListView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'quiz'



class SubjectsListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'subject'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('subjectName','subjectCode','classId',) 

     #you can search using the "search" keyword
    search_fields = ('subjectName','subjectCode','classId',) 

    #you can order using the "ordering" keyword
    ordering_fields = ('subjectName','subjectCode','classId',) 


class AttendanceListView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'attendance'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('userId','remark','classId','attendance', 'date',) 

     #you can search using the "search" keyword
    search_fields =  ('userId','remark','classId','attendance', 'date',)

    #you can order using the "ordering" keyword
    ordering_fields = ('userId','remark','classId','attendance', 'date',)


class ScoreListView(generics.ListAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'marks'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('userId','subjectId','classId') 

     #you can search using the "search" keyword
    search_fields =  ('userId','subjectId','classId')

    #you can order using the "ordering" keyword
    ordering_fields = ('userId','subjectId','classId')


class ScheduleListView(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'schedule'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('date','title','classId') 

     #you can search using the "search" keyword
    search_fields =  ('date','title','classId')

    #you can order using the "ordering" keyword
    ordering_fields = ('date','title','classId')


class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'complaint-detail'


class ComplaintListView(generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'complaint-list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('date','title','classId','userId') 

     #you can search using the "search" keyword
    search_fields =   ('date','title','classId','userId')

    #you can order using the "ordering" keyword
    ordering_fields =  ('date','title','classId','userId')



class HomeworkDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'homework-detail'


class HomeworkListView(generics.ListCreateAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['student']
    name = 'homework-list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('pk','userId','title','submission')

     #you can search using the "search" keyword
    search_fields =   ('pk','userId','title','submission')

    #you can order using the "ordering" keyword
    ordering_fields =  ('pk','userId','title','submission')


class ApiRoot(generics.GenericAPIView):
    name = 'api-root'
    def get(self, request, *args, **kwargs):
        return Response({'complaint-list': reverse(ComplaintListView.name,
            request=request), 'homework-list':reverse(HomeworkListView.name,
                                                      request=request),
                                                      })