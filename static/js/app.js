/**
 * Application JavaScript code for Concise view
 * 
 */
var Concise = function() {

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
     * Registers all event listeners we need
     */
    var registerEvents = function() {

        /**
         * Adds a new RSS source column to the grid when the button is clicked.
         */
        $('#add_rss_source').click(function(e){
            var row1 = document.getElementById("row1");
            var row2 = document.getElementById("row2");

            appendColumnToNextFreeRow([row1, row2]);
        });
    };

    // Init scrollbars when page is loaded
    var initScrollbars = function() {    
        $('.scrollbar-inner').scrollbar();
    };

    /**
     * Public API of the Concise view module
     */
    return {
        init: function() {
            registerEvents();
            initScrollbars();
        },
    };
}();

/**
 * Initialize the Concise view when the document is ready
 */
jQuery(document).ready(function() {
    Concise.init();
});