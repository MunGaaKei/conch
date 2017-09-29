;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
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
            };


            // 文库 - 列表点击事件
            lists[0].addEventListener('click', (e) => {
                let el = e.target;

                if(el.classList.contains('folder-header')){
                    el.parentNode.classList.toggle('expanded');
                } else if(el.parentNode.classList.contains('folder-header')){
                    el.parentNode.parentNode.classList.toggle('expanded');
                }

            });


            // 左侧导航栏
            doc.getElementById('navs').addEventListener('click', (e) => {
                let el = e.target,
                    i = parseInt(el.dataset.sec),
                    section = doc.querySelectorAll('.menu-a section')[i];

                if(section.classList.contains('show')) return;

                doc.getElementsByClassName('menu-a')[0].style.transform = 'translateX(0)';
                doc.querySelector('.menu-a section.show').classList.remove('show');
                section.classList.add('show');
                doc.getElementById('navs').firstElementChild.style.transform = 'translateY('+ 38.4 * i + 'px' +')';

            });

            // 侧边栏显示与隐藏
            doc.getElementsByClassName('menuctl')[0].onclick = () => {
                if(main.getBoundingClientRect().left === 0){
                    main.style.left = mainLeft + 'px';
                } else {
                    mainLeft = main.getBoundingClientRect().left;
                    main.style.left = 0;
                }
            }

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
                console.log(e.which);
                switch (e.which) {
                    case 116:
                        location.reload(); break;
                    default: break;
                }
            }, true);

            // 应用大小化及关闭
            winctl[2].onclick = () => { ipc.send('close-app'); }
            winctl[1].onclick = () => { ipc.send('maximize-app'); }
            winctl[0].onclick = () => { ipc.send('minimize-app'); }

        }

    };


    conch.init();

})(window, document);
