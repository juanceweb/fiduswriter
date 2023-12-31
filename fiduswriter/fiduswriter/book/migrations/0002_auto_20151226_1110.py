# Generated by Django 1.9 on 2015-12-26 17:10
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("book", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="book",
            name="chapters",
            field=models.ManyToManyField(
                blank=True,
                default=None,
                through="book.Chapter",
                to="document.Document",
            ),
        ),
    ]
