from django.core.files import File
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import transaction
from django.utils import simplejson
from PIL import Image
import StringIO
import tempfile
import urllib
import urllib2

from tvoeradio.radio.models import TopTag, TopArtist


def _resize_and_crop(image_content):
    image = Image.open(image_content)
    width, height = image.size
    min_size = min(width, height)
    x1 = (width - min_size) / 2
    y1 = 0
    x2 = x1 + min_size
    y2 = y1 + min_size
    image = image.crop((x1, y1, x2, y2))
    image.thumbnail((50, 50), Image.ANTIALIAS)
    thumb_io = StringIO.StringIO()
    image.save(thumb_io, 'PNG')
    thumb_io.seek(0)
    thumb_file = ContentFile(thumb_io.read())
    return thumb_file


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
            data = self.lastfm_request('chart.getTopTags')
            TopTag.objects.all().delete()
            for tag in data['tags']['tag']:
                TopTag(name=tag['name'], popularity=tag['taggings']).save()
                self.stdout.write('Tag "%s"\n' % tag['name'])

        @transaction.commit_on_success
        def update_top_artists(self):
            data = self.lastfm_request('geo.getTopArtists', country='russia')
            TopArtist.objects.all().delete()
            for artist in data['topartists']['artist']:
                obj = TopArtist()
                obj.name = artist['name']
                obj.popularity = artist['listeners']
                image_url = artist['image'][-1]['#text']
                image_name = obj.name + u'.png'
                image_content = ContentFile(urllib2.urlopen(image_url).read())
                image_content = _resize_and_crop(image_content)
                obj.image.save(image_name, image_content, save=False)
                obj.save()
                self.stdout.write('Artist "%s"\n' % obj.name)

        update_top_tags(self)
        update_top_artists(self)
