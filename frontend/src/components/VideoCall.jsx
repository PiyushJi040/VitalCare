 import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer/simplepeer.min.js';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Adjust if needed

const VideoCall = ({ roomId, userId, onClose }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    startLocalVideo();

    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit('join-room', roomId, userId);

    socketRef.current.on('user-connected', (userId) => {
      if (userId !== userId) {
        callUser(userId);
      }
    });

    socketRef.current.on('offer', handleReceiveOffer);
    socketRef.current.on('answer', handleReceiveAnswer);
    socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
    socketRef.current.on('user-disconnected', () => {
      endCall();
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startLocalVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const callUser = (remoteUserId) => {
    peerRef.current = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peerRef.current.on('signal', data => {
      if (data.type === 'offer') {
        socketRef.current.emit('offer', { target: remoteUserId, caller: userId, sdp: data });
      } else if (data.candidate) {
        socketRef.current.emit('ice-candidate', { target: remoteUserId, candidate: data.candidate });
      }
    });

    peerRef.current.on('stream', remoteStream => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setIsCallActive(true);
    });

    peerRef.current.on('close', () => {
      endCall();
    });
  };

  const handleReceiveOffer = (payload) => {
    if (payload.target !== userId) return;

    peerRef.current = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    peerRef.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peerRef.current.on('signal', data => {
      if (data.type === 'answer') {
        socketRef.current.emit('answer', { target: payload.caller, sdp: data });
      } else if (data.candidate) {
        socketRef.current.emit('ice-candidate', { target: payload.caller, candidate: data.candidate });
      }
    });

    peerRef.current.on('stream', remoteStream => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setIsCallActive(true);
    });

    peerRef.current.on('close', () => {
      endCall();
    });

    peerRef.current.signal(payload.sdp);
  };

  const handleReceiveAnswer = (payload) => {
    if (payload.target !== userId) return;
    if (peerRef.current) {
      peerRef.current.signal(payload.sdp);
    }
  };

  const handleNewICECandidateMsg = (candidate) => {
    if (peerRef.current) {
      peerRef.current.signal(candidate);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setIsCallActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 rounded-t-lg">
          <div className="flex justify-between items-center text-white">
            <div>
              <h3 className="text-lg font-semibold">Video Consultation</h3>
              <p className="text-sm text-gray-300">Room: {roomId}</p>
            </div>
            <div className="text-sm text-gray-300">
              {isCallActive ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />

          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
            {isVideoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4 rounded-b-lg">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full ${
                isAudioOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
              } text-white transition-colors`}
            >
              {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
              } text-white transition-colors`}
            >
              {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </button>

            {isCallActive ? (
              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            ) : (
              <button
                disabled
                className="p-3 rounded-full bg-green-600 text-white opacity-50 cursor-not-allowed"
                title="Call starts automatically when other user joins"
              >
                <Phone className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={endCall}
              className="text-gray-400 hover:text-white text-sm"
            >
              Leave Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
