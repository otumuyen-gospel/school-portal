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
    username = models.CharField(max_length=11, unique=True)
    firstName = models.CharField(max_length=255, blank=False)
    lastName = models.CharField(max_length=255, blank=False)
    is_active = models.BooleanField(default=True)
    '''for administrators only'''
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    '''this fields must be entered or unique'''
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','firstName','lastName','is_staff','is_active',
                       'is_superuser']
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
    ROLE_TEACHER = 'teacher'
    ROLE_ADMIN = 'admin'
    ROLE_PARENT = 'parent'
    ROLE_STUDENT = 'student'
    USERS_ROLES= [
         (ROLE_TEACHER,'teacher'),
         (ROLE_ADMIN,'admin'),
         (ROLE_STUDENT,'student'),
         (ROLE_PARENT,'parent'),
    ]
    role = models.CharField(choices=USERS_ROLES,
                               default=ROLE_STUDENT)
    entrance = models.DateTimeField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    classId = models.ForeignKey(Class, on_delete=models.SET_NULL, blank=True, null=True)
    childId = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=400, blank=True)
    nationality = models.CharField(max_length=70 , blank=True)
    state = models.CharField(max_length=70, blank=True)
    zipCode = models.CharField(max_length=8, blank=True)
    telephone = models.CharField(max_length=11, blank=True)

    objects = AccountManager()
    class Meta:
        ordering = ('firstName','lastName',)
    def __str__(self):
        return f"{self.firstName} {self.lastName}"
    @property
    def name(self):
        return f"{self.firstName} {self.lastName}"
    