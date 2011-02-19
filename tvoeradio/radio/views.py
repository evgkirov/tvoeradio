from annoying.decorators import render_to
from django.conf import settings


@render_to('radio/app.html')
def app(request):
    mode = request.GET.get('mode', 'vk')
    if mode not in ('vk', 'desktop'):
        mode = 'vk'
    return {
        'settings': settings,
        'mode': mode
    }
