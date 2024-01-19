import AsstConfig from "../components/AsstConfig";
import ChatBox from "../components/ChatBox";


const Assistant = () => {
    return (
        <>
            <div className="h-screen w-full grid grid-cols-12">
             <div className="h-screen col-span-3">
                <AsstConfig />
             </div>
             <div className="h-screen col-span-6">
                <ChatBox />
             </div>
             <div className="h-screen col-span-3"></div>
            </div>
        </>
    );
};

export default Assistant;
