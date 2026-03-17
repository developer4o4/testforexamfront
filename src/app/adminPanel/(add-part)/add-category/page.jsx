'use client';

import React, { useContext, useEffect, useState } from 'react';
import './page.scss';
import { AccessContext } from '@/contexts/contexts';
import { updateData } from '@/services/update';

const AddCategory = ({ isStatus, setIsStatus, initialData = null }) => {
    const [formData, setFormData] = useState({ category_name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [detailsError, setDetailsError] = useState({});
    const { showNewNotification } = useContext(AccessContext);

    useEffect(() => {
        if (initialData) {
            setFormData({ category_name: initialData.name });
        } else {
            setFormData({ category_name: '' });
        }
    }, [initialData]);

    const validateForm = () => {
        const errors = {};
        if (!formData.category_name.trim()) {
            errors.category_name = "Fan nomi kiritilishi kerak!";
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
                    `${process.env.NEXT_PUBLIC_TESTS_API}/test/update-category/${initialData.id}/`,
                    { name: formData.category_name }
                );
                showNewNotification("Fan muvaffaqiyatli tahrirlandi!", "success");
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/create-category/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.category_name }),
                });

                if (!response.ok) throw new Error("Fan yaratishda xatolik!");
                showNewNotification("Fan muvaffaqiyatli qo‘shildi!", "success");
            }

            setFormData({ category_name: '' });
            // setIsStatus(false);
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
                <h2>{initialData ? "Bo'lim nomini tahrirlash" : "Yangi bo'lim qo‘shish"}</h2>

                <div className="add-science-details">
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <label htmlFor="">Test bo'limi nomini kiriting:</label>
                            <input
                                type="text"
                                name="category_name"
                                value={formData.category_name}
                                onChange={handleChange}
                                placeholder="Bo'lim nomini kiriting"
                            />
                            {detailsError.category_name && (
                                <span>{detailsError.category_name}</span>
                            )}
                        </div>

                        <div className="input-row submit-button">
                            <button
                                type="button"
                                onClick={() => {
                                    // setIsStatus(false);
                                    setError(false);
                                    setDetailsError({});
                                    if (initialData) {
                                        setFormData({ category_name: initialData.name });
                                    } else {
                                        setFormData({ category_name: '' });
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

export default AddCategory;
