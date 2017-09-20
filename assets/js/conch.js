;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {

            let main = doc.querySelector('div.main'),
                mainLeft = 0;

            let widen = (e) => {
                let left = e.clientX < 76.8? 76.8: e.clientX;
                left = left < 454.4? left: 454.4;
                main.style.left = left + 'px';
            }

            // 应用大小化及关闭
            doc.querySelectorAll('.winctl i')[2].onclick = () => { ipc.send('close-app'); }
            doc.querySelectorAll('.winctl i')[1].onclick = () => { ipc.send('maximize-app'); }
            doc.querySelectorAll('.winctl i')[0].onclick = () => { ipc.send('minimize-app'); }

            // 侧边栏显示与隐藏
            doc.querySelector('.menuctl').onclick = () => {
                if(main.getBoundingClientRect().left === 0){
                    main.style.left = mainLeft + 'px';
                } else {
                    mainLeft = main.getBoundingClientRect().left;
                    main.style.left = 0;
                }
            }

            // 鼠标监听改变内容区宽度
            doc.querySelector('span.widen').addEventListener('mousedown', () => {
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
                        location.reload();
                        break;
                    default: break;
                }
            }, true);


        }

    };


    conch.init();

})(window, document);
