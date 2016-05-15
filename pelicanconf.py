#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Daniele Favara'
SITENAME = u'Zeroisp - Lonely IT Consultant'
SITEURL = 'http://www.zeroisp.com'
SITESUBTITLE = 'Lonely IT Consultant'
PATH = 'content'

AUTHOR_EMAIL="daniele@zeroisp.com"

ABOUT_ME = '<div>Data Lover, Data Mining and Business Intelligence</div>'
AVATAR = '/theme/images/zeroisp1.png'

ADDTHIS_PROFILE='ra-540726c06b305fb3'

DISPLAY_BREADCRUMBS=True
DISPLAY_CATEGORY_IN_BREADCRUMBS=True
DISPLAY_CATEGORIES_ON_SIDEBAR=True
#DISPLAY_RECENT_POSTS_ON_SIDEBAR=True

GOOGLE_ANALYTICS="UA-41601711-1"
TAG_CLOUD_MAX_ITEMS=30
DISPLAY_TAGS_INLINE=True

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

STATIC_PATHS = ['images', 'pdfs', 'extra']

EXTRA_PATH_METADATA = {
    #'extras/.htaccess': {'path': '.htaccess'},
    'extra/robots.txt': {'path': 'robots.txt'},
    'extra/favicon.ico': {'path': 'favicon.ico'},
    'extra/google8415ee42fe722457' : {'path': 'google8415ee42fe722457.html'}
}

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
#LINKS = (('Pelican', 'http://getpelican.com/'),
#         ('Python.org', 'http://python.org/'),
#         ('Jinja2', 'http://jinja.pocoo.org/'),
#         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('twitter', 'http://twitter.com/inomed'),
          ('github', 'http://github.com/nomed'),
      ('youtube', 'https://www.youtube.com/channel/UC3NBxki41FkgWHckj2JmL2A'),
      ('linkedin', 'http://it.linkedin.com/in/danielefavara'),
      ('google-plus', 'https://plus.google.com/104370257910930727853/posts'))

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

GITHUB_URL = 'http://github.com/nomed/'
GITHUB_USER = 'nomed'

TWITTER_CARDS=True
TWITTER_USERNAME = 'inomed'
USE_OPEN_GRAPH=True

DISQUS_SITENAME='zeroisp'

THEME = "./zeroisp"

# code blocks with line numbers
PYGMENTS_RST_OPTIONS = {'linenos': 'table'}
PYGMENTS_STYLE='friendly'

PLUGIN_PATHS = ["plugins"]
PLUGINS = ["html_rst_directive" , "sitemap", "github_activity", "gravatar"]

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

GITHUB_ACTIVITY_FEED = 'https://github.com/nomed.atom'
GITHUB_ACTIVITY_MAX_ENTRIES = 9

