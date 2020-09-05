from django.http import HttpResponse
from django.template import loader
from .models import Record

from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    # '-' indicates a descending order
    #records = Record.objects.order_by('-start_time')[:5]
    records = Record.objects.filter(user=request.user)
    template = loader.get_template('stopwatch/index.html')
    context = {
        'records':records,
    }
    return HttpResponse(template.render(context, request))
    
def chart(request, id):
    return HttpResponse("Details for record %s" % id)
    
   