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
    path('class-list/', ClassList.as_view(), name=ClassList.name),
    path('user-class/<int:id>/', UserClass.as_view(), name=UserClass.name),
    path('create-class/', ClassCreate.as_view(), name=ClassCreate.name),
    path('delete-class/<int:id>/', ClassDelete.as_view(), name=ClassDelete.name),
    path('update-class/<int:id>/', ClassUpdate.as_view(), name=ClassUpdate.name),
]
