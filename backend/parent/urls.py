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
    path('profile/<int:pk>/', ParentUserView.as_view(), name=ParentUserView.name),
    path('childs-attendance/<int:pk>/', ChildAttendanceListView.as_view(),
           name=ChildAttendanceListView.name),
    path('childs-score/<int:pk>/', ChildScoreListView.as_view(),
           name=ChildScoreListView.name),
    path('schedule/<int:pk>/', ScheduleListView.as_view(),
           name=ScheduleListView.name),
    path('complaint-list/', ComplaintListView.as_view(),
           name=ComplaintListView.name),
    path('complaint-detail/<int:pk>/', ComplaintDetailView.as_view(),
           name=ComplaintDetailView.name),
]
