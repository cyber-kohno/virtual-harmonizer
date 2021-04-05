class ScoreLoader {

    static load() {
        
        const rootEl = document.getElementById('score-list-root');
        const outlineEl = document.getElementById('score-outline-root');

        rootEl.innerHTML = '';
        outlineEl.innerHTML = '';
        
        
        const source = document.getElementById('score-all-json').value;
        const json = JSON.parse(source);
        const elList = json.elements;
        let cur = null;
        elList.forEach(params => {
            const type = params.type;
            // alert(type);
            switch(type) {
                case 'init':
                    ScoreTab.initDefaultElements(params)
                    cur = rootEl.children[1];
                break;
                case 'section':
                    cur.insertAdjacentHTML('afterend', ScoreTab.getSectionItemHtml(params));
                    cur = cur.nextElementSibling;
                break;
                case 'chord':
                    cur.insertAdjacentHTML('afterend', ScoreTab.getScoreChordItemHtml(params));
                    cur = cur.nextElementSibling;
                break;
            }
        });
        ScoreTab.updateBaseInfo();
        setSelectTab('scoretab', 1);
        ScoreTab.initSelectElement();
    }
}