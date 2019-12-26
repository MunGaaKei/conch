;(function(win, doc){

    const ipc = require('electron').ipcRenderer;
    const $header = doc.querySelector('.header');
    const $editor = doc.querySelector('.editor');

    let directHeader = act => {
        switch( act ){
            case 'min': ipc.send('app-minimize'); break;
            case 'close': ipc.send('app-close'); break;
            default: break;
        }
    }

    $header.addEventListener('click', e => {
        let act,
            tar = e.target;
        while( tar !== $header ){
            act = tar.dataset.act;
            act && directHeader( act );
            tar = tar.parentNode;
        }
    });

    $editor.addEventListener('drop', e => {
        e.preventDefault();
        console.log(e);
        
    });

})(window, document);
