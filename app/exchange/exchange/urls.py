from django.conf import settings
from django.urls import include, path
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf.urls.static import static

import rate

admin.autodiscover()

i18n_urls = (
    path('i18n/', include('django.conf.urls.i18n')),
)

urlpatterns = [
    path('', include('rate.urls')),
    path('admin/', admin.site.urls),
#     path('i18n/', include('django.conf.urls.i18n')),
#     path('change_lang', rate.views.change_lang, name='change_lang_url'),
] + i18n_patterns(*i18n_urls, prefix_default_language=False)

# urlpatterns.extend(i18n_patterns(*i18n_urls, prefix_default_language=False))
urlpatterns.extend(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
