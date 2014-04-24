


/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */

 /** MOD by James Towers
  
  Adds 'current' event that triggers when a page is 20% in view
  use:
  $(element).on(current'){
    doSometing()
  }
 **/

;(function ($) {
    current_page = false;
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
        var vpH = getViewportHeight(),
            scrolltop = (document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];
        
        // naughty, but this is how it knows which elements to check for
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        //console.log('ScrollTop: '+scrolltop);

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    elId = $el.attr('id'),
                    top = $el.offset().top,
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.data('currentPage', false);
                        $el.trigger('inview', [ false ]);                        
                    }
                } else if (scrolltop < (top + height)) {
                    if (!inview) {
                        $el.data('inview', true);
                        $el.data('currentPage', false);
                        $el.trigger('inview', [ true ]);
                    }
                }

                if ( scrolltop > (top - height*0.8)  && scrolltop < (top + height*0.8) ) {
                    if(current_page != elId){
                      current_page = elId
                      $el.data('currentPage', true);
                      $el.trigger('current', [ true ]);
                    }
                } else {
                  $el.data('currentPage', false);
                }
            });
        }
    });
    
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(function () {
        $(window).scroll();
    });
})(jQuery);