/* eslint-disable react/prop-types */
import { useState } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import Header from "./ChatHeader";

// const url = '/api';

const responseMessage = (props) => {
    return (
        <div className=" flex justify-start">
            <div className="bg-[#1e313a] p-2 rounded-xl w-[90%] text-white">
                <p className="">{props.text}</p>
            </div>
        </div>
    );
};

const UserMessage = (props) => {
    return (
        <div className="flex justify-end">
            <div className="bg-[#229369] p-2 rounded-xl w-[90%] text-white">
                <p>{props.text}</p>
            </div>
        </div>
    );
};

const ChatBox = () => {
    const [inputValue, setInputValue] = useState("");
    const [messageBox, setMessageBox] = useState([]);
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        console.log(e.target.value);
        setInputValue(e.target.value);
        setQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessageBox([...messageBox, query]);

        setInputValue("");
        
        const response = await fetch("/api/v1/completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: query }),
        });

        console.log(response);
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
    };


    const addMessage = messageBox.map((message, index) => (
        (message.role==='user')
        ?<UserMessage key={index} text={message} />
        :<responseMessage key={index} text={message} />
    ))

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-full w-full mx-auto">
                {/* HEADER */}
                <Header />

                {/* Chat box */}
                <div
                    style={{ backgroundImage: "url(/background-chat.jpg)" }}
                    className="h-[92%] flex flex-col justify-center bg-contain p-2"
                >
                    {/* Messages box */}
                    <div className="h-full w-full p-4 flex flex-col justify-end gap-3">
                        {}
                    </div>

                    {/* Text input */}
                    <div className="h-14 w-full flex justify-center items-center p-2">
                        <div className="flex items-center justify-center w-full">
                            <form
                                className="w-full flex items-center justify-center gap-2"
                                onSubmit={handleSubmit}
                            >
                                <textarea
                                    className="w-[90%] h-10 rounded-md p-2 outline-none"
                                    onChange={handleChange}
                                    value={inputValue}
                                ></textarea>

                                <button
                                    type="submit"
                                    className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center pl-1 text-white"
                                >
                                    <RiSendPlane2Fill className="text-xl" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
