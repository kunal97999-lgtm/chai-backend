import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./components/HomeLayout";
import WatchPage from "./pages/WatchPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TweetFeed from "./pages/TweetFeed";
import ChannelPage from "./pages/ChannelPage";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
// import ProtectedRoute from "./components/ProtectedRoute"; // use once you have a route that needs auth

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomeLayout /></PageTransition>} />
        <Route path="/watch/:id" element={<PageTransition><WatchPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/twitter" element={<PageTransition><TweetFeed /></PageTransition>} />
        <Route path="/channel/:username" element={<PageTransition><ChannelPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        {/* Example of a protected route once you need one:
        <Route path="/settings" element={
          <ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>
        } /> */}
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
