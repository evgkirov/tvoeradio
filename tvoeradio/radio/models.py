# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Station(models.Model):
    type = models.CharField(max_length=30, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    plays_count = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ('type', 'name')
        unique_together = ('type', 'name')

    def __unicode__(self):
        return '%s: %s' % (self.type, self.name)


class UserStationManager(models.Manager):

    def get_query_set(self):
        qs = super(UserStationManager, self).get_query_set()
        return qs.select_related('station')

    def get_for_user(self, user):
        return self.filter(user=user)

    def create_user_station(self, user, type, name):
        station, created = Station.objects.get_or_create(type=type, name=name)
        kwargs = {'station': station, 'user': user}
        self.filter(**kwargs).delete()
        return self.create(**kwargs)

    def delete_user_station(self, user, type, name):
        self.filter(user=user, station__type=type, station__name=name).delete()


class UserStation(models.Model):

    station = models.ForeignKey(Station)
    user = models.ForeignKey(User)
    date_added = models.DateTimeField(auto_now_add=True, db_index=True)

    objects = UserStationManager()

    class Meta:
        abstract = True


class RecentStation(UserStation):

    class Meta:
        ordering = ('-date_added',)


class FavoritedStation(UserStation):

    class Meta:
        ordering = ('-date_added',)


class TopBase(models.Model):

    name = models.CharField(max_length=255, db_index=True)
    popularity = models.IntegerField(db_index=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __unicode__(self):
        return self.name


class TopTag(TopBase):

    class Meta:
        ordering = ('name',)


class TopArtist(TopBase):

    image = models.URLField()

    class Meta:
        ordering = ('-popularity',)


class Ban(models.Model):

    user = models.ForeignKey(User)
    date_added = models.DateTimeField(auto_now_add=True)
    artist = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True)
    ban_artist = models.BooleanField()

    class Meta:
        ordering = ('-date_added',)

    def __unicode__(self):
        return u'%s - %s - %s - %s' % (self.user, self.artist, self.title, self.ban_artist)
