const Home = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl">Wellcome to ChatBot Hub</h1>

            <a
                className="mt-6 bg-green-500 py-2 w-[30%] text-center rounded-md text-white text-lg"
                href="http://localhost:5173/login"
            >
                login
            </a>
        </div>
    );
};

export default Home;
