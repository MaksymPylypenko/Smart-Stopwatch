from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
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
        r = Record(user=request.user, activity=data['activity'], start=data['start'], duration=data['duration'])
        r.save()
        return JsonResponse({'id':r.id}) 
    return JsonResponse({'id':-1})

@login_required
def delete(request):
    if request.method == 'POST':        
        data = json.loads(request.body)
        pk = data['id']
        records = Record.objects.filter(user=request.user)
        r = records.filter(id=pk)  
        r.delete()       
        return HttpResponse(status=200)
    return HttpResponse(status=404)