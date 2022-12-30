import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";
import { useLocation } from "react-router";

const ENDPOINT = "https://socket-app-chat-web.herokuapp.com/";
// const ENDPOINT = 'localhost:8000';

let socket;

const Chat = () => {
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [users, setUsers] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	const location = useLocation();

	useEffect(() => {
		const { name, room } = queryString.parse(location.search);

		socket = io(ENDPOINT, { transports: ["websocket"] });

		setRoom(room);
		setName(name);

		socket.emit("join", { name, room }, (error) => {
			if (error) {
				alert(error);
			}
		});
	}, [ENDPOINT, location.search]);

	useEffect(() => {
		socket.on("message", (message) => {
			setMessages((messages) => [...messages, message]);
		});

		socket.on("roomData", ({ users }) => {
			setUsers(users);
		});
	}, []);

	const sendMessage = (event) => {
		event.preventDefault();

		if (message) {
			socket.emit("sendMessage", message, () => setMessage(""));
		}
	};

	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
		</div>
	);
};

export default Chat;
