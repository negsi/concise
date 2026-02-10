var Concise = function() {
    var registerEvents = function() {
        $('#add_rss_source').click(function(e){
            swal({
                title: 'Input Something',
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Input Something",
                        type: "text",
                        id: "input-field",
                        className: "form-control"
                    },
                },
                buttons: {
                    cancel: {
                        visible: true,
                        className: 'btn btn-danger'
                    },        			
                    confirm: {
                        className : 'btn btn-secondary'
                    }
                },
            }).then(
            function() {
                console.log($('#input-field').val())
            }
            );
        });
    };

    return {
        init: function() {
            registerEvents();
        },
    };
}();

jQuery(document).ready(function() {
    Concise.init();
});