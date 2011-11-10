from django.conf.urls.defaults import *


urlpatterns = patterns('radio.views',
    ('^$', 'app'),
    ('^_/lastfm_proxy/$', 'lastfm_proxy'),
    ('^_/started/$', 'started'),
    ('^_/favorite/add/$', 'add_favorite'),
    ('^_/favorite/remove/$', 'remove_favorite'),
    ('^_/ban/add/$', 'add_ban'),
)
