
var timerIdList = new Array();
var nextBacking = null;
var isPlay = false;
var sustain = false;
var autoSustain = false;

var keyPressList = {};

const ALPHABETS = Array.apply(null, new Array(26)).map((v, i) => {
    return String.fromCharCode('a'.charCodeAt(0) + i);
});

const SCALE_TO_SUB = [0, 2, 4, 5, 7, 9, 11]

const SYMBOL = {
    // TRIAD
    MAJOR: ['', [0, 4, 7]],
    MINOR: ['m', [0, 3, 7]],
    AUGUMENT: ['aug', [0, 5, 8]],
    DIMINISH: ['dim', [0, 3, 6]],
    SUS4: ['sus4', [0, 5, 7]],
    MINOR_MINUS5: ['m(-5)', [0, 3, 6]],
    //TETRAD    
    MAJOR_7TH: ['maj7', [0, 4, 7, 11]],
    MINOR_7TH: ['m7', [0, 3, 7, 10]],
    SEVENTH: ['7', [0, 4, 7, 10]],
    MINOR_7TH_MINUS5: ['m7(-5)', [0, 4, 7, 10]],
}

function buildChordBox() {
    buildDiatonicChordItem();
    build7ThChordItem();
    buildSus4ChordItem();
    buildParallelChordItem();
    buildSecondalyDominantChordItem();
    buildSecondalyDominantNonRootChordItem();

    /* キーの初期値としてC majorを設定 */
    setSelectedKey(0);

    setAllScaleChordName();

    const list = [];
    drawKeyboad(list);

    buildBackingPlate();

    const rootEl = document.getElementById('system_cont-test');
    rootEl.addEventListener('keydown', function (e) {
        // alert(`[${e.key}]`);
        for (let i = 0; i < ALPHABETS.length; i++) {
            const value = ALPHABETS[i];
            if (e.key === value) {
                selectPatternKey(value);
                break;
            }
        }
        if (e.key === ' ') {
            sustainOn();
            // audioElm.play();
        }


        if (e.key === 'ArrowLeft') {
            setSelectTab('test-footer', 0);
        }
        if (e.key === 'ArrowUp') {
            setSelectTab('test-footer', 1);
        }
        if (e.key === 'ArrowRight') {
            setSelectTab('test-footer', 2);
        }
        if (e.key === 'ArrowDown') {
            if(!autoSustain) {
                autoSustain = true;
                sustainOn();
            } else {
                autoSustain = false;
                sustainOff();
            }
        }
    });
    rootEl.addEventListener('keyup', function (e) {
        if (e.key === ' ') {
            sustainOff()
        }
    });

    buildSessionTab();

    selectPatternKey('a');
}

function sustainOn() {
    this.sustain = true;
    const sustainEl = document.getElementById('sustain');
    sustainEl.classList.add('active');
}

function sustainOff() {
    this.sustain = false;
    updateRelease();
    const sustainEl = document.getElementById('sustain');
    sustainEl.classList.remove('active');
}

function buildDiatonicChordItem() {
    // return `
    //     <div class="chord-item" onmousedown="hoge()" onmouseup="releaseSynth()">${name}</div>
    // `;

    const list = new Array();
    list.push(getDataCode(0, 0, SYMBOL.MAJOR));
    list.push(getDataCode(0, 1, SYMBOL.MINOR));
    list.push(getDataCode(0, 2, SYMBOL.MINOR));
    list.push(getDataCode(0, 3, SYMBOL.MAJOR));
    list.push(getDataCode(0, 4, SYMBOL.MAJOR));
    list.push(getDataCode(0, 5, SYMBOL.MINOR));
    list.push(getDataCode(0, 6, SYMBOL.MINOR_MINUS5));
    buildColLines('DIATONIC<br>TRIAD', list);
}

function build7ThChordItem() {

    const list = new Array();
    list.push(getDataCode(0, 0, SYMBOL.MAJOR_7TH));
    list.push(getDataCode(0, 1, SYMBOL.MINOR_7TH));
    list.push(getDataCode(0, 2, SYMBOL.MINOR_7TH));
    list.push(getDataCode(0, 3, SYMBOL.MAJOR_7TH));
    list.push(getDataCode(0, 4, SYMBOL.SEVENTH));
    list.push(getDataCode(0, 5, SYMBOL.MINOR_7TH));
    list.push(getDataCode(0, 6, SYMBOL.MINOR_7TH_MINUS5));
    buildColLines('DIATONIC<br>7TH', list);
}

function buildSus4ChordItem() {

    const list = new Array();
    list.push(getDataCode(0, 0, SYMBOL.SUS4));
    list.push(null);
    list.push(null);
    list.push(null);
    list.push(getDataCode(0, 4, SYMBOL.SUS4));
    list.push(getDataCode(0, 5, SYMBOL.SUS4));
    list.push(null);
    buildColLines('SUS4', list);
}

function buildParallelChordItem() {

    const list = new Array();
    list.push(getDataCode(0, 0, SYMBOL.MINOR));
    // list.push(null);
    list.push(getDataCode(0, 1, SYMBOL.MAJOR));
    list.push(getDataCode(2, 2, SYMBOL.MAJOR));
    list.push(getDataCode(0, 3, SYMBOL.MINOR));
    list.push(getDataCode(0, 4, SYMBOL.MINOR));
    list.push(getDataCode(2, 5, SYMBOL.MAJOR));
    list.push(getDataCode(2, 6, SYMBOL.MAJOR));
    buildColLines('PARALLEL', list);
}

function buildSecondalyDominantChordItem() {

    const list = new Array();
    list.push(null);
    list.push(getDataCode(0, 5, SYMBOL.SEVENTH));
    list.push(getDataCode(0, 6, SYMBOL.SEVENTH));
    list.push(getDataCode(0, 0, SYMBOL.SEVENTH));
    list.push(getDataCode(0, 1, SYMBOL.SEVENTH));
    list.push(getDataCode(0, 2, SYMBOL.SEVENTH));
    list.push(null);
    buildColLines('SECONDARY<br>DOMINANT', list);
}

function buildSecondalyDominantNonRootChordItem() {

    const list = new Array();
    list.push(null);
    list.push(getDataCode(1, 0, SYMBOL.DIMINISH));
    list.push(getDataCode(1, 1, SYMBOL.DIMINISH));
    list.push(getDataCode(0, 2, SYMBOL.DIMINISH));
    list.push(getDataCode(1, 3, SYMBOL.DIMINISH));
    list.push(getDataCode(1, 4, SYMBOL.DIMINISH));
    list.push(null);
    buildColLines('SECONDARY<br>NON ROOT', list);
}


function buildColLines(header, dataList) {

    const tableRootEl = document.getElementById('chord-box').children[0].children[0];

    tableRootEl.children[0].insertAdjacentHTML('beforeend', `<th>${header}</th>`);

    for (let i = 0; i < dataList.length; i++) {
        const paramStr = dataList[i];
        let html = '<td class="disable"></td>';
        if (paramStr != null) {
            const params = paramStr.split('&');
            const degreeName = params[0];
            const param = params[1];
            const subIndexList = params[2];
            html = `
            <td onclick="playSynth(this, '${subIndexList}')" oncontextmenu="reservationSynth(this, '${subIndexList}')" tabindex="999" onkeydown="playSynthOne(event, this, '${subIndexList}')">
                <span>${degreeName}</span>
                <span></span>
                <div class="param">${param}</span>
            </td>
        `;
        }
        tableRootEl.children[i + 1].insertAdjacentHTML('beforeend', html);
    }
}

function getDataCode(sf, digSub, symbol) {

    let digName = '';
    switch (digSub) {
        case 0: digName = 'Ⅰ'; break;
        case 1: digName = 'Ⅱ'; break;
        case 2: digName = 'Ⅲ'; break;
        case 3: digName = 'Ⅳ'; break;
        case 4: digName = 'Ⅴ'; break;
        case 5: digName = 'Ⅵ'; break;
        case 6: digName = 'Ⅶ'; break;
    }
    let sfName = '';
    switch (sf) {
        case 1: sfName = '#'; break;
        case 2: sfName = '♭'; break;
    }
    const degChord = sfName + digName + symbol[0];
    const half = sf == 0 ? 0 : (sf == 1 ? 1 : -1);
    const scaleSub = SCALE_TO_SUB[digSub] + half;
    const chordStructs = symbol[1];
    let structs = [];
    for (let i = 0; i < chordStructs.length; i++) {
        structs.push(chordStructs[i] + scaleSub);
    }
    const params = `${scaleSub},${symbol[0]}`;
    return degChord + '&' + params + '&' + structs;
}

function playSynth(obj, str) {
    const patternKey = getSelectedPatternKey();
    const backingScript = getBackingScript(patternKey);

    obj.style.backgroundColor = '#ff0';
    setTimeout(() => {
        obj.style.backgroundColor = '';
    }, 200);

    isPlay = true;

    const params = backingScript[0];
    const scores = backingScript[1];
    const bpm = getBPM();
    const divid = scores.length;
    const backingLenght = 1000 / Number(params[0]) * divid;
    // alert('notes: ' + notes);
    // alert('bpm: ' + bpm);

    const values = str.split(',');
    const root = getSelectedKeyIndex();
    const list = [];
    for (let i = 0; i < values.length; i++) {
        const sub = root + Number(values[i]);
        const octave = 3 + Math.floor(sub / 12);
        list.push(3 + (sub % 12) + octave * 12);
    }

    const sectionTime = backingLenght * 60 / bpm * 4;
    const interval = sectionTime / divid;

    // 演奏終了時
    setTimeout(() => {
        isPlay = false;
        if (nextBacking != null) {
            nextBacking();
            nextBacking = null;
        }
        runBacking(-1);
    }, sectionTime);

    // synthReleaseAll();
    for (let i = 0; i < divid; i++) {
        const id = setTimeout(() => {
            runBacking(i);
            const notes = scores[i];
            for (let j = 0; j < notes.length; j++) {
                const noteIndex = notes[j][0];
                if (noteIndex > list.length - 1) continue;
                const adjust = notes[j][1] * 12;
                attackSynth(list[noteIndex] + adjust, interval);
            }
            if (autoSustain && i == 0) {
                setTimeout(() => {
                    sustainOff();
                }, 50);
                setTimeout(() => {
                    sustainOn();
                }, interval - 50);
            }
        }, i * interval);
        timerIdList.push(id);
    }

    // drawKeyboad(list);
}

function runBacking(val) {

    const records = document.getElementById('backing-table').children[0].children[0].children;
    for (let i = 0; i < records.length; i++) {
        const cells = records[i].children;
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (val == j || val == -1) {
                cell.classList.remove('disable');
            } else {
                cell.classList.add('disable');
            }
        }
    }
}

function reservationSynth(obj, str) {
    if (isPlay) {
        nextBacking = function () {
            playSynth(obj, str);
        }
    } else {
        playSynth(obj, str);
    }
}

function switchPedal() {

}

function synthReleaseAll() {

    synth.releaseAll();
    for (let i = 0; i < timerIdList.length; i++) {
        clearTimeout(timerIdList[i]);
    }
    timerIdList = new Array();
}

function playSynthOne(event, obj, str) {
    const nums = ['1', '2', '3', '4', '5', '6'];
    if (!nums.includes(event.key)) return;

    const soundKey = Number(event.key) - 1;

    obj.style.backgroundColor = '#aaf';
    setTimeout(() => {
        obj.style.backgroundColor = '';
    }, 200);

    const values = str.split(',');
    const root = getSelectedKeyIndex();
    const list = [];
    // synthReleaseAll();
    for (let i = 0; i < values.length; i++) {
        const sub = root + Number(values[i]);
        const octave = 3 + Math.floor(sub / 12);
        list.push(3 + (sub % 12) + octave * 12);
    }

    // let isOctaveDown = list[0] > 50;
    for (let i = 0; i < list.length; i++) {
        if (soundKey != i) {
            continue;
        }
        // if (isOctaveDown) list[i] -= 12;
        const value = list[i];
        // synth.triggerAttack(getSoundNameFromKeyIndex(value));
        attackSynth(value, 500);
    }

}

function attackSynth(noteIndex, noteTime) {
    const soundName = getSoundNameFromKeyIndexTest(noteIndex);
    // if(keyPressList[soundName] || this.sustain) {
    //     console.log('RESET:: ' + soundName);
    //     synth.triggerRelease(soundName);
    // }
    synth.triggerAttack(soundName, '+0', 0.15);

    setTimeout(() => {
        keyPressList[soundName].isPress = false;
        updateRelease();
        updateKeyboad();
    }, noteTime);
    keyPressList[soundName] = { index: noteIndex, isPress: true };

    updateKeyboad();
}

function getSoundNameFromKeyIndexTest(value) {
    value -= 3;
    const scaleName = KEY12_MAJOR_LIST[value % 12];
    const octave = Math.floor(value / 12);
    return scaleName + octave;
}

function updateKeyboad() {
    const list = new Array();
    for (let key in keyPressList) {
        if (keyPressList[key].isPress) list.push(keyPressList[key].index);
    }
    drawKeyboad(list);
}

function updateRelease() {
    if (this.sustain) return;
    let str = 'STOP:: '
    for (let key in keyPressList) {
        const isPress = keyPressList[key].isPress;
        // synth.triggerRelease(key);
        if (!isPress) {
            for (let i = 0; i < 5; i++) {
                synth.triggerRelease(key);
            }
            // synth.releaseAll();
            str += key + ', ';
        }
    }
    console.log(str);

}

function setAllScaleChordName() {

    const tableRootEl = document.getElementById('chord-box').children[0].children[0];

    const thElList = tableRootEl.children;
    const selectedKeyIndex = getSelectedKeyIndex();

    /* ヘッダーは除外するので1から走査する */
    for (let i = 1; i < thElList.length; i++) {
        const tdList = thElList[i].children;
        for (let j = 0; j < tdList.length; j++) {
            const tdEl = tdList[j];
            if (tdEl.innerHTML == '') continue;
            const scaleChordEl = tdEl.children[1];
            const params = tdEl.children[2].innerHTML.split(',');
            const scaleSub = Number(params[0]);
            const symbolName = params[1];
            const chord = KEY12_SHARP_LIST[(scaleSub + selectedKeyIndex) % 12] + symbolName;
            scaleChordEl.innerHTML = chord;
            // scaleChordEl.style.color = 'rgba(255, 255, 0, 1)';
            scaleChordEl.style.opacity = '0';
            setTimeout(() => {
                // scaleChordEl.style.color = '';
                scaleChordEl.style.opacity = '';
            }, 200);
        }
    }
}

function buildTuningBox() {

    const tuningEl = document.getElementById('tuning');

    for (let i = 0; i < KEY12_SHARP_LIST.length; i++) {
        const name = KEY12_SHARP_LIST[i];
        tuningEl.insertAdjacentHTML('beforeend', `
            <div class="key-item" onclick="selectKey(this)">
                <span>${name} major</span>
                <div class="param">${i}</div>
            </div>
        `);
    }
}

function selectKey(obj) {

    const list = document.getElementById('tuning').children;

    for (let i = 0; i < list.length; i++) {
        list[i].classList.remove('active');
    }
    obj.classList.add('active');

    setAllScaleChordName();
}

function setSelectedKey(keyIndex) {

    const list = document.getElementById('tuning').children;

    for (let i = 0; i < list.length; i++) {
        list[i].classList.remove('active');
    }
    list[keyIndex].classList.add('active');
}

function getSelectedKeyIndex() {

    const list = document.getElementById('tuning').children;

    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('active')) return i;
    }
    return -1;
}

