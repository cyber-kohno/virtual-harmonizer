

function getSoundNameFromKeyIndex(value) {
    value += 9;
    const scaleName = KEY12_SHARP_LIST[value % 12];
    const octave = Math.floor(value / 12);
    return scaleName + octave;
}

function playSynthSounds(sounds, time) {
    for (let i = 0; i < sounds.length; i++) {
        const soundName = sounds[i];
        synth.triggerAttack(soundName, '+0', 0.15);
    }

    setTimeout(() => {
        for (let i = 0; i < sounds.length; i++) {
            const soundName = sounds[i];
            synth.triggerRelease(soundName);
        }
    }, time);
}

function playBackingScript(env, script, timerQueue) {

    const layers = script.layers;
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const lens = layer.lens.split('-');
        const notes = layer.notes;
        const vels = layer.vels.split('-');
        const totalTime = env.beatTime * script.sustain4;

        let pastTime = 0;
        for (let j = 0; j < lens.length; j++) {
            const len = Number(lens[j]);
            const velocity = Number(vels[j]) * 0.03;
            const sustain = Number(4 / len);
            let time = env.beatTime * sustain;

            const sounds = [];
            const indexes = [];
            for (let k = notes.length - 1; k >= 0; k--) {
                const index = notes.length - 1 - k;
                const note = notes[k].split('-')[j];
                if (note == '1') {
                    sounds.push(env.asignSounds[index]);
                    indexes.push(Number(env.asignIndexes[index]));
                }
            }
            const endTime = totalTime - pastTime;

            let id = -1;
            const curTime = env.posSec + pastTime;
            id = setTimeout(() => {
                for (let k = 0; k < sounds.length; k++) {
                    const soundName = sounds[k];
                    synth.triggerAttack(soundName, '+0', velocity);
                }
                ScoreFooterTab.pianoViewer.downKeys(indexes, i + 1);
            }, curTime - getAdjustTime(env.baseTime));
            timerQueue.push(id);

            id = setTimeout(() => {
                ScoreFooterTab.pianoViewer.releaseKeys(indexes);
            }, curTime + time - getAdjustTime(env.baseTime));
            timerQueue.push(id);

            id = setTimeout(() => {
                for (let k = 0; k < sounds.length; k++) {
                    const soundName = sounds[k];
                    synth.triggerRelease(soundName);
                }
                // ScoreFooterTab.pianoViewer.resetSustain(indexes);
            }, curTime + endTime - getAdjustTime(env.baseTime));
            timerQueue.push(id);
            pastTime += time;
        }
    }
}


function getBackingTask(env, script, list) {

    const layers = script.layers;
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const lens = layer.lens.split('-');
        const notes = layer.notes;
        const vels = layer.vels.split('-');
        const totalTime = env.beatTime * script.sustain4;

        let pastTime = 0;
        for (let j = 0; j < lens.length; j++) {
            const len = Number(lens[j]);
            const velocity = Number(vels[j]) * 0.03;
            const sustain = Number(4 / len);
            let time = env.beatTime * sustain;

            const sounds = [];
            const indexes = [];
            for (let k = notes.length - 1; k >= 0; k--) {
                const index = notes.length - 1 - k;
                const note = notes[k].split('-')[j];
                if (note == '1') {
                    sounds.push(env.asignSounds[index]);
                    indexes.push(Number(env.asignIndexes[index]));
                }
            }
            const endTime = totalTime - pastTime;

            const curTime = env.posSec + pastTime;
            const json = {};
            json.sounds = sounds;
            json.indexes = indexes;
            json.velocity = velocity;
            json.side = i + 1;
            json.curTime = curTime;
            json.noteTime = time;
            json.endTime = endTime;
            list.push(json);
        
            pastTime += time;
        }
    }
}

function getAdjustTime(baseTime) {
    const adjustTime = new Date().getTime() - baseTime;
    console.log(`b=[${baseTime}], a=[${adjustTime}]`);
    return adjustTime;
}

function getBackingList(sustain) {
    const list = [];
    getAllBackingList().forEach(backing => {
        if (backing.sustain4 == sustain) {
            list.push(backing);
        }
    });
    
    return list;
}

function getBacking(sustain, name) {
    const list = getAllBackingList();
    for (let i = 0; i < list.length; i++) {
        const backing = list[i];
        if (backing.sustain4 == sustain & backing.name == name) {
            return backing;
        }
    }
    return null;
}

function getAllBackingList() {
    return BACKING_SAMPLE_LIST;
}