import requests
import datetime
import random
from operator import itemgetter


def get_rate(base, currency):
    rates = make_request(f'https://api.exchangeratesapi.io/latest?base={base}')
    return rates['rates'][currency]


def make_request(url):
    response = requests.get(url)
    return response.json()


def get_old_rates(base):
    period_start = datetime.timedelta(days=10)  # 5 and 6 days doesn't work. I don't think why
    today = datetime.date.today()
    previous_day = today - period_start
    response = make_request(f'https://api.exchangeratesapi.io/history?'
                            f'start_at={previous_day}'
                            f'&end_at={previous_day}'
                            f'&base={base}')
    return response['rates'][previous_day.__str__()]


def add_coefficients(rates, base):
    old_rates = get_old_rates(base)
    updated_rates = {}
    for rate in rates.items():
        currency = rate[0]
        latest_value = rate[1]
        old_value = old_rates[currency]
        updated_rates[currency] = f'{latest_value}-{latest_value / old_value}'
    return updated_rates


def get_rates(base):
    rates = make_request(f"https://api.exchangeratesapi.io/latest?base={base}")
    return add_coefficients(rates['rates'], base)


def sort_rates(rates):
    return sorted(rates.items(), key=itemgetter(0))


def get_course_for_period(base, currency, period_days):
    today = datetime.date.today()
    period = datetime.timedelta(days=int(period_days))
    period_before = today - period
    response = make_request(f'https://api.exchangeratesapi.io/history?'
                            f'start_at={period_before}'
                            f'&end_at={today}'
                            f'&symbols={currency}'
                            f'&base={base}')
    return sort_rates(response['rates'])
