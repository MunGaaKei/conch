;(function(win, doc, undefined){

    const ipc = require('electron').ipcRenderer;

    let LASTTAB;    // last activated tab


    // common functions
    let BYID = id => doc.getElementById(id);
    let getTAR = (tar, name, dep = 1) => {
        while( dep-- ){
            if(tar.classList.contains(name)) return tar;
            tar = tar.parentNode;
        }
        if(!tar.classList.contains(name)) return false;
        return tar;
    }
    let fullScreen = () => {
        let $fs = $('#switch-fs i');
        if(doc.webkitIsFullScreen){
            doc.webkitExitFullscreen();
            $fs.removeClass('icon-exitfullscreen').addClass('icon-fullscreen');
        } else {
            $('#container')[0].webkitRequestFullscreen();
            $fs.removeClass('icon-fullscreen').addClass('icon-exitfullscreen');
        }
    }
    let open = (id, title, page, params) => {
        let tab = doc.querySelector(`.tabs a[data-id="i-${id}"]`);
        if( !tab ){
            let search = [], key;
            for(key in params){ search.push(`${key}=${params[key]}`); }
            search = search.length? ('?'+ search.join('&')): '';

            let iframe = $(`<iframe id="i-${id}" src="${page}${search}" class="window"></iframe>`);
            tab = $(`<a data-id="i-${id}" title="${title}">${title}<i class="iconfont icon-close"></i></a>`);
            $('.windows').append(iframe);
            $('.tabs').prepend(tab);
        }
        tab.click();
    }
    let close = id => {
        let close = doc.querySelector(`.tabs a[data-id="i-${id}"] i`);
        close && close.click();
    }

    // reigst listeners
    $('.app-controls a').on('click', function(){ ipc.send(this.dataset.app); });

    $('#menu, #chapters').on('click', '.item', function(){
        $('.menu .selected').removeClass('selected');
        this.classList.add('selected');

        // activate or create tab here
        let ds = this.dataset;
        switch (ds.type) {
            case '1':
                open(ds.id, ds.title, ds.target, { id: ds.id });
            break;
            case '2':
                // load chapters here ...
                $('.menu > ul').toggleClass('hidden');
            break;
            default: break;
        }
    })
    .on('click', '.folder', function(){ this.parentNode.classList.toggle('expand'); })
    .on('click', '[data-check]', function(e){
        e.stopPropagation();
        let checked = this.dataset.check === 'true',
            item = this.parentNode,
            checkedIcon = '<i class="iconfont icon-checked" data-check="true"></i>',
            uncheckedIcon = '<i class="iconfont icon-unchecked" data-check="false"></i>';
        $(this).replaceWith( checked? uncheckedIcon: checkedIcon );
        if(item.classList.contains('folder')){
            $(item.nextElementSibling).find('[data-check="'+ checked +'"]').replaceWith(checked? uncheckedIcon: checkedIcon);
        } else if( checked ) {
            $(item).parent().prev().children('[data-check]').replaceWith(uncheckedIcon);
        } else {
            let $unchecked = $(item).siblings().children('[data-check="false"]');
            $unchecked.length === 0 && $(item).parent().prev().children('[data-check]').replaceWith(checkedIcon);
        }
    })
    .on('mouseup', '.item', function(e){
        if(e.which === 3){
            e.stopPropagation();
            $('.menu .selected').removeClass('selected');
            this.classList.add('selected');

            let menu = $('#menucontext')[0];
            menu.classList[this.classList.contains('folder')? 'remove': 'add']('menufolder');
            menu.classList.add('transless');
            menu.style.cssText = 'left:'+ e.pageX +'px;top:'+ e.pageY +'px;';
            menu.offsetWidth;
            menu.classList.remove('transless');
            menu.classList.add('on');
        }
    });
    $('#chapters h4')[0].addEventListener('click', () => { $('.menu > ul').toggleClass('hidden'); });

    $('#menucontext li').on('click', function(){
        let act = this.dataset.act,
            $item = $('.menu .selected');

        switch (act) {
            case '0':

            break;
            case '1':
            break;
            case '3':
                if($item.hasClass('folder')) $item = $item.parent();
                close($item.data("id"));
                $item.remove();
                break;
            default: break;
        }
    });

    $('.menu .tools a').on('click', function(){
        let tool = this.dataset.tool;
        switch (tool) {
            case '2':
                $('.menu')[0].classList.toggle('checking');
                break;
            default: break;
        }
    });

    $('.menu footer a').on('click', function(){
        let act = this.dataset.act;
        switch (act) {
            case '0':
                let checked = !doc.querySelector('#menu [data-check="false"]');
                $('#menu [data-check="'+ checked +'"]').replaceWith(
                    checked?
                    '<i class="iconfont icon-unchecked" data-check="false"></i>':
                    '<i class="iconfont icon-checked" data-check="true"></i>'
                );
            break;
            case '2':
                let $folders = $('#menu .folder [data-check="true"]').parent(),
                    $items = $('ul [data-check="true"]').parent();

                $items.add($folders.parent());
                $items.remove();
            break;
            default: break;
        }
    });

    $('.menu').on('scroll', () => { $('#menucontext').removeClass('on'); });
    $(doc).on('click', () => { $('#menucontext').removeClass('on'); });

    $('.controls li').on('click', function(){
        let ctrl = this.dataset.ctrl;
        switch (ctrl) {
            case '0': $('#sider')[0].classList.toggle('hidden'); break;
            case '1': fullScreen(); break;
            case '2': open('settings', '设置', 'pages/setting.html'); break;
            default: break;
        }
    });

    $('.tabs').on('click', 'a', function(e){
        if(this.classList.contains('active')) return;
        let prev = $('.tabs .active')[0];
        prev && prev.classList.remove('active');
        LASTTAB = prev;

        this.classList.add('active');
        $('.window.on').removeClass('on');
        $(`#${this.dataset.id}`).addClass('on');
    })
    .on('click', 'i', function(e){
        e.stopPropagation();
        let tab = this.parentNode;
        $(tab).add('#'+ tab.dataset.id).remove();

        LASTTAB = LASTTAB || doc.querySelector('.tabs a.active') || doc.querySelector('.tabs a');
        LASTTAB && LASTTAB.click();
    });

    // let DND_DIALOG = false,
    //     DND_DIALOG_EL = $('.dialog')[0],
    //     DND_DX, DND_DY;
    // $('.dialog header').on('mousedown', function(e){
    //     let rect = this.getBoundingClientRect();
    //     DND_DX = e.clientX - rect.left,
    //     DND_DY = e.clientY - rect.top;
    //     DND_DIALOG = true;
    // });
    //
    // doc.addEventListener('mousemove', function(e){
    //     if(!DND_DIALOG) return false;
    //     let x = e.pageX - DND_DX,
    //         y = e.pageY - DND_DY;
    //     DND_DIALOG_EL.style.cssText = `left:${x}px;top:${y}px;`;
    // });
    // doc.addEventListener('mouseup', function(e){
    //     $('#menucontext').removeClass('on');
    //     DND_DIALOG = false;
    //
    // });

    // 快捷键监听
    win.addEventListener('keyup', (e) => {
        let key = e.which;
        switch (key) {
            case 27: // ESC
                $('#switch-fs i').removeClass('icon-exitfullscreen').addClass('icon-fullscreen'); break;
            default: break;
        }
    });


})(window, document);
