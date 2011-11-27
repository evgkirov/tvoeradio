from django.contrib import admin
from markitup.widgets import AdminMarkItUpWidget

from .models import Page, File


class PageAdmin(admin.ModelAdmin):
    list_display = ('url', 'title')
    search_fields = ('url', 'title', 'content')

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == 'content':
            kwargs['widget'] = AdminMarkItUpWidget()
        return super(PageAdmin, self).formfield_for_dbfield(db_field, **kwargs)


class FileAdmin(admin.ModelAdmin):

    list_display = ('file', 'title', 'date_added', 'copy_link', 'download')

    def copy_link(self, obj):
        return '<input type="text" onclick="this.select()" class="vTextField" '\
               'style="width:97%%" value="%s"  />' % obj.file.url
    copy_link.allow_tags = True

    def download(self, obj):
        return '<a href="%s">link</a>' % obj.file.url
    download.allow_tags = True

admin.site.register(Page, PageAdmin)
admin.site.register(File, FileAdmin)
