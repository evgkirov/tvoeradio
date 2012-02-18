from annoying.decorators import ajax_request
from django.core.urlresolvers import reverse
from django.http import HttpResponsePermanentRedirect
from django.shortcuts import get_object_or_404

from .models import Ad


@ajax_request
def get_random(request):
    ad = Ad.objects.get_random()
    if not ad:
        return {}
    ad.viewed()
    return {
        'text': ad.get_random_text(),
        'warning': ad.warning,
        'link': reverse('ads.views.redirect_to_ad', kwargs={'slug': ad.slug}),
        'image': ad.image.url if ad.image else '',
    }


def redirect_to_ad(request, slug):
    ad = get_object_or_404(Ad, slug=slug)
    ad.clicked()
    return HttpResponsePermanentRedirect(ad.link)
