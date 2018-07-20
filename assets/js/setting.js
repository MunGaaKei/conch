;(function(win, doc, undefined){

    const require = win.parent.require;
    const { shell, remote } = require('electron');
    const os = require('os');

    // init data
    let LS = win.localStorage;
    $('#outpath').val(LS.PATH_OUTPUT);
    $('#fontsize').val(LS.FONT_SIZE);

    // regist listeners
    $('a[data-href]').on('click', function(){ shell.openExternal(this.dataset.href); });

    $('#outpath').on('click', function(){
        let dir = remote.dialog.showOpenDialog({
            defaultPath: this.value,
            properties: ['openDirectory']
        });
        if( dir ){
            this.value = dir;
            LS.PATH_OUTPUT = dir;
        }
    });

})(window, document);
