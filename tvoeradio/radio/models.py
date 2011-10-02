# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Station(models.Model):
    type = models.CharField(max_length=30, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    plays_count = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ('type', 'name')

    def __unicode__(self):
        return '%s - %s' % (self.type, self.name)


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
