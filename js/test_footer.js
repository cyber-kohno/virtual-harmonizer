var audioElm = null;


function buildBackingPlate() {
    const plateEl = document.getElementById('backing-plate');

    let html = '';
    for (let i = 0; i < ALPHABETS.length; i++) {
        const value = ALPHABETS[i];
        html += `<div class="pattern-panel" id="pattern_key_${value}"
            onclick="selectPatternKey('${value}')">${value}</div>`;
    }
    plateEl.innerHTML = html;
}

function getSelectedPatternKey() {

    for (let i = 0; i < ALPHABETS.length; i++) {
        const value = ALPHABETS[i];
        const keyEl = document.getElementById(`pattern_key_${value}`);
        if (keyEl.classList.contains('active')) return value;
    }
    return null;

}

function selectPatternKey(key) {
    for (let i = 0; i < ALPHABETS.length; i++) {
        const value = ALPHABETS[i];
        const keyEl = document.getElementById(`pattern_key_${value}`);
        if (value === key) keyEl.classList.add('active');
        else keyEl.classList.remove('active');
    }

    buildBackingTable();
}

function buildBackingTable() {
    const tableEl = document.getElementById('backing-table');

    const patternKey = getSelectedPatternKey();
    const backingScript = getBackingScript(patternKey);

    const params = backingScript[0];
    const scores = backingScript[1];
    // const bpm = getBPM();
    const divid = scores.length;
    const noteValue = Number(params[0]);
    const backingLenght = 1000 / noteValue * divid;

    let inner = '';
    const middle = 4 * 2 - 1;
    for (let i = 0; i < 12; i++) {
        inner += `<tr>`;
        for (let j = 0; j < divid; j++) {
            const notes = scores[j];
            let activeClass = '';
            for (let k = 0; k < notes.length; k++) {
                const note = notes[k];
                const value = middle - note[0] - 4 * note[1];
                if (value == i) {
                    activeClass = ' active';
                    break;
                }
            }
            inner += `<td class="divid${noteValue}${activeClass}"></td>`;
        }
        inner += `</tr>`;
    }
    tableEl.innerHTML = `
        <table>${inner}<table>
    `;
}

function getBackingScript(patternKey) {
    switch (patternKey) {
        case 'a': return [
            [2],
            [
                [[0, -1], [1, 0], [2, 0], [3, 0]]
            ]
        ];
        case 's': return [
            [8],
            [
                [[0, -1], [1, 0], [2, 0]],
                [],
                [[1, 0], [2, 0], [3, 0]],
                [[0, 0]],
            ]
        ];
        case 'd': return [
            [8],
            [
                [[0, -1], [1, 0], [2, 0]],
                [[0, 0]],
                [[1, 0], [3, 0]],
                [[2, 0]],
            ]
        ];
        case 'f': return [
            [16],
            [
                [[0, -1], [1, 0], [2, 0], [3, 0]],
                [],
                [[1, 0]],
                [[2, 0], [3, 0]],
                [],
                [[1, 0]],
                [[2, 0], [3, 0]],
                [[1, 0]]
            ]
        ];
        case 'g': return [
            [16],
            [
                [[0, -1]],
                [],
                [[1, 0], [2, 0], [3, 0]],
                [],
                [[0, -1], [2, 0], [3, 0]],
                [],
                [[1, 0], [2, 0]],
                [[0, 0]]
            ]
        ];
        case 'h': return [
            [2],
            [
                [[0, -1], [1, 0]],
                [[2, 0], [3, 0]]
            ]
        ];
        case 'j': return [
            [8],
            [
                [[0, -1], [1, 0], [2, 0], [3, 0]],
                [[1, 0]],
                [[2, 0], [3, 0]],
                [[1, 0]],
                [[2, 0], [3, 0]],
                [[1, 0]],
                [[2, 0], [3, 0]],
                [[0, 0]]
            ]
        ];
        case 'z': return [
            [16],
            [
                [[0, -1]],
                [],
                [[1, 0], [2, 0], [3, 0]],
                [],
                [[0, 0]],
                [[1, 0], [2, 0], [3, 0]],
                [],
                [[0, 0]],
                [[1, 0], [2, 0], [3, 0]],
                [],
                [[0, 0]],
                [[1, 0], [2, 0], [3, 0]],
                [],
                [[0, 0]],
                [[1, 0], [2, 0], [3, 0]],
                []
            ]
        ];
        case 'x': return [
            [16],
            [
                [[0, -1]],
                [[0, 0]],
                [[1, 0]],
                [[2, 0]],
                [[3, 0]],
                [[1, 1]],
                [[2, 1]],
                [[3, 1]],
                [[2, 1]],
                [[1, 1]],
                [[0, 1]],
                [[3, 0]],
                [[2, 0]],
                [[1, 0]],
                [[2, 0]],
                [[3, 0]],
            ]
        ];
        case 'c': return [
            [16],
            [
                [[0, -1],[0, 0],[1, 0],[2, 0],[3, 0]],
                [],
                [],
                [],
                [[1, 0],[2, 0],[3, 0]],
                [],
                [[0, 0]],
                [[1, 0],[2, 0],[3, 0]],
                [],
                [],
                [[0, 0]],
                [],
                [[1, 0],[2, 0],[3, 0],[0, 1]],
                [],
                [[2, 0]],
                [],
            ]
        ];
    }
}

function buildSessionTab() {

    /* タブの初期活性 */
    setSelectTab('test-footer', 0);

    const initialPatternKeyEl = document.getElementById('pattern_key_a');
    initialPatternKeyEl.classList.add('active');

    const pianoEl = document.getElementById('keyboad');
    pianoEl.scrollLeft = 540;

    const fileEl = document.getElementById('session-file');
    fileEl.addEventListener("change", function (e) {
        const file = e.target.files[0];
        var objectURL = window.URL.createObjectURL(file);
        // alert(objectURL);
        audioElm = new Audio();
        audioElm.src = objectURL;
        const buttonsEl = fileEl.nextElementSibling;
        buttonsEl.children[0].classList.add('disable');
        buttonsEl.children[1].classList.add('disable');
        buttonsEl.children[2].classList.add('disable');
        audioElm.addEventListener('loadedmetadata', function () {
            console.log(audioElm.duration);
            // audioElm.currentTime = 3;
            buttonsEl.children[0].classList.remove('disable');
            buttonsEl.children[1].classList.add('disable');
            buttonsEl.children[2].classList.remove('disable');
        });

        audioElm.addEventListener("ended", function () {
            audioElm.currentTime = 0;
            stopSound();
        }, false);
    }, false);
}

function playSound() {
    audioElm.play();
    const buttonsEl = document.getElementById('session-file').nextElementSibling;
    buttonsEl.children[0].classList.add('disable');
    buttonsEl.children[1].classList.remove('disable');
    buttonsEl.children[2].classList.remove('disable');
}

function stopSound() {
    audioElm.pause();
    const buttonsEl = document.getElementById('session-file').nextElementSibling;
    buttonsEl.children[0].classList.remove('disable');
    buttonsEl.children[1].classList.add('disable');
    buttonsEl.children[2].classList.remove('disable');
}

function resetSound() {
    audioElm.currentTime = 0;
}