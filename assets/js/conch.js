;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let conch = {

        init: () => {

            conch.eventListen();
        },

        eventListen: () => {
            doc.querySelectorAll('.header a')[0].onclick = () => { ipc.send('close-app'); }
<<<<<<< HEAD
            doc.querySelectorAll('.header a')[1].onclick = () => { ipc.send('maxmize-app'); }

=======
            doc.querySelectorAll('.header a')[1].onclick = () => { ipc.send('maximize-app'); }
            doc.querySelectorAll('.header a')[2].onclick = () => { ipc.send('minimize-app'); }
>>>>>>> origin/master
        }

    };


    conch.init();

})(window, document);
