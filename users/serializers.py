from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from users.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'is_admin')
        extra_kwargs = {'is_admin': {'default': False}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        if validated_data.get('is_admin'):
            user.is_admin = True
            user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_admin')
        