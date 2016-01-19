/**
 * Created by michaelumenta on 9/17/15.
 */
$(document).ready(function(){

    $.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Letters, numbers, and underscores only please");

    $.validator.addMethod("passwordFormat", function(value, element) {
        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{9,}$/;
        return value.match(decimal);
    }, "Password must contain uppercase letter, lowercase letter, number, special character, and be " +
        "be at least 9 letters long.");

    $.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    $( "#signup-form" ).validate({
        rules: {
            username: {
              alphanumeric: true,
                required: true,
                maxlength: 16,
                minlength: 6
            },
            first_name: {
              required: true
            },
            last_name: {
                required: true
            },
            password: {
                required: true,
                minlength: 9,
                passwordFormat: true
            },
            address_zip: {
                digits: true,
                maxlength: 5,
                minlength: 5
            },
            primary_phone: {
                digits: true,
                maxlength: 10,
                minlength: 10
            },
            primary_email: {
                email: true,
                required: true
            }
        }
    });
    $("#signup-form").submit(function(e){
        e.preventDefault();
        var form = $(this);
        var data = {};
        var data = ConvertFormToJSON(form);
        $.post('/v1/user', data)
            .success(function(response) {
                sessionStorage.setItem("state", "Logout");
                sessionStorage.setItem("username", response.username);
                sessionStorage.setItem("email", response.primary_email)
                location.replace('/profile?username=' + data.username);
            })
            .error(function(response) {
                alert(response.responseJSON.error)
            })
    });
});