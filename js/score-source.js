class ScoreSourceTab {

    constructor() {

    }

    static buildSouceTab() {

    }

    static convertSource() {

        const json = {};
        const elements = [];
        const rootEl = document.getElementById('score-list-root');
        for (let i = 0; i < rootEl.children.length; i++) {
            const element = rootEl.children[i];
            if (element.classList.contains('init')) {

            } else if (element.classList.contains('section')) {

            } else if (element.classList.contains('chord-range')) {
                const paramsEl = element.children[5];
                const params = JSON.parse(paramsEl.innerHTML);
                elements.push(params);
            }
        }
        json.elements = elements;

        const sourceEl = document.getElementById('score-all-json');
        sourceEl.value = JSON.stringify(json, null, '  ');
    }
}