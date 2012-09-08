from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from vk_iframe.backends import VkontakteUserBackend
from vk_iframe.models import City, Country


class VkontakteDesktopUserBackend(VkontakteUserBackend):

    def authenticate(self, vk_profile):

        username = str(vk_profile.pop('uid'))
        defaults = {
            'first_name': vk_profile.pop('first_name'),
            'last_name': vk_profile.pop('last_name'),
        }

        user, created = User.objects.get_or_create(username=username, defaults=defaults)
        if created:
            user = self.configure_user(vk_profile, user)
        return user
