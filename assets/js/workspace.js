let { WORKSPACE } = window.localStorage;
WORKSPACE = WORKSPACE? JSON.parse(WORKSPACE): {};

let handler = new Proxy(WORKSPACE, {
    set: ( tar, k, v, rcv ) => {
        if( tar[k] ){
            // activate it
        } else {
            // createMenu
        }
        tar[k] = v;
        return true;
    }
})

export { handler as W };