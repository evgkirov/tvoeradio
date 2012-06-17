# -*- coding: utf-8 -*-


def settings(request):
    from django.conf import settings
    return {'settings': settings}


def user_platform(request):
    platform_ru = u'Виндоус'
    platform = 'Windows'
    u_a = request.META.get('HTTP_USER_AGENT', '')
    if 'Linux' in u_a:
        platform_ru = u'Линукс'
        platform = 'Linux'
    if 'Mac OS X' in u_a:
        platform_ru = u'Мак'
        platform = 'Mac OS X'
    return {'user_platform_ru': platform_ru, 'user_platform': platform}


def version(request):
    from tvoeradio.version import VERSION
    return {'tvoeradio_version': VERSION}
