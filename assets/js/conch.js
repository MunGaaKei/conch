;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
            conch.setConfig();
        },

        eventListen: () => {

            let main = doc.getElementById('main'),
                winctl = doc.querySelectorAll('.winctl i'),
                lists = doc.getElementsByClassName('list'),
                mainLeft = 0;

            let widen = (e) => {
                let left = e.clientX < 76.8? 76.8: e.clientX;
                left = left < 454.4? left: 454.4;
                main.style.left = left + 'px';
            },  fullScreen = () => {
                let zoom = doc.getElementById('zoom');
                if(doc.webkitIsFullScreen){
                    doc.webkitExitFullscreen();
                    zoom.className = 'iconfont icon-fullscreen btn-conch';
                } else {
                    doc.getElementsByClassName('container')[0].webkitRequestFullscreen();
                    zoom.className = 'iconfont icon-exitfullscreen btn-conch';
                }
            };


            // 文库 - 列表点击事件
            lists[0].addEventListener('click', (e) => {
                let el = e.target;

                if(el.tagName == 'UL') return;
                if(el.tagName == 'I'){ el = el.parentNode; }

                if(el.tagName == 'LI'){
                    if(el.dataset.type == 'novel') doc.getElementsByClassName('menu-a')[0].style.transform = 'translateX(13rem)';
                } else if(el.tagName == 'P'){
                    el.parentNode.classList.toggle('expanded');
                }

            });
            doc.getElementById('menu-b').addEventListener('click', (e) => {
                let el = e.target;
                if(el.classList.contains('active')) return;
                if(el.tagName == 'LI'){
                    doc.getElementById('menu-b').getElementsByClassName('active')[0].classList.remove('active');
                    el.classList.add('active');

                }
            });

            // 左侧导航栏
            doc.getElementById('navs').addEventListener('click', (e) => {
                let el = e.target;
                if(el.tagName != 'I') return;

                doc.getElementById('editor-box').style.transition = 'none';
                doc.getElementById('editor-box').classList.remove('show');

                let i = parseInt(el.dataset.sec),
                    section = doc.querySelectorAll('.menu-a section')[i];

                if(section.classList.contains('show')) return;

                section.classList.add('show');
                doc.getElementById('navs').firstElementChild.style.transform = 'translateY('+ 38.4 * i + 'px' +')';

            });

            // 侧边栏显示与隐藏
            doc.getElementsByClassName('menuctl')[0].addEventListener('click', () => {
                if(main.getBoundingClientRect().left === 0){
                    main.style.left = mainLeft + 'px';
                } else {
                    mainLeft = main.getBoundingClientRect().left;
                    if(mainLeft === 0) mainLeft = 76.8;
                    main.style.left = 0;
                }
            });

            // 鼠标监听改变内容区宽度
            doc.getElementById('widen').addEventListener('mousedown', () => {
                main.style.transition = 'none';
                doc.addEventListener('mousemove', widen);
                doc.addEventListener('mouseup', () => {
                    doc.removeEventListener('mousemove', widen);
                    this.removeEventListener('mouseup', arguments.callee);
                    main.style.transition = 'all .2s ease';
                });
            });

            // 快捷键监听
            win.addEventListener('keyup', (e) => {
                let key = e.which;
                console.log(key);
                if(e.ctrlKey){
                    switch (key) {
                        case 83: // S
                            console.log('SAVE!');
                            break;
                        case 79: // O
                            fullScreen(); break;
                        default: break;
                    }
                } else {
                    switch (key) {
                        case 27: // ESC
                            zoom.className = 'iconfont icon-fullscreen btn-conch'; break;
                        case 116: // F5
                            location.reload(); break;
                        default: break;
                    }
                }

            });

            // 全屏功能
            doc.getElementById('zoom').addEventListener('click', fullScreen);

            // 应用大小化及关闭
            winctl[2].onclick = () => { ipc.send('close-app'); }
            winctl[1].onclick = () => { ipc.send('maximize-app'); }
            winctl[0].onclick = () => { ipc.send('minimize-app'); }

        },

        // 读取用户配置
        setConfig: () => {

        }

    };


    conch.init();

})(window, document);
