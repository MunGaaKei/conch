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

    // reigst listeners
    $('.app-controls a').on('click', function(){ ipc.send(this.dataset.app); });

    $('#menu').on('click', '.item', function(){
        if(this.classList.contains('selected')) return;
        $('.menu .selected').removeClass('selected');
        this.classList.add('selected');
    })
    .on('click', '.folder', function(){
        this.parentNode.classList.toggle('expand');
    })
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
            this.click();
            let menu = $('#menucontext')[0];
            menu.classList.add('transless');
            menu.style.cssText = 'left:'+ e.pageX +'px;top:'+ e.pageY +'px;';
            menu.offsetWidth;
            menu.classList.remove('transless');
            menu.classList.add('on');
        }
    });

    $('#menucontext li').on('click', function(){
        let act = this.dataset.act,
            $item = $('.menu .selected');

        switch (act) {
            case '0': // add
            break;
            case '1': // edit
            break;
            case '2': // delete
                if($item.hasClass('folder')) $item = $item.parent();
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

    doc.addEventListener('mouseup', () => { $('#menucontext').removeClass('on'); });
    $('.menu').on('scroll', () => { $('#menucontext').removeClass('on'); });

    $('.tabs').on('click', 'a', function(e){
        if(this.classList.contains('active')) return;
        let prev = $('.tabs .active')[0],
            page = this.dataset.page;
        prev && prev.classList.remove('active');
        LASTTAB = prev;
        this.classList.add('active');
        $('#pages').attr('src', page);
    })
    .on('click', 'i', function(e){
        e.stopPropagation();
        $(this.parentNode).remove();

        LASTTAB = LASTTAB || doc.querySelector('.tabs a.active') || doc.querySelector('.tabs a');
        LASTTAB && LASTTAB.click();
    });


})(window, document);
