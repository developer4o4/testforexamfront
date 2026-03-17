'use client'
import React, { useContext, useEffect, useState } from 'react';
import "./tests-table.scss";
import { updateData } from '@/services/update';
import { deleteData } from '@/services/delete';
import { AccessContext } from '@/contexts/contexts';
import AddScience from '../../science/add-science/add-science';
import AddScienceSection from '../../science/add-science-section/add-science-section';
import AddQuestion from '../add-question/add-question';
import AddOption from '../add-option/add-option';

const TestsTable = () => {
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const { showNewNotification } = useContext(AccessContext);
    const [expandedSubjects, setExpandedSubjects] = useState([]);
    const [subjectSections, setSubjectSections] = useState({});
    const [loadingSections, setLoadingSections] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteType, setDeleteType] = useState("");
    const [deletingItem, setDeletingItem] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [initialData, setInitialData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectionQuestions, setSectionQuestions] = useState({});
    const [expandedSections, setExpandedSections] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState({});
    const [questionOptions, setQuestionOptions] = useState({});
    const [expandedQuestions, setExpandedQuestions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({});

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/`);
                const data = await res.json();
                setSubjects(data);
            } catch (error) {
                console.error("Fanlarni olishda xatolik:", error);
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchSubjects();
    }, []);

    const toggleSections = async (subjectId) => {
        const alreadyOpen = expandedSubjects.includes(subjectId);

        if (alreadyOpen) {
            setExpandedSubjects(prev => prev.filter(id => id !== subjectId));
        } else {
            if (!subjectSections[subjectId]) {
                setLoadingSections(prev => ({ ...prev, [subjectId]: true }));
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/${subjectId}/`);
                    const data = await res.json();
                    setSubjectSections(prev => ({ ...prev, [subjectId]: data }));
                } catch (error) {
                    console.error("Bo‘limlarni yuklashda xatolik:", error);
                } finally {
                    setLoadingSections(prev => ({ ...prev, [subjectId]: false }));
                }
            }
            setExpandedSubjects(prev => [...prev, subjectId]);
        }
    };

    const toggleQuestions = async (sectionId) => {
        const alreadyOpen = expandedSections.includes(sectionId);

        if (alreadyOpen) {
            setExpandedSections(prev => prev.filter(id => id !== sectionId));
        } else {
            if (!sectionQuestions[sectionId]) {
                setLoadingQuestions(prev => ({ ...prev, [sectionId]: true }));
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/questions/?section=${sectionId}`);
                    const data = await res.json();
                    setSectionQuestions(prev => ({ ...prev, [sectionId]: data }));
                } catch (error) {
                    console.error("Savollarni olishda xatolik:", error);
                } finally {
                    setLoadingQuestions(prev => ({ ...prev, [sectionId]: false }));
                }
            }
            setExpandedSections(prev => [...prev, sectionId]);
        }
    };

    const toggleOptions = async (questionId) => {
        const alreadyOpen = expandedQuestions.includes(questionId);

        if (alreadyOpen) {
            setExpandedQuestions(prev => prev.filter(id => id !== questionId));
        } else {
            if (!questionOptions[questionId]) {
                setLoadingOptions(prev => ({ ...prev, [questionId]: true }));
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/options/?question=${questionId}`);
                    const data = await res.json();
                    setQuestionOptions(prev => ({ ...prev, [questionId]: data }));
                } catch (error) {
                    console.error("Variantlarni olishda xatolik:", error);
                } finally {
                    setLoadingOptions(prev => ({ ...prev, [questionId]: false }));
                }
            }
            setExpandedQuestions(prev => [...prev, questionId]);
        }
    };

    const openEditModal = (item, type) => {
        setModalType(type);
        setInitialData(item);
        setIsModalOpen(true);
    };

    const openDeleteModal = (item, type) => {
        setDeletingItem(item);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;
        setIsDeleteLoading(true);
        try {
            const url = deleteType === "subject"
                ? `${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/${deletingItem.id}/`
                : `${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/${deletingItem.id}/`;

            await deleteData(url);

            if (deleteType === "subject") {
                setSubjects(prev => prev.filter(sub => sub.id !== deletingItem.id));
            } else {
                setSubjectSections(prev => {
                    const filtered = prev[deletingItem.subject]?.filter(s => s.id !== deletingItem.id);
                    return { ...prev, [deletingItem.subject]: filtered };
                });
            }

            showNewNotification("O‘chirish muvaffaqiyatli amalga oshirildi!", "success");
            setIsDeleteModalOpen(false);
        } catch (error) {
            showNewNotification("O‘chirish amalga oshirilmadi!", "error");
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return (
        <div className="subject-container">
            <h2>Barcha fanlar ro'yxati</h2>
            {loadingSubjects ? (
                <p>Yuklanmoqda...</p>
            ) : subjects.length === 0 ? (
                <p>Hozircha fanlar mavjud emas.</p>
            ) : (
                subjects.map((subject) => (
                    <div key={subject.id} className={`subject-wrapper ${expandedSubjects.includes(subject.id) ? "open" : ""}`}>
                        <div className={`subject-item ${expandedSubjects.includes(subject.id) ? "open" : ""}`} onClick={() => toggleSections(subject.id)}>
                            <span>{subject.name}</span>
                            <div className="subject-actions">
                                <button className="edit-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(subject, "subject");
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                    </svg></button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteModal(subject, "subject");
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div
                            className={`subject-sections ${expandedSubjects.includes(subject.id) ? "open" : ""}`}
                        >
                            {loadingSections[subject.id] ? (
                                <p className="section-loading">Bo‘limlar yuklanmoqda...</p>
                            ) : (
                                <ul className='tests-table-fcking-ul'>
                                    {subjectSections[subject.id]?.map((section, indx) => (
                                        <li key={section.id} className={`test-question-text ${expandedSections.includes(section.id) ? 'open' : ''}`}>
                                            <div className={`question-header ${expandedSections.includes(section.id) ? 'open' : ''}`} onClick={() => toggleQuestions(section.id)}>
                                                <p><span>{indx + 1}-test.</span> {section.name}</p>
                                                <div className="section-actions">
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal({ ...section, subject_id: subject.id }, "section");
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal({ ...section, subject: subject.id }, "section");
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedSections.includes(section.id) && (
                                                <div className="questions-wrapper">
                                                    {loadingQuestions[section.id] ? (
                                                        <p>Savollar yuklanmoqda...</p>
                                                    ) : (
                                                        <ul className="tests-list">
                                                            {sectionQuestions[section.id]?.map((question, indx) => (
                                                                <div key={question.id} className={`question-block ${expandedQuestions.includes(question.id) ? "open" : ""}`}>
                                                                    <div className="question" onClick={() => toggleOptions(question.id)}>
                                                                        <p><span>{indx + 1}-savol.</span> {question.text}</p>
                                                                        <div className="question-actions">
                                                                            <button className="edit-btn" onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openEditModal({ ...question, section: section.id }, "question");
                                                                            }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                                                                </svg>
                                                                            </button>
                                                                            <button onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openDeleteModal(question, "question");
                                                                            }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {expandedQuestions.includes(question.id) && (
                                                                        <div className="options-wrapper">
                                                                            {loadingOptions[question.id] ? (
                                                                                <p>Variantlar yuklanmoqda...</p>
                                                                            ) : (
                                                                                <ul className="options">
                                                                                    {questionOptions[question.id]?.map((option) => (
                                                                                        <li key={option.id}>
                                                                                            <span>{option.text} {option.is_correct && <strong>(To‘g‘ri)</strong>}</span>
                                                                                            <div className="options-actions">
                                                                                                <button className="edit-btn" onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    openEditModal({ ...option, question: question.id }, "option");
                                                                                                }}>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                                <button onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    openDeleteModal(option, "option");
                                                                                                }}>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                                                                                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </ul>

                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                            )}
                        </div>
                    </div>
                ))
            )}

            <div className={`subject-delete-alert-modal ${isDeleteModalOpen ? "active" : ""}`}>
                <div className={`subject-delete-alert-modal-content ${isDeleteModalOpen ? "active" : ""}`}>
                    <p>
                        <strong>"{deletingItem?.name || deletingItem?.text}"</strong>
                        {
                            deleteType === "subject" ? " fanini o‘chirmoqchimisiz?"
                                : deleteType === "section" ? " bo‘limini o‘chirmoqchimisiz?"
                                    : deleteType === "question" ? " savolini o‘chirmoqchimisiz?"
                                        : deleteType === "option" ? " variantini o‘chirmoqchimisiz?"
                                            : " elementini o‘chirmoqchimisiz?"
                        }
                    </p>

                    <p>Bu amalni qaytarib bo‘lmaydi.</p>
                    <div className="delete-actions">
                        <button onClick={() => setIsDeleteModalOpen(false)}>Bekor qilish</button>
                        <button disabled={isDeleteLoading} onClick={handleDeleteConfirm}>
                            {isDeleteLoading ? "O‘chirilmoqda..." : "O‘chirish"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="modal-wrapper">
                {modalType === "subject" && (
                    <AddScience
                        isStatus={isModalOpen}
                        setIsStatus={setIsModalOpen}
                        initialData={initialData}
                    />
                )}
                {modalType === "section" && (
                    <AddScienceSection
                        isStatus={isModalOpen}
                        setIsStatus={setIsModalOpen}
                        initialData={initialData}
                    />
                )}
                {modalType === "question" && (
                    <AddQuestion
                        isStatus={isModalOpen}
                        setIsStatus={setIsModalOpen}
                        initialData={initialData}
                    />
                )}
                {modalType === "option" && (
                    <AddOption
                        isStatus={isModalOpen}
                        setIsStatus={setIsModalOpen}
                        initialData={initialData}
                    />
                )}
            </div>
        </div>
    );
};

export default TestsTable;
