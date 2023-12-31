# Generated by Django 1.9.5 on 2016-05-15 15:08
from django.db import migrations


ACCESS_RIGHT_CONV = {"w": "write", "r": "read"}


def modify_access_rights(apps, schema_editor):
    BookAccessRight = apps.get_model("book", "BookAccessRight")
    for access_right in BookAccessRight.objects.all():
        access_right.rights = ACCESS_RIGHT_CONV[access_right.rights]
        access_right.save()


ACCESS_RIGHT_DECONV = {"write": "w", "read": "r"}


def demodify_access_rights(apps, schema_editor):
    BookAccessRight = apps.get_model("book", "BookAccessRight")
    for access_right in BookAccessRight.objects.all():
        access_right.rights = ACCESS_RIGHT_DECONV[access_right.rights]
        access_right.save()


class Migration(migrations.Migration):
    dependencies = [
        ("book", "0003_auto_20160515_1007"),
    ]

    operations = [
        migrations.RunPython(modify_access_rights, demodify_access_rights),
    ]
