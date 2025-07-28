# school-portal

### Introduction
this project is the design and implementation of a school web portal using python and javascript. Frameworks used include react and django. This appication helps to manage basic information of users in any primary or secondary school system.

### Project Features
* Users can signup and login to their account to access features that are specific to them.
* Only authenticated users can access features of the application.
* user Account includes: 
 -  Administrators Account
 -  Teachers Account
 -  Student Account
 -  Parent Account
* Only the admin can create a new user account while all others can signup to access their user-specific features.
* Non-authenticated users are not authorize or granted access to any application-features.
* The app is made of a django rest Api for the backend and react app for the frontend.

## BACKEND APP

### Installation Guide
* Clone this repository (school-portal) [https://github.com/otumuyen-gospel/school-portal.git]
* for the backend install and configure Python, django and  your python virtual environment.
* Install dependencies for the project using as stated below.
```cmd
  pip install -r requirements.txt
```
* Ensure to have postgresql database installed and have created the necessary database and database user account. Please see [database settings](backend/backend/settings.py) in the project settings for more information.
* then run django migrations to create database tables.
```cmd
  python manage.py makemigrations
  python manage.py migrate
```

### App usage
* navigate to the backend app root folder then run the code below to start django server.
```cmd
  python manage.py runserver
```
* You can access the API endpoints using postman or Curl or any other Rest client of own choosen on port 8000.

## API Endpoints

### Users Account Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |

| GET | /accounts/users-list/ | list all users account; accessible by admin only |

| GET | /accounts/class-users/classId/ | users belonging to a class; accessible by admin & teacher only;remember to use a valid class id |

| GET | /accounts/retrieve-user/userId/ | retrieve user's own account ; accessible by all authenticated user;remember to use a valid user id |

| POST | /accounts/create-user/ | new user; accessible by admin only; this should not be accessed directly instead create a new user account through the Auth API |

| DELETE | /accounts/remove-user/userId/ | delete user; accessible by admin only;remember to use a valid user id |

| PUT | /accounts/user-update/userId/ | update user own account; [access:Any] |
Example request from Curl Client- specify your Bearer token
```cmd
  curl --request PUT --url "http://127.0.0.1:8000/accounts/user-update/158/" --header "Authorization: Bearer yourToken"
```



### Technologies
* Python Django and Django rest framework
* Postgresql database

### Authors
* [otumuyen-gospel](https://github.com/otumuyen-gospel)





## FRONTEND