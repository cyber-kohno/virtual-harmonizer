class ScoreTab {

    static symbolViewer = new KeyboadViewer('symbol-view');
    static structViewer = new KeyboadViewer('struct-view');

    static timerQueue = [];

    static initScoreTab() {

        ScoreTab.symbolViewer.init(446, 106, 0, 0, 18, 3, 0.55, 0.6);
        ScoreTab.structViewer.init(1000, 86, 0, 0, 52, 3, 0.58, 0.6);

        ScoreTab.buildScoreNote();
        // ScoreTree.buildScoreTree();

        ScoreFooterTab.build();

        ScoreTab.initSelectElement();
    }

    static initSelectElement() {
        const rootEl = document.getElementById('score-list-root');
        ScoreTab.selectScoreItem(rootEl.children[2]);
    }

    static buildScoreNote() {
        ScoreTab.initDefaultElements(null);
        const rootEl = document.getElementById('score-list-root');
        rootEl.children[1].insertAdjacentHTML('afterend', ScoreTab.getSectionItemHtml(null));
        ScoreTab.updateBaseInfo();
        ScoreInput.buildNoteKeyEvent();
    }

    static getSelectedItem() {
        const rootEl = document.getElementById('score-list-root');
        const list = rootEl.children;
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.classList.contains('active')) return element;
        }
        return null;
    }

    static addSectionItem(cur) {
        cur.insertAdjacentHTML('afterend', ScoreTab.getSectionItemHtml(null));
        const newEl = cur.nextElementSibling;
        newEl.classList.add('new');
        setTimeout(() => {
            newEl.classList.remove('new');
        }, 300);

        // const outlineEl = document.getElementById('score-outline-root');
        // const nodeList = document.getElementById('score-list-root').children;
        // let cnt = -1;
        // for (let i = 0; i < nodeList.length; i++) {
        //     const node = nodeList[i];
        //     if (newEl == node) break;
        //     if (node.classList.contains('section')) cnt++;
        // }
        // outlineEl.children[cnt].insertAdjacentHTML('afterend', `
        //     <div><span>${newParams.part}</span></div>
        // `);

        const newParams = JSON.parse(newEl.children[2].innerHTML);

        ScoreTab.updateBaseInfo();
        ScoreTab.selectScoreItem(cur);
    }

    static getSectionItemHtml(params) {

        if (params == null) {
            params = {};
            params.type = 'section';
            params.part = 'Section';
            params.chNo = null;
            params.partNo = null;
        }

        const html = `
            <div class="section" onclick="ScoreTab.selectScoreItem(this)" onkeydown="ScoreTab.scoreItemKeyEvent(this, event)">
                <div><span>${params.part}</span></div>
                <div></div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;
        return html;
    }

    static addScoreChordItem(cur) {
        cur.insertAdjacentHTML('afterend', ScoreTab.getScoreChordItemHtml(null));
        // cur.insertAdjacentHTML('afterend', html);

        const newEl = cur.nextElementSibling;
        newEl.classList.add('new');
        newEl.classList.add('current');
        setTimeout(() => {
            newEl.classList.remove('new');
        }, 300);

        ScoreTab.updateBaseInfo();
        ScoreTab.selectScoreItem(cur.nextElementSibling);
    }

    static getScoreChordItemHtml(params) {

        if (params == null) {
            params = {};
            params.type = 'chord';
            params.baseInfo = null;
            params.degreeIndex = -1;
            // params.semitone = 'none';
            params.isFlat = true;
            params.symbol = SYMBOL_PARAMS_LIST[0]; //暫定で初期値メジャー3和音
            params.sustain4 = 2;
            params.sustain8 = 0;
            params.sustain16 = 0;
            params.denominator = null;
            params.posBar = -1;
            params.posBeat4 = -1;
            params.posBeat8 = -1;
            params.posBeat16 = -1;
            params.posSec = 0;
        }

        const html = `
            <div class="chord-range"
                onclick="ScoreTab.selectScoreItem(this)"
            >
                <div class="degree"></div>
                <div class="chord"></div>
                <div class="sustain"></div>
                <div class="pos-bar"></div>
                <div class="pos-sec"></div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;
        return html;
    }

    static updateBaseInfo() {
        const rootEl = document.getElementById('score-list-root');
        const outlineEl = document.getElementById('score-outline-root');
        outlineEl.innerHTML = '';
        const list = rootEl.children;
        let baseInfo = null;
        let posBar = 1;
        let prevPosBar = -1;
        let posBeat4 = 0;
        let pastSec = 0;
        let secIndex = 0;
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const isCurrent = element.classList.contains('active');
            // 初期値（テンポ、調子、キー）情報を取得
            if (element.classList.contains('init')) {
                baseInfo = JSON.parse(element.children[1].innerHTML);
                const initMenuElList = element.children[0].children;
                const tempoEl = initMenuElList[0].children[1];
                const rythmEl = initMenuElList[1].children[1];
                const rootKeyEl = initMenuElList[2].children[1];
                const scaleEl = initMenuElList[3].children[1];
                tempoEl.innerHTML = baseInfo.tempo;
                rythmEl.innerHTML = RYTHM_LIST[baseInfo.rythm];
                rootKeyEl.innerHTML = KEY12_SHARP_LIST[baseInfo.rootKeyIndex];
                scaleEl.innerHTML = SCALE_LIST[baseInfo.scale];
            }
            if (element.classList.contains('section')) {
                const paramsEl = element.children[2];
                const params = JSON.parse(paramsEl.innerHTML);
                params.no = secIndex;
                paramsEl.innerHTML = JSON.stringify(params);

                outlineEl.insertAdjacentHTML('beforeend', `
                    <div><span>${params.part}</span></div>
                `);
                secIndex++;
            }
            if (element.classList.contains('chord-range')) {
                const paramsEl = element.children[5];
                const params = JSON.parse(paramsEl.innerHTML);
                // 各ブロックに初期値をコピー
                params.baseInfo = baseInfo;

                // 現在位置を格納
                params.posBar = -1;
                params.posBeat4 = -1;
                if (prevPosBar != posBar) {
                    params.posBar = posBar;
                }
                if (posBeat4 > 0) {
                    params.posBeat4 = posBeat4;
                }
                prevPosBar = posBar;

                // 経過時間（秒）の格納
                params.posSec = pastSec;

                // 加算
                posBeat4 += params.sustain4;
                if (posBeat4 >= 4) {
                    posBar += Math.floor(posBeat4 / 4);
                    posBeat4 = posBeat4 % 4;
                }

                // 1小節の時間（ミリ秒）
                const sectionTime = 60000 / baseInfo.tempo * 4;
                let time = sectionTime / 4 * params.sustain4;
                // time *= 10;
                // time = Math.round(time);
                // time /= 10;
                pastSec += time;

                // パラメータの保存
                paramsEl.innerHTML = JSON.stringify(params);

                // ブロック表示の更新
                ScoreTab.reloadChordRange(element);
            }

            // サイドバー表示の更新
            if (isCurrent) {
                // const jsonEl = document.getElementById('score-element-json');
                // if (element.classList.contains('chord-range')) {
                //     const params = ScoreTab.getParams(element);
                //     jsonEl.value = JSON.stringify(params, null, 2);
                // }
                if (element.classList.contains('chord-range')) {
                    const rootEl = document.getElementById('score-detail-chord');
                    const params = ScoreTab.getParams(element);
                }
            }
        }
    }

    static incDegreeIndex(obj, addValue) {
        const paramsEl = obj.children[5];
        const params = JSON.parse(paramsEl.innerHTML);
        let degreeIndex = params.degreeIndex;
        degreeIndex += addValue;
        if (degreeIndex >= 12) {
            degreeIndex = 11;
        } else if (degreeIndex < 0) {
            degreeIndex = 0;
        }
        params.degreeIndex = degreeIndex;
        if (addValue > 0) params.isFlat = false;
        else if (addValue < 0) params.isFlat = true;
        paramsEl.innerHTML = JSON.stringify(params);
    }

    static incSustain(obj, addValue) {
        const paramsEl = obj.children[5];
        const params = JSON.parse(paramsEl.innerHTML);
        let sustain = params.sustain4;
        sustain += addValue;
        if (sustain > 8) {
            sustain = 8;
        } else if (sustain < 1) {
            sustain = 1;
        }
        params.sustain4 = sustain;
        paramsEl.innerHTML = JSON.stringify(params);
    }

    static reloadChordRange(obj) {
        const degreeEl = obj.children[0];
        const chordEl = obj.children[1];
        const sustainEl = obj.children[2];
        const posBarEl = obj.children[3];
        const posSecEl = obj.children[4];
        const paramsEl = obj.children[5];
        const params = JSON.parse(paramsEl.innerHTML);

        const symbol = params.symbol;

        // ディグリールートの更新
        let degreeNameHtml = `<span>blank</span>`;
        degreeEl.classList.add('blank');
        // ディグリーインデックスが設定済みであればディグリーネームを取得する
        if (params.degreeIndex != -1) {
            const degreeList = params.isFlat ? DEGREE12_FLAT_LIST : DEGREE12_SHARP_LIST;
            const degreeName = `${degreeList[params.degreeIndex]}${symbol.name}`;
            degreeNameHtml = `<span>${degreeName}</span>`;
            degreeEl.classList.remove('blank');
            degreeEl.classList.remove('diatonic');
            if (DIATONIC_MAJOR_SCALE_DEGREE_NAMES.includes(degreeName)) {
                degreeEl.classList.add('diatonic');
            }
        }
        degreeEl.innerHTML = degreeNameHtml;

        // コードネームの更新
        let chordNameHtml = `<span>-</span>`;
        // ディグリーインデックスが設定済みであればコードネームを取得する
        if (params.degreeIndex != -1) {
            chordNameHtml = `<span>${ScoreTab.getChordName(params)}</span>`;
        }
        chordEl.innerHTML = chordNameHtml;

        // 持続の更新
        let sustainHtml = '';
        for (let i = 0; i < params.sustain4; i++) {
            sustainHtml += '<span></span>';
        }
        sustainEl.innerHTML = sustainHtml;

        // 現在位置の更新
        let posBar = params.posBar == -1 ? '' : params.posBar;
        let posBeat4 = params.posBeat4 == -1 ? '' : params.posBeat4;
        const pos1Html = `<span>${posBar}</span><span>${posBeat4}</span>`;
        posBarEl.innerHTML = pos1Html;

        const dispPosSec = params.posSec / 1000;
        posSecEl.innerHTML = `<span>${dispPosSec.toFixed(2)}s</span>`

        //コードストラクトの更新
        ScoreTab.setDefaultBackingAsigns(params);
        ScoreTab.setDefaultBackingScript(params);
        paramsEl.innerHTML = JSON.stringify(params);
    }

    static reloadSection(obj) {
        const paramsEl = obj.children[2];
        const params = JSON.parse(paramsEl.innerHTML);
        const part = params.part == null ? '' : params.part;
        const partNo = params.partNo == null ? '' : params.partNo;
        const value = `${part}${partNo}`;
        obj.children[0].children[0].innerHTML = value;

        const outlineEl = document.getElementById('score-outline-root');
        outlineEl.children[params.no].innerHTML = `<span>${value}</span>`;
    }

    static getChordName(params) {
        const keyList = params.isFlat ? KEY12_FLAT_LIST : KEY12_SHARP_LIST;
        return `${keyList[(params.baseInfo.rootKeyIndex + params.degreeIndex) % 12]}${params.symbol.name}`;
    }

    static initDefaultElements(initParams) {
        const rootEl = ScoreTab.getTimelineRootEl();
        // const outlineEl = document.getElementById('score-outline-root');
        // outlineEl.innerHTML = `
        //     <div class="active"><span>Section</span></div>
        // `;
        rootEl.innerHTML = `
            ${ScoreTab.getInitItemHtml(initParams)}
            <div class="start">
                <span>START</span>
            </div>
            <div class="end">
                <span>END</span>
            </div>
        `;
    }

    static getInitItemHtml(params) {
        if (params == null) {
            params = {};
            params.type = 'init'
            params.tempo = 100;
            params.rythm = 0;
            params.rootKeyIndex = 0;
            params.scale = 0;
        }
        const html = `
            <div class="init" onclick="ScoreTab.selectScoreItem(this)">
                <div>
                    <div><span>temp: </span><span></span></div>
                    <div><span>rythm: </span><span></span></div>
                    <div><span>key: </span><span></span></div>
                    <div><span>scale: </span><span></span></div>
                </div>
                <div class="param">${JSON.stringify(params)}</div>
            </div>
        `;
        return html;
    }

    static getTimelineRootEl() {
        return document.getElementById('score-note').children[1];
    }

    static selectScoreItem(obj) {

        const list = ScoreTab.getTimelineRootEl().children;

        let curSection = -1;
        let selectedSection = -1;
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const sectionEl = el.classList.contains('section') ? el : null;
            const initEl = el.classList.contains('init') ? el : null;
            const chordEl = el.classList.contains('chord-range') ? el : null;
            if (sectionEl != null) {
                const params = JSON.parse(sectionEl.children[2].innerHTML);
                curSection = params.no;
            }
            if (initEl != null) {
                const initMenuList = initEl.children[0].children;
                for (let i = 0; i < initMenuList.length; i++) {
                    initMenuList[i].classList.remove('active');
                }
            }
            el.classList.remove('current');
            el.classList.remove('active');
            el.classList.remove('edit');

            // 選択した要素に対しての処理
            if (el == obj) {
                el.classList.add('active');
                const rootEl = document.getElementById('score-detail').children[0];
                rootEl.innerHTML = '';
                if (initEl != null) {
                    initEl.children[0].children[0].classList.add('active');
                    const baseInfoEl = initEl.children[1];
                    const baseInfo = JSON.parse(baseInfoEl.innerHTML);
                    rootEl.innerHTML = ScoreSideBar.getInitializeAreaHtml(baseInfo);
                } else {
                    selectedSection = curSection;

                    // セクションの更新
                    const list = document.getElementById('score-note').children[0].children;
                    for (let i = 0; i < list.length; i++) {
                        const secEl = list[i];
                        secEl.classList.remove('active');
                    }
                    list[curSection].classList.add('active');

                    // サイドバーの更新
                    // const jsonEl = document.getElementById('score-element-json');
                    // jsonEl.value = '';
                    // if (chordEl != null) {
                    //     const params = ScoreTab.getParams(chordEl);
                    //     jsonEl.value = JSON.stringify(params, null, 2);
                    // }
                    if (chordEl != null) {
                        const params = JSON.parse(chordEl.children[5].innerHTML);
                        rootEl.innerHTML = ScoreSideBar.getChordAreaHtml(params);
                    } else if (sectionEl != null) {
                        const params = JSON.parse(sectionEl.children[2].innerHTML);
                        rootEl.innerHTML = ScoreSideBar.getSectionAreaHtml(params);
                    }
                }
            }
        }

        // 現在のセクションに含まれる要素にスタイルをつける
        curSection = -1;
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            const sectionEl = el.classList.contains('section') ? el : null;
            if (sectionEl != null) {
                const params = JSON.parse(sectionEl.children[2].innerHTML);
                curSection = params.no;
            }
            if (curSection == selectedSection) {
                el.classList.add('current');
            }
        }
    }

    static toggleAsignSound(obj) {
        obj.classList.toggle('active');
        ScoreTab.updateAsignSound();
    }

    static updateAsignSound() {
        const wndEl = document.getElementById('score-backing-selector');

        const outputEl = wndEl.children[1].children[1].children[2];
        const lineList = wndEl.children[1].children[1].children[1].children;
        const values = [];
        const indexes = [];
        const sounds = [];
        for (let i = 0; i < lineList.length; i++) {
            const soundList = lineList[i].children[1].children;
            for (let j = 0; j < soundList.length; j++) {
                const soundEl = soundList[j];
                if (soundEl.classList.contains('active')) {
                    const params = JSON.parse(soundEl.children[1].innerHTML);
                    values.push(params.place);
                    indexes.push(params.index);
                    sounds.push(params.soundName);
                }
            }
        }

        outputEl.innerHTML = `
            <span>${values.join(',')}</span>
            <div class="param">${sounds.join(',')}</div>
            <div class="param">${indexes.join(',')}</div>
        `;
        ScoreTab.updateStructViewer(indexes);
    }

    static updateStructViewer(keys) {
        ScoreTab.structViewer.drawKeyboad(keys);
    }

    static isDisplayFloatWnd() {
        const isDisplaySymbolWnd = !document.getElementById('chord-symbol-list').classList.contains('hidden');
        const isDisplayBackingWnd = !document.getElementById('score-backing-selector').classList.contains('hidden');
        return isDisplaySymbolWnd || isDisplayBackingWnd;
    }

    static updateSymbolViewer(rootIndex, intervals) {
        const list = intervals.split(',');
        const keys = [];
        for (let i = 0; i < list.length; i++) {
            keys.push(3 + rootIndex + Number(list[i]));
        }
        ScoreTab.symbolViewer.drawKeyboad(keys);
    }

    static getParams(obj) {
        const paramsEl = obj.children[5];
        const params = JSON.parse(paramsEl.innerHTML);
        return params;
    }

    static setDefaultBackingAsigns(params) {
        const rootKeyIndex = params.baseInfo.rootKeyIndex;
        const degreeIndex = params.degreeIndex;
        const intervals = params.symbol.intervals.split(',');

        const places = '1-0,1-2,2-0,2-1,2-2,3-0';
        const indexes = [];
        const sounds = [];
        // 6オクターブ分処理する
        for (let i = 0; i < 6; i++) {

            for (let j = 0; j < intervals.length; j++) {
                const isUse = places.split(',').includes(`${i}-${j}`);
                if (isUse) {
                    const interval = Number(intervals[j]); console.log(intervals[j]);
                    const keyIndex = 3 + i * 12 + (rootKeyIndex + degreeIndex) % 12 + interval;
                    const value = getSoundNameFromKeyIndex(keyIndex);
                    indexes.push(keyIndex);
                    sounds.push(value);
                }
            }
        }
        params.asignIndexes = indexes.join(',');
        params.asignPlaces = places;
        params.asignSounds = sounds.join(',');

        return params;
    }

    static setDefaultBackingScript(params) {
        const sustain4 = params.sustain4;
        let script = null;
        switch (sustain4) {
            case 4:
                script = getBacking(4, 'pops01');
                break;
            case 2:
                script = getBacking(2, 'pops01');
                break;
            case 3:
                script = getBacking(3, 'ballad01');
                break;
        }
        params.backingScript = script;

        return params;
    }
}