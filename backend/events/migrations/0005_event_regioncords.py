# Generated by Django 4.2.6 on 2024-01-07 19:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_user2event_hasbeennotified'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='regionCords',
            field=models.CharField(default='null', max_length=1000),
        ),
    ]