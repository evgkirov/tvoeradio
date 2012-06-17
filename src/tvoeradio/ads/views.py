from annoying.decorators import ajax_request
from django.core.urlresolvers import reverse
from django.http import HttpResponsePermanentRedirect, Http404
from django.shortcuts import get_object_or_404

from .models import Ad


@ajax_request
def get_random(request):
    ad = Ad.objects.get_random()
    if not ad:
        return {}
    ad.viewed()
    response = {
        'text': ad.get_random_text(),
        'warning': ad.warning,
        'image': ad.image.url if ad.image else '',
        'campaign': ad.slug,
        'link': False,
        'station': False,
    }
    if ad.link:
        response['link'] = reverse('ads.views.redirect_to_ad', kwargs={'slug': ad.slug})
    if ad.station:
        response['station'] = {
            'type': ad.station.type,
            'name': ad.station.name,
        }
    return response


def redirect_to_ad(request, slug):
    ad = get_object_or_404(Ad, slug=slug)
    ad.clicked()
    if not ad.link:
        raise Http404('')
    return HttpResponsePermanentRedirect(ad.link)
