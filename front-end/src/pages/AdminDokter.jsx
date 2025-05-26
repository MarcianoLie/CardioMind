import React, { useState, useRef, useEffect } from 'react';
import styles from '../css/admin-user-doctor.module.css';
import logo from '../assets/images/Logo.png';
import logoIcon from '../assets/images/logo-mobile.svg';
import dashboardIcon from '../assets/images/dashboard.png';
import userIcon from '../assets/images/adminuser.png';
import dokterIcon from '../assets/images/admindokter.png';
import addIcon from '../assets/images/menambahkan.png';
import deleteIcon from '../assets/images/menghapus.png';
import editIcon from '../assets/images/mengedit.png';
import { Link, useNavigate } from "react-router-dom";

const initialDoctors = [
    { name: 'dr. Andi Wijaya', email: 'andi@rs.com', number: '08123456789', place: 'Jakarta', dob: '1980-02-14' },
    { name: 'dr. Sari Dewi', email: 'sari@klinik.com', number: '08129876543', place: 'Bandung', dob: '1985-07-22' }
];

export default function AdminDokter() {
    const [doctors, setDoctors] = useState(initialDoctors);
    const [deleteMode, setDeleteMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState('add');
    const [form, setForm] = useState({ name: '', email: '', number: '', place: '', dob: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-session", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();
                if (data.status === "admin") {
                    setIsAuthorized(true);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error checking session:", error);
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null;
    }
    // Handlers
    const openAddPopup = () => {
        setPopupMode('add');
        setForm({ name: '', email: '', number: '', place: '', dob: '' });
        setPopupOpen(true);
    };

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (popupMode === 'add') {
            setDoctors([...doctors, form]);
        }
        setPopupOpen(false);
    };

    const handleDeleteMode = () => setDeleteMode(dm => !dm);

    const handleRowDelete = idx => {
        setDoctors(doctors => doctors.filter((_, i) => i !== idx));
    };

    // Popup close on overlay click
    const handlePopupOverlayClick = e => {
        if (e.target.classList.contains(styles.popupOverlay)) setPopupOpen(false);
    };

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
                <h1 className={styles.pageTitle}>Doctor</h1>
                <div className={styles.userActions}>
                    <button className={`${styles.actionBtn} ${styles.actionBtnAdd}`} title="Tambah Dokter" onClick={openAddPopup}>
                        <img src={addIcon} alt="Tambah" className={styles.actionBtnImg} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Hapus Dokter" onClick={handleDeleteMode}>
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
                                <th className={styles.userTableTh}>Date Of Birth</th>
                                {deleteMode && <th className={styles.userTableTh}>Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? styles.userTableTrEven : undefined}>
                                    <td className={styles.userTableTd}>{doctor.name}</td>
                                    <td className={styles.userTableTd}>{doctor.email}</td>
                                    <td className={styles.userTableTd}>{doctor.number}</td>
                                    <td className={styles.userTableTd}>{doctor.place}</td>
                                    <td className={styles.userTableTd}>{doctor.dob}</td>
                                    {deleteMode && (
                                        <td className={styles.aksiCell}>
                                            <button className={styles.rowDeleteBtn} title="Hapus Dokter" onClick={() => handleRowDelete(idx)}>
                                                <img src={deleteIcon} alt="Hapus" style={{ width: 24 }} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Popup Add Doctor */}
            {popupOpen && (
                <div className={styles.popupOverlay} onClick={handlePopupOverlayClick}>
                    <div className={styles.popupForm}>
                        <h2 className={styles.popupFormTitle}>Add Doctor</h2>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Full Name"
                                className={styles.popupFormInput}
                                value={form.name}
                                onChange={handleFormChange}
                            />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                                className={styles.popupFormInput}
                                value={form.email}
                                onChange={handleFormChange}
                            />
                            <input
                                type="text"
                                name="number"
                                required
                                placeholder="No Telp"
                                className={styles.popupFormInput}
                                value={form.number}
                                onChange={handleFormChange}
                            />
                            <input
                                type="text"
                                name="place"
                                required
                                placeholder="Tempat Lahir"
                                className={styles.popupFormInput}
                                value={form.place}
                                onChange={handleFormChange}
                            />
                            <input
                                type="date"
                                name="dob"
                                required
                                placeholder="Date of Birth"
                                className={styles.popupFormInput}
                                value={form.dob}
                                onChange={handleFormChange}
                            />
                            <div className={styles.popupActions}>
                                <button type="submit" className={styles.popupActionsBtn}>
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 