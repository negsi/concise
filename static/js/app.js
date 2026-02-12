/**
 * Application JavaScript code for Concise view
 * 
 */
var Concise = function() {

    /**
     * Predfined RSS feed URLs for the dropdown menu in the "Add RSS Source" dialog
     */
    var predefinedFeeds = [
        { name: "n-tv", url: "https://www.n-tv.de/politik/rss" },
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
        { name: "Spiegel Online", url: "https://www.spiegel.de/index.rss" },
        { name: "heise online", url: "https://www.heise.de/rss/heise.rdf" }
    ];

    /**
     * Shortens a text to a maximum length without cutting words.
     * Words are added until the next word would exceed the limit.
     *
     * @param {string} text The input text to shorten.
     * @param {number} maxLength The maximum allowed length.
     * @returns {string} The shortened text.
     */
    var shortenText = function(text, maxLength) {
        var words = text.split(" ");
        var result = "";

        for (var i = 0; i < words.length; i++) {
            var test = result.length === 0
                ? words[i]
                : result + " " + words[i];

            if (test.length > maxLength) {
                break;
            }

            result = test;
        }

        // Remove ugly trailing punctuation or separators 
        result = result.replace(/[-|/:.,!?]+$/, "");

        return result;
    };

    /**
     * Creates a new column DOM node based on the template.
     * The column receives a shortened feed title and initializes
     * the custom scrollbar after insertion.
     *
     * @param {string} feedTitle The full feed title received from the backend.
     * @param {Object[]} feedEntries The feed entries received from the backend.
     * @returns {HTMLDivElement} The constructed column element.
     */
    var createColumn = function(feedTitle, feedEntries) {
        const col = document.createElement("div");
        const tpl = document.getElementById("column_template");
        const clone = tpl.content.cloneNode(true);

        col.classList.add("col-2", "h-100");
        col.appendChild(clone);

        var title = shortenText(feedTitle, 20);
        $(col).find("h4.card-secondary").text(title);

        // Populate feed entries (limited to 15 atm)
        var container = $(col).find(".scrollbar-inner");
        var ul = $("<ul>").addClass("feed-entries");

        feedEntries.slice(0, 15).forEach(function(entry) {
            $("<li>")
                .text(entry.title)
                .data("entry", entry)
                .on("click", function () {

                    // Send item url to backend and crawl article content
                    var item = $(this).data("entry");

                    fetch("/fetch_article", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            link: item.link
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Article response:", data);
                    })
                    .catch(err => {
                        console.error("Error fetching article:", err);
                    });
                })
                .appendTo(ul);
        });

        container.append(ul);

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
    var appendColumnToNextFreeRow = function(rows, feedData) {
        var feedTitle = feedData.feed_title;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].children.length < 6) {
                return rows[i].appendChild(createColumn(feedTitle, feedData.entries));
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
        }).then(function(result) {

            if (result !== true) {
                return; 
            }

            var value = $('#feed_source').val();

            $.ajax({
                url: '/fetch_feed',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ url: value }),
                success: function(feedData) {

                    /**
                     * TODO: Not necessary, fetch dom nodes in appendColumnToNextFreeRow
                     */
                    var row1 = document.getElementById("row1");
                    var row2 = document.getElementById("row2");

                    appendColumnToNextFreeRow([row1, row2], feedData);
                },
                error: function(err) {
                    console.error("XMLHttpRequest Error:", err)
                }
            })
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
