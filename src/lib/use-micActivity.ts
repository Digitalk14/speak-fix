import { useEffect, useState } from "react";

export function useMicrophoneActivity() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaStreamAudioSourceNode;
    let rafId: number;

    const checkVolume = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setIsActive(avg > 10); 
      rafId = requestAnimationFrame(checkVolume);
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      stream = s;
      audioContext = new AudioContext();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      checkVolume();
    });

    return () => {
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach(t => t.stop());
      audioContext?.close();
    };
  }, []);

  return isActive;
}