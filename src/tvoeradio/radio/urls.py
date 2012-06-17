from django.conf.urls.defaults import *
from django.contrib.auth.views import logout_then_login


urlpatterns = patterns('tvoeradio.radio.views',
    url('^$', 'app', name='app'),
    url('^vkredir/$', 'redirect_to_vk', name='redirect_to_vk'),
    url('^login/$', 'login', name='login'),
    url('^login/proceed/$', 'login_proceed', name='login_proceed'),
    url('^logout/$', logout_then_login, name='logout'),
    url('^_/lastfm_proxy/$', 'lastfm_proxy'),
    url('^_/started/$', 'started'),
    url('^_/favorite/add/$', 'add_favorite'),
    url('^_/favorite/remove/$', 'remove_favorite'),
    url('^_/favorite/migrate/$', 'migrate_favorites'),
    url('^_/ban/add/$', 'add_ban'),
    url('^_/random_station/$', 'random_station'),
)
