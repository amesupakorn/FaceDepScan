import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import FaceUpload from "./face_upload/face_upload"
function App() {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<FaceUpload />} />

            </Routes>
    </Router>
  );
}

export default App;
