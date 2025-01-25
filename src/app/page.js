"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, LogIn } from "lucide-react";
import { ChatRoom } from "@/app/Chat/page.js"; 

export default function ChatApp() {
  const [rooms, setRooms] = useState(["General", "Random", "Tech"]);
  const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userId, setUserId] = useState(null);
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("wss://chat-application-backend-a749.onrender.com");
    ws.onopen = () => console.log("WebSocket connection open");
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket connection closed");

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const handleCreateRoom = () => {
    const trimmedRoom = newRoom.trim();
    if(trimmedRoom && !rooms.includes(trimmedRoom)){
      setRooms([trimmedRoom,...rooms]);
    }
  };

  const handleJoinRoom = (room) => {
    console.log("inside join");
    const userId = Math.random()*100000;
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: { 
            room: room,
            userId : userId
          },
        })
      );
    }
    setUserId(userId);
    setSelectedRoom(room);
  };

  const handleLeaveRoom = () => {
    wsRef.current.close();
    setSelectedRoom(null);
    setUserId(null);
  };
  if (selectedRoom) {
    return <ChatRoom roomName={selectedRoom} userId={userId} onLeave={handleLeaveRoom} wsRef={wsRef} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chat Rooms</CardTitle>
          <CardDescription>Join an existing room or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-room">Create a new room</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="new-room"
                  placeholder="Enter room name"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                />
                <Button onClick={handleCreateRoom}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create
                </Button>
              </div>
            </div>
            <div>
              <Label>Available Rooms</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-1">
                {rooms.map((room) => (
                  <div key={room} className="flex items-center justify-between py-2">
                    <span>{room}</span>
                    <Button variant="outline" onClick={() => handleJoinRoom(room)}>
                      <LogIn className="mr-2 h-4 w-4" /> Join
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


