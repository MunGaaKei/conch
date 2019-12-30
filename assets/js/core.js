;(function(win, doc){

    const IPC = require('electron').ipcRenderer;
    const FS = require('fs');
    const RL = require('readline');

    const $header = doc.querySelector('.header');
    const $editor = doc.querySelector('.editor');

    let directive = act => {
        switch( act ){
            case 'min': IPC.send('app-minimize'); break;
            case 'close': IPC.send('app-close'); break;
            default: break;
        }
    }

    async function readTXT( files ) {
        const stream = FS.createReadStream( files );
        return RL.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
    }

    $header.addEventListener('click', e => {
        let act,
            tar = e.target;
        while( tar !== $header ){
            act = tar.dataset.act;
            act && directive( act );
            tar = tar.parentNode;
        }
    });

    doc.addEventListener('dragover', e => { e.preventDefault(); });
    $editor.addEventListener('drop', e => {
        e.preventDefault();
        
        readTXT( e.dataTransfer.files[0].path ).then( res => {
            res.on('line', line => {
                console.log(line);
                
            })
        });
        
    });

})(window, document);
