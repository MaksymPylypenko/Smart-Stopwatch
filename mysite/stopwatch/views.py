from django.shortcuts import render
from django.http import JsonResponse
from .models import Record

from django.contrib.auth.decorators import login_required

@login_required
def index(request):  
    return render(request, 'stopwatch/index.html')
        
@login_required
def records(request):
    records = Record.objects.filter(user=request.user).values()  
    return JsonResponse({'records':list(records)})
