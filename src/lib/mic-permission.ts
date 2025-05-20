"use client";

import { useEffect, useState } from "react";

export const useMicrophonePermission = () => {
  const [permission, setPermission] = useState<
    "granted" | "denied" | "prompt" | "error"
  >("prompt");
  

  const requestPermission = async () => {
    try {
      // await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission("granted");
      return true;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermission("denied");
      return false;
    }
  };

  useEffect(() => {
    async function checkPermission() {
      try {
        if (navigator.permissions) {
          const status = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          setPermission(status.state);

          status.onchange = () => {
            setPermission(status.state);
          };
        } else {
          // await navigator.mediaDevices.getUserMedia({ audio: true });
          setPermission("granted");
        }
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setPermission("denied");
      }
    }

    checkPermission();
  }, []);

  return { permission, requestPermission };
};
