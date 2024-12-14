# Generated by Django 5.1.2 on 2024-10-21 02:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_remove_course_name'),
        ('reviews', '0003_tag_coursereview_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('take_again', models.BooleanField(default=False)),
                ('grade', models.CharField(max_length=3)),
                ('textbook_required', models.BooleanField(default=False)),
                ('difficulty_rating', models.IntegerField()),
                ('overall_rating', models.IntegerField()),
                ('professor', models.CharField(max_length=255)),
                ('online_course', models.BooleanField(default=False)),
                ('attendance_mandatory',models.CharField(max_length=20)),
                ('lectures_recorded', models.BooleanField(default=False)),
                ('workload', models.CharField(max_length=20)),
                ('description', models.TextField()),
                ('review_date', models.DateTimeField(auto_now_add=True)),
                ('semester', models.CharField(max_length=20)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='courses.course')),
                ('tags', models.ManyToManyField(blank=True, related_name='reviews', to='reviews.tag')),
            ],
        ),
        migrations.DeleteModel(
            name='CourseReview',
        ),
    ]