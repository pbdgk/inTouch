# Generated by Django 2.0.5 on 2018-06-07 15:14

import base.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_auto_20180605_1433'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='static/frontend/img/octobiwan.jpg', upload_to=base.models.user_directory_path),
        ),
    ]
