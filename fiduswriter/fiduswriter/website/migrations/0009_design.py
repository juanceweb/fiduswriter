# Generated by Django 4.1.2 on 2023-01-29 22:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("sites", "0002_alter_domain_unique"),
        ("website", "0008_alter_editor_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="Design",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "style",
                    models.TextField(
                        default="\n:root {\n    --posts_per_page: 10; /* Number of posts per page on frontpage. Disable for all. */\n}\n",
                        help_text="The CSS style definiton.",
                    ),
                ),
                (
                    "site",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sites.site",
                    ),
                ),
            ],
        ),
    ]
