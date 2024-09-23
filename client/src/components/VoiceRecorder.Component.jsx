import React, {useState, useEffect} from "react";


const VoiceRecorder = () => {

    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [bars, setBars] = useState(Array(50).fill(0));
    
    const toggleIsRecording = () => {
        setIsVoiceRecording(!isVoiceRecording);
    }

    useEffect(() => {
        let intervalId;
        if (isVoiceRecording) {
            intervalId = setInterval(() => {
                setBars(prevBars => prevBars.map(() => Math.random() * 100));
            }, 100);
        }
        return () => clearInterval(intervalId);
    }, [isVoiceRecording]);

    return (
        <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
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
            onClick={toggleIsRecording}
            className = {`px-4 py-2 rounded-full font-bold ${isVoiceRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                {isVoiceRecording ? 'Stop Recording' : 'Start Recoding'}
            </button>
        </div>
    )
}

export default VoiceRecorder;