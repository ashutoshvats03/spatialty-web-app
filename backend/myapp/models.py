from django.db import models
# from django.contrib.auth.models import User

class User(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    # is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Role(models.Model):
    name=models.CharField(max_length=200,unique=True)
    def __str__(self):
        return self.name


class UserRole(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_roles')
    role=models.ForeignKey(Role,on_delete=models.CASCADE,related_name='role')
    
    class Meta:
        unique_together = ('user', 'role')
    
    def __str__(self):
        return self.user.username + ' - ' + self.role.name
    





# # Create a user
# u = User.objects.create(name="Ashu", email="ashu@example.com")

# # Assign roles
# UserRole.objects.create(user=u, role_name="Admin")
# UserRole.objects.create(user=u, role_name="Editor")

# # Fetch roles
# user_roles = u.roles.all()  # returns queryset of UserRole
# for r in user_roles:
#     print(r.role_name)






# why to use serializer??
# to convert complex data types like querysets and model instances into native Python datatypes that can then be easily rendered into JSON, XML or other content types.
# from rest_framework import serializers

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'name', 'email']

# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .models import User
# from .serializers import UserSerializer

# @api_view(['GET'])
# def get_users(request):
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)  # serialize queryset
#     return Response(serializer.data)  # returns JSON to frontend

# [
#   {"id": 1, "name": "Ashu", "email": "ashu@example.com"},
#   {"id": 2, "name": "John", "email": "john@example.com"}
# ]

