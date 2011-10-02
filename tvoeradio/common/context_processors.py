def settings(request):
    from django.conf import settings
    return {'settings': settings}


def version(request):
    from version import VERSION
    return {'tvoeradio_version': VERSION}
