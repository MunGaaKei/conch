(function(win, doc){
    let LS = win.localStorage;

    LS.TOOLBAR_Y = LS.TOOLBAR_Y || 10;
    LS.TOOLBAR_X = LS.TOOLBAR_X || 10;
    LS.MODE_PURE = LS.MODE_PURE || true;
    LS.PATH_OUTPUT = LS.PATH_OUTPUT || 'D:\\';
    LS.PATH_OUTPUT_REQUEST = LS.PATH_OUTPUT_REQUEST || false;
    LS.FONT_SIZE = LS.FONT_SIZE || 14;

    $.extend({
        message: ( options ) => {
            if( !options ) return;
            let box = doc.getElementById("messages"),
                message = doc.createElement('DIV');
            if(typeof options === 'string') options = { text: options };
            message.className = 'message';

        }
    });

    $.fn.extend({
        dialog: function( options ){
            let $self = this,
                $handle = this.children('header');



            return this;
        }
    });

})(window, document);
