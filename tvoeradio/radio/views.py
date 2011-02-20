from annoying.decorators import render_to, ajax_request
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.views.decorators.http import require_POST
from django.utils import simplejson

from .forms import RecentStationForm
from .models import RecentStation
from django.views.decorators.csrf import csrf_protect


@render_to('radio/app.html')
def app(request):
    mode = request.GET.get('mode', 'vk')
    if mode not in ('vk', 'desktop'):
        mode = 'vk'
    recent_stations = simplejson.dumps(list(RecentStation.objects.filter(user=request.user).values('type', 'name')))
    print recent_stations
    return {
        'settings': settings,
        'mode': mode,
        'recent_stations': recent_stations
    }


@login_required
@require_POST
@ajax_request
def recent_station_add(request):
    form = RecentStationForm(request.POST)
    if form.is_valid():
        station = form.save(commit=False)
        station.user = request.user
        station.save()
        return {'status':'ok'}
    print form.errors
    raise Http404
