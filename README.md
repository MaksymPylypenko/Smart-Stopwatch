# Smart Stopwatch
Track how much time you spent on different activities

## Running
1. Make sure you have [Django](https://www.djangoproject.com/download/) installed
2. Go to **"Smart-Stopwatch\mysite"**
3. Run the following command to start the server `python manage.py runserver`
4. Open a web-browser and go to http://127.0.0.1:8000/stopwatch/
5. You will be redirected to a login page, then enter a username **user** and a password **test1test**.
  
## Technologies used:
* Server: Python3 (Django)
* Client: Html, Css, Javascript (vanilla)

### Completed features:
* [x] A working timer (actions: stop/reset)
* [x] Dynamic table of records (actions: add/remove)
* [x] A bar chart embeded in the table (reacts to changes in the table)

### Todo next
* [ ] React to user's input in the table (e.g. change existing rows)
* [ ] Group multiple activites.