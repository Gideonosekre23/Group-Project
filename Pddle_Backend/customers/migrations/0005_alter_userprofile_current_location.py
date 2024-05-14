# Generated by Django 5.0.6 on 2024-05-11 20:51

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0004_userprofile_current_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='current_location',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326),
        ),
    ]