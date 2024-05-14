# Generated by Django 5.0.6 on 2024-05-11 18:50

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Driver', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brand', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=50)),
                ('size', models.CharField(max_length=20)),
                ('year', models.PositiveIntegerField()),
                ('description', models.TextField(blank=True)),
                ('is_available', models.BooleanField(default=True)),
                ('current_location', django.contrib.gis.db.models.fields.PointField(blank=True, geography=True, null=True, srid=4326)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bikes_owned', to='Driver.driverprofile')),
            ],
        ),
    ]
