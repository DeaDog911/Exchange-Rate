from django.urls import path
from django.urls import include

from . import views

urlpatterns = [
    path('', views.exchange_rate, name='exchange_rate_url'),
    path('convert', views.convert, name='convert_url'),
    path('get_exchange_rates', views.get_exchange_rates, name='get_exchange_rates_url'),
    path('get_course_for_period', views.get_course_for_period, name='get_course_for_period_url'),
]