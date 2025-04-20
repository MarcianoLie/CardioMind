import { Routes, Route } from "react-router-dom";
import Header from "./components/header"; // Ensure the import path is correct
import Footer from "./components/footer";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import EditProfilePage from "./pages/EditProfile";
import PrediksiBunuhDiri from "./pages/PrediksiBunuhdiri";
import SuicideQ1 from "./pages/SuicideQ1.jsx";
import HasilBunuhDiri from "./pages/hasilbunuhdiri.jsx";

function App() {
  return (
    <div>
      <Header /> {/* Place Header outside of Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/PrediksiBunuhDiri" element={<PrediksiBunuhDiri />} />
        <Route path="/suicideq1" element={<SuicideQ1 />} />
        <Route path="/HasilBunuhDiri" element={<HasilBunuhDiri />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
