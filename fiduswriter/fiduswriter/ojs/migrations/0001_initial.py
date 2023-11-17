# Generated by Django 1.11 on 2017-05-03 09:06
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def submission_filename(instance, filename):
    return "/".join(
        [
            "submission",
            str(instance.journal.id),
            str(instance.submitter.id),
            filename,
        ]
    )


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("document", "0001_squashed_20200219"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Author",
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
                ("ojs_jid", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Journal",
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
                ("ojs_url", models.CharField(max_length=512)),
                ("ojs_key", models.CharField(max_length=512)),
                ("ojs_jid", models.PositiveIntegerField()),
                ("name", models.CharField(max_length=512)),
                (
                    "editor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Reviewer",
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
                ("ojs_jid", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Submission",
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
                ("ojs_jid", models.PositiveIntegerField(default=0)),
                (
                    "file_object",
                    models.FileField(upload_to=submission_filename),
                ),
                (
                    "journal",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="ojs.Journal",
                    ),
                ),
                (
                    "submitter",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SubmissionRevision",
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
                ("version", models.CharField(default="1.0.0", max_length=8)),
                (
                    "document",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="document.Document",
                    ),
                ),
                (
                    "submission",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="ojs.Submission",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="reviewer",
            name="revision",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="ojs.SubmissionRevision",
            ),
        ),
        migrations.AddField(
            model_name="reviewer",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="author",
            name="submission",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="ojs.Submission",
            ),
        ),
        migrations.AddField(
            model_name="author",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterUniqueTogether(
            name="reviewer",
            unique_together=set([("revision", "ojs_jid")]),
        ),
        migrations.AlterUniqueTogether(
            name="journal",
            unique_together=set([("ojs_url", "ojs_jid")]),
        ),
        migrations.AlterUniqueTogether(
            name="author",
            unique_together=set([("submission", "ojs_jid")]),
        ),
    ]
