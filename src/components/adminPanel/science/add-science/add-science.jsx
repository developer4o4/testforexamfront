'use client';

import React, { useContext, useEffect, useState } from 'react';
import './add-science.scss';
import { AccessContext } from '@/contexts/contexts';
import { updateData } from '@/services/update';

const AddScience = ({ isStatus, setIsStatus, initialData = null }) => {
    const [formData, setFormData] = useState({ science_name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [detailsError, setDetailsError] = useState({});
    const { showNewNotification } = useContext(AccessContext);

    useEffect(() => {
        if (initialData) {
            setFormData({ science_name: initialData.name });
        } else {
            setFormData({ science_name: '' });
        }
    }, [initialData]);

    const validateForm = () => {
        const errors = {};
        if (!formData.science_name.trim()) {
            errors.science_name = "Fan nomi kiritilishi kerak!";
        }
        setDetailsError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            if (initialData) {
                await updateData(
                    `${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/${initialData.id}/`,
                    { name: formData.science_name }
                );
                showNewNotification("Fan muvaffaqiyatli tahrirlandi!", "success");
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.science_name }),
                });

                if (!response.ok) throw new Error("Fan yaratishda xatolik!");
                showNewNotification("Fan muvaffaqiyatli qo‘shildi!", "success");
            }

            setFormData({ science_name: '' });
            setIsStatus(false);
            window.location.reload(); // yoki parentda qayta fetch qiling
        } catch (err) {
            setError(err.message);
            showNewNotification("Jarayonda xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="add-science-container">
            <div className={`add-science-name-shape ${isStatus ? 'active' : ''}`}></div>
            <div className={`add-science-content ${isStatus ? 'active' : ''}`}>
                <h2>{initialData ? "Fan nomini tahrirlash" : "Yangi fan qo‘shish"}</h2>

                <div className="add-science-details">
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <label htmlFor="">Fan nomini kiriting:</label>
                            <input
                                type="text"
                                name="science_name"
                                value={formData.science_name}
                                onChange={handleChange}
                                placeholder="Fan nomini kiriting (masalan: Matematika, Ingliz tili)"
                            />
                            {detailsError.science_name && (
                                <span>{detailsError.science_name}</span>
                            )}
                        </div>

                        <div className="input-row submit-button">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatus(false);
                                    setError(false);
                                    setDetailsError({});
                                    if (initialData) {
                                        setFormData({ science_name: initialData.name });
                                    } else {
                                        setFormData({ science_name: '' });
                                    }
                                }}
                            >
                                Bekor qilish
                            </button>

                            <button type="submit" disabled={loading}>
                                {loading
                                    ? initialData
                                        ? "Saqlanmoqda..."
                                        : "Qo‘shilmoqda..."
                                    : initialData
                                        ? "Saqlash"
                                        : "Qo‘shish"}
                            </button>
                        </div>
                    </form>
                </div>

                {error && <p style={{ color: 'red' }}>Xatolik: {error}</p>}
            </div>
        </div>
    );
};

export default AddScience;
