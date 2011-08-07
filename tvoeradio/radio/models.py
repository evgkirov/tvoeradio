# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Station(models.Model):
    type = models.CharField(max_length=30)
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ('type', 'name')

    def __unicode__(self):
        return '%s - %s' % (self.type, self.name)


class RecentStation(models.Model):
    station = models.ForeignKey(Station)
    user = models.ForeignKey(User)
    date_added = models.DateTimeField(auto_now_add=True)


class FavoritedStation(models.Model):
    station = models.ForeignKey(Station)
    user = models.ForeignKey(User)
    date_added = models.DateTimeField(auto_now_add=True)


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
    image = models.ImageField(upload_to='topartists')

    class Meta:
        ordering = ('-popularity',)

    def __unicode__(self):
        return self.name
