var FormControl = {

    formID: "",

    init: function (formId) {

        if (formId) {
            this.formID = formId;
        }

        $(this.formID + " .form-control").focusin(function () {
            $(this).parent().addClass("is-focus");
        })

        $(this.formID + " .form-control").focusout(function () {
            $(this).parent().removeClass("is-focus");
        })

        $(this.formID + " .form-control").keyup(function () {
            if ($(this).val().length == 0) {
                $(this).parent().addClass("is-empty");
            } else {
                $(this).parent().removeClass("is-empty");
            }
        })

        $(this.formID + " .toggle-password").click(function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parent().find('.form-control').prop('type', 'password');
            } else {
                $(this).addClass('active');
                $(this).parent().find('.form-control').prop('type', 'text');
            }
        })

    },
    setError: function (el, mess) {
        $(this.formID + " " + el).parent().addClass("is-invalid").find("+.feedback").html(mess)
    },
    setSuccess: function (el, mess = "") {
        $(this.formID + " " + el).parent().addClass("is-valid").find("+.feedback").html(mess)
    },
    reset: function (el) {
        $(this.formID + " " + el).parent().removeClass("is-valid").removeClass("is-invalid").find("+.feedback").html("")
    }
}