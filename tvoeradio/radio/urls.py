from django.conf.urls.defaults import *


urlpatterns = patterns('radio.views',
    url('^$', 'app', name='app'),
    url('^login/$', 'login', name='login'),
    url('^login/proceed/$', 'login_proceed', name='login_proceed'),
    url('^_/lastfm_proxy/$', 'lastfm_proxy'),
    url('^_/started/$', 'started'),
    url('^_/favorite/add/$', 'add_favorite'),
    url('^_/favorite/remove/$', 'remove_favorite'),
    url('^_/ban/add/$', 'add_ban'),
)
