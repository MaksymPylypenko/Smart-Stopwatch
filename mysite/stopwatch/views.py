from django.shortcuts import render
from .models import Record

from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    records = Record.objects.filter(user=request.user)    
    context = {'records':records}    
    return render(request, 'stopwatch/index.html', context)
    
def chart(request, id):
    return HttpResponse("Details for record %s" % id)
    
   