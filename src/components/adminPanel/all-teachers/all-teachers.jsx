'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from 'antd';

const TeachersWithClasses = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTeacher, setExpandedTeacher] = useState(null);
    const [teacherClasses, setTeacherClasses] = useState({});
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone_number: ''
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_TEACHER_API}/teachers/`);
            if (!response.ok) {
                throw new Error('Oʻqituvchilarni yuklab olishda xatolik');
            }
            const data = await response.json();
            setTeachers(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeacherClasses = async (teacherUsername) => {
        if (teacherClasses[teacherUsername]) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/teacher-classes/${teacherUsername}/`
            );
            if (!response.ok) {
                throw new Error('Sinf maʼlumotlarini yuklab olishda xatolik');
            }
            const data = await response.json();

            setTeacherClasses(prev => ({
                ...prev,
                [teacherUsername]: data || []
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleTeacher = async (teacherUsername) => {
        if (expandedTeacher === teacherUsername) {
            setExpandedTeacher(null);
        } else {
            setExpandedTeacher(teacherUsername);
            await fetchTeacherClasses(teacherUsername);
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher.id);
        setEditForm({
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            username: teacher.username,
            phone_number: teacher.phone_number || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingTeacher(null);
        setEditForm({
            first_name: '',
            last_name: '',
            username: '',
            phone_number: ''
        });
    };

    const handleUpdateTeacher = async (teacherId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TEACHER_API}/teachers/${teacherId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                throw new Error('Oʻqituvchini yangilashda xatolik');
            }

            // Yangilangan ma'lumotlarni ro'yxatga aks ettirish
            setTeachers(teachers.map(teacher =>
                teacher.id === teacherId ? { ...teacher, ...editForm } : teacher
            ));

            setEditingTeacher(null);
            alert('Oʻqituvchi maʼlumotlari muvaffaqiyatli yangilandi!');
        } catch (err) {
            setError(err.message);
            alert('Xatolik: ' + err.message);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (!confirm('Haqiqatan ham bu oʻqituvchini oʻchirmoqchimisiz?')) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TEACHER_API}/teachers/${teacherId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Oʻqituvchini oʻchirishda xatolik');
            }

            // O'chirilgan o'qituvchini ro'yxatdan olib tashlash
            setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
            alert('Oʻqituvchi muvaffaqiyatli oʻchirildi!');
        } catch (err) {
            setError(err.message);
            alert('Xatolik: ' + err.message);
        }
    };

     const handleSwitchChange = async (teacherId, field, checked) => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TEACHER_API}/teachers/${teacherId}/`, {
                method: 'PATCH', // PATCH ishlatamiz
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: checked }),
            });

            if (!response.ok) throw new Error('Oʻqituvchi huquqini yangilashda xatolik');

            setTeachers(prev =>
                prev.map(t => t.id === teacherId ? { ...t, [field]: checked } : t)
            );
        } catch (err) {
            setError(err.message);
            alert('Xatolik: ' + err.message);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="loading">Yuklanmoqda...</div>;
    if (error) return <div className="error">Xatolik: {error}</div>;

    return (
        <div className="teachers-container">
            <h2>O'qituvchilar ro'yxati</h2>
            <div className="teachers-list">
                {teachers.map(teacher => (
                    <div key={teacher.id} className="teacher-item">
                        {/* Checkboxlar */}
                        <div className="teacher-permissions" style={{ marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px' }}>
                                O'quvchi qo'shish: 
                                <Switch
                                    checked={teacher.student_permision}
                                    onChange={(checked) => handleSwitchChange(teacher.id, 'student_permision', checked)}
                                />
                            </span>
                            <span style={{ marginRight: '10px' }}>
                                Test qo'shish: 
                                <Switch
                                    checked={teacher.test_permision}
                                    onChange={(checked) => handleSwitchChange(teacher.id, 'test_permision', checked)}
                                />
                            </span>
                            <span>
                                Sinf qo'shish: 
                                <Switch
                                    checked={teacher.class_permision}
                                    onChange={(checked) => handleSwitchChange(teacher.id, 'class_permision', checked)}
                                />
                            </span>
                        </div>
                        <div className="teacher-header">
                            <div
                                className="teacher-info"
                                onClick={() => toggleTeacher(teacher.username)}
                                style={{ cursor: 'pointer', flex: 1 }}
                            >
                                {editingTeacher === teacher.id ? (
                                    <>
                                        <div className="edit-form-shape"></div>
                                        <div className="edit-form">
                                            <div className="input-row">
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={editForm.first_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Ism"
                                                />
                                            </div>
                                            <div className="input-row">
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={editForm.last_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Familiya"
                                                />
                                            </div>
                                            <div className="input-row">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={editForm.username}
                                                    onChange={handleInputChange}
                                                    placeholder="Username"
                                                />
                                            </div>
                                            <div className="input-row">
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={editForm.phone_number}
                                                    onChange={handleInputChange}
                                                    placeholder="Telefon raqami"
                                                />
                                            </div>
                                            <div className="input-row">
                                                <button
                                                    className="btn-save"
                                                    onClick={() => handleUpdateTeacher(teacher.id)}
                                                >
                                                    Saqlash
                                                </button>
                                                <button
                                                    type='button'
                                                    className="btn-cancel"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Bekor qilish
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                                <span className="teacher-name">
                                    {teacher.first_name} {teacher.last_name}
                                </span>
                                <span className="teacher-username">@{teacher.username}</span>
                                {teacher.phone_number && (
                                    <span className="teacher-phone">{teacher.phone_number}</span>
                                )}
                            </div>

                            <div className="teacher-actions">
                                {editingTeacher === teacher.id ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(teacher)}
                                        >
                                            Tahrirlash
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                        >
                                            O'chirish
                                        </button>
                                        <span
                                            className={`arrow ${expandedTeacher === teacher.username ? 'expanded' : ''}`}
                                            onClick={() => toggleTeacher(teacher.username)}
                                        >
                                            ▼
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {expandedTeacher === teacher.username && (
                            <div className="classes-container">
                                {teacherClasses[teacher.username]?.length > 0 ? (
                                    <div className="classes-list">
                                        {teacherClasses[teacher.username].map(classItem => (
                                            <div key={classItem.id} className="class-item">
                                                <span className="class-name">
                                                    {classItem.class_number}-sinf, {classItem.class_name}
                                                </span>
                                                <span className="students-count">
                                                    {classItem.students_count} o'quvchi
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-classes">Sinf mavjud emas</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TeachersWithClasses;