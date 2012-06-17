from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from vk_iframe.models import Profile


class UserProfileInline(admin.StackedInline):
    model = Profile


class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'last_login', 'date_joined',
                    'is_staff', 'is_superuser')
    ordering = ('-date_joined',)
    fieldsets = (
        (
            None,
            {'fields': ('username', 'first_name', 'last_name')}
        ),
        (
            'Shit',
            {'fields': ('password', 'is_active', 'is_staff', 'is_superuser', 'user_permissions', 'groups'),
             'classes': ('collapse',)}),
        ('Dates', {'fields': ('last_login', 'date_joined')}),
    )
    inlines = (UserProfileInline,)

admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, UserAdmin)
