from django.shortcuts import render
from django.http import JsonResponse
from django.http import Http404  
import json

from .models import Record

from django.contrib.auth.decorators import login_required

@login_required
def index(request):  
    return render(request, 'stopwatch/index.html')
        
@login_required
def records(request):
    records = Record.objects.filter(user=request.user).values()  
    return JsonResponse({'records':list(records)})

@login_required
def create(request):
    if request.method == 'POST':        
        data = json.loads(request.body)
        r = Record(activity=data['activity'], start=data['start'], duration=data['duration'])
        # r = Record(activity='test', start_time='02:02:02', duration='P0DT00H00M00S')
        r.save()
        return JsonResponse({'id':r.id}) 
    return JsonResponse({'id':-1})