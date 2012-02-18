from django.conf.urls.defaults import patterns, url


urlpatterns = patterns('ads.views',
    url('^_/get/$', 'get_random'),
    url('^redir/(?P<slug>[-\w]+)/', 'redirect_to_ad'),
)
