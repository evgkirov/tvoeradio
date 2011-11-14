from django.conf.urls.defaults import *
from django.views.generic import TemplateView


urlpatterns = patterns('',
    (r'^$', TemplateView.as_view(template_name='index.html')),
)
