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
class TeacherUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'profile'

class ClassView(generics.RetrieveAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'class'


class QuizListView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'quiz-list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('question','option1','option2','option3',
                     'answer',) 

     #you can search using the "search" keyword
    search_fields = ('question','option1','option2','option3',
                     'answer',) 

    #you can order using the "ordering" keyword
    ordering_fields = ('question','option1','option2','option3',
                     'answer',) 

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'quiz-detail'


class SubjectsListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'subject'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('subjectName','subjectCode','classId',) 

     #you can search using the "search" keyword
    search_fields = ('subjectName','subjectCode','classId',) 

    #you can order using the "ordering" keyword
    ordering_fields = ('subjectName','subjectCode','classId',) 


class ComplaintListView(generics.ListAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'complaint'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('date','title','classId','userId') 

     #you can search using the "search" keyword
    search_fields =   ('date','title','classId','userId')

    #you can order using the "ordering" keyword
    ordering_fields =  ('date','title','classId','userId')
    


class ScoreListView(generics.ListCreateAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'score-list'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('userId','subjectId','classId') 

     #you can search using the "search" keyword
    search_fields =  ('userId','subjectId','classId')

    #you can order using the "ordering" keyword
    ordering_fields = ('userId','subjectId','classId')

class ScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'score-detail'


class HomeworkListView(generics.ListAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'homework'

    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('pk','userId','title','submission')

     #you can search using the "search" keyword
    search_fields =   ('pk','userId','title','submission')

    #you can order using the "ordering" keyword
    ordering_fields =  ('pk','userId','title','submission')


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'attendance-detail'


class AttendanceListView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'attendance-list'

    
    #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('userId','remark','classId','attendance', 'date',) 

     #you can search using the "search" keyword
    search_fields =  ('userId','remark','classId','attendance', 'date',)

    #you can order using the "ordering" keyword
    ordering_fields = ('userId','remark','classId','attendance', 'date',)



class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'schedule-detail'


class ScheduleListView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializers
    permission_classes = [IsAuthenticated, IsInGroup,]
    required_groups = ['teacher']
    name = 'schedule-list'

   #you can filter by field names specified here keyword e.g url?className='primary one'
    filter_fields = ('date','title','classId') 

     #you can search using the "search" keyword
    search_fields =  ('date','title','classId')

    #you can order using the "ordering" keyword
    ordering_fields = ('date','title','classId')


class ApiRoot(generics.GenericAPIView):
    name = 'api-root'
    def get(self, request, *args, **kwargs):
        return Response({'attendance-list': reverse(AttendanceListView.name,
            request=request), 'schedule-list':reverse(ScheduleListView.name,
            request=request),'score-list':reverse(ScoreListView.name, 
            request=request),'quiz-list':reverse(QuizListView.name, 
            request=request),})