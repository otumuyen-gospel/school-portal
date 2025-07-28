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
* Ensure to have postgresql database installed and have created the necessary database and database user account. Please see [database settings] (/backend/backend/settings.py) in the project settings for more information.
* then run django migrations to create database tables.
```cmd
  python manage.py makemigrations
  python manage.py migrate
```



## FRONTEND