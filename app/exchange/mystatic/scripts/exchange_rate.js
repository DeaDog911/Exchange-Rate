$(document).ready(function() {

    const WEEK_DAYS = 7;
    const MONTH_DAYS = 30;
    const QUARTER_DAYS = 90;
    const YEAR_DAYS = 365;

    // необходимо для ajax post запросов
    var csrftoken = $.cookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    /**************** Burger *****************/

    function burgerClick() {
        console.log('ban');
    }

    $('.header-burger').click((e) => {
        $('.header-burger,#side-bar,.burger-wrapper,#currencies-list').toggleClass('active');
        $('body').toggleClass('block');
    });

    /******************* Cookie *********************/

    selectValuesFromCookies();
    showCourseForPeriod(getCookie('base-chart-currency'),
                                   getCookie('currency-chart'),
                                   MONTH_DAYS);
    $('select').on('change', saveInCookie);


    function selectValuesFromCookies() {
        for (var select of document.getElementsByTagName('select')) {
            var value = getCookie(select.id);
            select.value = value
        }
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : 'USD';
    }

    function saveInCookie(e) {
        document.cookie = e.target.id.concat('=' + e.target.value);
    }

    /************************ SideBar ******************************/

    var baseCurrency = document.getElementById('sidebar-currency-select').value;
    outputExchangeRate(baseCurrency);

    function outputExchangeRate(baseCurrency) {
        $.ajax({
            type: 'POST',
            url: 'get_exchange_rates',
            data: {'currency_base': baseCurrency},
            success: (data) => {
                if (data != 'Error') {
                    var rates = data;
                    createCurrenciesList(rates);
                } else {
//                    document.getElementById('side-bar').style.display = 'none';
                }
            },

        })
    }

    function createCurrenciesList(rates) {
        var currenciesList = document.getElementById('currencies-list');
        currenciesList.innerHTML = ''; //обнуление списка
        for (var currencyName of Object.keys(rates)) {
            var value = rates[currencyName].split('-');
            var currencyRate = parseFloat(value[0]).toFixed(2);
            var coefficient = parseFloat(value[1]).toFixed(3);

            var valueSpan = createValueSpan(currencyName, currencyRate);
            var coefficientSpan = createCoefficientSpan(coefficient);

            var currenciesListItem = createCurrenciesListItem(valueSpan, coefficientSpan);
            currenciesListItem.setAttribute('name', currencyName);

            currenciesList.appendChild(currenciesListItem);
        }
    }

    function createCurrenciesListItem(valueSpan, coefficientSpan) {
        var currenciesListItem = document.createElement('div');
        currenciesListItem.setAttribute('class', 'currencies-list-item');

        currenciesListItem.appendChild(valueSpan);
        currenciesListItem.appendChild(coefficientSpan);

        $(currenciesListItem).on('click', showChartFromItem);

        return currenciesListItem;
    }

    function createValueSpan(currencyName, currencyRate) {
        var span = document.createElement('span');
        span.textContent = currencyName + ': ' + currencyRate;
        return span;
    }

    function createCoefficientSpan(coefficient) {
        var spanCoefficient = document.createElement('span');
        spanCoefficient.textContent = coefficient;
        spanCoefficient.style.float = 'right';

        if (coefficient > 1) {
            spanCoefficient.style.color = 'green';
        }else if (coefficient == 1) {
            spanCoefficient.style.color = 'grey';
        }else {
            spanCoefficient.style.color = 'red';
        }

        return spanCoefficient;
    }


    document.getElementById('sidebar-currency-select').onchange = (e) => {
        var currency = e.target.value;
        outputExchangeRate(currency);
    }

    function showChartFromItem(e) {
        var base = document.getElementById('sidebar-currency-select').value;
        var currency = e.target.getAttribute('name');
        showCourseForPeriod(base, currency, MONTH_DAYS);
    }

    /************************************ Convert ***************************************/

    $('#convert').click((e) => {
        var currencyFromName = document.getElementById('currency-from-select').value;
        var currencyValue = document.getElementById('currency-from-value').value;
        var currencyToName = document.getElementById('currency-to-select').value;
        $.ajax({
            type: 'POST',
            url: 'convert',
            data: {
                'currencyFromName': currencyFromName,
                'currencyValue': currencyValue,
                'currencyToName': currencyToName,
            },
            success: (currencyToValue) => {
                if (currencyValue != '')
                    document.getElementById('currency-to-value').innerHTML = parseFloat(currencyToValue).toFixed(3);
            },
        })
    })

    /*********************************** CHART ******************************************/

    document.getElementById('currency-chart').onchange = (e) => {
        var base = document.getElementById('base-chart-currency').value;
        var currency = e.target.value;
        showCourseForPeriod(base, currency, MONTH_DAYS);
    }


    document.getElementById('base-chart-currency').onchange = (e) => {
        var base = e.target.value;
        var currency = document.getElementById('currency-chart').value;
        showCourseForPeriod(base, currency, MONTH_DAYS);
    }


    $("#update-chart").click((e) => {
        var base = document.getElementById('base-chart-currency').value;
        var currency = document.getElementById('currency-chart').value;
        showCourseForPeriod(base, currency, MONTH_DAYS);
    })


    $('.select-period-item').click((e) => {
        var item = e.target;
        resetColorsOnItems();
        item.style.backgroundColor = '#3C3E43';
        var base = document.getElementById('base-chart-currency').value;
        var currency = document.getElementById('currency-chart').value;
        choosePeriod(item);
    })

    function resetColorsOnItems() {
        for (var elem of document.getElementsByClassName('select-period-item')) {
            elem.style.backgroundColor = '#2E394D';
        }
    }

    function choosePeriod(item) {
        switch(item.id) {
            case 'week-period':
                showCourseForPeriod(base, currency, WEEK_DAYS);
            break;
            case 'month-period':
                showCourseForPeriod(base, currency, MONTH_DAYS);
            break;
            case 'quarter-period':
                showCourseForPeriod(base, currency, QUARTER_DAYS);
            break;
            case 'year-period':
                showCourseForPeriod(base, currency, YEAR_DAYS);
            break;
        }
    }


    var rates = null;
    function showCourseForPeriod(base, currency, period) {
        document.getElementById('loading').style.display = 'block';
        return $.when(getCourseForPeriod(base, currency, period)).done(() => {
             showChart(currency, rates, period);
             document.getElementById('loading').style.display = 'none';
        })

    }


    function getCourseForPeriod(base, currency, periodDays) {
        return $.when(ajaxGetCourseForPeriod(base, currency, periodDays)).done(() => {
             return rates;
        })
    }


    function ajaxGetCourseForPeriod(base, currency, periodDays) {
        return $.ajax({
            type: 'POST',
            url: 'get_course_for_period',
            data: {'base': base, 'currency': currency, 'period_days': periodDays},
            success: (data) => {
                rates = data;
            },
        })
    }


    function showChart(currency, rates, period) {
        var data = [];
        var labels = [];
        for(var rate of rates) {
            //rate это словарь типа {date: {currency: value}}
            labels.push(rate[0]); //date
            value_dict = rate[1]; //currency: value
            //получаем первое и единственное значение в словаре
            value = parseFloat(value_dict[Object.keys(value_dict)[0]]).toFixed(3);
            data.push(value);
        }
        createChart(currency, labels, data);
    }


    function createChart(currency, labels, data) {
        var canvas = recreateCanvas();
        var ctx = canvas.getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,

                datasets: [{
                    label: currency,
                    fill: false,
                    backgroundColor: '#63666D',
                    borderColor: '#28B066',
                    data: data,
                }]
            },
            options: {
            },
        })
        return chart
    }


    function recreateCanvas() {
        var canvas = document.getElementById('currencies-chart');
        canvas.parentNode.removeChild(canvas);
        canvas = createCanvas();
        document.getElementById('chart-container').appendChild(canvas);
        return canvas;
    }


    function createCanvas() {
        var canvas = document.createElement('canvas');
        canvas.id = 'currencies-chart';
        return canvas;
    }
});