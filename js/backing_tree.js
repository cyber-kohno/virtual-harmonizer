class BackingTree {

    static buildList() {
        BackingTree.initTreeCommandEvent();
    

        const params = {};
        const rootEl = BackingTree.getTreeEl();
    
        rootEl.innerHTML = `
            <div>
                <div class="root" onclick="BackingTree.selectNode(this)">
                    <span>BACKING-ROOT</span>
                </div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;

        BackingTree.addSustainNode(4);
        BackingTree.addSustainNode(3);
        BackingTree.addSustainNode(2);
        BackingTree.addSustainNode(1);
    }

    static getTreeEl() {
        return document.getElementById('backing-tree');
    }

    static initTreeCommandEvent() {
        const rootEl = BackingTree.getTreeEl();
    
        rootEl.addEventListener('keydown', function (e) {
            // alert(`[${e.key}]`);
            switch (e.key) {
                case 'a':
                    BackingTree.addNewNode();
                    break;
            }
        });
    }

    static addSustainNode(sustain4) {
        const activeNode = BackingTree.getTreeEl().children[0].children[0];
        const rootEl = BackingTree.getTreeEl();

        const params = {};
        params.sustain4 = sustain4;

        const html = `
            <div>
                <div class="sustain" onclick="BackingTree.selectNode(this)">
                    <span>sustain[</span><span>${params.sustain4}</span><span>]</span>
                </div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;
        rootEl.insertAdjacentHTML('beforeend', html);
    
        const newNodeEl = rootEl.children[rootEl.children.length-1].children[0];
        const indentSize = Number(activeNode.style.marginLeft.replace('px', ''))
        newNodeEl.style.marginLeft = (indentSize + 20) + 'px';
    }

    static addNewNode() {
        const activeNode = BackingTree.getActiveNode();
        if(!activeNode.classList.contains('sustain')) {
            return ;
        }
        const parentParams = JSON.parse(activeNode.children[1].innerHTML);
        const rootEl = BackingTree.getTreeEl();

        const params = BackingTab.getDefaultJson();
        params.name = 'new_backing';
        params.sustain4 = parentParams.sustain4;

        const html = `
            <div>
                <div class="node" onclick="BackingTree.selectNode(this)">
                    <span>${params.name}[</span><span>${params.channel}</span><span>]</span>
                </div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;
        activeNode.parentNode.insertAdjacentHTML('afterend', html);
    
        const newNodeEl = activeNode.parentNode.nextElementSibling.children[0];
        const indentSize = Number(activeNode.style.marginLeft.replace('px', ''))
        newNodeEl.style.marginLeft = (indentSize + 20) + 'px';
    }

    static getActiveNode() {
        const list = BackingTree.getTreeEl().children;
        for (let i = 0; i < list.length; i++) {
            const node = list[i].children[0];
            if(node.classList.contains('active')) {
                return node;
            }
        }
        return null;
    }

    static selectNode(obj) {

        const list = BackingTree.getTreeEl().children;
        for (let i = 0; i < list.length; i++) {
            const node = list[i].children[0];
            node.classList.remove('active');
        }
        obj.classList.add('active');

        if(obj.classList.contains('node')) {
            const params = JSON.parse(obj.parentNode.children[1].innerHTML);
            BackingTab.curData = params;
            BackingTab.mappingFromJsonData();
        }
    }
}
