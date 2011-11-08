# -*- coding: utf-8 -*-
from annoying.decorators import render_to, ajax_request
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.views.decorators.http import require_POST
import urllib2

from .models import TopTag, RecentStation, FavoritedStation, TopArtist, Ban
from .utils import get_user_stations_list


@login_required
@render_to('radio/app.html')
def app(request):

    user = request.user

    mode = request.GET.get('mode', 'vk')
    if mode not in ('vk', 'desktop'):
        mode = 'vk'

    top_tags = list(TopTag.objects.all())
    max_popularity = max(top_tags, key=lambda tag: tag.popularity).popularity
    for tag in top_tags:
        tag.size = 120 * tag.popularity / max_popularity + 90

    top_artists = TopArtist.objects.all()

    bans = list(Ban.objects.filter(user=request.user).values('artist', 'title', 'ban_artist'))

    return {
        'mode': mode,
        'top_tags': top_tags,
        'top_artists': top_artists,
        'recent_stations': get_user_stations_list(RecentStation, user, 20),
        'favorited_stations': get_user_stations_list(FavoritedStation, user),
        'bans': bans,
    }


@login_required
@require_POST
def lastfm_proxy(request):

    req = urllib2.Request(settings.LASTFM_API_URL, request.raw_post_data)
    response = urllib2.urlopen(req)
    return HttpResponse(response.read(), mimetype='application/json; charset=utf-8')


@login_required
@require_POST
@ajax_request
def started(request):
    """
    Регистрация начала воспроизведения станции.
    """

    try:
        type = request.POST['type']
        name = request.POST['name']
    except IndexError:
        raise Http404()

    rs = RecentStation.objects.create_user_station(request.user, type, name)
    rs.station.plays_count += 1
    rs.station.save()

    return {
        'recent_stations': get_user_stations_list(RecentStation, request.user, 20),
    }


@login_required
@require_POST
@ajax_request
def add_favorite(request):

    try:
        type = request.POST['type']
        name = request.POST['name']
    except IndexError:
        raise Http404()

    FavoritedStation.objects.create_user_station(request.user, type, name)

    return {
        'favorited_stations': get_user_stations_list(FavoritedStation, request.user),
    }


@login_required
@require_POST
@ajax_request
def remove_favorite(request):

    try:
        type = request.POST['type']
        name = request.POST['name']
    except IndexError:
        raise Http404()

    FavoritedStation.objects.delete_user_station(request.user, type, name)

    return {
        'favorited_stations': get_user_stations_list(FavoritedStation, request.user),
    }


@login_required
@require_POST
@ajax_request
def add_ban(request):

    try:
        artist = request.POST['artist']
        title = request.POST['title']
        ban_artist = bool(request.POST.get('ban_artist'))
    except IndexError:
        raise Http404()

    Ban.objects.create(user=request.user, artist=artist, title=title, ban_artist=ban_artist)

    return {
        'bans': list(Ban.objects.filter(user=request.user).values('artist', 'title', 'ban_artist'))
    }
