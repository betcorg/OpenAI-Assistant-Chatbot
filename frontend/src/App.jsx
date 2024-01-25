import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Assistant from "./screens/AssistantChat";
import PDFSummariser from "./screens/PDFSummariser";

import { AuthProvider } from "./context/AuthContext";

const App = () => {
    return (
        <>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/assistant" element={<Assistant />} />
                        <Route path="/pdfsummariser" element={<PDFSummariser />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    );
};
export default App;
