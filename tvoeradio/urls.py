from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse

admin.autodiscover()


urlpatterns = patterns('',
    (r'^app/', include('radio.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^markitup/', include('markitup.urls')),
    (r'^robots\.txt$', lambda r: HttpResponse('User-agent: *\nDisallow: /', mimetype='text/plain')),
    (r'^googlea44acf4184a0aff9\.html$', lambda r: HttpResponse('google-site-verification: googlea44acf4184a0aff9.html')),
)


if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
        url(r'^static/raw/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
        }),

   )
