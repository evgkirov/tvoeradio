from django.contrib import admin
from django.template.defaultfilters import linebreaksbr

from .models import Ad


class AdAdmin(admin.ModelAdmin):
    list_display = ('image_html', 'text_html', 'link', 'weight', 'is_active', 'views', 'clicks', 'ctr')
    list_display_links = list_display[:2]

    def image_html(self, obj):
        if obj.image:
            return '<img src="%s" />' % obj.image.url
        else:
            return ''
    image_html.allow_tags = True
    image_html.short_description = ''

    def text_html(self, obj):
        return linebreaksbr(obj.text)
    text_html.allow_tags = True
    text_html.short_description = 'Text'

    def ctr(self, obj):
        if not obj.views:
            val = 0
        else:
            val = float(obj.clicks) / float(obj.views)
        return '%.2f%%' % (100 * val)
    ctr.short_description = 'CTR'


admin.site.register(Ad, AdAdmin)
