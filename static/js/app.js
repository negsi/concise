/**
 * Application JavaScript code for Concise view
 * 
 */
var Concise = function() {

    /**
     * Predfined RSS feed URLs for the dropdown menu in the "Add RSS Source" dialog
     */
    var predefinedFeeds = [
        { name: "Spiegel Online", url: "https://www.spiegel.de/international/index.rss" },
        { name: "Zeit Online", url: "http://newsfeed.zeit.de/index" },
        { name: "JUNGE FREIHEIT", url: "https://jungefreiheit.de/feed/" },
        { name: "taz", url: "https://taz.de/!p4608;rss/" },
        { name: "Handelsblatt", url: "https://www.handelsblatt.com/contentexport/feed/top-themen" },
        { name: "Süddeutsche Zeitung", url: "https://rss.sueddeutsche.de/rss/Topthemen" },
        { name: "Stern", url: "https://www.stern.de/feed/standard/alle-nachrichten/" },
        { name: "Frankfurter Allgemeine", url: "https://www.faz.net/rss/aktuell/" },
        { name: "WELT", url: "https://www.welt.de/feeds/topnews.rss" },
        { name: "t-online", url: "https://www.t-online.de/nachrichten/feed.rss" },
        { name: "Tagesschau", url: "https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml" },
        { name: "heise online", url: "https://www.heise.de/rss/heise.rdf" }
    ];

    /**
     * Creates a new column DOM node based on the template.
     *
     * @returns {HTMLDivElement}
     */
    var createColumn = function() {
        const col = document.createElement("div");
        const tpl = document.getElementById("column_template");
        const clone = tpl.content.cloneNode(true);

        col.classList.add("col-2", "h-100");
        col.appendChild(clone);

        // Initialize scrollbar after DOM insertion
        setTimeout(function() {
            $(col).find(".scrollbar-inner").scrollbar();
        }, 0);

        return col;
    };

    /**
     * Appends a new column to the next free row (max 6 per row).
     *
     * @param {HTMLElement[]} rows
     */
    var appendColumnToNextFreeRow = function(rows) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].children.length < 6) {
                return rows[i].appendChild(createColumn());
            }
        }
    };

    /**
     * Shows a SweetAlert dialog using the HTML template.
     */
    var showSwalDialog = function() {

        var tpl = document.getElementById("swal_template");
        var clone = tpl.content.cloneNode(true);
        var content = clone.firstElementChild;

        swal({
            title: 'New RSS Source',
            content: content,
            buttons: {
                cancel: {
                    visible: true,
                    className: 'btn btn-danger'
                },
                confirm: {
                    className: 'btn btn-secondary'
                }
            }
        }).then(function() {
            var value = $('#feed_source').val();
            console.log("RSS Input:", value);

            var row1 = document.getElementById("row1");
            var row2 = document.getElementById("row2");

            appendColumnToNextFreeRow([row1, row2]);
        });

        /**
         * Populate the dropdown menu with predefined feeds after the dialog is rendered.
         */
        setTimeout(function() {
            var $menu = $('.swal-modal .dropdown-menu');
            $menu.empty();

            predefinedFeeds.forEach(function(feed) {
                $('<a>')
                    .addClass('dropdown-item')
                    .attr('href', '#')
                    .text(feed.name)
                    .data('url', feed.url)
                    .appendTo($menu);
            });
        }, 0);
    };

    /**
     * Registers all event listeners we need
     */
    var registerEvents = function() {

        /**
         * Adds a new RSS source column to the grid when the button is clicked.
         */
        $('#add_rss_source').click(function(e){
            showSwalDialog()
        });

        /**
         * Handles clicks on the dropdown items in the "Add RSS Source" dialog 
         * to populate the input field with the selected feed URL.
         */
        $(document).on('click', '.dropdown-item', function(e) {
            e.preventDefault();
            var url = $(this).data('url');
            $('#feed_source').val(url);
        });
    };

    /**
     * Public API of the Concise view module
     */
    return {
        init: function() {
            registerEvents();
        },
    };
}();

/**
 * Initialize the Concise view when the document is ready
 */
jQuery(document).ready(function() {
    Concise.init();
});
