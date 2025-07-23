"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from .views import *
urlpatterns = [
    path('profile/<int:pk>/', TeacherUserView.as_view(), name=TeacherUserView.name),
    path('complaint/<int:pk>/', ComplaintListView.as_view(),
           name=ComplaintListView.name),
    path('score-list/<int:pk>/', ScoreListView.as_view(),
           name=ScoreListView.name),
    path('score-detail/<int:pk>/', ScoreDetailView.as_view(),
           name=ScoreDetailView.name),
    path('homework/<int:pk>/', HomeworkListView.as_view(),
           name=HomeworkListView.name),
    path('attendance-list/<int:pk>/', AttendanceListView.as_view(),
           name=AttendanceListView.name),
    path('attendance-detail/<int:pk>/', AttendanceDetailView.as_view(),
           name=AttendanceDetailView.name),
    path('schedule-list/<int:pk>/', ScheduleListView.as_view(),
           name=ScheduleListView.name),
    path('schedule-detail/<int:pk>/', ScheduleDetailView.as_view(),
           name=ScheduleDetailView.name),
    path('class/<int:pk>/', ClassView.as_view(),
           name=ClassView.name),
    path('subjects/<int:pk>/', SubjectsListView.as_view(),
           name=SubjectsListView.name),
    path('quiz-list/<int:pk>/', QuizListView.as_view(),
           name=QuizListView.name),
    path('quiz-detail/<int:pk>/', QuizDetailView.as_view(),
           name=QuizDetailView.name),
]
