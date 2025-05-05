import { Routes, Route } from "react-router-dom";
import Header from "./components/header"; // Ensure the import path is correct
import Footer from "./components/footer";
import Homepage from "./pages/Homepage";
import InfoKesehatan from "./pages/infokesehatan";
import News from "./pages/News";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import EditProfilePage from "./pages/EditProfile";
import PrediksiBunuhDiri from "./pages/PrediksiBunuhdiri";
import SuicideQ1 from "./pages/SuicideQ1.jsx";
import HasilBunuhDiri from "./pages/hasilbunuhdiri.jsx";
import PrediksiJantung from "./pages/PrediksiJantung.jsx";
import JantungQ1 from "./pages/JantungQ1.jsx";
import JantungQ2 from "./pages/JantungQ2.jsx";
import JantungQ3 from "./pages/JantungQ3.jsx";
import JantungQ4 from "./pages/JantungQ4.jsx";
import JantungQ5 from "./pages/JantungQ5.jsx";
import JantungQ6 from "./pages/JantungQ6.jsx";
import JantungQ7 from "./pages/JantungQ7.jsx";
import JantungQ8 from "./pages/JantungQ8.jsx";
import JantungQ9 from "./pages/JantungQ9.jsx";
import HasilJantung from "./pages/HasilJantung.jsx";

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
        <Route path="/infokesehatan" element={<InfoKesehatan />} />
        <Route path="/news/:newsId" element={<News />} />
        <Route path="/PrediksiBunuhDiri" element={<PrediksiBunuhDiri />} />
        <Route path="/suicideq1" element={<SuicideQ1 />} />
        <Route path="/HasilBunuhDiri" element={<HasilBunuhDiri />} />
        <Route path="/PrediksiJantung" element={<PrediksiJantung />} />
        <Route path="/JantungQ1" element={<JantungQ1 />} />
        <Route path="/JantungQ2" element={<JantungQ2 />} />
        <Route path="/JantungQ3" element={<JantungQ3 />} />
        <Route path="/JantungQ4" element={<JantungQ4 />} />
        <Route path="/JantungQ5" element={<JantungQ5 />} />
        <Route path="/JantungQ6" element={<JantungQ6 />} />
        <Route path="/JantungQ7" element={<JantungQ7 />} />
        <Route path="/JantungQ8" element={<JantungQ8 />} />
        <Route path="/JantungQ9" element={<JantungQ9 />} />
        <Route path="/HasilJantung" element={<HasilJantung />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
