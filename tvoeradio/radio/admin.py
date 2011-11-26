from django.contrib import admin

from .models import Station, RecentStation, FavoritedStation, TopTag, TopArtist, Ban


def user_id(self, o):
    return u'<a href="../../auth/user/%s/">%s</a>' % (o.user.id, o.user.username)
user_id.allow_tags = True


def user_name(self, o):
    return o.user.get_full_name()


class StationAdmin(admin.ModelAdmin):

    list_display = ('__unicode__', 'plays_count')
    list_filter = ('type',)
    search_fields = ('name',)
    ordering = ('-plays_count',)


class UserStationAdmin(admin.ModelAdmin):

    list_display = ('station', 'user_name', 'user_id', 'date_added')
    list_filter = ('station__type', 'date_added')
    search_fields = ('station__name', 'user__username', 'user__first_name', 'user__last_name')
    raw_id_fields = ('station', 'user')
    user_id = user_id
    user_name = user_name


class TopAdmin(admin.ModelAdmin):

    list_display = ('name', 'popularity')


class BanAdmin(admin.ModelAdmin):

    list_display = ('artist', 'ban_artist', 'title', 'user_name', 'user_id', 'date_added')
    list_display_links = ('artist', 'ban_artist', 'title')
    search_fields = ('artist', 'title', 'user__username', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user',)
    user_id = user_id
    user_name = user_name


admin.site.register(Station, StationAdmin)
admin.site.register(RecentStation, UserStationAdmin)
admin.site.register(FavoritedStation, UserStationAdmin)
admin.site.register(TopTag, TopAdmin)
admin.site.register(TopArtist, TopAdmin)
admin.site.register(Ban, BanAdmin)
