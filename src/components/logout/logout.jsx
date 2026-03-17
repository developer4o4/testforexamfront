"use client"

import { AccessContext } from '@/contexts/contexts';
import React, { useContext, useState } from 'react'
import "./logout.scss";

const Logout = () => {
    const { setProfileData, setProfileLoading } = useContext(AccessContext)
    const [modalState, setModalState] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("sapfirAccess");
        localStorage.removeItem("sapfirRefresh");
        localStorage.removeItem("sapfirType");
        localStorage.removeItem("sapfirUser");
        setProfileData(null);
        setProfileLoading(false);
        window.location.href = "/";
    };

    const toggleShowModal = () => {
        setModalState(!modalState)
    }

    return (
        <>
            <button id='logout-main-btn' onClick={toggleShowModal}>
                Tizimdan chiqish
            </button>

            {
                modalState && (
                    <div className={`logout-modal ${modalState ? "active" : ""}`}>
                        <div className={`logout-modal-content ${modalState ? "active" : ""}`}>
                            <p>Rostdan ham profilingizdan chiqmoqchimisiz?</p>
                            <div className="logout-actions">
                                <button onClick={toggleShowModal}>Bekor qilish</button>
                                <button onClick={handleLogout}>Chiqish</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Logout