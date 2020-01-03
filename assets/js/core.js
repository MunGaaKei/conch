;(function(win, doc){

    const IPC = require('electron').ipcRenderer;
    const FS = require('fs');
    const RL = require('readline');

    const $header = doc.querySelector('.header');
    const $content = doc.querySelector('.content');

    let WORKSPACE = [];

    // 指令
    let directive = act => {
        switch( act ){
            case 'min': IPC.send('app-minimize'); break;
            case 'close': IPC.send('app-close'); break;
            default: break;
        }
    }

    // 打开文件
    let open = (id, path) => {

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
    doc.addEventListener('drop', e => {
        e.preventDefault();
        console.log(e.dataTransfer.files[0]);
        
        readTXT( e.dataTransfer.files[0].path ).then( res => {

            console.log(res);

        });
    });
    
    // 监听键盘输入
    doc.addEventListener('keydown', e => {
        switch( e.keyCode ){
            case 9: // tab
                e.preventDefault();
                doc.execCommand('insertHTML', doc.getSelection(), ' '.repeat(4));
                break;
            default: break;
        }
    });

})(window, document);
