# Django settings for tvoeradio project.

import os
here = lambda * x: os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)


DEBUG = TEMPLATE_DEBUG = MEDIA_DEV_MODE = True

ADMINS = MANAGERS = (
    ('Evgeniy Kirov', 'evg.kirov@gmail.com'),
)


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': here('..', 'db', 'dev.sqlite'),  # Or path to database file if using sqlite3.
        'USER': '',  # Not used with sqlite3.
        'PASSWORD': '',  # Not used with sqlite3.
        'HOST': '',  # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',  # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/Moscow'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'ru'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = here('media')
GLOBAL_MEDIA_DIRS = (here('static'),)

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/static/uploads/'
DEV_MEDIA_URL = '/develstatic/'

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
        'js/3rdparty/jplayer/jquery.jplayer.js',
        'radio/js/util.namespace.js',
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
        'radio/js/ui.infoblock.js',
        'radio/js/ui.search.js',
        'radio/js/player.audio.js',
        'radio/js/player.playlist.js',
        'radio/js/player.station.js',
        'radio/js/player.station.common.js',
        'radio/js/player.station.artist.js',
        'radio/js/player.station.library.js',
        'radio/js/player.station.loved.js',
        'radio/js/player.station.recommendations.js',
        'radio/js/player.station.similar.js',
        'radio/js/player.station.tag.js',
        'radio/js/player.control.js',
        'radio/js/events.js',
        'radio/js/events.player.js',
    ),
)

# Absolute path to the directory that holds static files.
# Example: "/home/media/media.lawrence.com/static/"
#STATIC_ROOT = here('static')

# URL that handles the static files served from STATIC_ROOT.
# Example: "http://media.lawrence.com/static/"
#STATIC_URL = '/static/'

# URL prefix for admin media -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

# A list of locations of additional static files
#STATICFILES_DIRS = ()

# List of finder classes that know how to find static files in
# various locations.
#STATICFILES_FINDERS = (
#    'django.contrib.staticfiles.finders.FileSystemFinder',
#    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
#)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'gmz7f8)&q848*^k+d_j*&3(77@7fe=3vgalst4(b-xl*^0@d+3'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'mediagenerator.middleware.MediaMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'vk_iframe.middleware.AuthenticationMiddleware',
    #'django.middleware.locale.LocaleMiddleware',
    #'vk_iframe.middleware.LoginRequiredMiddleware',

    #'django.contrib.messages.middleware.MessageMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    #"django.core.context_processors.static",
    #"django.contrib.messages.context_processors.messages",
    "common.context_processors.settings",
    "common.context_processors.user_platform",
    "common.context_processors.version",
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'vk_iframe.backends.VkontakteUserBackend',
)


ROOT_URLCONF = 'urls'
LOGIN_URL = '/app/login/'

TEMPLATE_DIRS = (
    here('templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    # 'django.contrib.sites',
    # 'django.contrib.messages',
    # 'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',

    'mediagenerator',
    'vk_iframe',

    'common',
    'radio',

    'south',
)

LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/'
LASTFM_API_KEY = '5f170ff5352903d39512d907566283fc'
LASTFM_API_SECRET = '212627ff4f288e140a8b3734a40d2be2'
VK_APP_ID = '1840144'
VK_APP_KEY = 'rlh7nKUmRE'
VK_APP_SECRET = '30mfDL0PaxY5b3VQGA2T'
VK_APP_URL = 'http://vkontakte.ru/app1840144'
VK_APP_SETTINGS = 'audio'


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
