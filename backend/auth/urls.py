from django.urls import include, path
from rest_framework.routers import SimpleRouter
from  .viewsets.register import SignupViewset
from .viewsets.login import LoginViewSet
from .viewsets.refresh import RefreshViewSet

router = SimpleRouter()
router.register(r'register', SignupViewset, basename='register')
router.register(r'login', LoginViewSet, basename='login')
router.register(r'refresh', RefreshViewSet, basename='refresh')

urlpatterns = [
    *router.urls,
]