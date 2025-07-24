from rest_framework import serializers
from django.contrib.auth.models import User
from myapp.models import Role, UserRole, User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()  # Fetch 'role' using the UserRole model

    def get_role(self, obj):
        user_role = UserRole.objects.filter(user=obj).first()
        return user_role.role.name if user_role else None  # Fetch role name from UserRole

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role')  # 'role' is now correctly mapped


class RegisterSerializer(serializers.ModelSerializer):
    role=serializers.CharField(write_only=True,required=False)
    class Meta:
        model = User
        fields = ( 'username','email', 'password','role')
    
    def create(self, validated_data):
        # user = User.objects.create_user(**validated_data)
        role_name = validated_data.pop('role', None) 
        user = User.objects.create(
            validated_data['username'],
            validated_data['email'], 
            validated_data['password'])
        if role_name: 
            role, created = Role.objects.get_or_create(name=role_name)
            UserRole.objects.create(user=user, role=role)
        return user





class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    