# Generated by Django 5.1.2 on 2024-10-13 03:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_remove_course_description_remove_course_instructor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='name',
        ),
    ]