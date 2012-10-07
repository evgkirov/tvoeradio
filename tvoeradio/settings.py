# -*- coding: utf-8 -*-
# Django settings for tvoeradio project.

import os
here = lambda * x: os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)

DEBUG = TEMPLATE_DEBUG = MEDIA_DEV_MODE = True

ADMINS = MANAGERS = (
    ('Evgeniy Kirov', 'evg.kirov@gmail.com'),
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': here('..', 'db', 'dev.sqlite'),
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

TIME_ZONE = 'Europe/Moscow'
LANGUAGE_CODE = 'ru'
USE_I18N = True
USE_L10N = True

# загруженные через админку файлы
MEDIA_ROOT = here('media')
MEDIA_URL = '/media/'

# медиагенератор
GLOBAL_MEDIA_DIRS = (here('static'),)
DEV_MEDIA_URL = '/static/gen/'

# остальная статика (админка и маркитап)
STATIC_ROOT = here('static_raw')
STATIC_URL = '/static/raw/'
ADMIN_MEDIA_PREFIX = '/static/raw/admin/'

MEDIA_BUNDLES = (
    ('website.css',
        'css/main.css',
    ),
    ('radio.css',
        'radio/css/main.css',
        'radio/css/skin.css',
    ),
    ('radio.js',
        'js/3rdparty/lscache.js',
        'js/3rdparty/ICanHaz.js',
        'js/3rdparty/jquery.jsonp.js',
        'js/3rdparty/jplayer/jquery.jplayer.js',
        'js/3rdparty/cusel.js',
        'radio/js/browsers.js',
        'radio/js/util.namespace.js',
        'radio/js/util.cachedselectors.js',
        'radio/js/util.random.js',
        'radio/js/util.cookie.js',
        'radio/js/util.string.js',
        'radio/js/util.array.js',
        'radio/js/network.vkontakte.js',
        'radio/js/network.lastfm.js',
        'radio/js/userdata.audio.js',
        'radio/js/userdata.bans.js',
        'radio/js/userdata.favorited_stations.js',
        'radio/js/userdata.recent_stations.js',
        'radio/js/ui.menu.js',
        'radio/js/ui.js',
        'radio/js/ui.popup.js',
        'radio/js/ui.notification.js',
        'radio/js/ui.infoblock.js',
        'radio/js/ui.search.js',
        'radio/js/player.audio.js',
        'radio/js/player.playlist.js',
        'radio/js/player.station.js',
        'radio/js/player.station.common.js',
        'radio/js/player.station.artist.js',
        'radio/js/player.station.album.js',
        'radio/js/player.station.library.js',
        'radio/js/player.station.loved.js',
        'radio/js/player.station.recommendations.js',
        'radio/js/player.station.similar.js',
        'radio/js/player.station.tag.js',
        'radio/js/player.station.insanity.js',
        'radio/js/player.control.js',
        'radio/js/desktop.js',
        'radio/js/migrate.js',
        'radio/js/events.js',
        'radio/js/events.player.js',
    ),
)

SECRET_KEY = 'gmz7f8)&q848*^k+d_j*&3(77@7fe=3vgalst4(b-xl*^0@d+3'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'tvoeradio.common.middleware.MigrateDjango14',
    'mediagenerator.middleware.MediaMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'vk_iframe.middleware.AuthenticationMiddleware',
    'vk_iframe.middleware.IFrameFixMiddleware',
    'tvoeradio.pages.middleware.PageMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
    "tvoeradio.common.context_processors.settings",
    "tvoeradio.common.context_processors.user_platform",
    "tvoeradio.common.context_processors.version",
)

AUTHENTICATION_BACKENDS = (
    'vk_iframe.backends.VkontakteUserBackend',
    'tvoeradio.radio.backends.VkontakteDesktopUserBackend',
)

ROOT_URLCONF = 'tvoeradio.urls'
LOGIN_URL = '/app/login/'

TEMPLATE_DIRS = (
    here('templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.admin',

    'dbbackup',
    'markitup',
    'mediagenerator',
    'vk_iframe',

    'tvoeradio.monkeypatches',
    'tvoeradio.common',
    'tvoeradio.pages',
    'tvoeradio.radio',
    'tvoeradio.ads',

    'south',
)

MARKITUP_FILTER = ('django.contrib.markup.templatetags.markup.textile', {})
MARKITUP_SET = 'markitup/sets/textile'

LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/'
LASTFM_API_KEY = '5f170ff5352903d39512d907566283fc'
LASTFM_API_SECRET = '212627ff4f288e140a8b3734a40d2be2'
VK_APP_ID = '1840144'
VK_APP_KEY = 'rlh7nKUmRE'
VK_APP_SECRET = '30mfDL0PaxY5b3VQGA2T'
VK_APP_URL = 'http://vk.com/app1840144'
VK_APP_SETTINGS = 2 + 8 # friends + audio


# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}



try:
    from settings_local import *
except:
    pass
