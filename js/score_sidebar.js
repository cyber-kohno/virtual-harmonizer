class ScoreSideBar {

    static getInitializeAreaHtml(params) {
        return `
            <div class="title"><span>Initialize</span></div>
            ${ScoreSideBar.getParamAreaHtml('Tempo', params.tempo)}
            ${ScoreSideBar.getParamAreaHtml('Rythm', '4/4')}
            ${ScoreSideBar.getParamAreaHtml('Key', KEY12_SHARP_LIST[params.rootKeyIndex])}
            ${ScoreSideBar.getParamAreaHtml('Scale', 'major')}
        `;
    }

    static getChordAreaHtml(params) {
        let degreeRoot = 'blank';
        let chordRoot = null;
        let symbol = null;
        if(params.degreeIndex != -1) {
            const degreeList = params.isFlat ? DEGREE12_FLAT_LIST : DEGREE12_SHARP_LIST;
            degreeRoot = degreeList[params.degreeIndex];
            const keyList = params.isFlat ? KEY12_FLAT_LIST : KEY12_SHARP_LIST;
            chordRoot = keyList[(params.baseInfo.rootKeyIndex + params.degreeIndex) % 12];
            symbol = `[${params.symbol.name}]`;
        }
        return `
            <div class="title"><span>Chord</span></div>
            ${ScoreSideBar.getParamAreaHtml('Degree Root', degreeRoot)}
            ${ScoreSideBar.getParamAreaHtml('Chord Root', chordRoot)}
            ${ScoreSideBar.getParamAreaHtml('Chord Symbol', symbol)}
            ${ScoreSideBar.getParamAreaHtml('Sustain', params.sustain4)}
        `;
    }

    static getSectionAreaHtml(params) {
        return `
            <div class="title"><span>Section</span></div>
            ${ScoreSideBar.getParamAreaHtml('Chorus', params.chNo)}
            ${ScoreSideBar.getParamAreaHtml('Part', params.part)}
            ${ScoreSideBar.getParamAreaHtml('No.', params.partNo)}
        `;
    }


    static getParamAreaHtml(name, value) {
        let disable = '';
        if(value == null) {
            value = '-';
            disable = ' disable';
        }
        return `
            <div class="param-area${disable}" onclick="ScoreSideBar.callParamSelector(this)">
                <div class="name"><span>${name}</span></div>
                <div class="value"><span>${value}</span></div>
            </div>
        `;
    }
    

    static callParamSelector(obj) {
        return;
        const wndEl = document.getElementById('sidebar-param-selector');
        wndEl.classList.remove('hidden');
        wndEl.focus();

        const rect = obj.getBoundingClientRect();

        wndEl.style.left = rect.left + 'px';
        wndEl.style.top = rect.bottom + 'px';
        wndEl.style.width = rect.width + 'px';
        wndEl.style.height = '300px';

        let html = '';

        wndEl.innerHTML = html;

    }
}