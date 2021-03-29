const ROOT_LIST = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const ROOT_LIST2 = ['C', 'C#<br>Db', 'D', 'D#<br>Eb', 'E', 'F', 'F#<br>Gb', 'G', 'G#<br>Ab', 'A', 'A#<br>Bb', 'B'];

const viewer = new KeyboadViewer('chord-view');

function buildChordTab() {
    buildChordList();
    // buildChordDefRootPosition();
    buildChordDefStruct();
    buildChordDefDeployment();

    // ルート要素を選択
    selectChordDefNode(getChordDefTreeEl().children[0].children[0]);
    updateDeployment();
}

function mappingFromChordDefNode(obj) {
    let nodeType = 'root';
    if (obj.classList.contains('chord-def')) nodeType = 'chord-def';

    const paramEl = document.getElementById('chord-def-param');
    const structEl = document.getElementById('chord-def-struct');
    const deployEl = document.getElementById('chord-def-deployment');
    const oprEl = document.getElementById('chord-def-operation');
    switch (nodeType) {
        case 'root':
            paramEl.classList.add('disable');
            structEl.classList.add('disable');
            deployEl.classList.add('disable');
            oprEl.classList.add('disable');
            setChordStruct([], []);
            break;
        case 'chord-def':
            paramEl.classList.remove('disable');
            structEl.classList.remove('disable');
            deployEl.classList.remove('disable');
            oprEl.classList.remove('disable');
            mappingChordDefParams();
            break;
    }
    updateDeployment();
    if (getChordStruct().length > 0) {
        changeRootPosition(getDeploymentLines()[0].children[1]);
    } else {
        changeRootPosition(null);
    }
    updatePianoView();
}

function mappingChordDefParams() {

    const paramEl = document.getElementById('chord-def-param');
    const activeNode = getActiveChordNode();
    const params = getChordDefParams(activeNode);

    paramEl.children[1].children[1].value = params.name;
    setChordStruct(params.struct.split(','), params.fixed.split(','));
}

function changeRootPosition(obj) {
    const list = getDeploymentLines()[0].children;
    for (let i = 1; i < list.length; i++) {
        list[i].classList.remove('active');
    }
    if (obj != null) {
        obj.classList.add('active');
    }
    updatePianoView();
}

function getRootPosition() {
    const list = document.getElementById('chord-def-deployment').children[0].children[0].children;
    for (let i = 1; i < list.length; i++) {
        if (list[i].classList.contains('active')) return i - 1;
    }
    return -1;
}

function buildChordDefStruct() {
    const rootEl = document.getElementById('chord-def-struct').children[0];

    let html = '';
    for (let i = 0; i < 12; i++) {

        let item = '';
        switch (i) {
            case 0:
                item += getItem('p', 1);
                break;
            case 1:
                item += getItem('m', 2);
                item += getItem('a', 1);
                break;
            case 2:
                item += getItem('M', 2);
                item += getItem('d', 3);
                break;
            case 3:
                item += getItem('m', 3);
                item += getItem('a', 2);
                break;
            case 4:
                item += getItem('M', 3);
                item += getItem('d', 4);
                break;
            case 5:
                item += getItem('p', 4);
                item += getItem('a', 3);
                break;
            case 6:
                item += getItem('a', 4);
                item += getItem('d', 5);
                break;
            case 7:
                item += getItem('p', 5);
                item += getItem('d', 6);
                break;
            case 8:
                item += getItem('a', 5);
                item += getItem('m', 6);
                break;
            case 9:
                item += getItem('M', 6);
                item += getItem('d', 7);
                break;
            case 10:
                item += getItem('m', 7);
                item += getItem('a', 6);
                break;
            case 11:
                item += getItem('M', 7);
                break;
        }
        html += `
            <div class="col">
                <div><span>${i}</span></div>
                <div>${item}</div>
            </div>
        `;
    }

    rootEl.innerHTML = html;
    // initPianoKey();
    // toggleActiveType(rootEl.children[0].children[2].children[0]);
}

function getItem(type, interval) {
    let typeName = getIntervalNameFromType(type);
    return `<div onclick="toggleActiveType(this)">
                <span>${typeName}${interval}</span>
                <div class="param">${type}${interval}</div>
            </div>`;
}

function getIntervalNameFromType(type) {
    let typeName = '*';
    switch (type) {
        case 'p': typeName = '完'; break;
        case 'd': typeName = '減'; break;
        case 'a': typeName = '増'; break;
        case 'M': typeName = '長'; break;
        case 'm': typeName = '短'; break;
    }
    return typeName;
}

function toggleActiveType(obj) {
    const colEl = obj.parentNode.parentNode;

    if (obj.classList.contains('active')) {
        obj.classList.remove('active');
        colEl.classList.remove('active');
    } else {
        const list = obj.parentNode.children;
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('active');
        }
        obj.classList.add('active');
        colEl.classList.add('active');
    }
    updateDeployment();
    updatePianoView();
}

function updateDeployment() {
    const list = getChordStruct(true);
    const lines = getDeploymentLines();

    for (let i = 1; i < lines.length; i++) {
        const lineEl = lines[i];
        const lineIndex = i - 1;
        const cols = lineEl.children;
        if (lineIndex > list.length - 1) {
            lineEl.classList.add('disable');
            for (let j = 0; j < cols.length; j++) {
                cols[j].innerHTML = '';
            }
        } else {
            lineEl.classList.remove('disable');
            const items = list[lineIndex].split('|');
            const interval = Number(items[0]);
            const typeName = getIntervalNameFromType(items[1].substring(0, 1));
            const num = items[1].substring(1);
            cols[0].innerHTML = `
                <div>
                    <span>${interval}</span><span>[${typeName + num}]</span>
                </div>
            `;
            for (let j = 1; j < cols.length; j++) {
                const rootIndex = j - 1;
                // const html = `<span>${ROOT_LIST2[(rootIndex + interval)%12]}</span>`;
                const html = `${ROOT_LIST2[(rootIndex + interval) % 12]}`;
                cols[j].innerHTML = html;
            }
        }
    }
}

function getDeploymentLines() {
    return document.getElementById('chord-def-deployment').children[0].children;
}

function updatePianoView() {
    const list = getChordStruct(true);
    const ret = [];
    const start = 3 + getRootPosition();
    for (let i = 0; i < list.length; i++) {
        const value = start + Number(list[i].split('|')[0]);
        ret.push(value);
    }
    viewer.drawKeyboad(ret);
}

function getChordStruct(hasInterval) {
    // const structEl = document.getElementById('chord-def-param').children[2].children[1];
    let list = [];
    const cols = document.getElementById('chord-def-struct').children[0].children;
    for (let i = 0; i < cols.length; i++) {
        const colEl = cols[i];
        if (colEl.classList.contains('active')) {

            for (let j = 0; j < colEl.children[1].children.length; j++) {
                const item = colEl.children[1].children[j];
                if (item.classList.contains('active')) {
                    let str = '';
                    if (hasInterval) str += colEl.children[0].children[0].innerHTML + '|';
                    str += item.children[1].innerHTML;
                    list.push(str);
                }
            }
        }
    }
    return list;
}
function getIntervals() {
    // const structEl = document.getElementById('chord-def-param').children[2].children[1];
    let list = [];
    const cols = document.getElementById('chord-def-struct').children[0].children;
    for (let i = 0; i < cols.length; i++) {
        const colEl = cols[i];
        if (colEl.classList.contains('active')) {

            for (let j = 0; j < colEl.children[1].children.length; j++) {
                const item = colEl.children[1].children[j];
                if (item.classList.contains('active')) {
                    list.push(colEl.children[0].children[0].innerHTML);
                }
            }
        }
    }
    return list;
}

function setChordStruct(struct, fixed) {
    // alert(struct);
    const list = document.getElementById('chord-def-struct').children[0].children;
    for (let i = 0; i < list.length; i++) {
        const colEl = list[i];

        colEl.classList.remove('lock');
        colEl.classList.remove('active');

        for (let j = 0; j < colEl.children[1].children.length; j++) {
            const item = colEl.children[1].children[j];
            const cur = item.children[1].innerHTML;
            item.classList.remove('active');
            if (fixed.includes(cur)) {
                item.classList.add('active');
                colEl.classList.add('active');
                colEl.classList.add('lock');
            } else if (struct.includes(cur)) {
                item.classList.add('active');
                colEl.classList.add('active');
            }
        }
    }
}

function buildChordDefDeployment() {

    const rootEl = document.getElementById('chord-def-deployment').children[0];

    let lineHtml = '';
    let html = '<div class="small-button"></div>';
    for (let i = 0; i < ROOT_LIST.length; i++) {
        const item = ROOT_LIST2[i];
        html += `<div class="small-button" onclick="changeRootPosition(this)"><span>${item}</span></div>`;
    }
    lineHtml += `<div>${html}</div>`;

    for (let i = 0; i < 7; i++) {
        html = `
            <div><div>
                <span>0</span><span>[完1]</span>
            </div></div>
        `;
        for (let j = 0; j < ROOT_LIST.length; j++) {
            const item = '';
            html += `<div class="small-label"><span>${item}</span></div>`;
        }
        lineHtml += `<div>${html}</div>`;
    }
    rootEl.innerHTML = lineHtml;

}

function saveChordDef() {
    const paramEl = document.getElementById('chord-def-param');
    const activeNode = getActiveChordNode();
    const params = getChordDefParams(activeNode);

    const symbol = paramEl.children[1].children[1].value;
    params.name = symbol;
    params.struct = getChordStruct(false).join(',');
    params.intervals = getIntervals().join(',');
    setChordDefParams(activeNode, params);
    reloadChordDefNode(activeNode);

    // alert(params.struct);
}

function getChordTreeNodeName() {
    const activeNode = getActiveChordNode();
    const params = getChordDefParams(activeNode);
    let list = [];
    const structs = params.struct;
    for (let i = 0; i < structs.length; i++) {
        const item = structs[i];
        const typeName = getIntervalNameFromType(item.substring(0, 1));
        const num = item.substring(1);
        list.push(typeName + num);
    }
    return list.join('-');
}