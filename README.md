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



# Backend App

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

### Account API
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |

| GET | /accounts/users-list/ | list all users account; access[admin] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/accounts/users-list/" --header "Authorization: Bearer yourToken"
```

| GET | /accounts/class-users/classId/ | users belonging to a class; access[Admin,Teacher] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/accounts/class-users/50/" --header "Authorization: Bearer yourToken"
```

| GET | /accounts/retrieve-user/userId/ | retrieve user's own account ; access[Any] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/accounts/retrieve-user/158/" --header "Authorization: Bearer yourToken"
```

| POST | /accounts/create-user/ | new user; access[admin] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/accounts/create-user/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```
 - Note this method should not be accessed directly instead use the Auth API

| DELETE | /accounts/remove-user/userId/ | delete user; [access:admin] |
```cmd
  curl --request DELETE --url "http://127.0.0.1:8000/accounts/remove-user/158/" --header "Authorization: Bearer yourToken"
```

| PUT | /accounts/user-update/userId/ | update user own account; [access:Any] |
```cmd
  curl --request PUT --url "http://127.0.0.1:8000/accounts/user-update/158/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```

### Attendance API
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |

| GET | /attendance/attendance-list/ | list all attendance account; access[admin] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/attendance/attendance-list/" --header "Authorization: Bearer yourToken"
```

| GET | /attendance/class-attendance/classId/ | class attendance; access[Admin,Teacher] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/attendance/class-attendance/50/" --header "Authorization: Bearer yourToken"
```

| GET | attendance/user-attendance/userId/ | retrieve user's own attendance ; access[Any] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/attendance/user-attendance/158/" --header "Authorization: Bearer yourToken"
```

| POST | attendance/create-attendance/ | new attendance; access[admin,Teacher] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/attendance/create-attendance/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```

| DELETE | attendance/delete-attendance/userId/ | delete attendance; access[admin,Teacher] |
```cmd
  curl --request DELETE --url "http://127.0.0.1:8000/attendance/delete-attendance/158/" --header "Authorization: Bearer yourToken"
```

| PUT | attendance/update-attendance/userId/ | update user attendance; access[Admin,Teacher] |
```cmd
  curl --request PUT --url "http://127.0.0.1:8000/attendance/update-attendance/158/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```

### Auth API
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |

| POST | auth/register/ | new account; access[admin] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/register/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```
| POST | auth/login/ | new login, new refresh & access token; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/login/"  --data "key1=value1&key2=value2" 
```
| POST | auth/refresh/ | refresh auth access token; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/refresh/"  --data "key1=value1&key2=value2" 
```
| POST | auth/logout/ | invalidate access token; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/logout/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2" 
```
- Note to completely logout stored authenticated user credentials in the frontend must be deleted.

| POST | auth/reset/request/ | request password reset token via email; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/reset/request/"  --data "key1=value1&key2=value2" 
```
| POST | auth/reset/verify/ | verify password reset token; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/reset/request/"  --data "key1=value1&key2=value2" 
```
| POST | auth/reset/password/ | reset password; access[Any] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/auth/reset/password/"  --data "key1=value1&key2=value2" 
```

### Class API
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |

| GET | classes/class-list/ | list all classes; access[admin,Teacher] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/classes/class-list/" --header "Authorization: Bearer yourToken"
```

| GET | classes/user-class/classId/ | users own class; access[student,parent] |
```cmd
  curl --request GET --url "http://127.0.0.1:8000/classes/user-class/50/" --header "Authorization: Bearer yourToken"
```

| POST | classes/create-class/ | new class; access[admin] |
```cmd
  curl --request POST --url "http://127.0.0.1:8000/classes/create-class/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```

| DELETE | classes/delete-class/classId/ | delete attendance; access[admin] |
```cmd
  curl --request DELETE --url "http://127.0.0.1:8000/classes/create-class/158/" --header "Authorization: Bearer yourToken"
```

| PUT | classes/update-class/classId/ | update class; access[Admin] |
```cmd
  curl --request PUT --url "http://127.0.0.1:8000/classes/update-class/158/" --header "Authorization: Bearer yourToken" --data "key1=value1&key2=value2"
```




### Technologies
* Python Django and Django rest framework
* Postgresql database

### Authors
* [otumuyen-gospel](https://github.com/otumuyen-gospel)





# Frontend App