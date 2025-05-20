"use client";

import { MicButton } from "@/components/ui/mic-button";

export const TextCard = ({ text }: { text: string }) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Please click "Start" and read the text aloud.
      </p>
      <p className="text-lg font-bold p-2 bg-muted rounded-md mt-4 mb-4">
        "{text}"
      </p>
      <MicButton />
    </div>
  );
};
