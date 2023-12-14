const Login = () => {
    return (
        <>
            <div className="bg-slate-50 h-screen flex items-center justify-center">
                <div className="bg-white h-[450px] w-[400px] rounded-xl shadow-xl p-4">
                    <div className="">
                        <h1 className="text-6xl text-center p-4 font-bold">Login</h1>
                        <p className="text-center">
                            By logging in, you accept our terms and privacy
                            policy.
                        </p>
                    </div>

                    <div>
                        <div className="">
                            <form>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full rounded-md border border-slate-300 p-2 my-2"
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-md border border-slate-300 p-2 my-2"
                                />
                                <button className="bg-green-500 rounded-md text-white px-4 py-2 w-full">
                                    Login
                                </button>
                            </form>
                        </div>

                        <div className="">
                            <p className="text-center my-2">
                                Don't have an account?{" "}
                                <a href="/signup" className="text-blue-500">
                                    Sign up
                                </a>
                            </p>
                            <p className="text-center my-2">
                                Forgot your password?{" "}
                                <a
                                    href="/forgotpassword"
                                    className="text-blue-500"
                                >
                                    Reset password
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
