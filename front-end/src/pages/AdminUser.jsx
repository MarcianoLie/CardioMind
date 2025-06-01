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


export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: '',
        place: '',
        dob: '',
        number: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchMessage, setSearchMessage] = useState('');
    const [medicList, setMedicList] = useState([]);

    // Tambahkan fungsi fetchUsers yang hilang
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/admin/usersDetail`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const result = await response.json();
            if (!result.error) {
                const mappedUsers = result.data.map(user => ({
                    name: user.displayName || 'N/A',
                    email: user.email || 'N/A',
                    number: user.phone || 'N/A',
                    place: user.birthPlace || 'N/A',
                    dob: user.birthDate ? new Date(user.birthDate).toLocaleDateString('id-ID') : 'N/A'
                }));
                setUsers(mappedUsers);
            } else {
                console.error("Error:", result.message);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    };

    const handleDeleteUser = async (email) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/admin/delete-user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!data.error) {
                alert("User berhasil dihapus");
                // Refresh data users
                await fetchUsers();
            } else {
                alert("Gagal menghapus user: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Terjadi kesalahan saat menghapus user");
        }
    };

    const fetchMedicUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/admin/list-medic`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (!data.error) {
                setMedicList(data.data || []);
            } else {
                console.error("Error fetching medics:", data.message);
                setMedicList([]);
            }
        } catch (error) {
            console.error("Failed to fetch medic list:", error);
            setMedicList([]);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkSessionAndFetchData = async () => {
            try {
                // 1. Check session dulu
                const sessionResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/check-session`, {
                    method: "GET",
                    credentials: "include",
                });

                const sessionData = await sessionResponse.json();

                if (!isMounted) return;

                if (sessionData.status === "admin") {
                    setIsAuthorized(true);

                    // 2. Fetch data secara paralel setelah session valid
                    await Promise.all([
                        fetchUsers(),
                        fetchMedicUsers()
                    ]);
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

    const handleEditClick = (idx) => {
        setEditingUser(editingUser === idx ? null : idx);
    };

    const handleEmailSearch = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/admin/search-user?email=${searchEmail}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (!data.error && data.data && data.data.status === "user") {
                setSearchResult(data.data);
                setSearchMessage("Email ditemukan dengan status user.");
            } else {
                setSearchResult(null);
                setSearchMessage("Email tidak ditemukan atau bukan status user.");
            }
        } catch (error) {
            console.error("Error searching email:", error);
            setSearchResult(null);
            setSearchMessage("Terjadi kesalahan saat mencari email.");
        }
    };



    const handlePromoteToMedic = async () => {
        if (!searchResult) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL
}/api/admin/promote-to-medic`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email: searchResult.email })
            });

            const data = await response.json();
            if (!data.error) {
                alert("User berhasil diubah menjadi medic.");
                fetchMedicUsers();
                setPopupOpen(false);
            } else {
                alert("Gagal mengubah status user.");
            }
        } catch (error) {
            console.error("Error promoting user:", error);
            alert("Terjadi kesalahan saat mengubah status.");
        }
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
        setSearchEmail('');
        setSearchResult(null);
        setSearchMessage('');
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

    if (users.length === 0 && !isLoading) {
        return (
            <div className={styles.container}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* ... isi sidebar ... */}
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <h1 className={styles.pageTitle}>User</h1>
                    <div className={styles.userActions}>
                        <button className={`${styles.actionBtn} ${styles.actionBtnAdd}`} onClick={openAddPopup}>
                            <img src={addIcon} alt="Tambah" className={styles.actionBtnImg} />
                        </button>
                    </div>
                    <div className={styles.noDataMessage}>
                        Tidak ada data user yang tersedia
                    </div>
                </main>
            </div>
        );
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
                                                onClick={() => handleDeleteUser(user.email)} // Ubah ini
                                            >
                                                <img src={deleteIcon} alt="Hapus" style={{ width: 24 }} />
                                            </button>
                                            {/*
                                            <button
                                                className={styles.rowEditBtn}
                                                title="Edit User"
                                                onClick={() => handleEditClick(idx)}
                                            >
                                                <img src={editIcon} alt="Edit" style={{ width: 24 }} />
                                            </button>
                                            */}
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
                        <h2 className={styles.popupFormTitle}>Promote User</h2>
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            className={styles.popupFormInput}
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button
                            className={`${styles.popupActionsBtn} ${styles.searchBtn}`}
                            type="button"
                            onClick={handleEmailSearch}
                            style={{ marginTop: '8px' }}
                        >
                            Search
                        </button>
                        {searchMessage && <p style={{ marginTop: '10px', color: searchResult ? "green" : "red" }}>{searchMessage}</p>}
                        <div className={styles.popupActions}>
                            <button
                                type="button"
                                className={styles.popupActionsBtn}
                                onClick={handlePromoteToMedic}
                                disabled={!searchResult}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}  