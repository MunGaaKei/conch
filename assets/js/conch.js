;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {
            doc.querySelectorAll('.winctl i')[2].onclick = () => { ipc.send('close-app'); }
            doc.querySelectorAll('.winctl i')[1].onclick = () => { ipc.send('maximize-app'); }
            doc.querySelectorAll('.winctl i')[0].onclick = () => { ipc.send('minimize-app'); }

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
