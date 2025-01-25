"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatRoom({ roomName, userId, onLeave, wsRef }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const ws = wsRef.current;

    ws.onmessage = (e)=>{
      const parsedMsg = JSON.parse(e.data);
      setMessages((prev) => [...prev, parsedMsg]);
    }
  }, [roomName, wsRef]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messagePayload = {
        type: "chat",
        payload: {
          message: newMessage,
        },
      };

      wsRef.current.send(JSON.stringify(messagePayload));
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Room: {roomName}</h2>
          <Button variant="outline" onClick={onLeave} className="mt-2">
            Leave Room
          </Button>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{userId==msg.userId ? "You" : "Anonymous"}:</strong> {msg.message}
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2 mt-4">
          <Input
            placeholder="Type your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}


