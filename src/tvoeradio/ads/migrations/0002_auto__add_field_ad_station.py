# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding field 'Ad.station'
        db.add_column('ads_ad', 'station', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['radio.Station'], null=True, blank=True), keep_default=False)


    def backwards(self, orm):
        
        # Deleting field 'Ad.station'
        db.delete_column('ads_ad', 'station_id')


    models = {
        'ads.ad': {
            'Meta': {'ordering': "('id',)", 'object_name': 'Ad'},
            'clicks': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'link': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'}),
            'station': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['radio.Station']", 'null': 'True', 'blank': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {}),
            'views': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'warning': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'weight': ('django.db.models.fields.PositiveIntegerField', [], {'default': '1'})
        },
        'radio.station': {
            'Meta': {'ordering': "('type', 'name')", 'object_name': 'Station'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'db_index': 'True'}),
            'plays_count': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0', 'db_index': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '30', 'db_index': 'True'})
        }
    }

    complete_apps = ['ads']
