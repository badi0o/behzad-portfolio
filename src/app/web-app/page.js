'use client';
import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import io from 'socket.io-client';
import Peer from 'simple-peer';

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [peers, setPeers] = useState({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const canvasInstance = useRef(null); // Ref to store the fabric.Canvas instance

  // Initialize canvas and sockets
  useEffect(() => {
    // Initialize the canvas only if it hasn't been initialized yet
    if (!canvasInstance.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: window.innerWidth,
        height: window.innerHeight - 100,
      });
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setSocket(socket);

    // Real-time drawing sync
    canvasInstance.current.on('path:created', (e) => {
      socket.emit('drawing', e.path.toJSON());
    });

    socket.on('drawing', (path) => {
      fabric.Path.fromObject(path, (obj) => {
        canvasInstance.current.add(obj);
        canvasInstance.current.renderAll();
      });
    });

    // WebRTC setup for voice
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      socket.on('users', (users) => {
        const peers = {};
        users.forEach((userId) => {
          if (userId === socket.id) return;
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });
          peer.on('signal', (signal) => {
            socket.emit('signal', { userId, signal });
          });
          peers[userId] = peer;
        });
        setPeers(peers);
      });

      socket.on('signal', ({ userId, signal }) => {
        peers[userId].signal(signal);
      });
    });

    // Cleanup function
    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose(); // Dispose of the canvas
        canvasInstance.current = null; // Reset the ref
      }
      socket.disconnect(); // Disconnect the socket
    };
  }, []);

  // AI text recognition handler
  const handleTextRecognition = async () => {
    const canvasData = canvasRef.current.toDataURL();
    const response = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ image: canvasData }),
    });
    const { text } = await response.json();
    setAiPrompt(text);
  };

  const loadTemplate = (templateType) => {
    // Template loading logic
    console.log('Loading template:', templateType);
  };

  return (
    <div className="h-screen w-screen">
      <canvas ref={canvasRef} />
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-4 border-t">
        {/* Drawing Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => (canvasInstance.current.isDrawingMode = true)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Draw
          </button>
          <button
            onClick={() => (canvasInstance.current.isDrawingMode = false)}
            className="p-2 bg-gray-500 text-white rounded"
          >
            Select
          </button>
        </div>

        {/* Templates */}
        <select
          onChange={(e) => loadTemplate(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Choose Template</option>
          <option value="flowchart">Flowchart</option>
          <option value="mindmap">Mind Map</option>
          <option value="swot">SWOT Analysis</option>
        </select>

        {/* Voice Chat */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded ${audioEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {audioEnabled ? 'Mute' : 'Unmute'}
          </button>
          <span className="text-sm">Voice Chat</span>
        </div>

        {/* AI Tools */}
        <button
          onClick={handleTextRecognition}
          className="p-2 bg-purple-500 text-white rounded"
        >
          AI Assist
        </button>

        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="AI suggestions..."
        />
      </div>
    </div>
  );
}