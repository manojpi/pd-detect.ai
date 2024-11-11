"use client";

import React, { useState } from 'react';
import AudioRecorder from '../AudioRecorder';
import { Toaster } from "../ui/toaster";
import ChatBox from './ChatBox';

const BotUI = () => {

    return (
        <div className="flex-grow flex flex-col pt-40 justify-start items-center bg-neutral-900 h-9/12 ">
            <div className="flex flex-col justify-start items-center">
                <div className="flex flex-col w-full max-w-3xl">
                    <p className='text-4xl font-bold mb-2 text-gray-300 text-center'>Take a Parkinson Disease Test</p>
                    <p className="pt-4 text-gray-400 text-center">
                        Get an early assessment with our AI-powered tool.
                        Record a voice sample and answer a few questions to screen for signs of Parkinson's disease. Fast, easy, and confidential.
                    </p>
                </div>

                <AudioRecorder/>
                <Toaster/>

                <div id="chat-content" className='mt-11 mb-16 w-full h-full max-w-3xl overflow-hidden'>

                </div>
                <ChatBox/>
                </div>
        </div>
    );
};

export default BotUI;