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
    path('profile/<int:pk>/', StudentUserView.as_view(), name=StudentUserView.name),
    path('attendance/<int:pk>/', AttendanceListView.as_view(),
           name=AttendanceListView.name),
    path('score/<int:pk>/', ScoreListView.as_view(),
           name=ScoreListView.name),
    path('schedule/<int:pk>/', ScheduleListView.as_view(),
           name=ScheduleListView.name),
    path('complaint-list/<int:pk>/', ComplaintListView.as_view(),
           name=ComplaintListView.name),
    path('complaint-detail/<int:pk>/', ComplaintDetailView.as_view(),
           name=ComplaintDetailView.name),
    path('homework-list/<int:pk>/', HomeworkListView.as_view(),
           name=HomeworkListView.name),
    path('homework-detail/<int:pk>/', HomeworkDetailView.as_view(),
           name=HomeworkDetailView.name),
    path('class/<int:pk>/', ClassView.as_view(),
           name=ClassView.name),
    path('subjects/<int:pk>/', SubjectsListView.as_view(),
           name=SubjectsListView.name),
    path('class-quiz/<int:pk>/', QuizListView.as_view(),
           name=QuizListView.name),
]
