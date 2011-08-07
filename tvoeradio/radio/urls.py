from django.conf.urls.defaults import *
from django.conf.project_template.urls import urlpatterns


urlpatterns = patterns('radio.views',
    ('^$', 'app'),
    ('^lastfm_proxy/$', 'lastfm_proxy'),
)
