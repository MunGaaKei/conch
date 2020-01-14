;(function(win, doc){

    const IPC = require('electron').ipcRenderer;
    const FS = require('fs');
    const RL = require('readline');

    const $header = doc.querySelector('.header');
    const $content = doc.querySelector('.content');

    let WORKSPACE = win.localStorage.tabs;
    WORKSPACE = WORKSPACE? JSON.parse(WORKSPACE): {
        '0': {
            title: '未命名',
            path: undefined,
            saved: true,
            create: '2020-01-01',
            active: false,
            content: ''
        },
        '1': {
            title: '挪威的森林',
            path: 'D:/1AN/conch/documents/untitled.docx',
            saved: true,
            create: '2020-01-02',
            active: false
        }
    };



    let MENUS = new Proxy( WORKSPACE, {
        set: ( tar, prop, val ) => {
            if ( tar[prop] ){
                console.log('exit');
                
            }
            tar[ prop ] = val;
            return true;
        }
    });
    

    // 指令
    let directive = ( act = '', tar ) => {
        switch( act ){
            case 'min': IPC.send('app-minimize'); break;
            case 'exit':
                // 检查是否还有文档未保存
                IPC.send('app-close');
                break;
            case 'sidebar': sidebar(); break;
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

    // toggle 侧边栏目录
    let sidebar = () => {
        let $sidebar = doc.querySelector('.sidebar');
        let rect = $sidebar.getBoundingClientRect();
        $content.style.cssText = rect.left === 0? `left:-${rect.width}px;`: '';
    }

    // 更新菜单栏
    let updateMenu = () => {
        
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
            case 66:    // toggle sidebar: ctrl+b
                e.ctrlKey && sidebar();
                break;
            default: break;
        }
    });



    MENUS[ '2' ] = {
        title: 'Gone with the wind',
        path: 'D:/1AN/conch/documents/untitled.txt',
        saved: true,
        create: '2020-01-03',
        active: false
    };

})(window, document);
