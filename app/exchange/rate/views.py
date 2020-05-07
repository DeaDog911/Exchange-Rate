from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from django.conf import settings

from . import utils


def exchange_rate(request):
    currency_type = request.GET.get('currency', 'currency')
    return render(request, 'rate/exchange_rate.html', context={'currency_type': currency_type})


def convert(request):
    if request.is_ajax():
        data = request.GET
        currency_from_name = data.get('currencyFromName')
        currency_to_name = data.get('currencyToName')
        currency_value = data.get('currencyValue')

        if currency_value.isdigit():
            currency_rate = utils.get_rate(base=currency_from_name, currency=currency_to_name)
            currency_to_value = float(currency_value) * float(currency_rate)
            return HttpResponse(currency_to_value)
        else:
            return HttpResponse('')
    else:
        raise Http404


def get_exchange_rates(request):
    if request.is_ajax():
        data = request.GET
        currency_base = data.get('currency_base')
        try:
            rates = utils.get_rates(base=currency_base)
        except KeyError:
            return HttpResponse('Error')
        return JsonResponse(rates)
    else:
        raise Http404


def get_course_for_period(request):
    if request.is_ajax():
        data = request.GET
        base = data.get('base')
        currency = data.get('currency')
        period_days = data.get('period_days')

        rates = utils.get_course_for_period(base, currency, period_days)
        return JsonResponse(rates, safe=False)
    else:
        raise Http404
