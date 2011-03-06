from django.conf.urls.defaults import *
from django.conf.project_template.urls import urlpatterns


urlpatterns = patterns('radio.views',
    ('^$', 'app'),
    ('^recent_station_add/$', 'recent_station_add'),
    ('^lastfm_proxy/$', 'lastfm_proxy'),

)
