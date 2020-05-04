$(document).ready(function() {
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



    $('#convert').click((e) => {
        var currencyFromName = document.getElementById('currency-from-select').selectedOptions[0].text;
        var currencyValue = document.getElementById('currency-from-value').value;
        var currencyToName = document.getElementById('currency-to-select').selectedOptions[0].text;

        $.ajax({
            type: 'POST',
            url: 'convert',
            data: {
                'currencyFromName': currencyFromName,
                'currencyValue': currencyValue,
                'currencyToName': currencyToName,
            },
            success: (data) => {

            },
        })
    })
})




