class BackingTab {

    static viewer = new KeyboadViewer('backing-piano-view');
    static curData = null;

    static build() {
        BackingTab.viewer.init(1000, 105, 0, 1, 40, 3, 0.55, 0.6);

        BackingTree.buildList();

        // BackingTab.buildCombobox();
        BackingTab.buildTable();
        BackingTab.initCommandEvent();
        // ラインを1つ追加
        // BackingTab.addLine(-1);
        // BackingTab.insertNoteCol(-1);

        /* タブの初期活性 */
        setSelectTab('backing-tabs', 0);
        BackingTab.viewer.drawKeyboad([]);
    }

    static saveBacking() {
        const nodeEl = BackingTree.getActiveNode();
        const paramsEl = nodeEl.parentNode.children[1];
        paramsEl.innerHTML = JSON.stringify(BackingTab.curData);
    }

    static getDefaultJson() {
        return {
            channel: 3,
            layers: [
                // LEFT-HAND
                {
                    lens: '1',
                    notes: [
                        '0',
                        '0',
                        '0'
                    ],
                    vels: '5'
                },
                // RIGHT-HAND
                {
                    lens: '1',
                    notes: [
                        '0',
                        '0',
                        '0'
                    ],
                    vels: '5'
                }
            ]
        };
    }

    static mappingToJsonData() {

        const json = BackingTab.curData;

        const headerEl = document.getElementById('backing-table-header');
        const lenListEl = headerEl.children[1];
        const bodyEl = document.getElementById('backing-table-body');
        const velRootEl = document.getElementById('backing-velocity');
        const activeLayer = BackingTab.getActiveLayerIndex();

        const lineList = bodyEl.children;

        json.channel = lineList.length;
        const layer = json.layers[activeLayer];

        // 音価の書き込み
        const lenList = lenListEl.children;
        const lens = [];
        for (let i = 0; i < lenList.length; i++) {
            const lenEl = lenList[i];
            const length = BackingTab.getNotesLength(lenEl);
            const isHalf = lenEl.classList.contains('half');
            let lenStr = length;
            if (isHalf) {
                lenStr += '.';
            }
            lens.push(lenStr);
        }
        layer.lens = lens.join('-');

        // ノーツの書き込み
        const notes = [];
        for (let i = 0; i < lineList.length; i++) {
            const line = lineList[i];
            const innerList = line.children[1].children;

            const lineNotes = [];
            for (let j = 0; j < innerList.length; j++) {
                const noteEl = innerList[j];
                const isNote = noteEl.classList.contains('left');
                let noteStr = '0';
                if (isNote) {
                    noteStr = '1';
                }
                lineNotes.push(noteStr);
            }
            notes.push(lineNotes.join('-'));
        }
        layer.notes = notes;

        //ベロシティの書き込み
        const velList = velRootEl.children;
        const vels = [];
        for (let i = 0; i < velList.length; i++) {
            const velEl = velList[i].children[0].children[0];
            const velStr = velEl.innerHTML;
            vels.push(velStr);
        }
        layer.vels = vels.join('-');
    }

    static getNotesLength(lenEl) {
        const classList = lenEl.classList;
        for (let j = 0; j < classList.length; j++) {
            const name = classList[j];
            if (name.indexOf('note') != -1) return name.replace('note', '');
        }
        return -1;
    }

    static mappingFromJsonData() {

        const headerEl = document.getElementById('backing-table-header');
        const lenListEl = headerEl.children[1];
        const bodyEl = document.getElementById('backing-table-body');
        const velEl = document.getElementById('backing-velocity');
        const activeLayer = BackingTab.getActiveLayerIndex();
        const anotherLayer = BackingTab.getAnotherLayerIndex();

        bodyEl.innerHTML = '';
        lenListEl.innerHTML = '';
        velEl.innerHTML = '';

        const json = BackingTab.curData;

        for (let i = 0; i < json.channel; i++) {
            BackingTab.addLine(-1);
        }
        const src = json.layers[activeLayer];
        const lens = src.lens.split('-');

        for (let i = 0; i < lens.length; i++) {
            BackingTab.insertNoteCol(-1);

            const len = lens[i];
            const value = 'note' + len.replace('.', '');
            const isHalf = len.indexOf('.') != -1;
            BackingTab.changeLength(i, value);
            if (isHalf) {
                BackingTab.toggleHalf(i);
            }
        }

        const lineList = bodyEl.children;

        for (let i = 0; i < lineList.length; i++) {
            const line = lineList[i];
            const innerList = line.children[1].children;
            for (let j = 0; j < innerList.length; j++) {
                const noteEl = innerList[j];
                const isNote = src.notes[i].split('-')[j] != '0';
                if (isNote) {
                    BackingTab.toggleNote(noteEl, false);
                }
            }
        }
        // lineList[2].children[1].insertAdjacentHTML('beforeend', '<div class="another"></div>');

        const vels = src.vels.split('-');
        for (let i = 0; i < vels.length; i++) {
            BackingTab.setVelocity(i, vels[i])
        }

        BackingTab.updateVelocity();
    }



    static getActiveLayerIndex() {
        const list = document.getElementById('backing-table-header').children[0].children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains('active')) return i;
        }
        return -1;
    }
    static getAnotherLayerIndex() {
        const list = document.getElementById('backing-table-header').children[0].children;
        for (let i = 0; i < list.length; i++) {
            if (!list[i].classList.contains('active')) return i;
        }
        return -1;
    }

    // static buildCombobox() {
    //     const components = document.getElementById('backing-test').children[1].children;
    //     const rootEl = components[1];
    //     const symbolEl = components[2];

    //     rootEl.innerHTML = this.getScalesOptionList();
    //     symbolEl.innerHTML = this.getSymbolOptionList();
    // }

    // static getScalesOptionList() {
    //     const list = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
    //     let html = '';
    //     for (let i = 0; i < list.length; i++) {
    //         const val = list[i];
    //         html += `<option value="${val}">${val}</option>`;
    //     }
    //     return html;
    // }

    static getSymbolOptionList() {
        const list = SYMBOL_PARAMS_LIST;
        let html = '';
        for (let i = 0; i < list.length; i++) {
            const params = list[i];
            html += `<option value="${params.intervals}">[${params.name}]</option>`;
        }
        return html;
    }

    static createStructList() {
        const components = document.getElementById('backing-test').children[1].children;
        const rootEl = components[1];
        const symbolEl = components[2];

        const root = rootEl.value.split('/')[0];
        const intervals = symbolEl.value.split(',');
        let rootIndex = -1;
        for (let i = 0; i < SCALE_LIST.length; i++) {
            if (root === SCALE_LIST[i]) {
                rootIndex = i;
                break;
            }
        }

        const list = [];
        const OCTAVE_NUM = 5;
        for (let i = 0; i < OCTAVE_NUM; i++) {
            for (let j = 0; j < intervals.length; j++) {
                const interval = Number(intervals[j]);
                list.push((i + 1) * 12 + rootIndex + interval);
            }
        }

        let html = '';
        for (let i = 0; i < list.length; i++) {
            const value = list[i];
            const octave = Math.floor(value / 12);
            const name = SCALE_LIST[value % 12];
            html += `<div class="small-button" onclick="BackingTab.toggleSoundName(this)">${name + octave}</div>`;
        }
        const listEl = document.getElementById('backing-test').children[3];
        listEl.innerHTML = html;
    }

    // static toggleSoundName(obj) {
    //     obj.classList.toggle('active');

    //     BackingTab.updateChannelStruct();
    // }

    // static updateChannelStruct() {
    //     const list = document.getElementById('backing-test').children[3].children;

    //     // 選択されている音のリストを作成する
    //     const indexList = [];
    //     const structs = [];
    //     for (let i = 0; i < list.length; i++) {
    //         const item = list[i];
    //         if (item.classList.contains('active')) {
    //             indexList.push(i);
    //             structs.push(item.innerHTML);
    //         }
    //     }

    //     const channelList = document.getElementById('backing-table-body').children;

    //     // チャンネルを全て空白にする
    //     for (let i = 0; i < channelList.length; i++) {
    //         const item = channelList[channelList.length - 1 - i];
    //         item.children[0].children[1].value = '';
    //     }
    //     // チャンネルに下から順に選択した音を割り当てる
    //     for (let i = 0; i < channelList.length; i++) {
    //         if (structs.length - 1 < i) break;
    //         // 逆から数える
    //         const item = channelList[channelList.length - 1 - i];
    //         item.children[0].children[1].value = structs[i];
    //     }

    //     //アサインフォームに値を入れる
    //     const assignEl = document.getElementById('backing-test').children[2].children[1];
    //     assignEl.value = indexList.join(',');
    // }

    // static syncStruct() {
    //     const assignEl = document.getElementById('backing-test').children[2].children[1];
    //     const swichElList = document.getElementById('backing-test').children[3].children;
    //     const indexList = assignEl.value.split(',');

    //     for (let i = 0; i < swichElList.length; i++) {
    //         swichElList[i].classList.remove('active');
    //     }
    //     for (let i = 0; i < indexList.length; i++) {
    //         const index = Number(indexList[i]);
    //         swichElList[index].classList.add('active');
    //     }
    // }

    static initSource() {
        const sourceEl = document.getElementById('backing-source').children[0];
        // const headerEl = document.getElementById('backing-table-header');
        // const bodyEl = document.getElementById('backing-table-body');
        // const velRootEl = document.getElementById('backing-velocity');
        sourceEl.value = JSON.stringify(BackingTab.curData, null, '  ');
    }

    static buildTable() {
        const rootEl = document.getElementById('backing-base');
        let measureInner = '';
        for (let i = 0; i < 17; i++) {
            let len = '';
            switch (i % 4) {
                case 0: len = 'len4'; break;
                case 1: case 3: len = 'len16'; break;
                case 2: len = 'len8'; break;
            }
            measureInner += `<div class="${len}">
                    <div></div>
                </div>
            `;
        }
        rootEl.innerHTML = `
            <div id="backing-editor" tabindex="999">
                <div id="backing-table-header">
                    <div>
                        <div onclick="BackingTab.shiftLayer(this)" class="active"><span>L-HAND</span></div>
                        <div onclick="BackingTab.shiftLayer(this)"><span>R-HAND</span></div>
                    </div>
                    <div></div>
                </div>
                <div id="backing-measure">${measureInner}</div>
                <div id="backing-table-body"></div>
                <div id="backing-velocity"></div>
            </div>
            <div>
                <canvas id="backing-piano-view"></canvas>
            </div>
        `;
    }

    static shiftLayer(obj) {

        BackingTab.mappingToJsonData();

        const list = obj.parentNode.children;
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('active');
        }
        obj.classList.add('active');
        BackingTab.mappingFromJsonData();
    }

    static addLine(activeLineNo) {
        const rootEl = document.getElementById('backing-table-body');
        const cnt = Number(rootEl.children.length);
        const name = cnt == 0 ? 'ROOT' : `CH${cnt}`;
        const html = `
            <div>
                <div onclick="BackingTab.selectLine(this)">
                    <div><span>${name}</span></div>
                    <input>
                </div>
                <div></div>
            </div>
        `;
        // 要素が1つもない場合
        if (activeLineNo == -1) {
            rootEl.insertAdjacentHTML('afterbegin', html);
        } else {
            const cur = rootEl.children[activeLineNo];
            cur.insertAdjacentHTML('beforebegin', html);
            const newLine = cur.previousElementSibling;
            newLine.children[1].innerHTML = cur.children[1].innerHTML;
        }
        // BackingTab.updateChannelStruct();
    }

    static selectLine(obj) {
        const lines = document.getElementById('backing-table-body').children;

        for (let i = 0; i < lines.length; i++) {
            const item = lines[i];
            if (obj != null && item == obj.parentNode) {
                item.classList.add('active');
                // 列の選択を解除
                BackingTab.selectLengthItem(null);
            } else {
                item.classList.remove('active');
            }
        }
    }

    static selectLengthItem(obj) {
        const lenList = document.getElementById('backing-table-header').children[1].children;
        const velList = document.getElementById('backing-velocity').children;
        let activeNo = -1;
        for (let i = 0; i < lenList.length; i++) {
            const item = lenList[i];
            if (item == obj) {
                item.classList.add('active');
                activeNo = i;
                // チャンネルの選択を解除
                BackingTab.selectLine(null);
            } else {
                item.classList.remove('active');
            }
        }

        const lines = document.getElementById('backing-table-body').children;
        for (let i = 0; i < lines.length; i++) {
            const inner = lines[i].children[1];
            const items = inner.children;
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                if (j == activeNo) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        }

        for (let i = 0; i < velList.length; i++) {
            const item = velList[i];
            if (i == activeNo) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    }

    static initCommandEvent() {
        const rootEl = document.getElementById('backing-editor');
        rootEl.addEventListener('keydown', function (e) {
            // alert(e.key);
            const activeColNo = BackingTab.getActiveColNo();
            const activeLineNo = BackingTab.getActiveLineNo();

            switch (e.key) {
                case 'a':
                    if (activeColNo != -1) {
                        BackingTab.insertNoteCol(activeColNo);
                    }
                    if (activeLineNo != -1) {
                        BackingTab.addLine(activeLineNo);
                    }
                    break;
                case 'Delete':
                    if (activeColNo != -1) {
                        BackingTab.delteNoteCol(activeColNo);
                    }
                    break;
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    if (activeColNo != -1) {
                        BackingTab.changeLength(activeColNo, BackingTab.getNoteLength(e.key));
                    }
                    break;
                case '.':
                    if (activeColNo != -1) {
                        BackingTab.toggleHalf(activeColNo);
                    }
                    break;
                case 'ArrowUp':
                    BackingTab.editVelocity(1);
                    break;
                case 'ArrowDown':
                    BackingTab.editVelocity(-1);
                    break;


                case ' ':
                    BackingTab.preview();
                    break;
            }
        });
    }

    static preview() {

        const testEl = document.getElementById('backing-test');
        const headerEl = document.getElementById('backing-table-header');
        const bodyEl = document.getElementById('backing-table-body');
        const velRootEl = document.getElementById('backing-velocity');
        const bpm = Number(testEl.children[0].children[1].value);
        const lenElList = headerEl.children[1].children;
        const lineList = bodyEl.children;
        const velList = velRootEl.children;
        const infoBeanList = [];

        for (let i = 0; i < lenElList.length; i++) {
            const items = lenElList[i].children[0].children;
            const rate = items[0].innerHTML;

            // 1小節の時間（ミリ秒）
            const sectionTime = 60000 / bpm * 4;
            let time = sectionTime / Number(rate);
            const isHalf = items[1].innerHTML == '.';
            if (isHalf) time *= 1.5;

            const bean = {};
            bean.len = time;

            const useChannels = [];
            for (let j = 0; j < lineList.length; j++) {
                const line = lineList[j];
                const channel = line.children[1].children[i];
                if (channel.classList.contains('right') ||
                    channel.classList.contains('left')) {
                    useChannels.push(j);
                }
            }
            bean.useChannels = useChannels;
            bean.component = lenElList[i];
            bean.velocity = Number(velList[i].children[0].children[0].innerHTML);
            infoBeanList.push(bean);
        }

        const sounds = [];
        for (let i = 0; i < lineList.length; i++) {
            const line = lineList[i];
            const name = line.children[0].children[1].value;
            const soundBean = {};
            soundBean.name = name;
            soundBean.index = BackingTab.getKeyIndex(name);
            sounds.push(soundBean);
        }
        // alert(infoBeanList[0].velocity);

        let startTime = 0;
        for (let i = 0; i < infoBeanList.length; i++) {
            const bean = infoBeanList[i];
            const id = setTimeout(() => {

                const useChannels = bean.useChannels;
                const velocity = bean.velocity * 0.03;
                BackingTab.selectLengthItem(bean.component);
                const keys = [];
                for (let j = 0; j < sounds.length; j++) {
                    if (!useChannels.includes(j)) continue;

                    synth.triggerAttack(sounds[j].name, '+0', velocity);
                    keys.push(sounds[j].index);
                }
                BackingTab.viewer.drawKeyboad(keys);
            }, startTime);
            startTime += bean.len;
        }
        // 全ての音を止める
        setTimeout(() => {
            synth.releaseAll();
            BackingTab.selectLengthItem(null);
            BackingTab.viewer.drawKeyboad([]);
        }, startTime);
    }

    static getKeyIndex(soundName) {
        const octave = Number(soundName.slice(-1)) - 1;
        const name = soundName.slice(0, -1);
        for (let i = 0; i < SCALE_LIST.length; i++) {
            if (SCALE_LIST[i] == name) return 3 + octave * 12 + i;
        }
        return -1;
    }

    static insertNoteCol(activeColNo) {
        const headerEl = document.getElementById('backing-table-header');
        const bodyEl = document.getElementById('backing-table-body');
        const velRootEl = document.getElementById('backing-velocity');

        let position = 'beforeend';
        let lenEl = headerEl.children[1];
        let velEl = velRootEl;
        if (activeColNo != -1) {
            position = 'afterend';
            lenEl = lenEl.children[activeColNo];
            velEl = velRootEl.children[activeColNo];
        }
        lenEl.insertAdjacentHTML(position, `
            <div class="note4" onclick="BackingTab.selectLengthItem(this)">
                <div><span>4</span><span></span></div>
            </div>
        `);
        const lineList = bodyEl.children;
        for (let i = 0; i < lineList.length; i++) {
            let innerEl = lineList[i].children[1];
            if (activeColNo != -1) {
                innerEl = lineList[i].children[1].children[activeColNo];
            }
            innerEl.insertAdjacentHTML(position, `
                <div class="note4"
                    onclick="BackingTab.toggleNote(this, false)"
                    oncontextmenu="BackingTab.toggleNote(this, true)"
                >
                    <div></div>
                </div>
            `);
        }
        velEl.insertAdjacentHTML(position, `
            <div class="note4">
                <div><div>5</div></div>
            </div>
        `);
        BackingTab.updateVelocity();
    }

    static delteNoteCol(activeColNo) {
        const lenRootEl = document.getElementById('backing-table-header').children[1];
        const bodyEl = document.getElementById('backing-table-body');
        const velRootEl = document.getElementById('backing-velocity');

        const lenEl = lenRootEl.children[activeColNo];
        const velEl = velRootEl.children[activeColNo];

        lenRootEl.removeChild(lenEl);

        const lineList = bodyEl.children;
        for (let i = 0; i < lineList.length; i++) {
            let innerRootEl = lineList[i].children[1];
            let innerCurEl = innerRootEl.children[activeColNo];
            innerRootEl.removeChild(innerCurEl);
        }
        velRootEl.removeChild(velEl);
    }

    static updateVelocity() {
        const velRootEl = document.getElementById('backing-velocity');
        const list = velRootEl.children;

        for (let i = 0; i < list.length; i++) {
            const item = list[i].children[0].children[0];
            let value = Number(item.innerHTML) * 10;
            item.style.height = value + '%';
        }
    }

    static editVelocity(val) {
        const velRootEl = document.getElementById('backing-velocity');
        const activeNo = BackingTab.getActiveColNo();
        if (activeNo == -1) return;
        const velEl = velRootEl.children[activeNo].children[0].children[0];
        let velocity = Number(velEl.innerHTML);
        velocity += val;
        if (velocity < 1) velocity = 1;
        else if (velocity > 10) velocity = 10;
        velEl.innerHTML = velocity;
        BackingTab.updateVelocity();
    }

    static setVelocity(activeNo, val) {
        const velRootEl = document.getElementById('backing-velocity');
        const velEl = velRootEl.children[activeNo].children[0].children[0];
        velEl.innerHTML = val;
    }

    static changeLength(activeNo, size) {
        const headerEl = document.getElementById('backing-table-header');
        const lines = document.getElementById('backing-table-body').children;
        const velRootEl = document.getElementById('backing-velocity');

        const target = headerEl.children[1].children[activeNo];
        target.children[0].innerHTML = `<span>${size.replace('note', '')}</span><span></span>`;
        // 付点がついていたら外す
        if (target.classList.contains('half')) {
            BackingTab.toggleHalf(activeNo);
        }
        BackingTab.replaceNoteLength(target, size);

        for (let i = 0; i < lines.length; i++) {
            const inner = lines[i].children[1];
            const items = inner.children;
            BackingTab.replaceNoteLength(items[activeNo], size);
        }
        BackingTab.replaceNoteLength(velRootEl.children[activeNo], size);
    }

    static getNoteLength(value) {
        switch (value) {
            case '2': return 'note16';
            case '3': return 'note8';
            case '4': return 'note4';
            case '5': return 'note2';
            case '6': return 'note1';
        }
    }

    static replaceNoteLength(obj, size) {
        const list = obj.classList;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.includes('note')) {
                list.remove(item);
                list.add(size);
            }
        }
    }

    static toggleHalf(activeNo) {
        const headerEl = document.getElementById('backing-table-header');
        const lines = document.getElementById('backing-table-body').children;
        const velRootEl = document.getElementById('backing-velocity');

        const target = headerEl.children[1].children[activeNo];
        target.classList.toggle('half');
        const hasDot = target.classList.contains('half');
        target.children[0].children[1].innerHTML = (hasDot ? '.' : '');

        for (let i = 0; i < lines.length; i++) {
            const inner = lines[i].children[1];
            const items = inner.children;
            items[activeNo].classList.toggle('half');
        }
        velRootEl.children[activeNo].classList.toggle('half');
    }

    static getActiveColNo() {
        const list = document.getElementById('backing-table-header').children[1].children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains('active')) return i;
        }
        return -1;
    }

    static getActiveLineNo() {
        const list = document.getElementById('backing-table-body').children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains('active')) return i;
        }
        return -1;
    }

    static toggleNote(obj, isRight) {
        const list = obj.classList;
        const hasLeft = list.contains('left');
        const hasRight = list.contains('right');

        list.remove('left');
        list.remove('right');

        if (isRight && hasRight || !isRight && hasLeft) {
            return;
        }
        if (!isRight) list.add('left');
        else list.add('right');

        const soundName = obj.parentNode.previousElementSibling.children[1].value;
        // alert(soundName);
        synth.triggerAttack(soundName, '+0', 0.15);
        BackingTab.viewer.drawKeyboad([BackingTab.getKeyIndex(soundName)]);
        setTimeout(() => {
            synth.triggerRelease(soundName);
            BackingTab.viewer.drawKeyboad([]);
        }, 500);
    }
}