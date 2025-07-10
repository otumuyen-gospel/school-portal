import uuid
from django.contrib.auth.models import (AbstractBaseUser, 
BaseUserManager, PermissionsMixin)
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.http import Http404
from .usermanager import AccountManager
from classes.models import Class

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(db_index=True, unique=True)
    last_login = models.DateTimeField(auto_now_add=True, editable=True)
    entrance = models.DateTimeField(auto_now_add=True, editable=True)
    dob = models.DateTimeField(blank=False)
    firstName = models.CharField(max_length=255, blank=False)
    lastName = models.CharField(max_length=255, blank=False)
    ROLE_TEACHER = 'T'
    ROLE_PARENT = 'P'
    ROLE_ADMIN = 'A'
    ROLE_STUDENT = 'S'
    USERS_ROLES = [
        (ROLE_ADMIN,'admin'),
        (ROLE_PARENT, 'parent'),
        (ROLE_STUDENT, 'student'),
        (ROLE_TEACHER, 'teacher')
    ]
    role = models.CharField(choices=USERS_ROLES, 
                            default=ROLE_STUDENT)
    GENDER_MALE = 'M'
    GENDER_FEMALE = 'F'
    GENDER_OTHERS = 'O'
    USERS_GENDER = [
        (GENDER_MALE,'male'),
        (GENDER_FEMALE, 'female'),
        (GENDER_OTHERS, 'others'),
    ]
    gender = models.CharField(choices=USERS_GENDER,
                               default=GENDER_MALE)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    classId = models.CharField(blank=True)
    childId = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=400, blank=True)
    nationality = models.CharField(max_length=70 , blank=True)
    state = models.CharField(max_length=70, blank=True)
    zipCode = models.CharField(max_length=8, blank=True)
    telephone = models.CharField(max_length=11, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AccountManager()
    class Meta:
        ordering = ('firstName','lastName',)
    def __str__(self):
        return f"{self.email}"
    @property
    def name(self):
        return f"{self.firstName} {self.lastName}"
    