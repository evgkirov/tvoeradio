# -*- coding: utf-8 -*-
from django.core.files import File
from django.db import models
from django.dispatch import receiver
from random import choice
import urllib
from urlparse import urlparse


class AdManager(models.Manager):

    def active(self):
        return self.filter(is_active=True)

    def get_random(self):
        list_with_weights = []
        for ad in self.active():
            list_with_weights.extend([ad] * ad.weight)
        try:
            return choice(list_with_weights)
        except IndexError:
            return None


class Ad(models.Model):

    image = models.ImageField(help_text=u'Если не указано, будет взята фавиконка.', upload_to='ads', blank=True)
    text = models.TextField(help_text=u'По одному тексту на строку.')
    warning = models.CharField(max_length=255, blank=True)
    link = models.URLField()
    slug = models.SlugField(help_text=u'Должно быть уникальным даже среди удалённых (потому что ' \
                                      u'используется HttpResponsePermanentRedirect)',
                            db_index=True, unique=True)
    weight = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True, db_index=True)
    views = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)

    objects = AdManager()

    class Meta:
        ordering = ('id',)

    def __unicode__(self):
        return self.text[:100]

    def viewed(self):
        self.views += 1
        self.save()

    def clicked(self):
        self.clicks += 1
        self.save()

    def get_random_text(self):
        return choice(self.text.strip().split('\n')).strip()

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


@receiver(models.signals.pre_save, sender=Ad)
def download_favicon(instance, **kwargs):
    if not instance.image:
        domain = urlparse(instance.link).hostname
        result = urllib.urlretrieve('http://favicon.yandex.net/favicon/%s/' % domain)
        instance.image.save(
            instance.slug + '.png',
            File(open(result[0], 'rb'))
        )

