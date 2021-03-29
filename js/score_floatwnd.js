class ScoreFloatWnd {

    static callSymbolListWnd(obj) {
        const params = ScoreTab.getParams(obj);
        const wndEl = document.getElementById('chord-symbol-list');
        wndEl.classList.remove('hidden');
        wndEl.focus();

        const rect = obj.children[1].getBoundingClientRect();

        wndEl.style.left = rect.left + 'px';
        wndEl.style.top = rect.bottom + 'px';

        let html = '';
        const symbolList = getChordSymbolList();
        for (let i = 0; i < symbolList.length; i++) {
            const symbol = symbolList[i];
            let active = '';
            if (params.symbol != null && params.symbol.name == symbol.name) {
                active = 'class="active"';
            } else if (params.symbol == null && i == 0) {
                active = 'class="active"';
            }
            html += `
                <div ${active}>
                    <span>[${symbol.name}]</span>
                    <div class="param">${JSON.stringify(symbol)}</div>
                </div>
            `;
        }

        wndEl.children[0].innerHTML = html;

        const rootIndex = (params.baseInfo.rootKeyIndex + params.degreeIndex) % 12;
        ScoreTab.updateSymbolViewer(rootIndex, params.symbol.intervals);
    }


    static callBackingSelectorWnd(obj) {
        const params = ScoreTab.getParams(obj);
        const asignPlaces = params.asignPlaces;
        const wndEl = document.getElementById('score-backing-selector');
        wndEl.classList.remove('hidden');
        wndEl.focus();

        const rect = obj.children[1].getBoundingClientRect();

        wndEl.style.left = rect.left + 'px';
        wndEl.style.top = rect.bottom + 'px';

        const infoEl = wndEl.getElementsByClassName('info')[0];
        const editorEl = wndEl.getElementsByClassName('editor')[0];
        const patternEl = editorEl.getElementsByClassName('pattern')[0];
        const structEl = editorEl.getElementsByClassName('struct')[0];
        // const keyboadEl = wndEl.getElementsByClassName('keyboad')[0];

        const keyList = KEY12_SHARP_LIST;
        const intervals = params.symbol.intervals.split(',');
        const structs = [];
        for (let i = 0; i < intervals.length; i++) {
            const structIndex = params.baseInfo.rootKeyIndex + params.degreeIndex + Number(intervals[i]);
            structs.push(keyList[structIndex % 12]);
        }

        // 基本情報
        infoEl.innerHTML = `
            <div><span>chord:</span><span>${ScoreTab.getChordName(params)}</span></div>
            <div><span>length:</span><span>${params.sustain4}</span></div>
            <div><span>struct:</span><span>${structs.length} [${structs.join(' ,')}]</span></div>
        `;

        // バッキングパターン
        patternEl.innerHTML = '';
        const patternList = ScoreFloatWnd.getPatternList(params.sustain4);
        for(let i = 0; i < patternList.length; i ++) {
            const pattern = patternList[i];
            patternEl.innerHTML += `
                <div><span>${pattern.name}</span><span>[${pattern.channel}]</span></div>
            `;
        }

        // コードストラクト
        let structHtml = '';
        structHtml += '<div class="header">';
        const structNames = params.symbol.struct.split(',');
        for (let i = 0; i < structNames.length; i++) {
            structHtml += `<div><span>${intervals[i]} [${structNames[i]}]</span></div>`;
        }
        structHtml += '</div>';
        structHtml += '<div class="body">';
        for (let i = 0; i < 6; i++) {
            structHtml += '<div class="line">';
            structHtml += `<div class="octave"><span>octave${i + 1}</span></div>`;
            structHtml += '<div class="sounds">';
            for (let j = 0; j < intervals.length; j++) {
                const keyIndex = 3 + i * 12 + (params.baseInfo.rootKeyIndex + params.degreeIndex) % 12 + Number(intervals[j]);
                const value = getSoundNameFromKeyIndex(keyIndex);
                const asignParams = { index: keyIndex, soundName: value, place: `${i}-${j}` };
                let asigned = '';
                if (asignPlaces != null) {
                    asigned = asignPlaces.split(',').includes(`${i}-${j}`) ? 'class="active"' : '';
                }
                structHtml += `<div onclick="ScoreTab.toggleAsignSound(this)" ${asigned}>
                <span>${value}</span><div class="param">${JSON.stringify(asignParams)}</div>
            </div>`;
            }
            structHtml += '</div></div>';
        }
        structHtml += '</div>';
        structHtml += `<div class="asigns"></div>`;

        structEl.innerHTML = structHtml;

        ScoreTab.updateAsignSound();
    }
    
    static symbolWndOperation(e) {
        const noteEl = document.getElementById('score-list-root');
        const wndEl = document.getElementById('chord-symbol-list');
        const obj = ScoreTab.getSelectedItem();
        const chordParams = ScoreTab.getParams(obj);
        const symbolList = wndEl.children[0].children;
        let activeSymbolEl = null;
        for (let i = 0; i < symbolList.length; i++) {
            const symbolEl = symbolList[i];
            if (symbolEl.classList.contains('active')) activeSymbolEl = symbolEl;
        }
        // const symbolParams = JSON.parse(activeEl.children[1].innerHTML);

        const selectSymbol = function (isNext) {
            const target = !isNext ? activeSymbolEl.previousElementSibling : activeSymbolEl.nextElementSibling;
            if (target != null) {
                activeSymbolEl.classList.remove('active');
                target.classList.add('active');
                activeSymbolEl = target;
                const rootIndex = (chordParams.baseInfo.rootKeyIndex + chordParams.degreeIndex) % 12;
                const intervals = JSON.parse(target.children[1].innerHTML).intervals;
                ScoreTab.updateSymbolViewer(rootIndex, intervals);
            }
        }
        switch (e.key) {
            case 'ArrowUp':
                selectSymbol(false);
                break;
            case 'ArrowDown':
                selectSymbol(true);
                break;
            case 'c':
                wndEl.classList.add('hidden');
                noteEl.focus();
                break;
            case 'Enter':
                wndEl.classList.add('hidden');
                noteEl.focus();
                const paramsEl = obj.children[5];
                const params = JSON.parse(paramsEl.innerHTML);
                params.symbol = JSON.parse(activeSymbolEl.children[1].innerHTML);
                paramsEl.innerHTML = JSON.stringify(params);
                ScoreTab.reloadChordRange(obj);
                break;
        }
    }

    static backinglWndOperation(e) {
        const noteEl = document.getElementById('score-list-root');
        const wndEl = document.getElementById('score-backing-selector');
        const obj = ScoreTab.getSelectedItem();
        const chordParams = ScoreTab.getParams(obj);
        const outputEl = wndEl.children[1].children[1].children[2];
        switch (e.key) {
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case 'b':
                wndEl.classList.add('hidden');
                noteEl.focus();
                break;
            case 'Enter':
                wndEl.classList.add('hidden');
                noteEl.focus();
                chordParams.asignPlaces = outputEl.children[0].innerHTML;
                chordParams.asignSounds = outputEl.children[1].innerHTML;
                chordParams.asignIndexes = outputEl.children[2].innerHTML;
                obj.children[5].innerHTML = JSON.stringify(chordParams);
                break;
        }
    }

    static getPatternList(sustain4) {

        const list = [];
        const backingList = BACKING_SAMPLE_LIST;

        for(let i = 0; i < backingList.length; i ++) {
            const backing = backingList[i];
            if(backing.sustain4 == sustain4) {
                list.push(backing);
            }
        }
        return list;
    }
}