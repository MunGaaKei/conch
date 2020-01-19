;((win, doc) => {

    const ELECTRON = require('electron');
    const IPC = ELECTRON.ipcRenderer;
    const SHELL = ELECTRON.shell;
    const FS = require('fs');
    const RL = require('readline');

    const $header = doc.querySelector('.header');
    const $menu = doc.querySelector('.menu');
    const $content = doc.querySelector('.content');
    const $contextmenu = doc.querySelector('.contextmenu');

    let WORKSPACE = win.localStorage.WORKSPACE;
    WORKSPACE = WORKSPACE? JSON.parse(WORKSPACE): {
        'untitled': {
            title: '未命名',
            path: undefined,
            editor: 0,
            type: 2,
            create: '2020-01-01'
        },
        'norwegian': {
            title: '挪威的森林',
            path: 'D:/1AN/conch/documents/挪威的森林/',
            files: ['chapter1'],
            type: 1
        },
        'chapter1': {
            title: '第一章',
            path: 'D:/1AN/conch/documents/挪威的森林/第一章/',
            files: ['section1', 'section2'],
            parent: 'norwegian',
            type: 1
        },
        'section1': {
            title: '第一节',
            path: 'D:/1AN/conch/documents/挪威的森林/第一章/第一节.txt',
            editor: 0,
            time: '2020-01-03',
            active: true,
            parent: 'chapter1',
            type: 2
        },
        'section2': {
            title: '第二节',
            path: 'D:/1AN/conch/documents/挪威的森林/第一章/第一节.txt',
            editor: 0,
            time: '2020-01-03',
            parent: 'chapter1',
            type: 2
        }
    };

    let ActiveTABS = new Proxy( {}, {
        set: ( tar, prop, val ) => {
            // add editor
            // activate menu li
            // add console handler
            console.log(prop, val);
            
            if( val ){
                
                
            } else {

            }
            
            return true;
        }
    });


    let Menus = new Proxy( WORKSPACE, {
        set: ( tar, prop, val ) => {
            if ( val ){
                if( tar[prop] ){
                    // update

                } else {
                    // create

                }
                tar[ prop ] = val;
            } else {
                // delete
                delete tar[ prop ];
                ActiveTABS[ prop ] = null;
            }
            return true;
        }
    });


    // 初始化侧边栏目录
    let generateMenu = ( files = {}, sub = true ) => {
        let html = '';
        let keys = sub? files: Object.keys( files );
        let o, k;
        
        for( k of keys ){
            o = WORKSPACE[ k ];
            if( !sub && o.parent ) continue;

            html += `<li>
                        <a class="li" data-key="${k}" data-type="${o.type}">
                            <b>${o.title}</b>
                            <i class="tgl-close"></i>
                        </a>
                    ${o.files? `<ul>${generateMenu(o.files)}</ul></li>`: `</li>`}`;
            if( o.type === 2 && o.active ) ActiveTABS[k] = true;
        }
        if( sub ) return html;
        $menu.innerHTML = html;
    }
    
    

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
        let line, content = '';
        for await ( line of lines ) content += `${line}<br>`;
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

    // 操作文件
    let operateFile = ( act, id ) => {
        switch( act - 0 ){
            case 0: // save
                console.log('save'+ id);
                break;
            case 8: // open folder
                SHELL.showItemInFolder( WORKSPACE[id].path );
                break;
            case 9: // remove
                break;
            default: break;
        }
        $contextmenu.style.cssText = `visibility:hidden;`;
    }

    // 右键上下文菜单
    let contextMenu = ( id, choice = [], x = 0, y = 0 ) => {
        let item;
        let html = '';
        for( item of choice ){
            html += `<a data-act="${item.act}">${item.title}</a>`
        }
        $contextmenu.dataset.id = id;
        $contextmenu.innerHTML = html;
        
        let rect = $contextmenu.getBoundingClientRect();
        let css = ( x + rect.width > win.innerWidth )? `left:auto;right:${win.innerWidth - x}px;`: `left:${x}px;`;
        css += ( y + rect.height > win.innerHeight )? `top:auto;bottom:${win.innerHeight - y}px;`: `top:${y}px;`;
        $contextmenu.style.cssText = `visibility:unset;${css}`;
    }

    // 右键菜单点击事件
    $contextmenu.addEventListener('click', e => {
        e.stopPropagation();
        let tar = e.target;
        let act = tar.dataset.act;
        act && operateFile( act, $contextmenu.dataset.id );
    });

    // Header 按钮点击事件
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

    // 拖拽读取文件
    $content.addEventListener('dragover', e => { e.preventDefault(); });
    $content.addEventListener('drop', e => {
        e.preventDefault();

        let file = e.dataTransfer.files[0];
        file && readFile( file.path ).then( res => {

            // doc.querySelector('.editor').innerHTML = res;

        });
    });

    
    // 侧边目录栏点击事件
    $menu.addEventListener('click', e => {
        let tar = e.target;
        while( tar !== $menu ){
            if( tar.classList.contains('li') ){
                let $ul = tar.nextElementSibling;
                if( $ul ){
                    $ul.classList.toggle( 'active' );
                } else if( !tar.classList.contains('active') ) {
                    // ActiveTABS[ tar.dataset.key ]
                }
            }
            tar = tar.parentNode;
        }
    });
    // 侧边目录栏右键事件
    $menu.addEventListener('contextmenu', e => {
        let tar = e.target;
        while( tar !== $menu ){
            let type = tar.dataset.type - 0;
            if( type ){
                // 显示右键菜单
                let options = [];
                type === 1 && options.push({ act: 1, title: '添加文本' }, { act: 1, title: '新建文件夹' });
                type === 2 && options.push({ act: 0, title: '保存' });
                options.push({ act: 8, title: '打开所在目录' }, { act: 9, title: '删除' });
                contextMenu( tar.dataset.key, options, e.clientX, e.clientY);
            }
            tar = tar.parentNode;
        }
    });

    // 内容区右键事件
    $content.addEventListener('contextmenu', e => {
        let tar = e.target;
        while( tar !== $content ){
            if( tar.classList.contains('editor') ){
                contextMenu( 0, [
                    { act: 0, title: '保存' },
                    { act: 1, title: '打开所在目录' },
                    { act: 2, title: '复制' },
                    { act: 3, title: '粘贴' },
                    { act: 8, title: '关闭' }
                ], e.clientX, e.clientY );
            }
            tar = tar.parentNode;
        }
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

    doc.addEventListener('click', e => {
        $contextmenu.style.cssText = `visibility:hidden;`;
    });


    generateMenu( WORKSPACE, false );

    ActiveTABS['section1'] = true;

})(window, document);
