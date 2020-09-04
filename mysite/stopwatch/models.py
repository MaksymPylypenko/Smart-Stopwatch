from django.db import models

# Create your models here.
     
class Record(models.Model):    
    record_date = models.DateField(blank=True)
    start_time = models.TimeField(blank=True)
    end_time = models.TimeField(blank=True)
    description = models.CharField(max_length=200)
    
    def __str__(self):
       return self.description
       
    def duration(self):
       return end_time-start_time