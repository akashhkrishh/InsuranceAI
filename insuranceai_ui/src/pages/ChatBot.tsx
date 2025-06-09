import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import {parseMessageWithLinks} from "../utils/parseMessageWithLinks.tsx";

interface ChatBotProps {
    onClick?: () => void;
}



const ChatBot: React.FC<ChatBotProps> = ({ onClick }) => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<React.ReactNode[]>([]);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInitialMessage = async () => {
            setLoading(true);
            try {
                const res = await axios.post("http://localhost:5000/api/chatbot/chat", {
                    user_id: "john",
                });

                const data = res.data;

                if (data.response) {
                    setChat([
                        <div key={0}>
                            <strong>Chat AI:</strong> {parseMessageWithLinks(data.response)}
                        </div>,
                    ]);
                } else {
                    setChat([
                        <div key={0}>
                            <strong>Chat AI:</strong> Hello! I am your Insurance Assistant. Ask me anything about insurance.
                        </div>,
                    ]);
                }
            } catch (err) {
                console.error("Error loading initial message:", err);
                setChat([
                    <div key={0} className="text-red-600">
                        Failed to connect to chatbot API.
                    </div>,
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialMessage();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat, loading]);

    const handleSend = async () => {
        if (!message.trim()) return;

        setChat((prev) => [
            ...prev,
            <div
                className="w-full flex justify-end items-end text-right"
                key={prev.length}
            >
                <div className="w-fit text-right px-2.5 bg-blue-500 text-white py-1">
                    {message}
                </div>
            </div>,
        ]);

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/chatbot/chat", {
                user_id: "john",
                message: message,
            });

            const data = res.data;

            setChat((prev) => [
                ...prev,
                <div key={prev.length} className="text-gray-800">
                    <strong>Chat AI:</strong> {parseMessageWithLinks(data.response || "No response.")}
                </div>,
            ]);
        } catch (err: unknown) {
            console.error("Error connecting to chatbot API:", err);
            alert("Failed to connect to chatbot API.");
            setChat((prev) => [
                ...prev,
                <div key={prev.length} className="text-red-600">
                    Failed to connect to chatbot API.
                </div>,
            ]);
        } finally {
            setLoading(false);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="absolute bottom-0 right-0 bg-white/70 z-50 w-full h-full">
            <div className="border bg-white bottom-0 right-0 absolute h-[550px] w-[380px] flex flex-col shadow-2xl rounded-t-lg">

                <div className="h-10 border-b border-slate-300 text-white bg-blue-500 flex items-center justify-between">
                    <h1 className="font-semibold px-4">Insure AI Chat Bot</h1>
                    <div
                        onClick={onClick}
                        className="flex items-center justify-center cursor-pointer aspect-square h-full bg-red-600 text-white px-2"
                    >
                        <X />
                    </div>
                </div>

                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-gray-700"
                >
                    {chat.map((msg, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                            {msg}
                        </div>
                    ))}
                    {loading && <div>⏳ Thinking...</div>}
                </div>

                <div className="p-2 border-t border-slate-200 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 appearance-none outline-none border-none bg-transparent px-3 py-1 placeholder-gray-400"
                        placeholder="Ask something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-blue-500 text-white px-3 py-1 hover:bg-blue-600 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
