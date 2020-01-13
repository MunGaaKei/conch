;(function(win, doc){

    const IPC = require('electron').ipcRenderer;
    const FS = require('fs');
    const RL = require('readline');

    const $header = doc.querySelector('.header');
    const $tabs = doc.querySelector('.tabs');
    const $content = doc.querySelector('.content');

    let WORKSPACE = win.localStorage.tabs;
    WORKSPACE = WORKSPACE? JSON.parse(WORKSPACE): {
        0: {
            path: undefined,
            title: '未命名',
            saved: true
        },
        // 1: {
        //     path: 'D:/1AN/conch/documents/demo.txt',
        //     title: '未命名',
        //     saved: true
        // },
        // 2: {
        //     path: 'D:/1AN/conch/documents/demo.docs',
        //     title: '未命名的文档',
        //     saved: true
        // }
    };


    // 监听 WORKSPACE 变化改变 tabs 状态
    let monitor = files => {
        let handler = new Proxy( files, {
            set: ( target, prop, val ) => {
                console.log( target, prop, val );
                target[prop] = val;
                return true;
            }
        });

        handler[2] = 123;
    }

    // 指令
    let directive = ( act = '', tar ) => {
        switch( act ){
            case 'min': IPC.send('app-minimize'); break;
            case 'exit':
                // 检查是否还有文档未保存
                IPC.send('app-close');
                break;
            default: break;
        }
    }

    // 打开文件
    let open = id => {
        let file = WORKSPACE[id];
        file && readFile( file.path ).then( res => {
            doc.querySelector('.editor').innerHTML = res;
        });
    }

    // 读取文件
    let readFile = async file => {
        const stream = FS.createReadStream( file );
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

    // 保存文件
    let save = ( id, content ) => {

    }

    $header.addEventListener('click', e => {
        e.stopPropagation();
        let act,
            tar = e.target;
        while( tar !== $header ){
            act = tar.dataset.act;
            act && directive( act, tar );
            tar = tar.parentNode;
        }
    });

    $content.addEventListener('dragover', e => { e.preventDefault(); });
    $content.addEventListener('drop', e => {
        e.preventDefault();

        let file = e.dataTransfer.files[0];
        file && readFile( file.path ).then( res => {

            // doc.querySelector('.editor').innerHTML = res;

        });
    });
    
    // 监听键盘输入
    $content.addEventListener('keydown', e => {
        switch( e.keyCode ){
            case 9:     // tab
                e.preventDefault();
                doc.execCommand('insertHTML', doc.getSelection(), ' '.repeat(4));
                break;
            default: break;
        }
    });

    $content.addEventListener('keyup', e => {
        console.log(e);
        
        switch( e.keyCode ){
            case 83:    // save: ctrl+s
                if( e.ctrlKey ){
                    
                }
                break;
            default: break;
        }
    });

    


    monitor( WORKSPACE );



})(window, document);
