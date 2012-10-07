from django.contrib.auth import BACKEND_SESSION_KEY


class MigrateDjango14(object):

    def process_view(self, request, view_func, view_args, view_kwargs):
        if BACKEND_SESSION_KEY not in request.session or\
           request.session[BACKEND_SESSION_KEY] == 'radio.backends.VkontakteDesktopUserBackend':
            request.session[BACKEND_SESSION_KEY] = 'tvoeradio.radio.backends.VkontakteDesktopUserBackend'
