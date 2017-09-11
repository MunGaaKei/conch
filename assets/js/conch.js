;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {
            doc.querySelectorAll('.header a')[0].onclick = () => { ipc.send('close-app'); }
            doc.querySelectorAll('.header a')[1].onclick = () => { ipc.send('maxmize-app'); }

        }

    };


    conch.init();

})(window, document);
