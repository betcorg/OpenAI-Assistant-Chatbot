import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatScreen from "./screens/ChatScreen";
import Login from "./screens/Login";
import Register from "./screens/Register";



const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<ChatScreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </>
    );
};
export default App;
