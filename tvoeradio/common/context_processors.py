def settings(request):
    from django.conf import settings
    return {'settings': settings}


def user_platform(request):
    platform = 'Windows'
    u_a = request.META.get('HTTP_USER_AGENT', '')
    if 'Linux' in u_a:
        platform = 'Linux'
    if 'Mac OS X' in u_a:
        platform = 'Mac OS X'
    return {'user_platform': platform}


def version(request):
    from version import VERSION
    return {'tvoeradio_version': VERSION}
