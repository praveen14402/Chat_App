import { reduceCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from 'wavesurfer.js';

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animateTime, setAnimateTime] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          setAnimateTime(true); // Trigger animation
          return prevDuration + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });
    return () => {
      wavesurfer.destroy();
    };
  }, []);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudioBlob(null);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioURL = URL.createObjectURL(blob);
        setRecordedAudioBlob(blob);
        const audio = new Audio(audioURL);
        waveform.load(audioURL);
        setRecordedAudioBlob(blob); // Save the blob
      };
      mediaRecorder.start();
    }).catch(error => {
      console.error("Error accessing microphone:", error);
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();
    }
  };

  useEffect(() => {
    if (recordedAudioBlob) {
      const audio = new Audio(URL.createObjectURL(recordedAudioBlob));
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audio.currentTime);
      };
      audio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudioBlob]);

  const handlePlayRecording = () => {
    if (recordedAudioBlob) {
      waveform.stop();
      waveform.play();
      const audio = new Audio(URL.createObjectURL(recordedAudioBlob));
      audio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveform.stop();
    if (recordedAudioBlob) {
      const audio = new Audio(URL.createObjectURL(recordedAudioBlob));
      audio.pause();
    }
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", recordedAudioBlob, "recording.ogg");

      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });

      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });

        dispatch({
          type: reduceCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message
          },
          fromSelf: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAnimationEnd = () => {
    setAnimateTime(false);
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {recordedAudioBlob && (
          <div>
            {isRecording ? (
              <div
                className={`text-red-500 w-20 text-center ${animateTime ? 'animate-pulse' : ''}`}
                onAnimationEnd={handleAnimationEnd}
              >
                <span>{formatTime(recordingDuration)}</span>
              </div>
            ) : (
              <div className="text-center w-20">
                <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
              </div>
            )}
          </div>
        )}
        {isRecording ? (
          <div className="text-red-500 animate-pulse">
            <FaPauseCircle onClick={handleStopRecording} />
          </div>
        ) : (
          <div>
            {recordedAudioBlob && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaPauseCircle onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording}>
          <audio ref={audioRef} hidden />
        </div>
        <div>
          {!isRecording && (
            <FaMicrophone className="text-red-500" onClick={handleStartRecording} />
          )}
        </div>
        <div>
          <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={sendRecording} />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
