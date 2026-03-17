"use client";

import React, { useContext, useEffect, useState } from "react";
import { AccessContext } from "@/contexts/contexts";
import "./teachersClasses.scss";
import EditStudentModal from "../adminPanel/editStudent/edit-student";

const TeacherClasses = () => {
    const { profileData } = useContext(AccessContext);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openGroups, setOpenGroups] = useState({});
    const [studentsByClass, setStudentsByClass] = useState({});
    const [loadingStudents, setLoadingStudents] = useState({});
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isDeletedStudent, setIsDeletedStudent] = useState({student:"", cls: ""});
    const [editStudent, setEditStudent] = useState(null);
    useEffect(() => {
        const fetchTeacherClasses = async () => {
            if (profileData?.user_type !== "teacher") return;

            setLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/teacher-classes/${profileData.username}/`
                );
                if (!res.ok) throw new Error("Sinf ma'lumotlarini olishda xatolik!");
                const data = await res.json();
                setClasses(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherClasses();
    }, [profileData]);

    if (profileData?.user_type !== "teacher") {
        return <p>❌ Bu sahifa faqat o‘qituvchilar uchun!</p>;
    }

    const groupedClasses = classes.reduce((acc, cls) => {
        const number = cls.class_number;
        if (!acc[number]) acc[number] = [];
        acc[number].push(cls);
        return acc;
    }, {});

    const toggleGroup = (number) => {
        setOpenGroups((prev) => ({
            ...prev,
            [number]: !prev[number],
        }));
    };

    const toggleClass = async (className) => {
        if (!studentsByClass[className]) {
            setLoadingStudents((prev) => ({ ...prev, [className]: true }));
            try {
                const res = await fetch(
                    `https://test.smartcoders.uz/students/students/class-students/?class_name=${className}`
                );
                if (!res.ok) throw new Error("O‘quvchilarni olishda xatolik!");
                const data = await res.json();
                setStudentsByClass((prev) => ({ ...prev, [className]: data.data }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingStudents((prev) => ({ ...prev, [className]: false }));
            }
        } else {
            setStudentsByClass((prev) => {
                const newState = { ...prev };
                delete newState[className];
                return newState;
            });
        }
    };

    const handleDeleteStudent = async (studentId, className) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/delete/${studentId}/`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("O‘chirishda xatolik!");
            // State dan ham o‘chirish
            // setStudentsByClass((prev) => ({
            //     ...prev,
            //     [className]: prev[className].filter((s) => s.id !== studentId),
            // }));
            window.location.reload()
        } catch (err) {
            console.error("Delete error:", err);
            alert("O‘chirishda muammo yuz berdi!");
        }
    };

    return (
        <div className="teacher-classes-container">

            <div className={`class-delete-alert-modal ${isDeleteModal ? "active" : ""}`}>
                <div className={`class-delete-alert-modal-content ${isDeleteModal ? "active" : ""}`}>
                    <p>Haqiqatdan xam o'quvchini o'chirishni istaysizmi?</p>
                    <p>Diqqat o'chirilgan o'quvchini qayta tiklab bo'lmaydi!</p>
                    <div className="delete-actions">
                        <button onClick={() => {
                            setIsDeleteModal(false)
                        }}>Bekor qilish</button>
                        <button onClick={() => {
                            handleDeleteStudent(
                                isDeletedStudent.student,
                                isDeleteModal.cls
                            )
                            setIsDeleteModal(false);
                        }
                        }>O'chirish</button>
                    </div>
                </div>
            </div>

            <EditStudentModal
                isStatus={editStudent}
                student={editStudent}
                onClose={() => setEditStudent(null)}
                onSuccess={(updatedStudent) => {
                    // setStudentsList(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
                    setEditStudent(null); 
                }}
            />
            <h2>Mening sinflarim</h2>

            {loading ? (
                <p>⏳ Yuklanmoqda...</p>
            ) : classes.length === 0 ? (
                <p>❗ Sizga birorta sinf biriktirilmagan</p>
            ) : (
                <div className="class-groups">
                    {Object.entries(groupedClasses).map(([number, clsList]) => (
                        <div key={number} className="class-group">
                            <h3
                                className="class-group-title"
                                onClick={() => toggleGroup(number)}
                            >
                                <span>{number}-sinflar</span>{" "}
                                <span className={openGroups[number] ? "act" : ""}>+</span>
                            </h3>

                            <div
                                className={`accordion-content ${openGroups[number] ? "open" : ""
                                    }`}
                            >
                                <ul>
                                    {clsList.map((cls) => (
                                        <li key={cls.id}>
                                            <button
                                                className="class-btn"
                                                onClick={() => toggleClass(cls.class_name)}
                                            >
                                                {cls.class_name} sinf
                                            </button>

                                            {loadingStudents[cls.class_name] && (
                                                <p className="">O‘quvchilar yuklanmoqda...</p>
                                            )}

                                            {studentsByClass[cls.class_name] && (
                                                <ul className="students-list">
                                                    {studentsByClass[cls.class_name].map((student) => (
                                                        <li key={student.id}>
                                                            <p>{student.first_name} {student.last_name}</p>

                                                            <div className="actions">
                                                                <button className='actions' onClick={() => setEditStudent(student)}>
                                                                    <svg className="feather feather-edit" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="actions"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setIsDeleteModal(true);
                                                                        setIsDeletedStudent({
                                                                            student: student.id,
                                                                            cls: cls.class_name
                                                                        })
                                                                    }}

                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;
