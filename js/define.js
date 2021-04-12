const DEGREE12_FLAT_LIST = [
    'Ⅰ', '♭Ⅱ', 'Ⅱ', '♭Ⅲ', 'Ⅲ', 'Ⅳ', '♭Ⅴ', 'Ⅴ', '♭Ⅵ', 'Ⅵ', '♭Ⅶ', 'Ⅶ'
];
const DEGREE12_SHARP_LIST = [
    'Ⅰ', '#Ⅰ', 'Ⅱ', '#Ⅱ', 'Ⅲ', 'Ⅳ', '#Ⅳ', 'Ⅴ', '#Ⅴ', 'Ⅵ', '#Ⅵ', 'Ⅶ'
];

const KEY12_FLAT_LIST = [
    'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'
];
const KEY12_SHARP_LIST = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];
const SCALE_LIST = [
    'major', 'minor'
];
const RYTHM_LIST = [
    '4/4', '2/4', '3/4', '6/8', '12/8'
];

const DIATONIC_MAJOR_SCALE_JSONS = [
    { degreeIndex: 0, symbolNo: 0 },
    { degreeIndex: 2, symbolNo: 1 },
    { degreeIndex: 4, symbolNo: 1 },
    { degreeIndex: 5, symbolNo: 0 },
    { degreeIndex: 7, symbolNo: 0 },
    { degreeIndex: 9, symbolNo: 1 },
    { degreeIndex: 11, symbolNo: 10 },
];

const DIATONIC_MAJOR_SCALE_DEGREE_NAMES = [
    'Ⅰ', 'Ⅰmaj7',
    'Ⅱm', 'Ⅱm7',
    'Ⅲm', 'Ⅲm7',
    'Ⅳ', 'Ⅳmaj7',
    'Ⅴ', 'Ⅴ7',
    'Ⅵm', 'Ⅵm7',
    'Ⅶm(-5)', 'Ⅶm7(-5)'
]

const DIATONIC_NATURAL_MINOR_SCALE_DEGREE_NAMES = [
    'Ⅰm', 'Ⅰm7',
    'Ⅱm(-5)', 'Ⅱm7(-5)',
    '♭Ⅲ', '♭ⅢM7',
    'Ⅳm', 'Ⅳm7',
    'Ⅴm', 'Ⅴm7',
    '♭Ⅵ', '♭ⅥM7',
    '♭Ⅶ', '♭Ⅶ7'
]