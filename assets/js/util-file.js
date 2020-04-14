const FS = require('fs');
const RL = require('readline');

let readFile = async file => {
    const stream = FS.createReadStream( file );
    const lines = RL.createInterface({
        input: stream,
        crlfDelay: Infinity,
        autoNext: true
    });
    let line, content = '';
    for await ( line of lines ) content += `${line}<br>`;
    return content;
}

export let F = {
    readFile,
};