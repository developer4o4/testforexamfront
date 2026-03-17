'use client';

import React, { useContext, useEffect, useState } from 'react';
import './add-question.scss';
import { AccessContext } from '@/contexts/contexts';
import { updateData } from '@/services/update';

const AddQuestion = ({ isStatus, setIsStatus, initialData = null }) => {
    const [formData, setFormData] = useState({ question_name: '', section: '' });
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [detailsError, setDetailsError] = useState({});
    const { showNewNotification } = useContext(AccessContext);

    // 🔽 Sectionsni API'dan olish
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/`);
                if (!response.ok) throw new Error("Bo‘limlarni olishda xatolik!");
                const data = await response.json();
                setSections(data);
            } catch (err) {
                console.error("Bo‘limlar xatosi:", err);
            }
        };

        fetchSections();
    }, []);

    // 🔁 Edit rejimida boshlang‘ich qiymat
    useEffect(() => {
        if (initialData) {
            setFormData({
                question_name: initialData.text || '', // <--- bu yerda `.text` ishlating
                section: initialData.section || '',
            });
        } else {
            setFormData({ question_name: '', section: '' });
        }
    }, [initialData]);

    const validateForm = () => {
        const errors = {};
        if (!formData.question_name.trim()) {
            errors.question_name = "Savol nomi kiritilishi kerak!";
        }
        if (!formData.section) {
            errors.section = "Bo‘lim tanlanishi kerak!";
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
                    `${process.env.NEXT_PUBLIC_TESTS_API}/test/questions/${initialData.id}/`,
                    {
                        text: formData.question_name,
                        section_id: formData.section,
                    }
                );
                showNewNotification("Savol muvaffaqiyatli yangilandi!", "success");
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/questions/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: formData.question_name,
                        section_id: formData.section,
                    }),
                });

                if (!response.ok) throw new Error("Savol yaratishda xatolik!");
                showNewNotification("Savol muvaffaqiyatli qo‘shildi!", "success");
                window.location.reload(); // yoki parentdan fetch qiling
            }

            setFormData({ question_name: '', section: '' });
            setIsStatus(false);
        } catch (err) {
            setError(err.message);
            showNewNotification("Jarayonda xatolik yuz berdi!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="add-question-container">
            <div className={`add-question-name-shape ${isStatus ? 'active' : ''}`}></div>
            <div className={`add-question-content ${isStatus ? 'active' : ''}`}>
                <h2>{initialData ? "Savolni tahrirlash" : "Yangi savol qo‘shish"}</h2>

                <div className="add-question-details">
                    <form onSubmit={handleSubmit}>
                        {/* Savol matni */}
                        <div className="input-row">
                            <label>Savol kiriting:</label>
                            <textarea name="question_name" onChange={handleChange} value={formData.question_name} placeholder="Savol matnini kiriting" id=""></textarea>
                            {detailsError.question_name && (
                                <span>{detailsError.question_name}</span>
                            )}
                        </div>

                        {/* Section tanlash */}
                        <div className="input-row">
                            <label>Bo‘limni tanlang:</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                            >
                                <option value="">-- Bo‘limni tanlang --</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                            {detailsError.section && (
                                <span>{detailsError.section}</span>
                            )}
                        </div>

                        {/* Tugmalar */}
                        <div className="input-row submit-button">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatus(false);
                                    setError(false);
                                    setDetailsError({});
                                    setFormData({
                                        question_name: initialData ? initialData.name : '',
                                        section: initialData ? initialData.section : '',
                                    });
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

export default AddQuestion;
