"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from "sonner"

interface VoiceRecorderContextType {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearRecording: () => void;
  error: string | null;
}

const VoiceRecorderContext = createContext<VoiceRecorderContextType | undefined>(undefined);

export function VoiceRecorderProvider({ children }: { children: ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      toast.error("Error starting recording: " + (err instanceof Error ? err.message : String(err)));
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setError(null);
  }, []);

  const value = {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error,
  };

  console.log(audioBlob);

  return (
    <VoiceRecorderContext.Provider value={value}>
      {children}
    </VoiceRecorderContext.Provider>
  );
}

// Custom hook to use the voice recorder context
export function useVoiceRecorder() {
  const context = useContext(VoiceRecorderContext);
  if (context === undefined) {
    throw new Error('useVoiceRecorder must be used within a VoiceRecorderProvider');
  }
  return context;
}
