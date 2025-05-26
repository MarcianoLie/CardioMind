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

const initialDoctors = [
    { name: 'dr. Andi Wijaya', instansi: 'RS Harapan Sehat' },
    { name: 'dr. Sari Dewi', instansi: 'Klinik Medika' }
];

export default function AdminDokter() {
    const [doctors, setDoctors] = useState(initialDoctors);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState('add');
    const [form, setForm] = useState({ name: '', instansi: '' });

    // Handlers
    const openAddPopup = () => {
        setEditIndex(null);
        setPopupMode('add');
        setForm({ name: '', instansi: '' });
        setPopupOpen(true);
    };

    const openEditPopup = () => {
        if (doctors.length === 0) return alert('No doctor to edit!');
        setEditIndex(0); // Demo: edit first doctor
        setPopupMode('edit');
        setForm(doctors[0]);
        setPopupOpen(true);
    };

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (popupMode === 'add') {
            setDoctors([...doctors, form]);
        } else if (popupMode === 'edit' && editIndex !== null) {
            const updated = [...doctors];
            updated[editIndex] = form;
            setDoctors(updated);
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
                    <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} title="Edit Dokter" onClick={openEditPopup}>
                        <img src={editIcon} alt="Edit" className={styles.actionBtnImg} />
                    </button>
                </div>
                <div className={styles.userTableContainer}>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th className={styles.userTableTh}>Nama</th>
                                <th className={styles.userTableTh}>Instansi</th>
                                {deleteMode && <th className={styles.userTableTh}>Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? styles.userTableTrEven : undefined}>
                                    <td className={styles.userTableTd}>{doctor.name}</td>
                                    <td className={styles.userTableTd}>{doctor.instansi}</td>
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

            {/* Popup Add/Edit Doctor */}
            {popupOpen && (
                <div className={styles.popupOverlay} onClick={handlePopupOverlayClick}>
                    <div className={styles.popupForm}>
                        <h2 className={styles.popupFormTitle}>{popupMode === 'add' ? 'Add Doctor' : 'Edit Doctor'}</h2>
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
                                name="instansi"
                                required
                                placeholder="Instansi"
                                className={styles.popupFormInput}
                                value={form.instansi}
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