// recorder-worklet.js
class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data === 'STOP') this.stop = true;
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0][0]; // mono audio
    if (input && !this.stop) {
      this.port.postMessage(input); // Send Float32Array to main thread
    }
    return true;
  }
}

registerProcessor('recorder-processor', RecorderProcessor);
