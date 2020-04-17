const win = window;
const doc = document;

const ELECTRON = require('electron');
const IPC = ELECTRON.ipcRenderer;
const SHELL = ELECTRON.shell;
const FS = require('fs');
const RL = require('readline');
const OS = require('os');

const $header = doc.querySelector('.header');
const $sidebar = doc.querySelector('.sidebar');
const $menu = doc.querySelector('.menu');
const $content = doc.querySelector('.content');
const $contextmenu = doc.querySelector('.contextmenu');
const $confirm = doc.querySelector('.confirm');
const $file = doc.getElementById('select');

let { WORKSPACE } = win.localStorage;
let $editor = doc.querySelector('.editor');

WORKSPACE = WORKSPACE? JSON.parse(WORKSPACE): {};


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
                        <i class="status"></i>
                    </a>
                ${o.files? `<ul>${generateMenu(o.files)}</ul></li>`: `</li>`}`;
    }
    if( sub ) return html;
    $menu.insertAdjacentHTML('beforeend', html);
}

// 激活目录文件
let activateMenu = key => {
    let $prev = $menu.querySelector('.active');
    let $li = $menu.querySelector(`[data-key="${key}"]`);
    let o = WORKSPACE[key];

    readFile( o.path ).then( res => {
        $editor.innerHTML = res;
        $editor.dataset.id = key;
        $editor.dataset.type = o.type;
    });

    $prev && $prev.classList.remove( 'active' );
    $li && $li.classList.add( 'active' );   
}

// 打开\关闭 模态框
let backdrop = $el => {
    if( $el.classList.contains('active') ){
        $el.classList.remove('in');
        setTimeout(() => { $el.classList.remove('active'); }, 300);
    } else {
        $el.classList.add('active');
        $el.offsetWidth;
        $el.classList.add('in');
    }
}

// 检查文件是否存在
let checkPath = path => {
    let k;
    for(k in WORKSPACE){
        if(WORKSPACE[k].path === path) return k;
    }
    return false;
}


// 生成 id
let generateID = () => {
    let id = '';
    let s = 'abcdefghijklmnopqrstuvwxyz';
    let i = 0;
    for(; i < 4; i++) { id += s[Math.round(26 * Math.random())]; }
    return new Date().getTime() + id;
}


// 指令
let directive = ( act = '', tar ) => {
    switch( act ){
        case 'min': IPC.send('app-minimize'); break;
        case 'exit':
            // 检查是否还有文档未保存
            // 保存 ACTIVETABS & WORKSPACE
            IPC.send('app-close');
            break;
        case 'add': $file.click(); break;
        case 'sidebar': sidebar(); break;
        default: break;
    }
}


// 文件数据填充
let setItem = file => {
    let id = checkPath( file.path );
    if( !id ) {
        id = generateID();
        let data = {
            name: file.name,
            path: file.path,
            size: file.size,
            original: file
        };
        switch( file.type ){
            case 'text/plain':
                let name = data.name.split('.');
                name.length -= 1;
                data.title = name.join('.');
                data.type = 2;
                break;
            default: break;
        }
        let item = {}
        item[id] = WORKSPACE[id] = data;
        generateMenu( item, false );
    }
    return id;
}


// 读取文件
let readFile = async path => {
    let stream = FS.createReadStream( path );
    let lines = RL.createInterface({
        input: stream,
        crlfDelay: Infinity,
        autoNext: true
    });
    let line, content = '';
    for await ( line of lines ) content += `${line}${OS.EOL}`;
    return content;
}

// 写入TXT文件
let writeTXT = (key, o) => {
    let stream = FS.createWriteStream( o.path );
    stream.write( $editor.textContent );
}

// 保存
let save = () => {
    let key = $editor.dataset.id;
    if( key ){
        let o = WORKSPACE[key];
        switch (o.type) {
            case 2: writeTXT( key, o ); break;
            case 1: break;
            default: break;
        }
    } else {

    }
}

// toggle 侧边栏目录
let sidebar = () => {
    let rect = $sidebar.getBoundingClientRect();
    $content.style.cssText = Math.round( rect.right ) <= win.innerWidth? `right:-${rect.width + 1}px;`: '';
}

// 操作文件
let operateFile = ( act, id ) => {
    switch( act - 0 ){
        case 0: // save
            
            break;
        case 7: // open folder
            SHELL.showItemInFolder( WORKSPACE[id].path );
            break;
        case 8: // view file information

            break;
        case 9: // remove
            break;
        default: break;
    }
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
    
    backdrop( $contextmenu.parentNode );
    let rect = $contextmenu.getBoundingClientRect();
    let css = ( x + rect.width > win.innerWidth )? `right:${win.innerWidth - x}px;`: `left:${x}px;`;
    css += ( y + rect.height > win.innerHeight )? `bottom:${win.innerHeight - y}px;`: `top:${y}px;`;
    $contextmenu.style.cssText = `${css}`;
}

// 右键菜单点击事件
$contextmenu.addEventListener('click', e => {
    let tar = e.target;
    let act = tar.dataset.act;
    act && operateFile( act, $contextmenu.dataset.id );
});

// 确认框点击事件
$confirm.addEventListener('click', e => {
    e.stopPropagation();
    
    let tar = e.target;
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
    file && activateMenu( setItem(file) );
});


// 选择文件
$file.addEventListener('change', () => {
    let file = $file.files[0];
    file && activateMenu( setItem(file) );
});

$sidebar.querySelector('.btn').addEventListener('click', () => { $file.click(); });

// 侧边目录栏点击事件
$menu.addEventListener('click', e => {
    let tar = e.target;
    while( tar !== $menu ){
        if( tar.classList.contains('li') ){
            let $ul = tar.nextElementSibling;
            if( $ul ){
                $ul.classList.toggle( 'active' );
            } else if( !tar.classList.contains('active') ) {
                activateMenu(tar.dataset.key);
            }
        }
        if( tar.classList.contains('tgl-close') ){
            backdrop( $confirm.parentNode );
            tar = $menu;
            break;
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
            options.push(
                { act: 7, title: '打开所在目录' },
                { act: 8, title: '详细信息' },
                { act: 9, title: '删除' }
            );
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
            e.ctrlKey && save();
            break;
        case 78:    // toggle sidebar: ctrl+n
            e.ctrlKey && sidebar();
            break;
        default: break;
    }
});

// 侧边栏宽度拉伸
let sidebarDraggable = false;
doc.querySelector('.widen').addEventListener('mousedown', () => { sidebarDraggable = true; });
doc.addEventListener('mousemove', e => {
    if( sidebarDraggable ) $sidebar.style.width = `${Math.min(win.innerWidth - e.clientX, win.innerWidth / 2)}px`;
});

doc.addEventListener('mouseup', () => {
    sidebarDraggable = false;
});

doc.body.addEventListener('click', e => {
    let tar = e.target;
    while( tar !== doc.body ){
        tar.classList.contains('dismiss') && backdrop( tar );
        tar = tar.parentNode;
    }
}, false);


generateMenu( WORKSPACE, false );