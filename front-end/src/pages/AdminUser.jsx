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

const initialUsers = [
    { name: 'Budi Santoso', email: 'budi@mail.com', number: '08123456789', place: 'Jakarta', dob: '1990-01-01' },
    { name: 'Siti Aminah', email: 'siti@mail.com', number: '08129876543', place: 'Bandung', dob: '1992-05-12' }
];

export default function AdminUser() {
    const [users, setUsers] = useState(initialUsers);
    const [deleteMode, setDeleteMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ name: '', place: '', dob: '', number: '', email: '' });
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

    const handleEditClick = (idx) => {
        setEditingUser(editingUser === idx ? null : idx);
    };

    const handleRoleChange = (idx, newRole) => {
        if (newRole === 'doctor') {
            const userToDoctor = users[idx];
            // Get existing doctors from localStorage
            const existingDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
            // Add the user to doctors
            localStorage.setItem('doctors', JSON.stringify([...existingDoctors, userToDoctor]));
            // Remove from users
            setUsers(users.filter((_, i) => i !== idx));
        }
        setEditingUser(null);
    };

    const handleDeleteMode = () => setDeleteMode(prev => !prev);

    const handleRowDelete = idx => {
        setUsers(users => users.filter((_, i) => i !== idx));
    };

    const openAddPopup = () => {
        setForm({ name: '', place: '', dob: '', number: '', email: '' });
        setPopupOpen(true);
    };

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        setUsers([...users, form]);
        setPopupOpen(false);
    };

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
                    <Link to="/AdminUser" className={`${styles.navItem} ${styles.navItemActive}`}>
                        <img src={userIcon} alt="User Icon" className={styles.navItemImg} />
                        <span className={styles.navItemSpan}>Users</span>
                    </Link>
                    <Link to="/AdminDokter" className={styles.navItem}>
                        <img src={dokterIcon} alt="Doctor Icon" className={styles.navItemImg} />
                        <span className={styles.navItemSpan}>Doctors</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>User</h1>
                <div className={styles.userActions}>
                    <button className={`${styles.actionBtn} ${styles.actionBtnAdd}`} title="Tambah User" onClick={openAddPopup}>
                        <img src={addIcon} alt="Tambah" className={styles.actionBtnImg} />
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
                                <th className={styles.userTableTh}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? styles.userTableTrEven : undefined}>
                                    <td className={styles.userTableTd}>{user.name}</td>
                                    <td className={styles.userTableTd}>{user.email}</td>
                                    <td className={styles.userTableTd}>{user.number}</td>
                                    <td className={styles.userTableTd}>{user.place}</td>
                                    <td className={styles.userTableTd}>{user.dob}</td>
                                    <td className={styles.aksiCell} style={{ position: 'relative', overflow: 'visible' }}>
                                        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                            <button
                                                className={styles.rowDeleteBtn}
                                                title="Hapus User"
                                                onClick={() => handleRowDelete(idx)}
                                            >
                                                <img src={deleteIcon} alt="Hapus" style={{ width: 24 }} />
                                            </button>
                                            <button
                                                className={styles.rowEditBtn}
                                                title="Edit User"
                                                onClick={() => handleEditClick(idx)}
                                            >
                                                <img src={editIcon} alt="Edit" style={{ width: 24 }} />
                                            </button>
                                            {editingUser === idx && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '100%',
                                                    minWidth: '100%',
                                                    backgroundColor: 'gray',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    zIndex: 10000,
                                                    color: "black"
                                                }}>
                                                    <button
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '8px 16px',
                                                            textAlign: 'left',
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleRoleChange(idx, 'user')}
                                                    >
                                                        User
                                                    </button>
                                                    <button
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '8px 16px',
                                                            textAlign: 'left',
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                            color: '#007bff'
                                                        }}
                                                        onClick={() => handleRoleChange(idx, 'doctor')}
                                                    >
                                                        Doctor
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Popup Add User */}
            {popupOpen && (
                <div className={styles.popupOverlay} onClick={handlePopupOverlayClick}>
                    <div className={styles.popupForm}>
                        <h2 className={styles.popupFormTitle}>Add User</h2>
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
                                type="text"
                                name="place"
                                required
                                placeholder="Place"
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
                            <input
                                type="text"
                                name="number"
                                required
                                placeholder="Number"
                                className={styles.popupFormInput}
                                value={form.number}
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