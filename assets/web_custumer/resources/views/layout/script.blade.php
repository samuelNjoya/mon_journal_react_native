<script type="text/javascript">
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "5000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // function showErrorMsg(form, type, msg) {
    //     let alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
    //                         <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="la la-close"></i></span></button>\
    //                         <span class="message" style="text-align: center"></span>\
    //                     </div>');
    //
    //     form.find('.alert').remove();
    //     alert.prependTo(form);
    //     //alert.animateClass('fadeIn animated');
    //     KTUtil.animateClass(alert[0], 'fadeIn animated');
    //     alert.find('span[class="message"]').html(msg);
    // }

    function smsKtAppblock(selector, overlayColor = '#000000', type = 'v2', state = 'primary', message = null) {
        KTApp.block(selector, {
            overlayColor: overlayColor,
            type: type,
            state: state,
            message: (message != null) ? message : '{{ __('master.processing') }}'
        });
    }

    function smsKtAppunblock(selector) {
        KTApp.unblock(selector);
    }

    function smsToastSuccess(message) {
        toastr.success((message != null) ? message : '{{ __('notification.default_success') }}');
    }

    function smsToastError(message) {
        toastr.error((message != null) ? message : '{{ __('notification.default_error') }}');
    }

    function smsToastInfo(message = "") {
        toastr.info(message);
    }

    function loader(id, message = "") {
        KTApp.block(id, {
            overlayColor: '#2c2c2c',
            type: 'v2',
            state: 'brand',
            //message: message != "" ? message : '{!! __('page.text_load') !!}',
            message: message +
                " <img alt='Logo' src='{{ asset('assets/media/logos/logo_sesampayx.png') }}' style='width: 20px;'><br>",
            size: 'lg'
        });
    }

    function unloader(id) {
        KTApp.unblock(id);
    }

    function smsToastWarning(message = "") {
        toastr.warning(message);
    }

    function smsAskConfirmSweetAlert2(title, text, callback, type = "warning", okBtn = "Confirmer", cancelBtn =
        "Annuler") {
        swal.fire({
            title: title,
            html: text,
            type: type,
            showCancelButton: true,
            confirmButtonText: okBtn,
            cancelButtonText: cancelBtn,
            reverseButtons: true,
            allowOutsideClick: false
        }).then(function(result) {
            if (result.value) {
                if (callback) {
                    callback("ok");
                }
                // result.dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
            } else if (result.dismiss === 'cancel') {
                callback("cancel");
                /*swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )*/
            }
        });
    }

    function smsSweetAlert(message, type = "success", title = "", callback = null) {
        swal.fire({
            title: title,
            html: message,
            type: type,
            allowOutsideClick: false,
            confirmButtonClass: "btn btn-secondary",
        }).then(function(result) {
            callback && callback(result);
        });
    }

    function smsSweetLoadingAlert(title, message, callback = null) {
        return swal.fire({
            title: title,
            html: message,
            allowOutsideClick: false,
            onOpen: function() {
                swal.showLoading()
            }
        }).then(function(result) {
            callback && callback(result);
        })
    }

    function initSelectAllowNewValue(selector = null) {
        $(".select2-allow-new-value").select2({
            tags: true,
            selectOnBlur: true,
            placeholder: "{{ __('master.make_choice_placeholder') }}",
            language: {
                "noResults": function() {
                    return "{{ __('master.no_result_found') }}";
                }
            },
        });
    }

    //use only by modal make ajax submit
    function formSubmit(btnElt, validateOptions, bloc_selector, datatable, modal, ajax, callback, successCallback,
        errorCallBack) {
        let btn = btnElt;
        let form = btnElt.closest('form');

        form.validate(validateOptions);

        if (!form.valid()) {
            return;
        }

        smsKtAppblock(bloc_selector);

        form.ajaxSubmit({
            url: ajax.url,
            data: ajax.data ? ajax.data : {},
            method: ajax.method,
            success: function(response, status, xhr, $form) {
                smsKtAppunblock(bloc_selector);
                successCallback()
            },
            error: function(error) {
                errorCallBack(error);
            }
        });

    }

    function changeStatusSubmit(mainSelector, datatable, ajax, callback) {
        smsKtAppblock(mainSelector);
        $.ajax({
            url: ajax.url,
            method: ajax.method,
            dataType: 'JSON',
            data: JSON.stringify(ajax.data ?? {}),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(data) {
                if (callback) callback(data);
                else {
                    smsKtAppunblock(mainSelector);
                    if (data.status === 1) {
                        if (datatable != null) {
                            datatable.reload();
                        }
                        smsToastSuccess();
                    } else {
                        smsToastError(data.message);
                    }
                }
            },
            error: function(error) {
                smsKtAppunblock(mainSelector);
                smsToastError(JSON.stringify(error));
            }
        });
    }

    function ajaxSubmit(ajax, successCallback, errorCallback) {
        $request = $.ajax({
            url: ajax.url,
            method: ajax.method ?? "GET",
            dataType: ajax.dataType ?? 'JSON',
            data: JSON.stringify(ajax.data ?? {}),
            contentType: ajax.contentType ?? "application/json",
            cache: false,
            processData: false,
            success: function(data) {
                successCallback(data);
            },
            error: function(error) {
                errorCallback(error);
            }
        });
        return $request;
    }

    function smsPrintDatatableContent(datatable, url, queryText, printMode) {
        let allDatatableParams = {
            "_token": "{{ csrf_token() }}",
            "pagination": datatable.getDataSourceParam("pagination"),
            "query": datatable.getDataSourceParam("query"),
            "sort": datatable.getDataSourceParam("sort"),
            "queryText": queryText,
            "printMode": printMode,
        };
        smsSweetLoadingAlert("{{ __('pdf.printing') }}", "{{ __('master.processing') }}");
        $.ajax({
            url: url,
            method: "POST",
            dataType: 'JSON',
            data: JSON.stringify(allDatatableParams),
            contentType: "application/json",
            cache: false,
            processData: false,
            success: function(data1) {
                if (data1.status === 1) {
                    $.ajax({
                        url: data1.extra_data.url,
                        method: 'GET',
                        xhrFields: {
                            responseType: 'blob'
                        },
                        success: function(data) {
                            let a = document.createElement('a');
                            let url = window.URL.createObjectURL(data);
                            a.href = url;
                            a.download = data1.extra_data.filename;
                            document.body.append(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        }
                    });
                    swal.close();
                } else {
                    smsToastError(JSON.stringify(data1));
                    swal.close();
                }
            },
            error: function(error) {
                smsToastError(JSON.stringify(error));
                swal.close();
            }
        });
    }

    //select2 ajax format Item search
    function formatStudentSearchItem(item) {
        if (!item || !item.id) return "";
        return '\
                <div class="kt-wizard-v2__review-content">\
                    ' + item.name + '<br />\
                    <span class="kt-font-bold">' + item.class + '</span>, <span class="kt-font-bold58">' + item
            .gender + '</span><br />\
                    <span class="kt-font-bold">' + item.numberid + '</span>, <span>' + item.session_name + '</span><br />\
                    <span class="kt-font-bold badge badge-' + item.status.type + '">' + item.status.status + '</span>\
                </div>\
            ';
    }

    function formatStudentItemSelection(item) {
        return item.name || item.text;
    }

    function select2RemoteOptions(options) {
        return {
            placeholder: options.placeholder,
            allowClear: true,
            language: "{{ App::getLocale() }}",
            ajax: {
                url: options.url,
                method: "GET",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: data.more
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatStudentSearchItem, // omitted for brevity, see the source of this page
            templateSelection: formatStudentItemSelection // omitted for brevity, see the source of this page
        };
    }

    let datereangpickerFrOptions = {
        buttonClasses: ' btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',
        locale: {
            cancelLabel: '{{ __('actions.clear') }}',
            applyLabel: '{{ __('actions.validate') }}',
            customRangeLabel: "{{ __('master.rangepicker.other') }}",
            format: 'DD/MM/YYYY',
            "daysOfWeek": [
                "Di",
                "Lu",
                "Ma",
                "Me",
                "Je",
                "Ve",
                "Sa"
            ],
            "monthNames": [
                "Janvier",
                "Fevrier",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre"
            ],
        }
    };

    let datereangpickerEnOptions = {
        buttonClasses: ' btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',
        locale: {
            cancelLabel: '{{ __('actions.clear') }}',
            applyLabel: '{{ __('actions.validate') }}',
            format: 'DD/MM/YYYY',
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
        }
    };

    let datereangpickerOptions = null;
    let datereangpickerPeriodeFilterOptions = null;

    @if (App::getLocale() == 'fr')
        datereangpickerOptions = datereangpickerFrOptions;

    @else
        datereangpickerOptions = datereangpickerEnOptions;
    @endif

    // Class definition
    $(document).ready(function() {


        //refresh action
        $("#refresh").unbind().click(function() {
            window.location.href = window.location.href;
        });


        //adding laravel csrf token to all future ajax request
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        let allFormSelector = $('form');

        allFormSelector.on('focus', 'input[type=number]', function(e) {
            $(this).on('wheel.disableScroll', function(e) {
                e.preventDefault()
            })
        });

        allFormSelector.on('blur', 'input[type=number]', function(e) {
            $(this).off('wheel.disableScroll')
        });

    });


    //**********transfert vers un non abonné**********//
    // Class Definition
    let non_account_transfert = $('#non_acc_transfert_form');

    let showErrorMsg = function(form, type, msg) {
        let alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>')
    };


    // Class Initialization
    jQuery(document).ready(function() {


    });

    function formatMoney(money) {
        return (parseFloat(money)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    let phoneNumberInternational = null

    let getCountry = function(country_code) {
        let input = document.querySelector("#phone_number")
        phoneNumberInternational = window.intlTelInput(input, {
            autoHideDialCode: false,
            separateDialCode: true,
            initialCountry: country_code,
            formatOnDisplay: true,
            nationalMode: true,
            utilsScript: "./assets/js/utils.js"
        })
    }
    let getCountryInterTrans = function(country_code) {
        let input = document.querySelector("#phone_number_1")
        phoneNumberInternational = window.intlTelInput(input, {
            autoHideDialCode: false,
            separateDialCode: true,
            initialCountry: country_code,
            formatOnDisplay: true,
            nationalMode: true,
            utilsScript: "./assets/js/utils.js"
        })
    }
    let getCountryInterTrans2 = function(country_code) {
        let input = document.querySelector("#phone_number_2")
        phoneNumberInternational = window.intlTelInput(input, {
            autoHideDialCode: false,
            separateDialCode: true,
            initialCountry: country_code,
            formatOnDisplay: true,
            nationalMode: true,
            utilsScript: "./assets/js/utils.js"
        })
    }

    let getPhoneNumberInternational = function() {
        let phoneNumber = {
            isValid: false,
            number: ""
        }
        let number = phoneNumberInternational.getNumber()
        phoneNumber.number = number.substr(number.indexOf("+") + 1)
        phoneNumber.isValid = phoneNumberInternational.isValidNumber()
        return phoneNumber
    }

</script>
