import React, { useState } from "react";

const Register = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const getUsername = (e) => {
        setName(e.target.value);
    };
    const getUserEmail = (e) => { 
        setEmail(e.target.value);
    }
    const getPassword = (e) => { 
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setName('');
        setEmail('');
        setPassword('');
        
        console.log(name, email, password);
    };

    return (
        <>
            <div className="bg-slate-50 h-screen flex items-center justify-center">
                <div className="bg-white h-[400px] w-[400px] rounded-xl shadow-xl p-4">
                    <div className="">
                        <h1 className="text-6xl text-center p-4 font-bold">
                            Sign Up
                        </h1>
                        <p className="text-center">
                            Enter your data to create an account.
                        </p>
                    </div>

                    <div>
                        <div className="">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full rounded-md border border-slate-300 p-2 my-2"
                                    onChange={getUsername}
                                    value={name}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    className="w-full rounded-md border border-slate-300 p-2 my-2"
                                    onChange={getUserEmail}
                                    value={email}
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-md border border-slate-300 p-2 my-2"
                                    onChange={getPassword}
                                    value={password}
                                />
                                <button
                                    type="submit"
                                    className="bg-green-500 rounded-md text-white px-4 py-3 w-full mt-4"
                                >
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
