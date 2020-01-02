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

    // 读取文件
    let readTXT = async files => {
        const stream = FS.createReadStream( files );
        const lines = RL.createInterface({
            input: stream,
            crlfDelay: Infinity,
            autoNext: true
        });

        let line,
            content = '';
        for await ( line of lines ){
            content += `${line}<br>`;
        }

        return content;
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
        console.log(e);
        
            readTXT( e.dataTransfer.files[0].path ).then( res => {

                $editor.innerHTML = res;
    
            });
    });
    
    // 监听键盘输入
    $editor.addEventListener('keydown', e => {
        switch( e.keyCode ){
            case 9:// tab
                e.preventDefault();
                doc.execCommand('insertHTML', doc.getSelection(), ' '.repeat(4));
                break;
            default: break;
        }
    });

})(window, document);
