from django.http import HttpResponse
from django.template import loader
from .models import Record

def index(request):
    # '-' indicates a descending order
    records = Record.objects.order_by('-record_date')[:5]
    template = loader.get_template('stopwatch/index.html')
    context = {
        'records':records,
    }
    return HttpResponse(template.render(context, request))
    
def chart(request, user_id):
    return HttpResponse("There will be a chart for user %s" % user_id)