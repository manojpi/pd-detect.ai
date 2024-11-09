import React, { useState } from "react"
import { SendHorizontal } from "lucide-react";


export default function ChatBox() {
    const [prompt, setPrompt] = useState<string>('');

    const addMessage = async () => {
        const messageElement = document.createElement("div");
        messageElement.className = '';
    }

    const userPromptAdder  = (userQuery: string) => {

        const chat_content_id = "chat-content"
        const newUserQueryElement = document.createElement("div")
        const newUserQueryContent = document.createElement("p")
        newUserQueryContent.innerHTML = userQuery
        newUserQueryElement.className = "flex justify-end items-center space-x-3  mb-8 rounded-lg text-gray-300 p-4  text-right"
        newUserQueryContent.className = "bg-zinc-600 bg-neutral-800 p-2 rounded-xl"
        newUserQueryElement.appendChild(newUserQueryContent)

        document.getElementById(chat_content_id)?.appendChild(newUserQueryElement)
    }

    const llmResponseAdder = (llmResponse: string) => {
        const chat_content_id = "chat-content"
        const newLLMResponseElement = document.createElement("div")
        const newLLMResponseContent = document.createElement("p")
        newLLMResponseContent.innerHTML = llmResponse
        newLLMResponseElement.className = "w-full mb-8 rounded-lg  bg-neutral-800 text-gray-400 p-4 text-right"
        newLLMResponseElement.appendChild(newLLMResponseContent)

        document.getElementById(chat_content_id)?.appendChild(newLLMResponseElement)
    }

    const handleAskBtn = async () => {
        
        const query = {
            prompt: prompt
        }
        setPrompt('');
        userPromptAdder(prompt)

        const llmResponse = await fetch('http://localhost:8000/api/chat/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query)
        }).then(
            response => response.json()
        ).then(data => data.message);
        
        console.log(llmResponse);
        llmResponseAdder(llmResponse);
    }

    return (
        <div className="w-screen max-w-screen-2xl bg-neutral-900 fixed bottom-9 pt-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-screen-md min-w-screen-md bg-neutral-800 rounded-lg flex items-center p-3">
                <input
                    type="text"
                    placeholder="Ask about Parkinson Disease"
                    className="bg-transparent flex-grow outline-none text-gray-400 text-lg "
                    onChange={e => setPrompt(e.target.value)}
                    value={prompt}
                />
                <button onClick={handleAskBtn} className="w-10 h-10 ml-2 p-2 rounded-full bg-slate-700 flex flex-col items-center justify-center hover:bg-slate-500">
                    <SendHorizontal color='#fdf7f7' size={25} strokeWidth={2.5} absoluteStrokeWidth />
                </button>
            </div>
        </div>
    )
}

