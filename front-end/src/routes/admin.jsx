// components/AdminRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/check-session`, {
          method: "GET",
          credentials: "include", // cookie session dikirim
        });

        const data = await res.json();
        if (data.status === "admin") {
          setIsAuthorized(true);
        } else {
          navigate("/"); // redirect jika bukan admin
        }
      } catch (err) {
        console.error("Gagal memverifikasi sesi:", err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;
  return isAuthorized ? children : null;
}
