from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

class AccountManager(BaseUserManager):
     def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404
     def create_user(self, username, email, password=None,**kwargs):
        """Create and return a `User` with an email, phone
        number, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')
        if email is None:
            raise TypeError('Users must have an email.')
        if password is None:
            raise TypeError('User must have an email.')
        user = self.model.objects.create()
        user.username = username
        user.email = email
        user.set_password(password)
        user.firstName = kwargs.get('firstName')
        user.lastName = kwargs.get('lastName')
        user.is_active = kwargs.get('is_active')
        user.is_superuser = kwargs.get('is_superuser')
        user.is_staff = kwargs.get('is_staff')
        user.gender = kwargs.get('gender')
        user.entrance = kwargs.get('entrance')
        user.dob = kwargs.get('dob')
        user.classId = kwargs.get('classId')
        user.childId = kwargs.get('childId')
        user.address = kwargs.get('address')
        user.nationality = kwargs.get('nationality')
        user.state = kwargs.get('state')
        user.zipCode = kwargs.get('zipCode')
        user.telephone = kwargs.get('telephone')
        user.role =  kwargs.get('role')
        user.save(using=self._db)
        return user
     
     def create_superuser(self, username, email, password,**kwargs):
        """Create and return a `User` with superuser (admin)permissions."""
        if username is None:
            raise TypeError('Users must have a username.')
        if password is None:
            raise TypeError('Superusers must have a password.')
        if email is None:
            raise TypeError('Superusers must have an email.')
        user = self.create_user(username, email, password,**kwargs)
        user.save(using=self._db)
        return user
