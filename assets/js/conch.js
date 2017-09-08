;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {
            doc.getElementById('close').onclick = () => { ipc.send('close-app'); }
        }

    };


    conch.init();

})(window, document);
