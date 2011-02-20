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
