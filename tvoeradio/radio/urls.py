from django.conf.urls.defaults import *


urlpatterns = patterns('radio.views',
    ('^$', 'app'),
    ('^lastfm_proxy/$', 'lastfm_proxy'),
    ('^started/$', 'started'),
    ('^add_favorite/$', 'add_favorite'),
    ('^remove_favorite/$', 'remove_favorite'),
    ('^add_ban/$', 'add_ban'),
)
