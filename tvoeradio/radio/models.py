# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Station(models.Model):
    """
    Абстрактная модель для избранных и недавно прослушанных станций.
    """
    user = models.ForeignKey(User)
    date_added = models.DateTimeField(auto_now_add=True, db_index=True)
    type = models.CharField(max_length=30)
    name = models.CharField(max_length=255)

    class Meta:
        abstract = True
        ordering = ('-date_added',)

    def __unicode__(self):
        return '%s - %s - %s' % (self.user, self.type, self.name)


class RecentStation(Station):
    """
    История прослушанных станций.
    """
    pass


class FavoritedStation(Station):
    """
    Избранная станция.
    """
    pass


class TopTag(models.Model):
    """
    Топ тегов, показываемый в дашборде.
    """
    name = models.CharField(max_length=255, db_index=True)
    popularity = models.IntegerField()

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return self.name


class TopArtist(models.Model):
    """
    Топ исполнителей, показываемый в дашборде.
    """
    name = models.CharField(max_length=255, db_index=True)
    popularity = models.IntegerField(db_index=True)
    image = models.URLField(verify_exists=False)

    class Meta:
        ordering = ('-popularity',)

    def __unicode__(self):
        return self.name
