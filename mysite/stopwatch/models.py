from django.db import models

# Create your models here.

from django.conf import settings   
User = settings.AUTH_USER_MODEL 
     
class Record(models.Model):     
    user = models.ForeignKey(User, default = 1, null = True, on_delete = models.SET_NULL) 
    start = models.TimeField()
    duration = models.BigIntegerField()
    activity = models.CharField(max_length=200)
    
    def __str__(self):
       return self.activity
      