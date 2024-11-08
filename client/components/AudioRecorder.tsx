import React, {useState, useEffect} from "react";

const AudioRecorder = () => {

    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [bars, setBars] = useState(Array(50).fill(0));
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChuncks] = useState<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    useEffect(() => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true})
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                })
                .catch(error => console.error("Error in accessing microphone: ", error));
        }
    }, [])

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        if (isVoiceRecording) {
            intervalId = setInterval(() => {
                setBars(prevBars => prevBars.map(() => Math.random() * 100));
            }, 100);
        }
        return () => clearInterval(intervalId);
    }, [isVoiceRecording]);

    const startAudioRecording = async () => {

        // reset the old audio chunks and blobs
        await setAudioBlob(null);
        await setAudioChuncks([])
        if (mediaRecorder) {
            setIsVoiceRecording(true);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = (event) => {
                setAudioChuncks((prev) => [...prev, event.data]);
            };
        }
    };

    const stopAudioRecording = async () => {

        if (mediaRecorder) {
            setIsVoiceRecording(false);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(audioChunks, {type: 'audio/mp3'});
                setAudioBlob(blob);
            }
            mediaRecorder.stop();
        }
    }

    const handleSendAudio = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            const audio = new Audio(window.URL.createObjectURL(audioBlob)); // await new Audio(window.URL.createObjectURL(audioBlob)) does not work

            try {
                const response = await fetch('http://localhost:8085/api/predict/audio/', {
                    method: 'POST',
                    body: formData,
                });

            } catch (error) {
                console.error('Error sending audio: ', error)
            }
        }
    }

    return (
        <div className="flex flex-col items-center p-4 bg-neutral-800 rounded-lg">
            <div className="w-full h-32 bg-black rounded-lg overflow-hidden flex items-end justify-center space-x-1 mb-4">
                {
                    bars.map((height, index) => (
                        <div
                        key={index}
                        className="w-1 bg-blue-500 transition-all duration-100 ease-out"
                        style={{height: `${height}%`}}
                        ></div>
                    ))
                }

            </div>
            <button
            onClick={startAudioRecording}
            className = {"px-4 py-2 rounded-full font-bold bg-blue-500 text-white hover:bg-red-500 text-white"}>
                Start Recording
            </button>

            <button
            onClick={stopAudioRecording}
            className = {"px-4 py-2 rounded-full font-bold bg-blue-500 text-white hover:bg-red-500 text-white"}>
                Stop Recording
            </button>

            <button
            onClick={handleSendAudio}
            className = {"px-4 py-2 rounded-full font-bold bg-blue-500 text-white hover:bg-red-500 text-white"}>
                Detech Parkinson Disease
            </button>

        </div>
    )
}

export default AudioRecorder;