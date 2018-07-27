;(function(win, doc, undefined){

    const EDITOR = doc.getElementById('editor');
    const PICKER = doc.getElementById('colorpicker');
    const CTX = PICKER.getContext('2d');
    const TOOLBAR = $('#toolbar')[0];

    let search = location.search.substr(1).split('&'),
        map = {};
    for(let k of search){
        k = k.split('=');
        map[k[0]] = k[1];
    }

    EDITOR.innerHTML = `POST ID ${map.id}`;

    let DND_TOOLS = false,
        DND_TOOLS_LOC = [0, 0],
        LS = win.localStorage,
        FONT_COLOR = [0, 0, 0];

    let layerA = CTX.createLinearGradient(0,0,250,0),
        layerB = CTX.createLinearGradient(0,0,0,155);
    layerA.addColorStop(0, '#fff');
    layerA.addColorStop(.125, '#f00');
    layerA.addColorStop(.25, '#f0f');
    layerA.addColorStop(.375, '#00f');
    layerA.addColorStop(.5, '#0ff');
    layerA.addColorStop(.625, '#0f0');
    layerA.addColorStop(.75, '#ff0');
    layerA.addColorStop(.875, '#f00');
    layerA.addColorStop(1, '#000');
    CTX.fillStyle = layerA;
    CTX.fillRect(0,0,250,255);
    layerB.addColorStop(0, 'rgba(0,0,0,1)');
    layerB.addColorStop(.45, 'rgba(0,0,0,0)');
    layerB.addColorStop(.55, 'rgba(255,255,255,0)');
    layerB.addColorStop(1, 'rgba(255,255,255,1)');
    CTX.fillStyle = layerB;
    CTX.fillRect(0,0,250,155);

    // common functions
    let setFontColor = color => { $('#rgb a')[0].style.cssText = 'border-color: rgb('+ color.join(',') +')'; }


    // UI Init
    TOOLBAR.style.cssText = 'left:'+ LS.TOOLBAR_X +'px;top:'+ LS.TOOLBAR_Y +'px;';
    TOOLBAR.classList[(LS.TOOLBAR_Y + 280 > win.innerHeight)? 'add': 'remove']('bybottom');
    LS.TOOLBAR_MINI === 'true' && TOOLBAR.classList.add('minimized');
    map.editable == 'true' && $('li[data-act="14"]').click();

    // regist listeners
    $('#movable').on('mousedown', function(e){
        DND_TOOLS = true;
        DND_TOOLS_LOC = [e.offsetX+4, e.offsetY+4];
        this.classList.add('active');
    });
    $(doc).on('mouseup', function(e){
        if(DND_TOOLS){
            DND_TOOLS = false;
            $('#movable').removeClass('active');
            let x = e.pageX - DND_TOOLS_LOC[0],
                y = e.pageY - DND_TOOLS_LOC[1],
                ow = TOOLBAR.offsetWidth,
                oh = TOOLBAR.offsetHeight,
                w = win.innerWidth,
                h = win.innerHeight;

            x = x > (w - ow - 10)? (w - ow - 10): x;
            x = x < 0? 0: x;
            y = y > (h - oh - 10)? (h - oh - 10): y;
            y = y < 10? 10: y;
            TOOLBAR.style.cssText = 'left:'+ x +'px;top:'+ y +'px;';
            LS.TOOLBAR_X = x;
            LS.TOOLBAR_Y = y;
            TOOLBAR.classList[(y + 280 > h)? 'add': 'remove']('bybottom');
        }
    }).on('mousemove', function(e){
        if(DND_TOOLS){
            let x = e.pageX - DND_TOOLS_LOC[0],
                y = e.pageY - DND_TOOLS_LOC[1];
            TOOLBAR.style.cssText = 'left:'+ x +'px;top:'+ y +'px;';
        }
    });
    win.addEventListener('resize', () => {
        if(LS.TOOLBAR_X >= win.innerWidth || LS.TOOLBAR_Y >= win.innerHeight){
            LS.TOOLBAR_X = LS.TOOLBAR_Y = 10;
            console.log('resize');
            TOOLBAR.style.cssText = 'left:'+ LS._toolbarX +'px;top:'+ LS._toolbarY +'px;';
            TOOLBAR.classList.remove('bybottom');
        }
    });
    $(TOOLBAR).on('click', 'li[data-act]', function(){
        let act = this.dataset.act;
        $('#toolbar li[data-act="drop"]').removeClass('active');
        switch (act) {
            case '0': TOOLBAR.classList.toggle('minimized'); LS.TOOLBAR_MINI = TOOLBAR.classList.contains('minimized'); break;
            case '1': break; // save
            case '2': doc.execCommand('bold', false); break;
            case '3': doc.execCommand('italic', false); break;
            case '4': doc.execCommand('underline', false); break;
            case '5': doc.execCommand('strikeThrough', false); break;
            case '6': doc.execCommand(this.dataset.align, false); break;
            case '7': doc.execCommand('FormatBlock', false, this.dataset.h); break;
            case '8': doc.execCommand('FormatBlock', false, 'blockquote'); break;
            case '9': break;
            case '10': break;
            case '13': $('.editor-o').animate({ scrollTop: 0 }, 300); break;
            case '14':
                this.classList.toggle('active')?
                EDITOR.setAttribute('contenteditable', 'true'):
                EDITOR.removeAttribute('contenteditable');
                EDITOR.focus();
            break;
            case '15':
                let pa = win.parent.document,
                    clear = this.classList.toggle('active');
                if(LS.MODE_PURE == 'true'){
                    pa.getElementById('container').classList[clear? 'add': 'remove']('clear');
                    clear && pa.getElementById('sider').classList.add('hidden');
                    doc.getElementsByClassName('container')[0].classList[clear? 'add': 'remove']('clear');
                }
            break;
            case 'drop': this.classList.add('active'); break;
            default: break;
        }
    });
    $('.editor-o').on('click', () => {
        $('#toolbar li[data-act="drop"]').removeClass('active');
    });
    $('#fontsize').on('click', 'li', function(){
        doc.execCommand('FontSize', false, this.dataset.size);
        let $font = $('#editor font[size]'),
            size = parseInt($font.attr('size')),
            sizeMap = [0, '13px', '14px', '15px', '16px', '24px', '36px', '48px'];
        $font.css('fontSize', sizeMap[size]).removeAttr('size');
    });
    PICKER.addEventListener('click', function(e){
        let rect = this.getBoundingClientRect(),
            x = rect.x, y = rect.y,
            pixels = CTX.getImageData(e.clientX - x, e.clientY - y, 1, 1).data;

        FONT_COLOR = [pixels[0], pixels[1], pixels[2]];
        $('#rgb span').each((i, el) => { el.textContent = FONT_COLOR[i]; });
        setFontColor(FONT_COLOR);
    });
    $('#rgb span').on('input', function(e){
        let key = e.originalEvent.data,
            i = this.dataset.i,
            n = this.textContent;

        n = parseInt(n.replace(/[^\d]/g, '')) || 0;
        n = n > 255? 255: n;
        this.textContent = n;
        FONT_COLOR[i] = n;
        setFontColor(FONT_COLOR);
    });
    $('#rgb a').on('click', () => { doc.execCommand('ForeColor', false, 'rgb('+ FONT_COLOR.join(',') +')'); });


})(window, document);
