
class ScoreSheetTab {

    constructor() {

    }

    static initSheetMusic() {
        const rootEl = document.getElementById('score-list-root');
        const list = rootEl.children;

        let left = '';
        let right = '';
        for (let i = 0; i < list.length; i++) {
            const objEl = list[i];
            if (objEl.classList.contains('chord-range')) {
                const curParams = ScoreTab.getParams(objEl);
                const asignSounds = curParams.asignSounds.split(',');
                const asignIndexes = curParams.asignIndexes.split(',');
                const bpm = curParams.baseInfo.tempo;
                const script = curParams.backingScript;
                const backingEnv = {};

                right += `"${ScoreTab.getChordName(curParams)}"`;
                if (script == null) {
                    left += '[';
                    right += '[';
                    for (let j = 0; j < asignSounds.length; j++) {
                        const name = ScoreSheetTab.convertSheetSoundName(asignSounds[j]);
                        if (j == 0) {
                            left += name;
                        } else {
                            right += name;
                        }
                    }
                    left += ']' + curParams.sustain4;
                    right += ']' + curParams.sustain4;
                } else {
                    right += ScoreSheetTab.getBackingSheet(script, asignSounds, 1);
                    left += ScoreSheetTab.getBackingSheet(script, asignSounds, 0);
                }
                left += '|';
                right += '|';
                if (i % 4 == 3) {
                    left += '\n';
                    right += '\n';
                }
            }
        }
        const src = `
            M:4/4
            L:1/4
            K:C
            V:1
            ${right}
            V:2 bass
            ${left}
        `;
        console.log(src);
        ABCJS.renderAbc("sheet-music-view", src);
        ABCJS.renderMidi( "sheet-music-midi", src, {}, { generateInline: true }, {} );
    }

    static getBackingSheet(script, asignSounds, index) {

        const layers = script.layers;

        const layer = layers[index];
        const lens = layer.lens.split('-');
        const notes = layer.notes;

        let src = '';
        for (let i = 0; i < lens.length; i++) {
            const len = Number(lens[i]);

            let names = '';
            for (let j = 0; j < notes.length; j++) {
                const flg = notes[j].split('-')[i];
                if (flg == '1') {
                    const baseName = asignSounds[asignSounds.length - 1 - j];
                    names += ScoreSheetTab.convertSheetSoundName(baseName);
                }
            }
            src += (names == '' ? 'z' : `[${names}]`);
            switch (len) {
                case 8: src += '/'; break;
                case 16: src += '//'; break;
                case 2: src += '2'; break;
                case 1: src += '4'; break;
            }
        }
        return src;
    }

    static convertSheetSoundName(baseName) {
        let name = baseName;
        name = name.replace('2', ',,');
        name = name.replace('3', ',');
        name = name.replace('4', '');
        name = name.replace('5', '\'');
        // if (baseName.includes('4')) {
        //     name = name.replace('4', '');
        //     name = name.toLowerCase();
        // }
        if (baseName.includes('#')) {
            name = '^' + name.replace('#', '');
        }
        return name;
    }
}