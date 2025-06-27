import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const VoiceRecorder = () => {
  const [replyUrl, setReplyUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      if (!(blob instanceof Blob)) {
        return reject(new Error('Invalid blob type'));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]; // clean base64
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendToBackend = async (blob) => {
    try {
      if (!(blob instanceof Blob)) {
        console.error('handleSendToBackend: Not a valid Blob:', blob);
        return;
      }

      const base64Audio = await convertBlobToBase64(blob);

      const res = await fetch('/api/v1/user/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio }),
      });

      if (!res.ok) throw new Error('API error');

      const replyBlob = await res.blob();
      setReplyUrl(URL.createObjectURL(replyBlob));
    } catch (err) {
      console.error('Failed to process recording:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-6 px-4">
      <ReactMediaRecorder
        audio
        blobPropertyBag={{ type: 'audio/webm' }}
        onStop={handleSendToBackend}
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <>
            <p className="text-xl">
              Status: <span className="font-semibold">{status}</span>
            </p>

            <div className="space-x-4">
              <button
                onClick={() => {
                  startRecording();
                  setIsRecording(true);
                  setReplyUrl(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
              >
                🎙️ Start
              </button>

              <button
                onClick={() => {
                  stopRecording();
                  setIsRecording(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
              >
                ⏹️ Stop
              </button>
            </div>

            {mediaBlobUrl && (
              <div className="mt-4">
                <p className="text-lg font-semibold">Your Recording:</p>
                <audio src={mediaBlobUrl} controls className="w-full max-w-md mt-2" />
              </div>
            )}

            {replyUrl && (
              <div className="mt-4">
                <p className="text-lg font-semibold">Therapist Response:</p>
                <audio src={replyUrl} controls className="w-full max-w-md mt-2" />
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default VoiceRecorder;
