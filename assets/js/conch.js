;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;
    const C_FOLDERS = 'folders';
    const C_ARTICLES = 'articles';
    const C_CHAPTERS = 'chapters';

    let DB;

    let conch = {

        init: () => {

            conch.initDB();
            conch.eListen();
        },

        // 初始化数据库数据
        initDB: () => {

            const DB_NAME = 'CONCH';
            const DB_VER = 1;

            win.indexedDB.deleteDatabase(DB_NAME);

            let DBReq = win.indexedDB.open(DB_NAME, DB_VER);

            DBReq.onsuccess = e => {
                DB = e.target.result;
                conch.initUI();
            }
            DBReq.onupgradeneeded = e => {
                let db = e.target.result,
                    folders, articles, chapters;

                folders = db.createObjectStore(C_FOLDERS, { keyPath: "id", autoIncrement: true });
                folders.createIndex("id", "id", { unique: true });
                folders.createIndex("title", "title", { unique: true });
                folders.add({ title: "默认" });

                articles = db.createObjectStore(C_ARTICLES, { keyPath: "id", autoIncrement: true });
                articles.createIndex("id", "id", { unique: true });
                articles.createIndex("title", "title");
                articles.createIndex("folder", "folder");
                articles.createIndex("type", "type");
                articles.createIndex("state", "state");
                articles.add({ title: "挪威的森林", folder: 1, type: 2 });
                articles.add({ title: "20180606", content: "明天要去种树！", folder: 1, type: 1 });

                chapters = db.createObjectStore(C_CHAPTERS, { keyPath: "id", autoIncrement: true });
                chapters.createIndex("id", "id", { unique: true });
                chapters.createIndex("article", "article");
                chapters.createIndex("title", "title");
                chapters.add({ title: "第一章", article: 1, content: "aaaaaaaaaaaa" });
                chapters.add({ title: "第二章", article: 1, content: "bbbbbbbbbbbb" });

                folders = articles = chapters = null;
            }

        },

        // 初始化界面
        initUI: () => {

            let transaction = DB.transaction(C_FOLDERS, 'readonly');
            let os = transaction.objectStore(C_FOLDERS);
            let folders = os.getAll();

            folders.onsuccess = () => {
                folders = folders.result;
                let html = '';
                for(i in folders) html += iFolder(folders[i]);
                by('folders').innerHTML = html;
                folders = html = null;
            }

            transaction = DB.transaction(C_ARTICLES, 'readonly');
            os = transaction.objectStore(C_ARTICLES);
            let articles = os.getAll();

            articles.onsuccess = () => {
                articles = articles.result;
                let kv = {}, files, html = '';
                for(i in articles){
                    files = kv[`folder${articles[i].folder}`] || '';
                    kv[`folder${articles[i].folder}`] = files + iArticle(articles[i]);
                }
                for(i in kv){
                    files = by(i);
                    if(files) files.innerHTML = kv[i];
                }
                articles = html = files = kv = null;
            }

            transaction = os = null;
        },

        // 添加事件绑定
        eListen: () => {

            let appmmc = by('appmmc').getElementsByTagName('i'),
                navs = by('navs').getElementsByTagName('i');

            by('menu').addEventListener('click', function(e){
                let tar = e.target,
                    pa = tar.parentNode;


                if(tar.classList.contains('folder')){
                    pa.classList.toggle('expand');
                    return;
                } else if(pa.classList.contains('folder')){
                    pa.parentNode.classList.toggle('expand');
                    return;
                } else if(tar.dataset.type == '2'){
                    by('list').classList.remove('out');
                    getArticle(parseInt(tar.dataset.id));
                    return;
                }


            });

            navs[1].addEventListener('click', function(){ location.reload(); });
            by('back').addEventListener('click', function(){ by('list').classList.add('out'); });

            // 快捷键监听
            win.addEventListener('keyup', (e) => {
                let key = e.which;
                if(e.ctrlKey){
                    switch (key) {
                        case 83: // S save
                            break;
                        case 79: // O
                            fullScreen(); break;
                        default: break;
                    }
                } else {
                    switch (key) {
                        case 27: // ESC
                            by('fullscreen').className = 'iconfont icon-fullscreen btn'; break;
                        case 116: // F5
                            location.reload(); break;
                        default: break;
                    }
                }
            });

            // 全屏功能
            navs[2].addEventListener('click', fullScreen);

            // 应用大小化及关闭
            appmmc[2].onclick = () => { ipc.send('app-close'); }
            appmmc[1].onclick = () => { ipc.send('app-maximize'); }
            appmmc[0].onclick = () => { ipc.send('app-minimize'); }

            appmmc = navs = null;

        },

        // 读取用户配置
        setConf: () => {

        },

    };

    // 公用函数
    let by = id => { return doc.getElementById(id); }
    let fullScreen = () => {
        let fs = by('fullscreen');
        if(doc.webkitIsFullScreen){
            doc.webkitExitFullscreen();
            fs.className = 'iconfont icon-fullscreen btn';
        } else {
            by('container').webkitRequestFullscreen();
            fs.className = 'iconfont icon-exitfullscreen btn';
        }
    }
    let iFolder = folder => `<li class="item"><p class="folder"><i class="iconfont icon-tri"></i><span>${folder.title}</span></p><ul id="folder${folder.id}"></ul></li>`;
    let iArticle = article => `<li data-id="${article.id}" data-type="${article.type}"><i class="iconfont icon-article"></i><i class="iconfont icon-unchecked"></i><span>${article.title}</span></li>`

    let getArticle = id => {
        let transaction = DB.transaction(C_ARTICLES, 'readwrite'),
            os = transaction.objectStore(C_ARTICLES),
            article = os.get(id);
        article.onsuccess = () => {
            article = article.result;
            article = null;
        }
        transaction = os = null;
    }


    conch.init();

})(window, document);
