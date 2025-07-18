# Generated by Django 4.2.22 on 2025-07-14 10:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('subjects', '0001_initial'),
        ('classes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField(max_length=1000, unique=True)),
                ('option1', models.CharField()),
                ('option2', models.CharField()),
                ('option3', models.CharField()),
                ('answer', models.CharField()),
                ('setAsQuiz', models.BooleanField(default=False)),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('classId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.class')),
                ('subjectId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subjects.subject')),
            ],
            options={
                'ordering': ('question',),
            },
        ),
    ]
