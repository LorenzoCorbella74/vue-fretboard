import * as d3 from 'd3';
import {
    Scale,
    Chord
} from "tonal";
import * as Key from "tonal-key";

const COLOURS_MERGE = ['#F4D03F', 'lightgray', 'gray'];
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

export const SCALES = [{
        text: '- Major and Penta:',
        value: '',
        disabled: true
    }, {
        text: 'aeolian',
        value: 'aeolian'
    },
    {
        text: 'altered',
        value: 'altered'
    },
    {
        text: 'augmented',
        value: 'augmented'
    },
    {
        text: 'augmented heptatonic',
        value: 'augmented heptatonic'
    },
    {
        text: 'bebop',
        value: 'bebop'
    },
    {
        text: 'bebop dominant',
        value: 'bebop dominant'
    },
    {
        text: 'bebop locrian',
        value: 'bebop locrian'
    },
    {
        text: 'bebop major',
        value: 'bebop major'
    },
    {
        text: 'bebop minor',
        value: 'bebop minor'
    },
    {
        text: 'chromatic',
        value: 'chromatic'
    },
    {
        text: 'composite blues',
        value: 'composite blues'
    },
    {
        text: 'diminished',
        value: 'diminished'
    },
    {
        text: 'dorian',
        value: 'dorian'
    },
    {
        text: 'dorian #4',
        value: 'dorian #4'
    },
    {
        text: 'double harmonic lydian',
        value: 'double harmonic lydian'
    },
    {
        text: 'double harmonic major',
        value: 'double harmonic major'
    },
    {
        text: 'egyptian',
        value: 'egyptian'
    },
    {
        text: 'enigmatic',
        value: 'enigmatic'
    },
    {
        text: 'flamenco',
        value: 'flamenco'
    },
    {
        text: 'flat six pentatonic',
        value: 'flat six pentatonic'
    },
    {
        text: 'flat three pentatonic',
        value: 'flat three pentatonic'
    },
    {
        text: 'half-whole diminished',
        value: 'half-whole diminished'
    },
    {
        text: 'harmonic major',
        value: 'harmonic major'
    },
    {
        text: 'harmonic minor',
        value: 'harmonic minor'
    },
    {
        text: 'ionian augmented',
        value: 'ionian augmented'
    },
    {
        text: 'ionian pentatonic',
        value: 'ionian pentatonic'
    },
    {
        text: 'leading whole tone',
        value: 'leading whole tone'
    },
    {
        text: 'locrian',
        value: 'locrian'
    },
    {
        text: 'locrian #2',
        value: 'locrian #2'
    },
    {
        text: 'locrian major',
        value: 'locrian major'
    },
    {
        text: 'locrian pentatonic',
        value: 'locrian pentatonic'
    },
    {
        text: 'lydian',
        value: 'lydian'
    },
    {
        text: 'lydian #5P pentatonic',
        value: 'lydian #5P pentatonic'
    },
    {
        text: 'lydian #9',
        value: 'lydian #9'
    },
    {
        text: 'lydian augmented',
        value: 'lydian augmented'
    },
    {
        text: 'lydian diminished',
        value: 'lydian diminished'
    },
    {
        text: 'lydian dominant',
        value: 'lydian dominant'
    },
    {
        text: 'lydian dominant pentatonic',
        value: 'lydian dominant pentatonic'
    },
    {
        text: 'lydian minor',
        value: 'lydian minor'
    },
    {
        text: 'lydian pentatonic',
        value: 'lydian pentatonic'
    },
    {
        text: 'major',
        value: 'major'
    },
    {
        text: 'major blues',
        value: 'major blues'
    },
    {
        text: 'major flat two pentatonic',
        value: 'major flat two pentatonic'
    },
    {
        text: 'major pentatonic',
        value: 'major pentatonic'
    },
    {
        text: 'melodic minor',
        value: 'melodic minor'
    },
    {
        text: 'melodic minor fifth mode',
        value: 'melodic minor fifth mode'
    },
    {
        text: 'melodic minor second mode',
        value: 'melodic minor second mode'
    },
    {
        text: 'minor #7M pentatonic',
        value: 'minor #7M pentatonic'
    },
    {
        text: 'minor bebop',
        value: 'minor bebop'
    },
    {
        text: 'minor blues',
        value: 'minor blues'
    },
    {
        text: 'minor hexatonic',
        value: 'minor hexatonic'
    },
    {
        text: 'minor pentatonic',
        value: 'minor pentatonic'
    },
    {
        text: 'minor six diminished',
        value: 'minor six diminished'
    },
    {
        text: 'minor six pentatonic',
        value: 'minor six pentatonic'
    },
    {
        text: 'mixolydian',
        value: 'mixolydian'
    },
    {
        text: 'mixolydian pentatonic',
        value: 'mixolydian pentatonic'
    },
    {
        text: 'mystery #1',
        value: 'mystery #1'
    },
    {
        text: 'neopolitan',
        value: 'neopolitan'
    },
    {
        text: 'neopolitan major',
        value: 'neopolitan major'
    },
    {
        text: 'neopolitan major pentatonic',
        value: 'neopolitan major pentatonic'
    },
    {
        text: 'neopolitan minor',
        value: 'neopolitan minor'
    },
    {
        text: 'oriental',
        value: 'oriental'
    },
    {
        text: 'persian',
        value: 'persian'
    },
    {
        text: 'phrygian',
        value: 'phrygian'
    },
    {
        text: 'phrygian dominant',
        value: 'phrygian dominant'
    },
    {
        text: 'six tone symmetric',
        value: 'six tone symmetric'
    },
    {
        text: 'spanish heptatonic',
        value: 'spanish heptatonic'
    },
    {
        text: 'super locrian pentatonic',
        value: 'super locrian pentatonic'
    },
    {
        text: 'whole tone',
        value: 'whole tone'
    },
    {
        text: 'whole tone pentatonic',
        value: 'whole tone pentatonic'
    }
]


const NOTES = 'a a# b c c# d d# e f f# g g#'.split(' '); // è l'array di note
const NOTESENH = 'a bb b c db d eb e f gb g ab'.split(' '); // è l'array di note

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

// Crea la scala da suonare
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

// Crea gli accordi da suonare 
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
                showColor = COLOURS_MERGE[instance.colors[i]];
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