# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Ad'
        db.create_table('ads_ad', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('text', self.gf('django.db.models.fields.TextField')()),
            ('warning', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('link', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50, db_index=True)),
            ('weight', self.gf('django.db.models.fields.PositiveIntegerField')(default=1)),
            ('is_active', self.gf('django.db.models.fields.BooleanField')(default=True, db_index=True)),
            ('views', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('clicks', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
        ))
        db.send_create_signal('ads', ['Ad'])


    def backwards(self, orm):
        
        # Deleting model 'Ad'
        db.delete_table('ads_ad')


    models = {
        'ads.ad': {
            'Meta': {'object_name': 'Ad'},
            'clicks': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True', 'db_index': 'True'}),
            'link': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50', 'db_index': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {}),
            'views': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'warning': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'weight': ('django.db.models.fields.PositiveIntegerField', [], {'default': '1'})
        }
    }

    complete_apps = ['ads']
