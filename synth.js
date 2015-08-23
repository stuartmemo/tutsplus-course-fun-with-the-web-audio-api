var context = new AudioContext(),
    volume = context.createGain(),
    squareOscillators = {},
    sawtoothOscillators = {},
    analyser = context.createAnalyser(),
    waveData = new Uint8Array(analyser.frequencyBinCount),
    canvas = document.querySelector('#oscilloscope'),
    canvasContext = canvas.getContext('2d'),
    canvasHeight = 150,
    canvasWidth = 587;


var keyboard = new QwertyHancock({
    id: 'keyboard',
    octaves: 2
});

volume.gain.value = 0.5;

volume.connect(context.destination);

keyboard.keyDown = function (note, frequency) {
    var squareOsc = context.createOscillator(),
        sawtoothOsc = context.createOscillator(),
        gainNode = context.createGain();

    gainNode.gain.value = 0.5;

    squareOscillators[note] = squareOsc;
    sawtoothOscillators[note] = sawtoothOsc;

    squareOsc.connect(volume);
    sawtoothOsc.connect(volume);

    squareOsc.type = 'square';
    sawtoothOsc.type = 'sawtooth';

    squareOsc.frequency.value = frequency;
    squareOsc.detune.value = -10;

    sawtoothOsc.frequency.value = frequency;
    sawtoothOsc.detune.value = 10;

    squareOsc.start(context.currentTime);
    sawtoothOsc.start(context.currentTime);

    squareOsc.connect(gainNode);
    sawtoothOsc.connect(gainNode);

    gainNode.connect(analyser);
};

keyboard.keyUp = function (note, frequency) {
    sawtoothOscillators[note].stop(context.currentTime);
    sawtoothOscillators[note].disconnect();
    squareOscillators[note].stop(context.currentTime);
    squareOscillators[note].disconnect();
};

var xWidth = canvasWidth / analyser.frequencyBinCount;

var draw = function () {
    requestAnimationFrame(function () {
        canvas.width = canvasWidth; // Clear the canvas on each frame

        analyser.getByteTimeDomainData(waveData);

        for (var i = 0; i < analyser.frequencyBinCount; i++) {
            var yPosition = waveData[i] / 256; // 1 is max 0 is min,
                xPosition = i * xWidth;

            yPosition = yPosition * canvasHeight;
            canvasContext.lineTo(xPosition, yPosition);
        }

        canvasContext.strokeStyle = 'yellow';
        canvasContext.stroke();

        draw();
    })
};

draw();
