;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {

            let main = doc.getElementById('main'),
                winctl = doc.querySelectorAll('.winctl i'),
                mainLeft = 0;

            let widen = (e) => {
                let left = e.clientX < 76.8? 76.8: e.clientX;
                left = left < 454.4? left: 454.4;
                main.style.left = left + 'px';
            };


            // 左侧导航栏
            doc.getElementById('navs').addEventListener('click', (e) => {
                let nav = e.target,
                    navO = doc.getElementById('navs').firstElementChild,
                    i = parseInt(nav.dataset.nav);

                switch (i) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    default:break;

                }

                navO.style.transform = 'translateY('+ 38.4 * i + 'px' +')';

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
