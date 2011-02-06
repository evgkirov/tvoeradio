from annoying.decorators import render_to
from django.conf import settings


@render_to('radio/app.html')
def app(request):
    return {
        'settings': settings
    }
