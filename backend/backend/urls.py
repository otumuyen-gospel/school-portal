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
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('classes/', include('classes.urls'), name='classes'),
    path('subjects/', include('subjects.urls'), name='subjects'),
    path('quizzes/', include('quizzes.urls'), name='quizzes'),
    path('accounts/', include('account.urls'), name='accounts'),
    path('marks/', include('marks.urls'), name='marks'),
    path('complaints/', include('complaint.urls'), name='complaints'),
    path('attendance/', include('attendance.urls'), name='attendance'),
    path('schedule/', include('schedule.urls'), name='schedule'),
    path('homework/', include('homework.urls'), name='homework'),
    path('auth/', include('auth.urls'), name='auth'),
    path('parent/', include('parent.urls'), name='parent'),
    path('student/', include('student.urls'), name='student'),
    path('teacher/', include('teacher.urls'), name='teacher'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
