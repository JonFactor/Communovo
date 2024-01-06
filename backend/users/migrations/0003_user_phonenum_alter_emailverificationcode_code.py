# Generated by Django 4.2.6 on 2024-01-05 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_emailverificationcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phoneNum',
            field=models.CharField(default='', max_length=50, null=''),
        ),
        migrations.AlterField(
            model_name='emailverificationcode',
            name='code',
            field=models.CharField(max_length=6, unique=True),
        ),
    ]
