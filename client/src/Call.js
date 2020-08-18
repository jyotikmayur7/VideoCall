import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

function Call() {
    const [yourID, setYourID] = useState("");
    const [username, setUsername] = useState("User");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io.connect("");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        })

        socket.current.on("yourID", (id) => {
            setYourID(id);
        })

        socket.current.emit("username", username + Math.floor((Math.random() * 100) + 1));

        socket.current.on("usersData", (users) => {
            setUsers(users);
        })

        socket.current.on("hey", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        })

    }, [])


    let UserVideo;
    if (stream) {
        UserVideo = (
            <Video playsInline muted ref={userVideo} autoPlay />
        )
    }

    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <Video playsInline ref={partnerVideo} autoPlay />
        )
    }


    return (
        <Container>
            <Row>
                {UserVideo}
                {PartnerVideo}
            </Row>
            <Row>
                {Object.keys(users).map(key => {
                    if (key === yourID) {
                        return null;
                    }
                    return (
                        <button onClick={() => callPeer(key)}>Call {users[key]}</button>
                    )
                })}
            </Row>
            <Row>
                {incomingCall}
            </Row>
        </Container>
    )
}

export default Call;