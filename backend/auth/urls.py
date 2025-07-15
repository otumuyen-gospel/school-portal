from django.urls import include, path
from rest_framework.routers import DefaultRouter
from  .viewsets.register import SignupViewset
from .viewsets.login import LoginViewSet
from .viewsets.refresh import RefreshViewSet

router = DefaultRouter()
router.register(r'singup', SignupViewset, 'signup')
router.register(r'login', LoginViewSet, 'login')
router.register(r'refresh', RefreshViewSet, 'refresh')

urlpatterns = [
    path('', include(router.urls)),
]