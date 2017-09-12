;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {
            doc.querySelectorAll('.header i')[2].onclick = () => { ipc.send('close-app'); }
            doc.querySelectorAll('.header i')[1].onclick = () => { ipc.send('maximize-app'); }
            doc.querySelectorAll('.header i')[0].onclick = () => { ipc.send('minimize-app'); }
        }

    };


    conch.init();

})(window, document);
