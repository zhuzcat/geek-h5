import "./App.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Home from "./pages/Home";
import Question from "./pages/Question";
import Video from "./pages/Video";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/Profile/Edit";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/qs" element={<Question />} />
          <Route path="/home/video" element={<Video />} />
          <Route path="/home/profile" element={<Profile />} />
        </Route>
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
