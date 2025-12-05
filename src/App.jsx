// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// import Header from "../components/Header";
// import Footer from "./components/Footer";
import Main from "./pages/MainPage";
import PostsPage from "./pages/Posts/PostPage";
import MyPostsPage from "./pages/Posts/MyPostPage";
import UpgradePage from "./pages/Upgrade/Upgrade";
import News from "./pages/AnimePage/Anime";
// import CommunitiesPage from "./pages/Communities/CommunityHub";
// import CommunityPage from "./pages/Communities/ChatPanel.jsx";
import CommunityHub from "./pages/Communities/CommunityHub";
// import Header from "./components/Header";
// import Upgrade from "./pages/Upgrade/Upgrade";
// import UpgradePage from "./pages/Upgrade/Upgrade";
// import PageLoader from "./components/AnimeLoader";

export default function App() {
  // const location = useLocation();
  // const [loading, setLoading] = useState(false);

  // whenever route changes, show loader briefly
  // useEffect(() => {
  // small UX: show loader for at least 350ms so the animation is visible
  // setLoading(true);
  // const t = setTimeout(() => setLoading(false), 400);
  // return () => clearTimeout(t);
  // }, [location.pathname]);

  return (
    <div>
      {/* <Header /> */}
      {/* <PageLoader show={loading} /> */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />

          <Route path="/posts" element={<PostsPage />} />
          <Route path="/my-posts" element={<MyPostsPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/anime" element={<News />} />

          <Route path="/communities" element={<CommunityHub />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
