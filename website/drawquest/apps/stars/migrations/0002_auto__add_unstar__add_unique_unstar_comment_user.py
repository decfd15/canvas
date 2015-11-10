# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Unstar'
        db.create_table('stars_unstar', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('comment', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['canvas.Comment'], unique=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
        ))
        db.send_create_signal('stars', ['Unstar'])

        # Adding unique constraint on 'Unstar', fields ['comment', 'user']
        db.create_unique('stars_unstar', ['comment_id', 'user_id'])


    def backwards(self, orm):
        
        # Removing unique constraint on 'Unstar', fields ['comment', 'user']
        db.delete_unique('stars_unstar', ['comment_id', 'user_id'])

        # Deleting model 'Unstar'
        db.delete_table('stars_unstar')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '254', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'canvas.category': {
            'Meta': {'object_name': 'Category'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '140'}),
            'founded': ('django.db.models.fields.FloatField', [], {'default': '1298956320'}),
            'founder': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'founded_groups'", 'null': 'True', 'blank': 'True', 'to': "orm['auth.User']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'moderators': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'moderated_categories'", 'symmetrical': 'False', 'to': "orm['auth.User']"}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20'}),
            'visibility': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'canvas.comment': {
            'Meta': {'object_name': 'Comment'},
            'anonymous': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'author': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'comments'", 'null': 'True', 'blank': 'True', 'to': "orm['auth.User']"}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'comments'", 'null': 'True', 'blank': 'True', 'to': "orm['canvas.Category']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ip': ('django.db.models.fields.IPAddressField', [], {'default': "'0.0.0.0'", 'max_length': '15'}),
            'judged': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'ot_hidden': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'parent_comment': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'replies'", 'null': 'True', 'blank': 'True', 'to': "orm['canvas.Comment']"}),
            'parent_content': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'comments'", 'null': 'True', 'to': "orm['canvas.Content']"}),
            'replied_comment': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': "orm['canvas.Comment']", 'null': 'True', 'blank': 'True'}),
            'reply_content': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'used_in_comments'", 'null': 'True', 'to': "orm['canvas.Content']"}),
            'reply_text': ('django.db.models.fields.CharField', [], {'max_length': '2000', 'blank': 'True'}),
            'score': ('django.db.models.fields.FloatField', [], {'default': '0', 'db_index': 'True'}),
            'timestamp': ('canvas.util.UnixTimestampField', [], {'default': '0'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '140', 'blank': 'True'}),
            'visibility': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'canvas.content': {
            'Meta': {'object_name': 'Content'},
            'alpha': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'animated': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.CharField', [], {'max_length': '40', 'primary_key': 'True'}),
            'ip': ('django.db.models.fields.IPAddressField', [], {'default': "'0.0.0.0'", 'max_length': '15'}),
            'remix_of': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'remixes'", 'null': 'True', 'to': "orm['canvas.Content']"}),
            'remix_text': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '1000', 'blank': 'True'}),
            'source_url': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '4000', 'blank': 'True'}),
            'stamps_used': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'used_as_stamp'", 'blank': 'True', 'to': "orm['canvas.Content']"}),
            'timestamp': ('canvas.util.UnixTimestampField', [], {}),
            'url_mapping': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['canvas.ContentUrlMapping']", 'null': 'True', 'blank': 'True'}),
            'visibility': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        'canvas.contenturlmapping': {
            'Meta': {'object_name': 'ContentUrlMapping'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        'canvas_auth.user': {
            'Meta': {'object_name': 'User', 'db_table': "'auth_user'", '_ormbases': ['auth.User'], 'proxy': 'True'}
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'drawquest_auth.user': {
            'Meta': {'object_name': 'User', 'db_table': "'auth_user'", '_ormbases': ['canvas_auth.User'], 'proxy': 'True'}
        },
        'stars.unstar': {
            'Meta': {'unique_together': "(('comment', 'user'),)", 'object_name': 'Unstar'},
            'comment': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['canvas.Comment']", 'unique': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        }
    }

    complete_apps = ['stars']