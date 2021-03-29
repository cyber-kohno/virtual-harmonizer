const SYMBOL_PARAMS_LIST = [
    {"no":1,"parentNo":0,"depth":1,"name":"","struct":"p1,M3,p5","fixed":"p1","intervals":"0,4,7"},
    {"no":2,"parentNo":0,"depth":1,"name":"m","struct":"p1,m3,p5","fixed":"p1","intervals":"0,3,7"},
    {"no":3,"parentNo":0,"depth":1,"name":"sus4","struct":"p1,p4,p5","fixed":"p1","intervals":"0,5,7"},
    {"no":4,"parentNo":0,"depth":1,"name":"dim","struct":"p1,m3,d5","fixed":"p1","intervals":"0,3,6"},
    {"no":5,"parentNo":0,"depth":1,"name":"aug","struct":"p1,M3,a5","fixed":"p1","intervals":"0,4,8"},
    {"no":6,"parentNo":0,"depth":1,"name":"maj7","struct":"p1,M3,p5,M7","fixed":"p1","intervals":"0,4,7,11"},
    {"no":7,"parentNo":0,"depth":1,"name":"7","struct":"p1,M3,p5,m7","fixed":"p1","intervals":"0,4,7,10"},
    {"no":8,"parentNo":0,"depth":1,"name":"m7","struct":"p1,m3,p5,m7","fixed":"p1","intervals":"0,3,7,10"},
    {"no":9,"parentNo":0,"depth":1,"name":"mmaj7","struct":"p1,m3,p5,M7","fixed":"p1","intervals":"0,3,7,11"},
    {"no":10,"parentNo":0,"depth":1,"name":"add9","struct":"p1,M2,M3,p5","fixed":"p1","intervals":"0,2,4,7"},
    {"no":11,"parentNo":0,"depth":1,"name":"m(-5)","struct":"p1,m3,d5","fixed":"p1","intervals":"0,3,6"},
];

function getChordSymbolList() {
    return SYMBOL_PARAMS_LIST;
}

function buildChordList() {
    initChordTreeCommandEvent();

    // const params = createChordDefParams(0, -1, 0, 'chord-list');
    
    const params = {};
    params.no = 0;
    params.parentNo = -1;
    params.depth = 0;
    params.name = 'chord-list';
    params.struct = 'p1';
    // params.fixed = parent.struct;
    const rootEl = getChordDefTreeEl();

    rootEl.innerHTML = `
        <div>
            <div class="root" onclick="selectChordDefNode(this)">
                <span>${params.name}</span>
            </div>
            <div class="param">${JSON.stringify(params)}</div>
        </div>
    `;

    for(let i = 0; i < SYMBOL_PARAMS_LIST.length; i ++) {
        addChildChordNode(SYMBOL_PARAMS_LIST[i]);
    }
}

function initChordTreeCommandEvent() {
    const rootEl = document.getElementById('chord-def-list');

    rootEl.addEventListener('keydown', function (e) {
        // alert(`[${e.key}]`);
        switch (e.key) {
            case 'a':
                addChildNewChordNode();
                break;
        }
        // if (e.key === 'a') {
        //     alert(getActiveChordNode().innerHTML);
        // }
    });
}

function getChordDefTreeEl() {
    return document.getElementById('chord-def-list');
}

function selectChordDefNode(obj) {
    const list = getChordDefTreeEl().children;
    for (let i = 0; i < list.length; i++) {
        const node = list[i].children[0];
        node.classList.remove('active');
    }
    obj.classList.add('active');

    mappingFromChordDefNode(obj);

    
    // const activeNode = getActiveChordNode();
    const parentParams = getChordDefParams(obj);
    console.log(JSON.stringify(parentParams));
}

function addChildChordNode(params) {
    const activeNode = getChordDefTreeEl().children[0].children[0];
    // const parentParams = getChordDefParams(activeNode);
    const rootEl = getChordDefTreeEl();
    // const treeElCnt = getChordDefTreeEl().children.length - 1;
    // const curNo = treeElCnt + 1;
    // const params = createChordDefParams(treeElCnt + 1, parentParams);
    // const numberLabel = 'no' + curNo;
    const label = ``;
    const html = `
        <div>
            <div class="chord-def" onclick="selectChordDefNode(this)">
                <span>${label}[</span><span>${params.name}</span><span>]</span>
            </div>
            <div class="param">${JSON.stringify(params)}</div>
        </div>
    `;
    rootEl.insertAdjacentHTML('beforeend', html);

    const newNodeEl = rootEl.children[rootEl.children.length-1].children[0];
    const indentSize = Number(activeNode.style.marginLeft.replace('px', ''))
    newNodeEl.style.marginLeft = (indentSize + 20) + 'px';
    // selectChordDefNode(newNodeEl);
}

function addChildNewChordNode() {
    const activeNode = getActiveChordNode();
    const parentParams = getChordDefParams(activeNode);
    const lineEl = activeNode.parentNode;
    const treeElCnt = getChordDefTreeEl().children.length - 1;
    const curNo = treeElCnt + 1;
    const params = createChordDefParams(treeElCnt + 1, parentParams);
    // const numberLabel = 'no' + curNo;
    const label = ``;
    const html = `
        <div>
            <div class="chord-def" onclick="selectChordDefNode(this)">
                <span>${label}[</span><span></span><span>]</span>
            </div>
            <div class="param">${JSON.stringify(params)}</div>
        </div>
    `;
    lineEl.insertAdjacentHTML('afterend', html);

    const newNodeEl = lineEl.nextElementSibling.children[0];
    const indentSize = Number(activeNode.style.marginLeft.replace('px', ''))
    newNodeEl.style.marginLeft = (indentSize + 20) + 'px';
    selectChordDefNode(newNodeEl);
}

function getIndent(size) {
    let indent = '';
    for(let i = 0; i < size; i ++) indent += '　';
    return indent;
}

function createChordDefParams(no, parent) {
    const params = {};
    params.no = no;
    params.parentNo = parent.no;
    params.depth = parent.depth + 1;
    params.name = '';
    params.struct = parent.struct;
    params.fixed = parent.struct;
    return params;
}

function getChordDefParams(node) {
    return JSON.parse(node.nextElementSibling.innerHTML);
}

function setChordDefParams(node, params) {
    node.nextElementSibling.innerHTML = JSON.stringify(params);
}

function reloadChordDefNode(node) {
    const params = getChordDefParams(node);
    let list = [];
    const structs = params.struct.split(',');
    for (let i = 0; i < structs.length; i++) {
        const item = structs[i];
        const typeName = getIntervalNameFromType(item.substring(0, 1));
        const num = item.substring(1);
        list.push(typeName + num);
    }
    node.children[0].innerHTML = list.join('-') + '[';
    node.children[1].innerHTML = params.name;
}

function getActiveChordNode() {

    const list = getChordDefTreeEl().children;
    for (let i = 0; i < list.length; i++) {
        const node = list[i].children[0];
        if (node.classList.contains('active')) return node;
    }
    return null;
}