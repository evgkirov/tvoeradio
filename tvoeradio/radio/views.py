from annoying.decorators import render_to, ajax_request
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.utils import simplejson
import urllib, urllib2

from .models import TopTag


@render_to('radio/app.html')
def app(request):

    mode = request.GET.get('mode', 'vk')
    if mode not in ('vk', 'desktop'):
        mode = 'vk'
    top_tags = list(TopTag.objects.all())
    max_popularity = max(top_tags, key=lambda tag:tag.popularity).popularity
    for tag in top_tags:
        tag.size = 120 * tag.popularity / max_popularity + 90

    return {
        'settings': settings,
        'mode': mode,
        'top_tags': top_tags
    }


@login_required
@require_POST
def lastfm_proxy(request):
    req = urllib2.Request(settings.LASTFM_API_URL, request.raw_post_data)
    response = urllib2.urlopen(req)
    return HttpResponse(response.read(), mimetype='application/json; charset=utf-8')
