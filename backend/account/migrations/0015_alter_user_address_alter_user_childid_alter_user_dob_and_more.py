# Generated by Django 4.2.22 on 2025-07-29 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0014_user_otp_user_otp_exp_user_otp_verified'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='address',
            field=models.CharField(blank=True, default=None, max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='childId',
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='dob',
            field=models.DateField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='entrance',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='nationality',
            field=models.CharField(blank=True, default=None, max_length=70, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='state',
            field=models.CharField(blank=True, default=None, max_length=70, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='telephone',
            field=models.CharField(blank=True, default=None, max_length=11, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='zipCode',
            field=models.CharField(blank=True, default=None, max_length=8, null=True),
        ),
    ]
