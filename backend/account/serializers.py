from rest_framework import serializers
from .models import User

class UserSerializers(serializers.ModelSerializer):
    id = serializers.UUIDField(source='userId',
                               read_only=True, format='hex')
    class Meta:
        model = User
        fields = '__all__'