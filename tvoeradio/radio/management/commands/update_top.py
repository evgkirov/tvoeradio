from django.core.files import File
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import transaction
from django.utils import simplejson
import StringIO
import tempfile
import urllib
import urllib2

from tvoeradio.radio.models import TopTag, TopArtist


class Command(BaseCommand):

    def lastfm_request(self, method, **kwargs):
        params = {}
        params['api_key'] = settings.LASTFM_API_KEY
        params['format'] = 'json'
        params['method'] = method
        for (k, v) in kwargs.iteritems():
            params[k] = v
        api_url = settings.LASTFM_API_URL
        fetcher = urllib.urlopen(api_url + '?' + urllib.urlencode(params))
        return simplejson.loads(fetcher.read())

    def handle(self, *args, **options):

        @transaction.commit_on_success
        def update_top_tags(self):
            self.stdout.write('update_top_tags')
            data = self.lastfm_request('chart.getTopTags')
            TopTag.objects.all().delete()
            for tag in data['tags']['tag']:
                TopTag(name=tag['name'], popularity=tag['taggings']).save()

        @transaction.commit_on_success
        def update_top_artists(self):
            self.stdout.write('update_top_artists')
            data = self.lastfm_request('geo.getTopArtists', country='russia')
            TopArtist.objects.all().delete()
            for artist in data['topartists']['artist']:
                obj = TopArtist()
                obj.name = artist['name']
                obj.popularity = artist['listeners']
                obj.image = filter(lambda i: i['size'] == 'medium', artist['image'])[0]['#text'].replace('/64/', '/64s/')
                obj.save()

        update_top_tags(self)
        update_top_artists(self)
