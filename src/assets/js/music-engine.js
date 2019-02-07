import * as d3 from 'd3';
import {
    Note,
    Interval,
    Distance,
    Scale,
    Chord
} from "tonal";
import * as Key from "tonal-key";

/* const colors_dim = ['yellow', '#87CEFA', '#F4D03F', '#8FBC8F', 'Tomato', '#a78999', 'lightgray', '#C70039']; // 8 note
const colors = ['yellow', '#87CEFA', '#F4D03F', '#8FBC8F', 'Tomato', '#a78999', 'lightgray']; // 7 note
const colors_penta = ['yellow', '#87CEFA', '#F4D03F', 'Tomato', 'lightgray']; // 5 note
const colors_penta_six = ['yellow', '#87CEFA', '#F4D03F', 'SlateBlue', 'Tomato', 'lightgray']; // 6 note
const colors_triads_seven = ['yellow', '#F4D03F', 'Tomato', 'lightgray']; // 4 note
const colors_triads = ['yellow', '#F4D03F', 'Tomato']; // 3 note
const colors_merge = ['#F4D03F', 'lightgray', 'gray']; // 3 note */

const colors_merge = ['#F4D03F', 'lightgray', 'gray'];
const COLOURS = {
    "1P": 'yellow',
    "2m": '#87CEFA',
    "2M": '#87CEFA',
    "2A": '#87CEFA',
    "3m": '#F4D03F',
    "3M": '#F4D03F',
    "4P": '#8FBC8F',
    "4A": 'blue',
    "5d": 'Tomato',
    "5P": 'Tomato',
    "5A": 'Tomato',
    "6m": '#a78999',
    "6M": '#a78999',
    "7d": 'lightgray',
    "7m": 'lightgray',
    "7M": 'gray'
};

// ACCORDATURE
export const Tunings = {
    E_4ths: ['e2', 'a2', 'd3', 'g3', 'c4', 'f4'],
    E_std: ['e2', 'a2', 'd3', 'g3', 'b3', 'e4'],
    Drop_D: ['d2', 'a2', 'd3', 'g3', 'b3', 'e4'],
    G_open: ['d2', 'g2', 'd3', 'g3', 'b4', 'd4']
};

/* const intervalMap8 = {
    '2': {
        '1': 'b9',
        '2': '9',
        '3': '#9',
    },
    '3': {
        '3': 'b3',
        '4': '3',
        //'5':'#3',
    },
    '4': {
        '4': '3',
        '5': '4',
        '6': '#4',
    },
    '5': {
        '6': 'b5',
        '7': '5',
        '8': '#5',
    },
    '6': {
        '7': '5',
        '8': 'b6',
        '9': '6',
        '10': '#6',
    },
    '7': {
        '9': '6',
        '10': 'b7',
        '11': '7',
        //'12':'T',
    },
    '8': {
        '10': 'b7',
        '11': '7',
        //'12':'T',
    },
};
const intervalMap7 = {
    '2': {
        '1': 'b9',
        '2': '9',
        '3': '#9',
    },
    '3': {
        '3': 'b3',
        '4': '3',
        //'5':'#3',
    },
    '4': {
        '4': 'b4',
        '5': '4',
        '6': '#4',
    },
    '5': {
        '6': 'b5',
        '7': '5',
        '8': '#5',
    },
    '6': {
        '8': 'b6',
        '9': '6',
        '10': '#6',
    },
    '7': {
        '10': 'b7',
        '11': '7',
        //'12':'T',
    },
};
const intervalMap6 = {
    '2': {
        '1': 'b9',
        '2': '9',
        '3': '#9',
    },
    '3': {
        '2': '9',
        '3': '#9',
        '3': 'b3',
        '4': '3',
        '5': '4',
        '6': 'b5',
        '7': '5',
        '8': '#5',
    },
    '4': {
        '3': 'b3',
        '4': '3',
        '5': '4',
        '6': '#4',
        '7': '5',
        '8': '#5',
    },
    '5': {
        '6': 'b5',
        '7': '5',
        '8': '#5',
        '9': '6',
        '10': 'b7',
        '11': '#7',
    },
    '6': {
        '8': 'b6',
        '9': '6',
        '10': 'b7',
        '11': '7',
    }
};
const intervalMap5 = {
    '2': {
        '1': 'b9',
        '2': '9',
        '3': 'b3',
        '4': '3',
    },
    '3': {
        '3': 'b3',
        '4': '3',
        '5': '4',
    },
    '4': {
        '6': 'b5',
        '7': '5',
        '8': '#5',
    },
    '5': {
        '8': 'b6',
        '9': '6',
        '10': 'b7',
    }
};
const intervalMap4 = {
    '2': {
        '3': 'b3',
        '4': '3',
        //'5': '4',
    },
    '3': {
        '6': 'b5',
        '7': '5',
        '8': '#5',
    },
    '4': {
        '9': '7°',
        '10': 'b7',
        '11': '7',
    }
}; */
const NOTES = 'a a# b c c# d d# e f f# g g#'.split(' '); // è l'array di note
const NOTESENH = 'a bb b c db d eb e f gb g ab'.split(' '); // è l'array di note
/* export const SCALES = {
    'maj': ["2t", "ts", "2ts"],
    'maj7': ["2t", "ts", "2t", 's'],
    '7': ["2t", "ts", "ts", 't'],
    'aug': ["2t", "2t", "2t"],
    'min': ["ts", "2t", "3t"],
    'min7': ["ts", "2t", "ts", 'ts'],
    'min7/b5': ["ts", "ts", "2t", 'ts'],
    'dim': ["ts", "ts", "ts", '2ts'], // TODO: 
    'dim7': ["ts", "ts", "ts", '2ts'],

    'ionian': ["t", "t", "s", "t", "t", "t", "s"],
    'dorian': ["t", "s", "t", "t", "t", "s", "t"],
    'phrygian': ["s", "t", "t", "t", "s", "t", "t"],
    'lydian': ["t", "t", "t", "s", "t", "t", "s"],
    'mixolydian': ["t", "t", "s", "t", "t", "s", "t"],
    'aeolian': ["t", "s", "t", "t", "s", "t", "t"],
    'locrian': ["s", "t", "t", "s", "t", "t", "t"],

    'harmonic-minor': ["t", "s", "t", "t", "s", "ts", "s"],
    'locrian-#6': ["s", "t", "t", "s", "ts", "s", "t"],
    'ionian-#5': ["t", "t", "s", "ts", "s", "t", "s"],
    'dorian-#4': ["t", "s", "ts", "s", "t", "s", "t"],
    'phrygian-dominant': ["s", "ts", "s", "t", "s", "t", "t"],
    'lydian-#2': ["ts", "s", "t", "s", "t", "t", "s"],
    'super-locrian-dim': ["s", "t", "s", "t", "t", "s", "ts"],

    'melodic-minor': ["t", "s", "t", "t", "t", "t", "s"],
    'dorian-b2': ["s", "t", "t", "t", "t", "s", "t"],
    'lydian-aug': ["t", "t", "t", "t", "s", "t", "s"],
    'lydian-dominant': ["t", "t", "t", "s", "t", "s", "t"],
    'mixolydian-b6': ["t", "t", "s", "t", "s", "t", "t"],
    'aeolian-b5': ["t", "s", "t", "s", "t", "t", "t"],
    'super-locrian': ["s", "t", "s", "t", "t", "t", "t"],

    'major-pentatonic': ["t", "t", "ts", "t", "ts"],
    'major-blues': ["t", "s", "s", "ts", "t", "ts"],
    'dorian-pentatonic': ["ts", "t", "t", "t", "ts"], // R b3 4 5 6
    'phrygian-pentatonic': ["s", "2t", "t", "ts", "t"], // R b2 4 5 b7
    'lydian-pentatonic': ["t", "t", "t", "ts", "ts"], // R 2 3 #4 6
    'mixolydian-pentatonic': ["t", "t", "ts", "ts", "t"], // R 2 3 5 b7
    'dom-pentatonic': ["2t", "s", "t", "ts", "t"], // R 3 4 5 b7
    'minor-pentatonic': ["ts", "t", "t", "ts", "t"],
    'minor-blues': ["ts", "t", "s", "s", "ts", "t"],
    'minor6Th-blues-pentatonic': ["ts", "t", "s", "s", "t", "ts"], // R b3 4# 5 6
    'rootless9th-pentatonic': ["t", "t", "ts", "t", "ts"], // 2 b3 4 5 7b TODO:
    'locrian-pentatonic': ["ts", "t", "s", "2t", "t"], // R b3 4 b5 b7

    'whole-tone': ["t", "t", "t", "t", "t", "t"],

    'diminished-st': ["s", "t", "s", "t", "s", "t", "s", "t"],
    'diminished-ts': ["t", "s", "t", "s", "t", "s", "t", "s"],
}; */

// helper per ritornare il valore
const verbatim = (d => d);

// In base al nome della nota calcola lo spostamento sulla tastiera
function asOffset(note) {
    note = note.toLowerCase();
    let offset = NOTES.indexOf(note);
    if (offset === -1) {
        offset = NOTESENH.indexOf(note);
    }
    return offset;
}

// calcola che nota è a2 è pari a 33
// tutte le note hanno l'ottava ES: a2 indica che è il LA sulla 5° corda (a vuoto) !
function absNote(note) {
    const octave = note[note.length - 1];
    let pitch = asOffset(note.slice(0, -1)); // pitch = tono 
    if (pitch > -1) {
        return pitch + octave * 12; // per a2 è 33
    }
}

/* function sumInterval(intervalArray) {
    let trasformati = transformInt(intervalArray);
    return trasformati.reduce((a, b) => a + b);
}

function calculateDegrees(intervalArray) {
    let out = ['T']; //{'1': 'T'};
    let loops = intervalArray.length;
    let mapToBeUsed;
    switch (loops) {
        case 8:
            mapToBeUsed = intervalMap8;
            break;
        case 7:
            mapToBeUsed = intervalMap7;
            break;
        case 6:
            mapToBeUsed = intervalMap6;
            break;
        case 5:
            mapToBeUsed = intervalMap5;
            break;
        case 4:
            mapToBeUsed = intervalMap4;
            break;
        case 3:
            mapToBeUsed = intervalMap4;
            break;
        default:
            break;
    }
    for (let i = 0; i < loops; i++) {
        let subarray = intervalArray.slice(0, i + 1);
        let oo = sumInterval(subarray);
        if (oo < 12) {
            //out[`${i + 2}`] = /*  `${oo}`;  
mapToBeUsed[`${i + 2}`][`${oo}`];
oggetto
out.push(mapToBeUsed[`${i + 2}`][`${oo}`]); // array
}
}
return out;
}*/

// ritorna un array di note che parte da startNote
export function transposeSpecificScaleByStartingNote(startNote, scale) {
    var indexToSplit = scale.indexOf(startNote);
    var first = scale.slice(0, indexToSplit);
    var second = scale.slice(indexToSplit);
    return second.concat(first);
}


// ritorna un array di note che parte da startNote
export function transposeScaleByStartingNote(startNote) {
    var indexToSplit = NOTES.indexOf(startNote);
    var first = NOTES.slice(0, indexToSplit);
    var second = NOTES.slice(indexToSplit);
    return second.concat(first);
}

// ritorna un array di intervalli che parte da startDegree
// (startDegree è pari 0  se si considera il 1° grado)
function transposeIntervalsByStartingDegree(startDegree, intervals) {
    var indexToSplit = startDegree;
    var first = intervals.slice(0, indexToSplit);
    var second = intervals.slice(indexToSplit);
    return second.concat(first);
}

// 7 semitoni è una quinta, 5 semitoni è una quarta
// torna il nome della T
function moveDownByNumOfSemitones(howManySemitone, fromNote) {
    let numOfSemiton = howManySemitone > 12 ? howManySemitone % 12 : howManySemitone;
    var indexToSplit = NOTES.indexOf(fromNote);
    var first = NOTES.slice(0, indexToSplit);
    var second = NOTES.slice(indexToSplit);
    var join = second.concat(first);
    return createScale(join[numOfSemiton], SCALES.ionian)
}

function moveUpByNumOfSemitones(howManySemitone, fromNote) {
    let numOfSemiton = howManySemitone > 12 ? howManySemitone % 12 : howManySemitone;
    var indexToSplit = NOTES.indexOf(fromNote);
    var first = NOTES.slice(0, indexToSplit + 1);
    var second = NOTES.slice(indexToSplit + 1);
    var join = second.concat(first);
    return createScale(join[11 - numOfSemiton], SCALES.ionian);
}

// tona un array di numeri indicanti il num di spostamenti
function transformInt(intervalli) {
    return intervalli.map((e) => {
        let out;
        switch (e) {
            case '3t':
                out = 6;
                break;
            case '2ts':
                out = 5;
                break;
            case '2t':
                out = 4;
                break;
            case 'ts':
                out = 3;
                break;
            case 't':
                out = 2;
                break;
            case 's':
                out = 1;
                break;
            default:
                break;
        }
        return out;
    });
}

// ritorna il nome della scala passando gli intervalli
function getName(intervalli) {
    for (const key in SCALES) {
        if (SCALES.hasOwnProperty(key) && SCALES[key].toString() == intervalli.toString()) {
            return key;
        }
    }
}

// ritorna un array
function compare(list1, list2, isUnion) {
    var result = [];
    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i],
            found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = item1 === list2[j];
        }
        if (found === !!isUnion) { // isUnion is coerced to boolean
            result.push(item1);
        }
    }
    return result;
}

// 
function analize(noteScala, gradi) {
    let gradiArr = []
    for (const key in gradi) {
        if (gradi.hasOwnProperty(key)) {
            gradiArr.push(gradi[key]);
        }
    }
    let out = {
        inside: {},
        consonant: {},
        dissonances: []
    };
    for (let i = 0; i < noteScala.length; i++) {
        const element = noteScala[i];
        if ((i + 1) % 2 != 0) {
            out.inside[gradiArr[i]] = element;
        } else {
            out.consonant[gradiArr[i]] = element;
        }
        out.dissonances = compare(NOTES, noteScala, false);
    }
    return out;
}

function calcolaAccordo(gradiScala) {
    let outStr = '';
    if (gradiScala.indexOf("b3") != -1 && gradiScala.indexOf("b5") != -1) {
        outStr = 'm7/b5';
    } else if (gradiScala.indexOf("b3") != -1 && gradiScala.indexOf("b7") != -1) {
        outStr = 'm7';
    } else if (gradiScala.indexOf("b7") != -1) {
        outStr = '7';
    } else if (gradiScala.indexOf("7") != -1) {
        outStr = 'maj7';
    }
    return outStr;
}

function flipAndCapitalizeNote(note) {
    // console.log(note)
    if (!note) return;
    if (note.length == 2 && note[1] == "b") {
        note = "b" + note[0].toUpperCase();
        return note;
    } else {
        return note.charAt(0).toUpperCase() + note.substr(1);
    }
}
// dato un array di note ["C", "D", "D#", "F", "G", "G#", "A#"]
// torna un array senza note ripetute ["C", "D", "bE", "F", "G", "bA", "bB"]
function getReadableScaleNames(arr) {
    let output = [];
    arr = arr.map(e => e.toLowerCase());
    let a = arr.map(e => e.toLowerCase().charAt(0));
    for (let index = 0; index < a.length; index++) {
        const element = a[index];
        let primo = a.indexOf(element);
        let ultimo = a.lastIndexOf(element);
        // console.log(index, element, primo, ultimo);
        if (primo != ultimo && primo < ultimo && ultimo == a.lenght - 1) {
            let ultimoIndexNote = NOTES.findIndex(x => x == arr[ultimo]);
            // console.log(ultimo, ultimoIndexNote, index, arr[index]);
            output.push(arr[index]);
            output.push(NOTESENH[ultimoIndexNote]);
            index = ultimo;
        } else if (
            output[output.length - 1] && output[output.length - 1].charAt(0) == element.charAt(0)
        ) {
            let ultimoIndexNote = NOTES.findIndex(x => x == arr[ultimo]);
            // console.log(ultimo, ultimoIndexNote);
            output.push(NOTESENH[ultimoIndexNote]);
        } else {
            output.push(arr[index]);
        }
    }
    return output.map(flipAndCapitalizeNote);
}


// ritorna un array di note che rappresenta la scala in base agli intervalli passati
export function createScale(startNote, intervalli) {
    let output = {
        key: startNote,
        notes: [],
        intervalli: intervalli,
        mode: getName(intervalli),
        gradi: calculateDegrees(intervalli)
    };
    var notes = transposeScaleByStartingNote(startNote, NOTES);
    var intervalli = transformInt(intervalli);
    let progressIndex = 0; // indica i salti da fare tra gli elementi della scala
    output.notes.push(notes[progressIndex]);
    intervalli.forEach((e, index) => {
        if (index != intervalli.length - 1) {
            progressIndex += e;
            output.notes.push(notes[progressIndex]);
        }
    });
    // alalize aggiunge .inside, .dissonances, .consonant
    output = Object.assign(output, analize(output.notes, output.gradi));
    output.accordo = calcolaAccordo(output.gradi);
    output.sons = [];
    output.readAbleNotes = getReadableScaleNames(output.notes);
    // console.log(output);
    return output;
}

// ritorna un array di note a partire da una nota iniziale ed un relativo grado
export function createScaleOnDegree(startNote, scale, degree) {
    let i = degree - 1;
    var mag = createScale(startNote, scale).notes; // "scala di riferimento"
    var ind = transposeIntervalsByStartingDegree(i, scale);
    return createScale(mag[i], ind);
}

// si creano tutti i gradi a partire da una scala maggiore
export function createAllDegree(tonica, scala) {
    var allDegree = [];
    var mag = createScale(tonica, scala).notes;
    mag.forEach((firstNote, i) => {
        var n = transposeScaleByStartingNote(firstNote, mag);
        var ind = transposeIntervalsByStartingDegree(i, selectedScale);
        allDegree.push(createScale(n[0], ind));
    });
    return allDegree;
}

function formatText(scalename) {
    let out = scalename.replace(/-/, ' ');
    out = out.charAt(0).toUpperCase() + out.slice(1).toLowerCase();
    return out;
}

/* ------------------- MERGE SCALES ------------------- */

export function transposeScaleObjByStartingNote(startNote, scale) {
    var indexToSplit;
    scale.some(function (item, i) {
        if (item["value"] === startNote) {
            indexToSplit = i;
            return true;
        }
    });
    var first = scale.slice(0, indexToSplit);
    var second = scale.slice(indexToSplit);
    return second.concat(first);
}

export function mergeScale(a, b) {
    let mag, min;
    if (a.length >= b.length) {
        mag = a;
        min = b;
    } else {
        mag = b;
        min = a;
    }
    let data = [];
    let trovato = [];
    for (let i = 0; i < min.length; i++) {
        for (let j = 0; j < mag.length; j++) {
            if (min[i] === mag[j]) {
                data.push({
                    value: min[i],
                    style: 0,
                    index: j
                }); // se in entrambi
                trovato[i] = true;
                break;
            }
        }
        if (!trovato[i]) {
            data.push({
                value: min[i],
                style: 2,
                index: i
            }); // se solo nel 2°
        }
    }
    let trovatodue = [];
    for (let i = 0; i < mag.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (mag[i] === data[j].value) {
                trovatodue[i] = true;
                break;
            }
        }
        if (!trovatodue[i]) {
            data.push({
                value: mag[i],
                style: 1,
                index: i
            }); // se solo nel 1°
        }
    }
    // console.log("min: ", min,"mag: ", mag);
    // console.log(data.map(e=>e.value))
    let output = data.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    });
    return transposeScaleObjByStartingNote(a[0], output);
}

export function mergeDegree(data, uno, due) {
    let a, b;
    if (uno.length > due.length) {
        a = uno;
        b = due;
    } else {
        a = due;
        b = uno;
    }
    let output = [];
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.style === 1 || e.style === 0) {
            output.push(a[e.index]);
        }
        if (e.style == 2) {
            output.push(b[e.index]);
        }
    }
    return output;
}

export function createScaleToBePlayed(s) {
    let a = 3,
        b = 3;
    let indexJump = detectJumpOverC(s);
    // console.log('index: ', indexJump);
    var o = s.map((e, i) => {
        if (i == indexJump) {
            a++;
        }
        return e.toUpperCase() + a;
    });
    var o_rev = s
        .map((e, i) => {
            if (i == indexJump) {
                b++;
            }
            return e.toUpperCase() + b;
        })
        .reverse();
    let osotto = o[0].charAt(0);
    let olast = Number(o[o.length - 1].substr(-1));
    if (osotto == "C") {
        olast++;
    }
    return o.concat(osotto + olast, o_rev);
}

export function createChordNotes(s) {
    let a = 3;
    let indexJump = detectJumpOverC(s);
    // console.log('index: ', indexJump);
    var o = s.map((e, i) => {
        if (i == indexJump) {
            a++;
        }
        return e.toUpperCase() + a;
    });
    return o;
}

function getFirstChar(c) {
    return c.charAt(0);
}

function detectJumpOverC(scale) {
    let c = scale.indexOf("c");
    if (c != -1) {
        return c;
    }
    let result;
    for (let i = 0; i < scale.length; i++) {
        const first = scale[i];
        const last = scale[i + 1];
        if (getFirstChar(first) == "b" || last && getFirstChar(last) == "d") {
            result = i + 1;
            break;
        }
    }
    return result;
}

function calculateRootsOfCircleOfFifth(scale) {
    let out = [];
    let semitonArray = [42, 35, 28, 21, 14, 7];
    semitonArray.forEach((e) => out.push(moveUpByNumOfSemitones(e, scale)));
    out.push(createScale('c', SCALES.ionian))
    semitonArray.reverse().forEach((e) => out.push(moveDownByNumOfSemitones(e, scale)));
    return out;
}



export function createTableOfCircleOfFifth(note) {
    let roots = calculateRootsOfCircleOfFifth(note);
    let scalaArray = [
        SCALES.ionian,
        SCALES.dorian,
        SCALES.phrygian,
        SCALES.lydian,
        SCALES.mixolydian,
        SCALES.aeolian,
        SCALES.locrian
    ];
    roots.forEach(root => {
        let majors = []
        scalaArray.forEach((e, i) => majors.push(createScale(root.notes[i], e)));
        root.majors = majors;
    });
    return roots;
}
export function tableModalInterchange(note) {
    let scalaArray = [
        SCALES.ionian,
        SCALES.dorian,
        SCALES.phrygian,
        SCALES.lydian,
        SCALES.mixolydian,
        SCALES.aeolian,
        SCALES.locrian
    ];
    let out = []
    scalaArray.forEach((e, i) => out.push(createScale(note, e)));

    return out;
}
/* ------------------- MERGE SCALES ------------------- */

// si istanzia l'oggetto 'TASTIERA' passandogli un eventuale oggetto di configurazione
export const Fretboard = function (config) {
    config = config || {};

    const instance = {
        frets: config.frets || 12, // numero di tasti da visualizzare
        strings: config.strings || 6, // numero di corde
        tuning: config.tuning || Tunings.E_4ths, // accordatura
        fretWidth: config.fretWidth || 46, // larghezza tasti
        fretHeight: 30, // altezza tasti
        id: 'fretboard-' + Math.floor(Math.random() * 1000000), // id della tastiera
        name: '', // NOME della scala/arpeggio
        notes: '', // NOTE della scala/arpeggio
        callback: config.callback || null
    };

    instance.fretsWithDots = function () {
        const allDots = [3, 5, 7, 9, 15, 17, 19, 21];
        return allDots.filter(function (v) {
            return v <= instance.frets;
        });
    };

    instance.fretsWithDoubleDots = function () {
        const allDots = [12, 24];
        return allDots.filter(function (v) {
            return v <= instance.frets;
        });
    };

    instance.fretboardHeight = function () {
        return (instance.strings - 1) * instance.fretHeight + 2;
    };

    instance.fretboardWidth = function () {
        return instance.frets * instance.fretWidth + 2;
    };

    instance.XMARGIN = function () {
        return instance.fretWidth;
    };
    instance.YMARGIN = function () {
        return instance.fretHeight;
    };

    // si crea l'istanza SVG
    instance.makeContainer = function (elem) {
        instance.svgContainer = d3
            .select(elem)
            .append('div')
            .attr('class', 'fretboard')
            .attr('class', 'col-md-8 offset-lg-2')
            .attr('id', instance.id) // id è nell'istanza
            .append('svg')
            .attr('width', instance.fretboardWidth() + instance.XMARGIN() * 2)
            .attr('height', instance.fretboardHeight() + instance.YMARGIN() * 2);

        return instance.svgContainer;
    };

    // TASTI
    instance.drawFrets = function () {
        for (let i = 0; i <= instance.frets; i++) {
            let x = i * instance.fretWidth + 1 + instance.XMARGIN(); // coordinata x del tasto
            instance.svgContainer
                .append('line')
                .attr('x1', x)
                .attr('y1', instance.YMARGIN())
                .attr('x2', x)
                .attr('y2', instance.YMARGIN() + instance.fretboardHeight())
                .attr('stroke', 'lightgray')
                .attr('stroke-width', i == 0 ? 8 : 2)
                .append('text')
                .attr('x', x - 6 + 'px')
                .attr('y', (instance.fretboardHeight() + instance.YMARGIN() + 5) + 'px')
                .text(i); // è il numero del tasto
        }
        for (let i = 0; i <= instance.frets; i++) {
            let x = i * instance.fretWidth + 1 + instance.XMARGIN(); // coordinata x del tasto
            instance.svgContainer
                .append('text')
                .attr('x', x - 5 + 'px')
                .attr('y', (instance.fretboardHeight() + instance.YMARGIN() + 20) + 'px')
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "lightgray")
                .text(i); // è il numero del tasto
        }
    }

    // CORDE
    instance.drawStrings = function () {
        for (let i = 0; i < instance.strings; i++) {
            instance.svgContainer
                .append('line')
                .attr('x1', instance.XMARGIN())
                .attr('y1', i * instance.fretHeight + 1 + instance.YMARGIN())
                .attr('x2', instance.XMARGIN() + instance.fretboardWidth())
                .attr('y2', i * instance.fretHeight + 1 + instance.YMARGIN())
                .attr('stroke', 'lightgray')
                .attr('stroke-width', 1);
        }
        let cordeAVuoto = instance.tuning.slice(0, instance.strings).map(e => e.charAt(0).toUpperCase());
        for (let i = 0; i < cordeAVuoto.length; i++) {
            instance.svgContainer
                .append('text')
                .attr("x", (instance.XMARGIN() - 46) + 'px')
                .attr('y', i * instance.fretHeight + 4 + instance.YMARGIN())
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "gray")
                .text(cordeAVuoto[i])
        }

        /* for (let i = 0; i < cordeAVuoto.length; i++) {
            instance.svgContainer
                .append('text')
                .attr("x", (instance.XMARGIN() - 50) + 'px')
                .attr('y', i * instance.fretHeight + 4 + instance.YMARGIN())
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "lightgray")
                .text(cordeAVuoto[i])
        } */
    };

    // PALLINI
    instance.drawDots = function () {

        // disegna i cerchi delle note...
        let p = instance.svgContainer
            .selectAll('circle')
            .data(instance.fretsWithDots())


        // cerchi indicanti 3 5 7 9 tasto
        p.enter()
            .append('circle')
            .attr('cx', function (d) {
                return (d - 1) * instance.fretWidth + instance.fretWidth / 2 + instance.XMARGIN();
            })
            .attr('cy', instance.fretboardHeight() / 2 + instance.YMARGIN())
            .attr('r', 4).style('fill', '#ddd');

        // rimuove i cerchi sul 3 5 7 9  tasto... ?
        let p2 = instance.svgContainer
            .selectAll('.octave')
            .data(instance.fretsWithDoubleDots);

        // cerchi indicanti il 12 e 24 tasto
        p2.enter()
            .append('circle')
            .attr('class', 'octave')
            .attr('cx', function (d) {
                return (d - 1) * instance.fretWidth + instance.fretWidth / 2 + instance.XMARGIN();
            })
            .attr('cy', instance.fretHeight * 3 / 2 + instance.YMARGIN())
            .attr('r', 4).style('fill', '#ddd');
        p2.enter()
            .append('circle')
            .attr('class', 'octave')
            .attr('cx', function (d) {
                return (d - 1) * instance.fretWidth + instance.fretWidth / 2 + instance.XMARGIN();
            })
            .attr('cy', instance.fretHeight * 7 / 2 + instance.YMARGIN())
            .attr('r', 4).style('fill', '#ddd');
    };


    // Notes on fretboard
    // 'a2' 1 red
    instance.addNoteOnString = function (note, string, color, tipovisualizzazione, grado) {
        // console.log(note, string, color, tipovisualizzazione, grado);
        const absPitch = absNote(note); // ES: 33
        color = color || 'black';
        const absString = (instance.strings - string);
        const basePitch = absNote(instance.tuning[absString]); // ES: 52 cioè si prende il valore della nota di partenza (sulla corda a vuoto)
        let content = tipovisualizzazione == 'nota' ? note.substring(0, note.length - 1).toUpperCase() : grado;
        if ((absPitch >= basePitch) && (absPitch <= basePitch + instance.frets)) {

            if (grado == '1P') {
                instance.svgContainer
                    .append('rect')
                    .attr('class', 'note')
                    .style('stroke', '#666')
                    .attr('stroke-width', 1)
                    .attr("x", (absPitch - basePitch + 0.40) * instance.fretWidth)
                    .attr("y", (string - 1) * instance.fretHeight + instance.YMARGIN() / 2 + 3.5)
                    .attr("width", 24)
                    .attr("height", 24)
                    //.attr("transform", (d,i) => `rotate(${90})`)
                    .style("fill", color)
                    .on('click', () => instance.playNote(note));
            } else if (grado == '3M' || grado == '3m' || grado == '5P' || grado == '5A' || grado == '5d' || grado == '7m' || grado == '7M' || grado == '7d') {
                instance.svgContainer
                    .append('rect')
                    .attr("rx", 8)
                    .attr('class', 'note')
                    .style('stroke', '#666')
                    .attr('stroke-width', 1)
                    .attr("x", (absPitch - basePitch + 0.40) * instance.fretWidth)
                    .attr("y", (string - 1) * instance.fretHeight + instance.YMARGIN() / 2 + 3.5)
                    .attr("width", 24)
                    .attr("height", 24)
                    .style("fill", color)
                    .on('click', () => instance.playNote(note));
            } else {
                instance.svgContainer
                    .append('circle')
                    .attr('class', 'note')
                    .attr('stroke-width', 1)
                    // 0.75 is the offset into the fret (higher is closest to fret)
                    .attr('cx', (absPitch - basePitch + 0.65) * instance.fretWidth) // calcola la posizione sull'asse X
                    .attr('cy', (string - 1) * instance.fretHeight + 1 + instance.YMARGIN()) // calcola la posizione sull'asse y
                    .attr('r', 12).style('stroke', '#666').style('fill', color)
                    .on('click',
                        /*  function (d) {
                                                let fill = this.style.fill;
                                                this.setAttribute('stroke-width', 5 - parseInt(this.getAttribute('stroke-width')));
                                                this.style.fill = fill == color ? 'grey' : color;
                                            } */
                        () => instance.playNote(note));
            }

            instance.svgContainer
                .append('text')
                .attr('class', 'notes-info')
                .attr('x', content.length > 1 ? ((absPitch - basePitch + 0.54) * instance.fretWidth + 'px') : ((absPitch - basePitch + 0.60) * instance.fretWidth + 'px'))
                .attr('y', (string - 1) * instance.fretHeight + 1 + instance.YMARGIN() + 3.5 + 'px')
                .attr('font-family', 'sans-serif')
                .attr('font-size', '10px')
                .attr('fill', '#4c5151') // '#2F4F4F' DarkSlateGrey
                .text(content) // si rimuove l'ultimo carattere
                .on('click', () => instance.playNote(note));


        }
    };


    instance.addNote = function (note, color, tipovisualizzazione, grado) {
        for (let string = 1; string <= instance.strings; string++) {
            instance.addNoteOnString(note, string, color, tipovisualizzazione, grado);
        }
    };

    // recuperare i colori giusti in base al tipo di scala (7,5 note) o accordo (3,4,5,6 note)
    /*     instance.getRightColor = function (i, type, numNotes) {
            if (type == 'scala') {
                let out;
                switch (numNotes) {
                    case 5:
                        out = colors_penta[i];
                        break;
                    case 6:
                        out = colors_penta_six[i];
                        break;
                    case 7:
                        out = colors[i];
                        break;
                    case 8:
                        out = colors_dim[i];
                        break;
                    default:
                        break;
                }
                return out;
            } else if (type == 'arpeggio') {
                return numNotes > 3 ? colors_triads_seven[i] : colors_triads[i];
            }
        } */

    instance.addNotes = function (notes, tipo, tipovisualizzazione, colorForMerge) {
        // console.log('Notes:', notes, tipo, tipovisualizzazione, colorForMerge);
        let showColor;
        // TODO: si prende il colore in base all'intervallo...
        for (let i = 0; i < notes.length; i++) {
            if (!colorForMerge) {
                showColor = COLOURS[instance.intervals[i]]; //instance.getRightColor(i, tipo, notes.length);
            } else {
                showColor = colors_merge[instance.colors[i]];
            }
            const note = notes[i];
            const degree = instance.intervals ? instance.intervals[i] : null;
            for (let octave = 2; octave < 7; octave++) {
                instance.addNote(note + octave, showColor, tipovisualizzazione, degree);
            }
        }
    }

    instance.playNote = function (note) {
        instance.callback(note);
    }

    /* 
    Per disegnare SCALE è chiamata all'interno dell'HTML !!!! 
    scaleNAme = "c lydian"
    */
    instance.mergedScale = function (root, scaleName, note, gradi, tipo, tipovisualizzazione, name) {
        console.log(root, scaleName, note, gradi, tipo, tipovisualizzazione, name);
        instance.merged = true;
        instance.name = scaleName;
        instance.notes = note.map(e => e.value);
        instance.intervals = gradi.map(e => e.value);
        instance.colors = note.map(e => e.style);
        instance.gradi = gradi.map(e => e.value);
        instance.clear(); // cancella tutto e ridisegna la tastiera
        instance.addNotes(instance.notes, tipo, tipovisualizzazione, instance.colors); // ridisegna le note "c d e f# g a b", "scala", "grado"
    };
    instance.scale = function (root, scaleName, tipo, tipovisualizzazione) {
        let complete = root + ' ' + scaleName;
        instance.name = complete;
        instance.notes = Scale.notes(complete);
        instance.gradi = Key.degrees(complete);
        instance.degrees = Key.degrees(complete);
        instance.accordi = Key.chords(complete);
        instance.intervals = Scale.intervals(scaleName);
        instance.domSecondarie = Key.secDomChords(complete);
        instance.tonic = Key.props(complete).tonic;
        instance.relatives = Key.modeNames().map(name => Key.relative(name, complete));
        instance.paralells = Key.modeNames().map(name => instance.tonic + ' ' + name);
        instance.chordsForThisScale = Scale.chords(scaleName);
        instance.chordsForThisScaleIntervals = instance.chordsForThisScale.map(e => Chord.intervals(e));
        instance.clear(); // cancella tutto e ridisegna la tastiera
        instance.addNotes(instance.notes, tipo, tipovisualizzazione); // ridisegna le note "c d e f# g a b", "scala", "grado"
    };

    /*  per disegnare accordi */
    instance.placeNotes = function (sequence) {
        // Sequence of string:note
        // e.g. '6:g2 5:b2 4:d3 3:g3 2:d4 1:g4'
        instance.clear();
        const pairs = sequence.split(' ');
        pairs.forEach(function (pair, i) {
            let [string, note] = pair.split(':');
            string = parseInt(string);
            instance.addNoteOnString(note, string, i == 0 ? 'red' : 'black');
        });
    };


    instance.clearNotes = function () {
        instance.svgContainer
            .selectAll('.note')
            .remove();
    };


    // rimuove quanto disegnato e ridisegna
    instance.clear = function () {
        d3.select('#' + instance.id).selectAll('.fretnum,.tuning').remove();
        instance.svgContainer
            .selectAll('line')
            .remove();
        instance.svgContainer
            .selectAll('circle')
            .remove();
        instance.draw();
    };

    // cancella la singola istanza
    instance.delete = function (id) {
        // instance.clear();
        d3.select('#' + id).remove();
    };

    instance.draw = function () {
        instance.drawFrets(); //  TASTI
        instance.drawStrings(); // STRINGHE
        instance.drawDots(); // cerchi per 3 5 7 9 12 15 17 19 21 24 e note !
    };

    return instance;
};