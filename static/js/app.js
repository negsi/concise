/**
 * Application JavaScript code for Concise view
 * 
 */
var Concise = function() {

    /**
     * Registers all event listeners we need
     */
    var registerEvents = function() {

        /**
         * Adds a new RSS source column to the grid when the "Add RSS Source" button is clicked.
         */
        $('#add_rss_source').click(function(e){

            const row1 = document.getElementById("row1");
            const row2 = document.getElementById("row2");

            /**
             * Creates a new DomNode and appends it to the corresponding row
             * 
             * @returns {HTMLDivElement}
             */
            const createColumn = () => {

                const col = document.createElement("div");
                const tpl = document.getElementById("column_template"); 
                const clone = tpl.content.cloneNode(true); 

                col.classList.add("col-2", "h-100");
                col.appendChild(clone);

                // Initialize scrollbar as soon as the element is in the DOM 
                setTimeout(() => { 
                    $(col).find(".scrollbar-inner").scrollbar();
                }, 0);

                return col;
            };

            /**
             * For now we are using 6 columns and 2 rows as maximum
             */
            if (row1.children.length < 6) return row1.appendChild(createColumn());
            if (row2.children.length < 6) return row2.appendChild(createColumn());
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