import React, { useState, useRef } from 'react';
import styles from '../css/admin-user-doctor.module.css';
import logo from '../assets/images/Logo.png';
import logoIcon from '../assets/images/logo-mobile.svg';
import dashboardIcon from '../assets/images/dashboard.png';
import userIcon from '../assets/images/adminuser.png';
import dokterIcon from '../assets/images/admindokter.png';
import addIcon from '../assets/images/menambahkan.png';
import deleteIcon from '../assets/images/menghapus.png';
import editIcon from '../assets/images/mengedit.png';
import { Link } from 'react-router-dom';

const initialUsers = [
    { name: 'Budi Santoso', email: 'budi@mail.com', number: '08123456789', place: 'Jakarta', dob: '1990-01-01' },
    { name: 'Siti Aminah', email: 'siti@mail.com', number: '08129876543', place: 'Bandung', dob: '1992-05-12' }
];

export default function AdminUser() {
    const [users, setUsers] = useState(initialUsers);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState('add');
    const [form, setForm] = useState({ name: '', place: '', dob: '', number: '', email: '' });

    // Handlers
    const openAddPopup = () => {
        setEditIndex(null);
        setPopupMode('add');
        setForm({ name: '', place: '', dob: '', number: '', email: '' });
        setPopupOpen(true);
    };

    const openEditPopup = () => {
        if (users.length === 0) return alert('No user to edit!');
        setEditIndex(0); // Demo: edit first user
        setPopupMode('edit');
        setForm(users[0]);
        setPopupOpen(true);
    };

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (popupMode === 'add') {
            setUsers([...users, form]);
        } else if (popupMode === 'edit' && editIndex !== null) {
            const updated = [...users];
            updated[editIndex] = form;
            setUsers(updated);
        }
        setPopupOpen(false);
    };

    const handleDeleteMode = () => setDeleteMode(dm => !dm);

    const handleRowDelete = idx => {
        setUsers(users => users.filter((_, i) => i !== idx));
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
                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Hapus User" onClick={handleDeleteMode}>
                        <img src={deleteIcon} alt="Hapus" className={styles.actionBtnImg} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} title="Edit User" onClick={openEditPopup}>
                        <img src={editIcon} alt="Edit" className={styles.actionBtnImg} />
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
                            {users.map((user, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? styles.userTableTrEven : undefined}>
                                    <td className={styles.userTableTd}>{user.name}</td>
                                    <td className={styles.userTableTd}>{user.email}</td>
                                    <td className={styles.userTableTd}>{user.number}</td>
                                    <td className={styles.userTableTd}>{user.place}</td>
                                    <td className={styles.userTableTd}>{user.dob}</td>
                                    {deleteMode && (
                                        <td className={styles.aksiCell}>
                                            <button className={styles.rowDeleteBtn} title="Hapus User" onClick={() => handleRowDelete(idx)}>
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

            {/* Popup Add/Edit User */}
            {popupOpen && (
                <div className={styles.popupOverlay} onClick={handlePopupOverlayClick}>
                    <div className={styles.popupForm}>
                        <h2 className={styles.popupFormTitle}>{popupMode === 'add' ? 'Add User' : 'Edit User'}</h2>
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
                                    {popupMode === 'add' ? 'Add' : 'Edit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 