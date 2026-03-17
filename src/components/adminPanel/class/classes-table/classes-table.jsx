'use client'
import React, { useContext, useEffect, useState } from 'react'
import './classes-table.scss'
import AddClassNumber from '../add-class-number/add-class-number';
import { deleteData } from '@/services/delete';
import { AccessContext } from '@/contexts/contexts';
import AddClassName from '../add-class-name/add-class';
import Link from 'next/link';

const ClassesTable = () => {
    const [classNumbers, setClassNumbers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClassNumber, setEditingClassNumber] = useState(null);
    const { showNewNotification } = useContext(AccessContext)
    const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [expandedClasses, setExpandedClasses] = useState({});
    const [studentsByClass, setStudentsByClass] = useState({});
    const [openedClasses, setOpenedClasses] = useState({});

    const openEditClassModal = (classItem) => {
        setEditingClass(classItem);
        setIsEditClassModalOpen(true);
    };

    const openEditModal = (classNumberItem) => {
        setEditingClassNumber(classNumberItem);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        const fetchClassNumbers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes-number/`);
                const data = await res.json();
                setClassNumbers(data.data || []);
            } catch (error) {
                console.error("Sinf raqamlarini yuklashda xatolik:", error);
            }
        };
        fetchClassNumbers();
    }, []);

    const toggleExpand = async (number) => {
        if (expanded === number) {
            setExpanded(null);
            return;
        }

        // Agar oldin ochilgan bo‘lsa, faqat expanded ni yangilaymiz
        if (expandedClasses[number]) {
            setExpanded(number);
            return;
        }

        // Aks holda API so‘rov yuboriladi
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/get-classes-by-number/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ class_id: number })
            });

            const data = await res.json();

            setExpandedClasses(prev => ({ ...prev, [number]: data.classes || [] }));
            setExpanded(number);
        } catch (error) {
            console.error("Sinflarni olishda xatolik:", error);
        }
    };

    const toggleStudents = async (className) => {
        // Agar avval ochilgan bo‘lsa - yopiladi
        if (openedClasses[className]) {
            setOpenedClasses(prev => ({ ...prev, [className]: false }));
            return;
        }

        // Agar o‘quvchilar allaqachon fetch bo‘lgan bo‘lsa, faqat ochamiz
        if (studentsByClass[className]) {
            setOpenedClasses(prev => ({ ...prev, [className]: true }));
            return;
        }

        // Aks holda - API so‘rov yuboriladi
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/class-students/?class_name=${encodeURIComponent(className)}`);
            const data = await res.json();

            setStudentsByClass(prev => ({
                ...prev,
                [className]: data.data || []
            }));

            setOpenedClasses(prev => ({
                ...prev,
                [className]: true
            }));
        } catch (error) {
            console.error(`"${className}" uchun o‘quvchilarni olishda xatolik:`, error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await deleteData(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/delete-class-number/${id}/`)
            setClassNumbers(prev => prev.filter(s => s.id !== id));
            showNewNotification("O'chirish muvaffaqiyatli amalga oshirildi!", "success");
        } catch (err) {
            showNewNotification("O'chirish amalga oshirilmadi!", "error");
        }
    }

    const handleDeleteClassByClass = async (id, classNumber) => {
        try {
            await deleteData(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/delete/${id}/`);
            setExpandedClasses(prev => {
                const updated = { ...prev };
                if (updated[classNumber]) {
                    updated[classNumber] = updated[classNumber].filter(cls => cls.id !== id);
                }
                return updated;
            });
            showNewNotification("O'chirish muvaffaqiyatli amalga oshirildi!", "success");
        } catch (err) {
            showNewNotification("O'chirish amalga oshirilmadi!", "error");
        }
    };

    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [deletedClass, setDeletedClass] = useState(null);

    return (
        <div className="classes-table">
            <AddClassNumber
                isStatus={isEditModalOpen}
                setIsStatus={setIsEditModalOpen}
                initialData={editingClassNumber}
            />

            <AddClassName
                isStatus={isEditClassModalOpen}
                setIsStatus={setIsEditClassModalOpen}
                initialData={editingClass}
            />

            <div className={`class-delete-alert-modal ${isDeleteModal ? "active" : ""}`}>
                <div className={`class-delete-alert-modal-content ${isDeleteModal ? "active" : ""}`}>
                    <p>Haqiqatdan xam {deletedClass?.class_number} {deletedClass?.class_name}ni o'chirishni istaysizmi?</p>
                    <p>Diqqat o'chirilgan sinflarni qayta tiklab bo'lmaydi!</p>
                    <div className="delete-actions">
                        <button onClick={() => {
                            setDeletedClass(null)
                            setIsDeleteModal(false)
                        }}>Bekor qilish</button>
                        <button onClick={() => {
                            deletedClass?.class_name ? (
                                handleDeleteClassByClass(deletedClass.id, deletedClass.class_number)
                            ) : (
                                handleDelete(deletedClass.id)
                            );
                            setDeletedClass(null);
                            setIsDeleteModal(false);
                        }
                        }>O'chirish</button>
                    </div>
                </div>
            </div>
            <h2>Maktabdagi barcha sinflar</h2>
            <div className="accordion-wrapper">
                {
                    classNumbers.length > 0 ? (classNumbers.map((num) => {
                        const relatedClasses = expandedClasses[num.id] || [];
                        return (
                            <div className={`accordion-item ${expanded === num.id ? 'active' : ''}`} key={num.id}>
                                <div
                                    className={`accordion-header ${expanded === num.id ? 'active' : ''}`}
                                    onClick={() => toggleExpand(num.id)}
                                >
                                    <span>{num.class_number}</span>
                                    <div className="header-actions">
                                        <Link href="/adminPanel/all-students" onClick={(e) => e.stopPropagation()}>Sinflar ro'yxatiga o'tish
                                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M85 277.375h259.704L225.002 397.077 256 427l171-171L256 85l-29.922 29.924 118.626 119.701H85v42.75z"></path></svg>
                                        </Link>
                                        <button className="edit-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(num);
                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                            </svg></button>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteModal(true);
                                            setDeletedClass(num)
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className={`accordion-body ${expanded === num.id ? 'open' : ''}`}>
                                    {relatedClasses.length > 0 ? (
                                        <ul>
                                            {relatedClasses.map(cls => (
                                                <li key={cls.id}>
                                                    <div className="class-by-students">
                                                        <div
                                                            className='class-name'
                                                            onClick={() => toggleStudents(cls.class_name)}
                                                            style={{ cursor: "pointer", fontWeight: 'bold' }}
                                                        >
                                                            <span>{cls.class_name}</span>
                                                            <div className="accordion-body-actions">
                                                                <Link
                                                                    href={`/adminPanel/all-students?grade=${encodeURIComponent(cls.class_number)}&classes=${encodeURIComponent(cls.class_name)}`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    Sinfga o'tish
                                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M85 277.375h259.704L225.002 397.077 256 427l171-171L256 85l-29.922 29.924 118.626 119.701H85v42.75z"></path></svg>
                                                                </Link>
                                                                <button
                                                                    className="edit-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openEditClassModal(cls);
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                                                    </svg>
                                                                </button>
                                                                <button onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsDeleteModal(true);
                                                                    setDeletedClass(cls)
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className={`students-wrapper ${openedClasses[cls.class_name] ? 'open' : ''}`}>
                                                            {
                                                                Array.isArray(studentsByClass[cls.class_name]) ? (
                                                                    studentsByClass[cls.class_name].length > 0 ? (
                                                                        studentsByClass[cls.class_name].map(student => (
                                                                            <div className="student" key={student.id}>
                                                                                {student.first_name} {student.last_name}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p>Bu sinfda o'quvchilar mavjud emas!</p>
                                                                    )
                                                                ) : null
                                                            }

                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                    ) : (
                                        <p>Sinflar mavjud emas!</p>
                                    )}
                                </div>
                            </div>
                        );
                    })) : (
                        <p>Maktabda sinflar mavjud emas</p>
                    )
                }
            </div>
        </div>
    );
};

export default ClassesTable;
