def tvoeradio_version(request):
    import tvoeradio
    return {'tvoeradio_version': tvoeradio.VERSION}
