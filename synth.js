var context = new AudioContext(),
    osc = context.createOscillator(),
    volume = context.createGain();

var keyboard = new QwertyHancock({
    id: 'keyboard',
    octaves: 2
});

volume.gain.value = 0.5;

osc.connect(volume);
volume.connect(context.destination);


keyboard.keyDown = function (note, frequency) {
    osc.frequency.value = frequency;
    osc.start(context.currentTime);
};

keyboard.keyUp = function () {
    osc.stop(context.currentTime);
};
