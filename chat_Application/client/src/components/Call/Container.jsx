import { reduceCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(null);
  const [publishStream, setPublishStream] = useState(null);

  // Handle call acceptance
  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data, socket]);

  // Fetch token for call
  useEffect(() => {
    const getToken = async () => {
      try {
        const { data: { token: returnedToken } } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
        setToken(returnedToken);
      } catch (err) {
        console.error("Error fetching call token:", err);
      }
    };
    if (callAccepted) {
      getToken();
    }
  }, [callAccepted, userInfo]);

  // Start the call using ZegoExpressEngine
  useEffect(() => {
    const startCall = async () => {
      try {
        const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
        const zg = new ZegoExpressEngine(
          process.env.NEXT_PUBLIC_ZEGO_APP_ID,
          process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
        );
        setzgVar(zg);

        // Handle room stream updates
        zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
          if (updateType === "ADD") {
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement(data.callType === "video" ? "video" : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            if (rmVideo) {
              rmVideo.appendChild(vd);
            }
            const stream = await zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true,
            });
            vd.srcObject = stream;
          } else if (updateType === "DELETE" && zgVar && localStream && streamList[0].streamID) {
            zgVar.destroyStream(localStream);
            zgVar.stopPublishingStream(streamList[0].streamID);
            zgVar.logoutRoom(data.roomId.toString());
            dispatch({ type: reduceCases.END_CALL });
          }
        });

        // Login to room and create stream
        await zg.loginRoom(data.roomId.toString(), token, {
          userID: userInfo.id.toString(),
          userName: userInfo.name,
        }, { userUpdate: true });

        const stream = await zg.createStream({
          camera: {
            audio: true,
            video: data.callType === "video",
          },
        });

        setLocalStream(stream);

        const localVideo = document.getElementById("local-video");
        const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
        videoElement.id = "video-local-zego";
        videoElement.className = "h-28 w-32";
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        localVideo.appendChild(videoElement);
        videoElement.srcObject = stream;

        const streamID = "123" + Date.now().toString();
        setPublishStream(streamID);
        zg.startPublishingStream(streamID, stream);
      } catch (err) {
        console.error("Error starting call:", err);
      }
    };

    if (token) {
      startCall();
    }
  }, [token, data.callType, data.roomId, dispatch, userInfo]);

  // End the call
  const endCall = () => {
    const id = data.id;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }

    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", { from: id });
    } else {
      socket.current.emit("reject-video-call", { from: id });
    }

    dispatch({ type: reduceCases.END_CALL });
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video" ? "On going call" : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-video"></div>
      </div>
      <div className="h-20 w-20 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
      </div>
    </div>
  );
}

export default Container;
