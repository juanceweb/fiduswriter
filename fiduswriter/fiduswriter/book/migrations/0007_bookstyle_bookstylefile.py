# Generated by Django 2.2.4 on 2019-08-31 22:40
import os
import book.models
from django.db import migrations, models
import django.db.models.deletion
from django.core.management import call_command


fixture_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../fixtures")
)
fixture_filename = "initial_book_data.json"


def load_fixture(apps, schema_editor):
    fixture_file = os.path.join(fixture_dir, fixture_filename)
    call_command("loaddata", fixture_file)


def unload_fixture(apps, schema_editor):
    BookStyle = apps.get_model("book", "BookStyle")
    BookStyle.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("book", "0006_auto_20190622_2126"),
    ]

    operations = [
        migrations.CreateModel(
            name="BookStyle",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        default="Default",
                        help_text="The human readable title.",
                        max_length=128,
                    ),
                ),
                (
                    "slug",
                    models.SlugField(
                        default="default",
                        help_text="The base of the filenames the style occupies.",
                        max_length=20,
                        unique=True,
                    ),
                ),
                (
                    "contents",
                    models.TextField(
                        default="", help_text="The CSS style definiton."
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="BookStyleFile",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "file",
                    models.FileField(
                        help_text="A file references in the style. The filename will be replaced with the final url of the file in the style.",
                        upload_to=book.models.bookstylefile_location,
                    ),
                ),
                (
                    "filename",
                    models.CharField(
                        help_text="The original filename.", max_length=255
                    ),
                ),
                (
                    "style",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="book.BookStyle",
                    ),
                ),
            ],
            options={
                "unique_together": {("filename", "style")},
            },
        ),
        migrations.RunPython(load_fixture, reverse_code=unload_fixture),
    ]
