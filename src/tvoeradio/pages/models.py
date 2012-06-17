from django.db import models
import os.path


class Page(models.Model):
    url = models.CharField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    template_name = models.CharField(max_length=70, blank=True, help_text="Example: 'flatpages/contact_page.html'.If this isn't provided, the system will use 'flatpages/default.html'.")

    class Meta:
        ordering = ('url',)

    def __unicode__(self):
        return u"%s -- %s" % (self.url, self.title)

    def get_absolute_url(self):
        return self.url


class File(models.Model):
    file = models.FileField(upload_to=lambda o, fn: os.path.join(o.directory, fn))
    directory = models.CharField(max_length=250, blank=True)
    title = models.CharField(max_length=250, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-date_added',)

    def __unicode__(self):
        return u'File #%s %s' % (self.id, self.title)
