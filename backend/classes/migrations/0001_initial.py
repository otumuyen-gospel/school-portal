# Generated by Django 4.2.22 on 2025-07-14 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('className', models.CharField(max_length=50, unique=True)),
                ('classCode', models.CharField(max_length=7, unique=True)),
            ],
            options={
                'ordering': ('className',),
            },
        ),
    ]
