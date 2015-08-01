var context = new AudioContext(),
    volume = context.createGain(),
    sawtoothOscillators = {},
    squareOscillators = {};

var keyboard = new QwertyHancock({
    id: 'keyboard',
    octaves: 2
});

volume.gain.value = 0.5;

volume.connect(context.destination);

keyboard.keyDown = function (note, frequency) {
    var osc = context.createOscillator(),
        squareOsc = context.createOscillator();

    sawtoothOscillators[note] = osc;
    squareOscillators[note] = squareOsc;

    osc.connect(volume);
    squareOsc.connect(volume);

    osc.type = 'sawtooth';
    squareOsc.type = 'square';
    osc.frequency.value = frequency;
    osc.detune.value = 10;
    squareOsc.frequency.value = frequency;
    squareOsc.detune.value = -10;
    osc.start(context.currentTime);
    squareOsc.start(context.currentTime);
};

keyboard.keyUp = function (note, frequency) {
    sawtoothOscillators[note].stop(context.currentTime);
    sawtoothOscillators[note].disconnect();
    squareOscillators[note].stop(context.currentTime);
    squareOscillators[note].disconnect();
};
