from rest_framework import serializers
from .models import User

class UserSerializers(serializers.ModelSerializer):
    pk = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
       # fields = '__all__'
        exclude = ('id','user_permissions','groups','last_login')
        