import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/app/context/voice-recorder";

export const MicButton = () => {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  
  if (isRecording) {
    return (
      <Button variant="destructive" onClick={stopRecording}>
        Stop
      </Button>
    );
  }
  return <Button onClick={startRecording}>Start</Button>;
};
