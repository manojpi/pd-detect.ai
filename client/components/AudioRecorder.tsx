import React, { useState, useEffect, useRef } from "react";
import { Mic, Bolt } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";

export default function AudioRecorder() {

    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const audioRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { toast } = useToast();

    const handleStartAudioRecording = async () => {
        try {
            const audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = audioStream;

            // creating a MediaRecorder Instance
            const audioRecorder = new MediaRecorder(audioStream, {mimeType: 'audio/webm'});
            audioRecorderRef.current = audioRecorder;

            // store audio data chunks
            const audioChunks: Blob[] = [];

            // on data available, push the data to chunks array
            audioRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            }

            // on stoping the audio recorder
            audioRecorder.onstop = () => {
                const currentAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(currentAudioBlob);
                setAudioURL(url);
                setAudioBlob(currentAudioBlob);
            }

            // start recording
            audioRecorder.start();
            setIsAudioRecording(true);
        } catch (error) {
            console.error('Error accessing user audio:', error);
        }
    }

    const handleStopAudioRecording = async () => {

        if (audioRecorderRef.current) {
            audioRecorderRef.current.stop(); // stops the audio recording process and calls ondataavialable
        }

        if (audioStreamRef.current) {
            // stops all the media tracks, actual recording stop
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }

        setIsAudioRecording(false);
    }

    const handleMicClick = async () => {
        if (isAudioRecording) {
            handleStopAudioRecording();
        } else {
            handleStartAudioRecording();
        }
    }

    const handleAudioSend = async () => {
        const formData = new FormData();
        if (audioBlob) {
            formData.append('audio', audioBlob, 'recording.webm'); ///webp is better for compatibility
            try {
                const response = await fetch('http://localhost:8000/api/detect/audio/', {
                    method: 'POST',
                    body: formData
                }).then( response => {
                    if (!response.ok) {
                        console.error('Error uploading audio:', response.statusText);
                    }
                    return response.json();
                }).then(data => {
                    console.log(data.message);
                    toast({
                        title: "Parkinson Disease Diagnosis",
                        description: data.message
                    })
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    return (
        <div className="mt-12 flex flex-col items-center">
            <div onClick={handleMicClick} className="rounded-full w-44 h-44 flex flex-col justify-center items-center hover:cursor-pointer" style={{ backgroundColor: !isAudioRecording ? "rgb(253, 247, 247)" : "rgb(234, 93, 93)" }}>
                <Mic size={150} strokeWidth={1.5} color={!isAudioRecording ? "rgb(234, 93, 93)" : "rgb(253, 247, 247)"} />
            </div>

            {audioURL && (
                <div className="mt-12 flex flex-row items-center justify-normal">
                    <audio className="w-30" controls src={audioURL} ></audio>
                    <button onClick={handleAudioSend} className="ml-5 w-12 h-12 rounded-full bg-slate-700 flex flex-col items-center justify-center  hover:bg-slate-500">
                        <Bolt size={35} color="#fdf7f7" strokeWidth={2.5} absoluteStrokeWidth />
                    </button>
                </div>
            )}

        </div>
    )
}