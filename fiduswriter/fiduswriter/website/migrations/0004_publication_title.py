# Generated by Django 3.2.13 on 2022-07-11 12:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("website", "0003_auto_20220707_1955"),
    ]

    operations = [
        migrations.AddField(
            model_name="publication",
            name="title",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
    ]
