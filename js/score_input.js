class ScoreInput {

    static buildNoteKeyEvent() {

        const baseEl = document.getElementById('score-note');
        const noteEl = baseEl.children[1];

        noteEl.addEventListener('keydown', function (e) {
            //  alert(`[${e.key}]`);
            const obj = ScoreTab.getSelectedItem();

            if (obj.classList.contains('init')) {
                const baseInfoEl = obj.children[1];
                const baseInfo = JSON.parse(baseInfoEl.innerHTML);
                const list = obj.children[0].children;
                const selectInitMode = function (isNext) {
                    let switchEl = null;
                    for (let i = 0; i < list.length; i++) {
                        const el = list[i];
                        if (el.classList.contains('active')) {
                            if (isNext) switchEl = el.nextElementSibling;
                            else switchEl = el.previousElementSibling;
                            if (switchEl != null) {
                                el.classList.remove('active');
                                switchEl.classList.add('active');
                            }
                            return;
                        }
                    }
                }
                const adjustInitValue = function (val) {
                    let selectedIndex = -1;
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].classList.contains('active')) selectedIndex = i;
                    }
                    switch (selectedIndex) {
                        case 0: // テンポ
                            baseInfo.tempo += val;
                            if (baseInfo.tempo < 50) baseInfo.tempo = 50;
                            if (baseInfo.tempo > 250) baseInfo.tempo = 250;
                            break;
                        case 1: // 拍子
                            baseInfo.rythm += val;
                            if (baseInfo.rythm < 0) baseInfo.rythm = 0;
                            if (baseInfo.rythm > RYTHM_LIST.length - 1) baseInfo.rythm = RYTHM_LIST.length - 1;
                            break;
                        case 2: // キー
                            baseInfo.rootKeyIndex += val;
                            if (baseInfo.rootKeyIndex < 0) baseInfo.rootKeyIndex = 0;
                            if (baseInfo.rootKeyIndex > 11) baseInfo.rootKeyIndex = 11;
                            break;
                        case 3: // スケール
                            baseInfo.scale += val;
                            if (baseInfo.scale < 0) baseInfo.scale = 0;
                            if (baseInfo.scale > SCALE_LIST.length - 1) baseInfo.scale = SCALE_LIST.length - 1;
                            break;
                    }
                    baseInfoEl.innerHTML = JSON.stringify(baseInfo);
                    ScoreTab.updateBaseInfo();
                }
                switch (e.key) {
                    case 'ArrowUp':
                        selectInitMode(false);
                        break;
                    case 'ArrowDown':
                        selectInitMode(true);
                        break;
                    case 'ArrowLeft':
                        adjustInitValue(-1);
                        break;
                    case 'ArrowRight':
                        adjustInitValue(1);
                        break;
                    case 'i':
                        ScoreTab.selectScoreItem(noteEl.children[2]);
                        break;
                }
                return;
            }

            let chordParams = null;
            let chordEl = null;
            let sectionEl = null;
            let editEl = null;
            if (obj.classList.contains('chord-range')) {
                chordEl = obj;
                chordParams = ScoreTab.getParams(obj);
            } else if (obj.classList.contains('section')) {
                sectionEl = obj;
            }
            const rootEl = document.getElementById('score-list-root');
            const list = rootEl.children;
            for (let i = 0; i < list.length; i++) {
                const objEl = list[i];
                if (objEl.classList.contains('edit')) editEl = objEl;
            }

            if (chordEl != null) {
                switch (e.key) {
                    case 'c':
                        if (chordParams != null && chordParams.degreeIndex != -1) {
                            ScoreFloatWnd.callSymbolListWnd(obj);
                        }
                        break;
                    case 'b':
                        if (chordParams != null && chordParams.degreeIndex != -1) {
                            ScoreFloatWnd.callBackingSelectorWnd(obj);
                        }
                        break;
                    case 'd':
                        if (chordParams != null && chordParams.degreeIndex != -1) {
                            chordParams.degreeIndex = -1;
                            chordParams.symbol = SYMBOL_PARAMS_LIST[0];
                            obj.children[5].innerHTML = JSON.stringify(chordParams);
                            ScoreTab.reloadChordRange(obj);
                        }
                        break;
                    case 'Delete':
                        obj.parentNode.removeChild(obj);
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7': {
                        const no = Number(e.key) - 1;
                        const scaleItem = DIATONIC_MAJOR_SCALE_JSONS[no];
                        chordParams.degreeIndex = scaleItem.degreeIndex;
                        chordParams.symbol = SYMBOL_PARAMS_LIST[scaleItem.symbolNo];
                        obj.children[5].innerHTML = JSON.stringify(chordParams);
                        ScoreTab.reloadChordRange(obj);
                    }
                        break;
                    case 'p':
                        if (chordParams != null && chordParams.asignSounds != null) {
                            const bpm = chordParams.baseInfo.tempo;
                            // 1小節の時間（ミリ秒）
                            const sectionTime = 60000 / bpm * 4;
                            let time = sectionTime / 4 * chordParams.sustain4;
                            playSynthSounds(chordParams.asignSounds.split(','), time);
                        }
                        break;
                    case 'o':
                        if (ScoreTab.timerQueue.length == 0) {
                            baseEl.classList.add('preview');
                            // const baseTime = new Date().getTime();
                            let lastPosSec = 0;
                            let startSec = -1;
                            let backingTaskList = [];
                            for (let i = 0; i < list.length; i++) {
                                const objEl = list[i];
                                if (objEl.classList.contains('chord-range')) {
                                    const curParams = ScoreTab.getParams(objEl);
                                    // 選択している要素からスタート
                                    if (startSec == -1) {
                                        if (objEl == chordEl) {
                                            startSec = curParams.posSec;
                                        } else {
                                            continue;
                                        }
                                    }
                                    const asignSounds = curParams.asignSounds.split(',');
                                    const asignIndexes = curParams.asignIndexes.split(',');
                                    const bpm = curParams.baseInfo.tempo;
                                    const beatTime = 60000 / bpm;
                                    const script = curParams.backingScript;
                                    const backingEnv = {};
                                    backingEnv.asignSounds = asignSounds;
                                    backingEnv.asignIndexes = asignIndexes;
                                    backingEnv.beatTime = beatTime;
                                    // let adjust = getAdjustTime(baseTime);
                                    // backingEnv.baseTime = baseTime;
                                    backingEnv.posSec = curParams.posSec - startSec;// - adjust;

                                    // 1小節の時間（ミリ秒）
                                    let time = beatTime * curParams.sustain4;
                                    const posSec = curParams.posSec - startSec;
                                    // const id = setTimeout(() => {
                                    //     ScoreTab.selectScoreItem(objEl);
                                    // }, posSec);

                                    if (script == null) {
                                        // playSynthSounds(asignSounds, time);
                                        // asignIndexes.map(Number);
                                        // ScoreFooterTab.pianoViewer.updateKeyboad();
                                    } else {
                                        // playBackingScript(backingEnv, script, ScoreTab.timerQueue);
                                        getBackingTask(backingEnv, script, backingTaskList);
                                    }
                                    // ScoreTab.timerQueue.push(id);
                                    lastPosSec = posSec + time;
                                }
                            }
                            
                            const baseTime = new Date().getTime();
                            for (let i = 0; i < backingTaskList.length; i++) {
                                const adjust = getAdjustTime(baseTime);
                                const task = backingTaskList[i];

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                    for (let k = 0; k < task.sounds.length; k++) {
                                        const soundName = task.sounds[k];
                                        synth.triggerAttack(soundName, '+0', task.velocity);
                                    }
                                }, task.curTime - adjust));
                                ;

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                }, task.curTime + task.noteTime - adjust));

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                    for (let k = 0; k < task.sounds.length; k++) {
                                        const soundName = task.sounds[k];
                                        synth.triggerRelease(soundName);
                                    }
                                }, task.curTime + task.endTime - adjust + 10));
                            }
                            for (let i = 0; i < backingTaskList.length; i++) {
                                const adjust = getAdjustTime(baseTime) - 1;
                                const task = backingTaskList[i];

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                    ScoreFooterTab.pianoViewer.downKeys(task.indexes, task.side);
                                }, task.curTime - adjust));

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                    ScoreFooterTab.pianoViewer.releaseKeys(task.indexes);
                                }, task.curTime + task.noteTime - adjust));

                                ScoreTab.timerQueue.push(setTimeout(() => {
                                    ScoreFooterTab.pianoViewer.resetSustain(task.indexes);
                                }, task.curTime + task.endTime - adjust));
                            }
                            // 最後まで到達したらプレビューを終了させる
                            ScoreTab.timerQueue.push(setTimeout(() => {
                                baseEl.classList.remove('preview');
                                ScoreTab.timerQueue.splice(0);
                            }, lastPosSec));
                        } else {
                            baseEl.classList.remove('preview');
                            ScoreTab.timerQueue.forEach(id => {
                                clearTimeout(id);
                            });
                            ScoreTab.timerQueue.splice(0);
                            synth.releaseAll();
                            ScoreFooterTab.pianoViewer.releaseAllKeys();
                        }
                        break;
                }
            }
            if (editEl == null) {

                const moveSection = function (isNext) {
                    let cur = obj;
                    let isMove = false;
                    while (true) {
                        if (isNext) cur = cur.nextElementSibling;
                        else cur = cur.previousElementSibling;
                        if (cur.classList.contains('section')) {
                            isMove = true;
                            break;
                        } else if (cur.classList.contains('start') || cur.classList.contains('end')) {
                            break;
                        }
                    }
                    if (isMove) {
                        obj.classList.remove('active');
                        cur.classList.add('active');
                        ScoreTab.selectScoreItem(cur);
                    }
                }

                // 共通操作
                switch (e.key) {
                    case 'ArrowUp': {
                        moveSection(false);
                        break;
                    }
                    case 'ArrowDown': {
                        moveSection(true);
                        break;
                    }
                    case 'ArrowLeft':
                        const prev = obj.previousElementSibling;
                        if (!prev.classList.contains('start')) {
                            ScoreTab.selectScoreItem(prev);
                        }
                        break;
                    case 'ArrowRight':
                        const next = obj.nextElementSibling;
                        if (!next.classList.contains('end')) {
                            ScoreTab.selectScoreItem(next);
                        }
                        break;
                    case 'a':
                        ScoreTab.addScoreChordItem(obj);
                        break;
                    case 's':
                        ScoreTab.addSectionItem(obj);
                        break;
                    case 'i':
                        ScoreTab.selectScoreItem(noteEl.children[0]);
                        break;
                    case ' ':
                        obj.classList.add('edit');
                        break;
                }
            } else {
                // 共通操作
                switch (e.key) {
                    case ' ':
                        obj.classList.remove('edit');
                        break;
                }

                if (chordEl != null) {
                    switch (e.key) {
                        case 'ArrowRight':
                            ScoreTab.incSustain(obj, 1);
                            ScoreTab.reloadChordRange(obj);
                            ScoreTab.updateBaseInfo();
                            break;
                        case 'ArrowLeft':
                            ScoreTab.incSustain(obj, -1);
                            ScoreTab.reloadChordRange(obj);
                            ScoreTab.updateBaseInfo();
                            break;
                        case 'ArrowUp':
                            ScoreTab.incDegreeIndex(obj, 1);
                            ScoreTab.reloadChordRange(obj);
                            break;
                        case 'ArrowDown':
                            ScoreTab.incDegreeIndex(obj, -1);
                            ScoreTab.reloadChordRange(obj);
                            break;
                    }
                } else if (sectionEl != null) {
                    const setSectionInfo = function (name, value) {
                        const paramsEl = sectionEl.children[2];
                        const params = JSON.parse(paramsEl.innerHTML);
                        params[name] = value;
                        paramsEl.innerHTML = JSON.stringify(params);
                        ScoreTab.reloadSection(sectionEl);
                    };
                    switch (e.key) {
                        case 'i': setSectionInfo('part', 'イントロ'); break;
                        case 'a': setSectionInfo('part', 'Aメロ'); break;
                        case 'b': setSectionInfo('part', 'Bメロ'); break;
                        case 'c': setSectionInfo('part', 'Cメロ'); break;
                        case 's': setSectionInfo('part', 'サビ'); break;
                        case 'k': setSectionInfo('part', '間奏'); break;
                        case 'o': setSectionInfo('part', 'アウトロ'); break;
                        case '0': setSectionInfo('partNo', null); break;
                        case '1':
                        case '2':
                        case '3': setSectionInfo('partNo', e.key); break;
                    }
                }
            }
        });

        const symbolWndEl = document.getElementById('chord-symbol-list');
        symbolWndEl.addEventListener('keydown', function (e) {
            ScoreFloatWnd.symbolWndOperation(e);
        });
        symbolWndEl.addEventListener('blur', function () {
            symbolWndEl.classList.add('hidden');
        });

        const backingWndEl = document.getElementById('score-backing-selector');
        backingWndEl.addEventListener('keydown', function (e) {
            ScoreFloatWnd.backinglWndOperation(e);
        });
        backingWndEl.addEventListener('blur', function () {
            backingWndEl.classList.add('hidden');
        });
    }

}