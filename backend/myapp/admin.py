from django.contrib import admin
from myapp.models import Role, UserRole,User

class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
# Register your custom models

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'created_at', 'modified_at')
    search_fields = ('username', 'email')


admin.site.register(Role, RoleAdmin)
admin.site.register(UserRole)
admin.site.register(User, UserAdmin)
