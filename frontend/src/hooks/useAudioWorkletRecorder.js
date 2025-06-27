import { useEffect, useRef, useState } from 'react';

export const useAudioWorkletRecorder = (onAudioChunk) => {
  const audioContextRef = useRef(null);
  const processorNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const start = async () => {
    audioContextRef.current = new AudioContext();
    await audioContextRef.current.audioWorklet.addModule('/recorder-worklet.js');

    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

    processorNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'recorder-processor');
    processorNodeRef.current.port.onmessage = (e) => {
      onAudioChunk(e.data); // e.data is a Float32Array of audio samples
    };

    source.connect(processorNodeRef.current).connect(audioContextRef.current.destination);
  };

  const stop = () => {
    processorNodeRef.current.port.postMessage('STOP');
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
  };

  return { start, stop };
};
