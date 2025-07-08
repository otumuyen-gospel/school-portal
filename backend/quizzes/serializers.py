from rest_framework import serializers
from .models import Quiz

class QuizSerializers(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'