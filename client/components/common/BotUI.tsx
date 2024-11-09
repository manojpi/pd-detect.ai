"use client";

import React, { useState } from 'react';
import { Mic, SendHorizontal } from "lucide-react";
import AudioRecorder from '../AudioRecorder';


const BotUI = () => {

    const [prompt, setPrompt] = useState<string>('Ask about Parkinson Disease');

    return (
        <div className="flex-grow flex flex-col pt-40 justify-start items-center bg-neutral-900 ">
            <div className="flex flex-col w-full max-w-2xl">
                <p className='text-4xl font-bold mb-2 text-gray-300 text-center'>Take a Parkinson Disease Test</p>
                <p className="pt-4 text-gray-400 text-center">
                    Get an early assessment with our AI-powered tool.
                    Record a voice sample and answer a few questions to screen for signs of Parkinson's disease. Fast, easy, and confidential.
                </p>
            </div>

            <AudioRecorder/>

            <div className="fixed bottom-9 mt-8 w-full max-w-3xl">
                <div className="bg-neutral-800 rounded-lg flex items-center p-3">
                    <input
                        type="text"
                        placeholder={prompt}
                        className="bg-transparent flex-grow outline-none text-gray-400 text-lg"
                        onChange={ e => setPrompt(e.target.value)}
                    />
                    <button className="w-10 h-10 ml-2 p-2 rounded-full bg-slate-700 flex flex-col items-center justify-center hover:bg-slate-500">
                        <SendHorizontal color='#fdf7f7' size={25} strokeWidth={2.5} absoluteStrokeWidth/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BotUI;