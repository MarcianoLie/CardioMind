import React, { useState, useEffect } from 'react';
import styles from '../css/admin-user-doctor.module.css';
import logo from '../assets/images/Logo.png';
import logoIcon from '../assets/images/logo-mobile.svg';
import dashboardIcon from '../assets/images/dashboard.png';
import userIcon from '../assets/images/adminuser.png';
import dokterIcon from '../assets/images/admindokter.png';
import deleteIcon from '../assets/images/menghapus.png';
import { Link, useNavigate } from "react-router-dom";

export default function AdminDokter() {
    const [medics, setMedics] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    const fetchMedics = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/admin/medicsDetail`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            if (!result.error) {
                const formattedMedics = result.data.map(medic => ({
                    name: medic.displayName || 'N/A',
                    email: medic.email || 'N/A',
                    number: medic.phone || 'N/A',
                    place: medic.birthPlace || 'N/A',
                    dob: medic.birthDate ? new Date(medic.birthDate).toLocaleDateString('id-ID') : 'N/A'
                }));
                setMedics(formattedMedics);
            } else {
                console.error("Error:", result.message);
                setMedics([]);
            }
        } catch (error) {
            console.error("Error fetching medics:", error);
            setMedics([]);
        }
    };

    const handleDeleteMedic = async (email) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus dokter ini?")) {
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/admin/changeToUser`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!data.error) {
                alert("Dokter berhasil diubah menjadi user biasa");
                await fetchMedics();
            } else {
                alert("Gagal mengubah status dokter: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting medic:", error);
            alert("Terjadi kesalahan saat mengubah status dokter");
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkSessionAndFetchData = async () => {
            try {
                const sessionResponse = await fetch(`${process.env.BACKEND_URL}/api/check-session`, {
                    method: "GET",
                    credentials: "include",
                });

                const sessionData = await sessionResponse.json();

                if (!isMounted) return;

                if (sessionData.status === "admin") {
                    setIsAuthorized(true);
                    await fetchMedics();
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error in initialization:", error);
                if (isMounted) navigate("/");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        checkSessionAndFetchData();

        return () => { isMounted = false };
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <img src={logo} alt="CardioMind Logo" className={`${styles.logo} ${styles.logoFull}`} />
                <img src={logoIcon} alt="CardioMind Icon" className={`${styles.logo} ${styles.logoIcon}`} />
                <nav className={styles.navLinks}>
                    <Link to="/AdminDashboard" className={styles.navItem}>
                        <img src={dashboardIcon} alt="Dashboard Icon" className={styles.navItemImg} />
                        <span className={styles.navItemSpan}>Dashboard</span>
                    </Link>
                    <Link to="/AdminUser" className={styles.navItem}>
                        <img src={userIcon} alt="User Icon" className={styles.navItemImg} />
                        <span className={styles.navItemSpan}>Users</span>
                    </Link>
                    <Link to="/AdminDokter" className={`${styles.navItem} ${styles.navItemActive}`}>
                        <img src={dokterIcon} alt="Doctor Icon" className={styles.navItemImg} />
                        <span className={styles.navItemSpan}>Doctors</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>Doctors</h1>
                <div className={styles.userActions}>
                    <button 
                        className={`${styles.actionBtn} ${styles.actionBtnDelete}`} 
                        title="Hapus Dokter" 
                        onClick={() => setDeleteMode(!deleteMode)}
                    >
                        <img src={deleteIcon} alt="Hapus" className={styles.actionBtnImg} />
                    </button>
                </div>
                <div className={styles.userTableContainer}>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th className={styles.userTableTh}>Nama</th>
                                <th className={styles.userTableTh}>Email</th>
                                <th className={styles.userTableTh}>No Telp</th>
                                <th className={styles.userTableTh}>Tempat Lahir</th>
                                <th className={styles.userTableTh}>Tanggal Lahir</th>
                                {deleteMode && <th className={styles.userTableTh}>Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {medics.length > 0 ? (
                                medics.map((medic, idx) => (
                                    <tr key={idx} className={idx % 2 === 1 ? styles.userTableTrEven : undefined}>
                                        <td className={styles.userTableTd}>{medic.name}</td>
                                        <td className={styles.userTableTd}>{medic.email}</td>
                                        <td className={styles.userTableTd}>{medic.number}</td>
                                        <td className={styles.userTableTd}>{medic.place}</td>
                                        <td className={styles.userTableTd}>{medic.dob}</td>
                                        {deleteMode && (
                                            <td className={styles.aksiCell}>
                                                <button
                                                    className={styles.rowDeleteBtn}
                                                    title="Hapus Dokter"
                                                    onClick={() => handleDeleteMedic(medic.email)}
                                                >
                                                    <img src={deleteIcon} alt="Hapus" style={{ width: 24 }} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={deleteMode ? 6 : 5} className={styles.noDataMessage}>
                                        Tidak ada data dokter yang tersedia
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}