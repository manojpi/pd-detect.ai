import React from 'react';
import { LogOut } from 'lucide-react';
import AudioRecorder from './AudioRecorder.Component';

const ChatbotUI = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-white rounded-full"></div>
          <span className="font-semibold">Name</span>
        </div>
        <div className="flex items-center space-x-4">

          <button className="flex items-center space-x-1 bg-white text-gray-900 px-3 py-1 rounded">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-800 rounded-lg p-6 max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-2">Take a Parkinson Disease Test</h1>
          <p className="text-gray-400 mb-4">
            ...
          </p>
          <p className="text-gray-400">
          Get an early assessment with our AI-powered tool. Record a voice sample and answer a few questions to screen for signs of Parkinson's disease. Fast, easy, and confidential.
          </p>
        </div>

        <AudioRecorder/>

        <div className="fixed bottom-4 mt-8 b-0 w-full max-w-3xl">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center">
            <input
              type="text"
              placeholder="Send a message..."
              className="bg-transparent flex-grow outline-none"
            />
            <button className="ml-2 p-2 rounded-full bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">
            pd-detect.ai
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatbotUI;