#!/bin/bash

sudo killall gunicorn;
cd app/exchange;
python manage.py collectstatic;

