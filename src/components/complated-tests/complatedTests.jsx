'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import "./complatedTests.scss";

const ProfileScienceResult = ({ studentId }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const itemsPerPage = 5; 
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch("https://test.smartcoders.uz/students/students/stat-student/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ student_id: studentId }),
                });

                if (!res.ok) {
                    throw new Error("API dan ma'lumot olishda xatolik");
                }

                const data = await res.json();
                setTests(data.tests || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchTests();
        }
    }, [studentId]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTests = tests.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(tests.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            router.push(`?page=${page}`);
        }
    };

    // Pagination dynamic buttons
    const getPaginationRange = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pages;
    };

    if (loading) return <p>Yuklanmoqda...</p>;
    if (error) return <p>Xatolik: {error}</p>;
    if (tests.length === 0) return <p>Hozircha test natijalari mavjud emas</p>;

    return (
        <div className='profile-science-result'>
            {currentTests.map((testItem) => (
                <div className="test-item" key={testItem.id}>
                    <p className='complated-test-date'>
                        <span>{formatDate(testItem.completed_at)}</span> da yechilgan test natijalari
                    </p>
                    <div className="test-item-details">
                        <div className="test-item-details-container">
                            <span>Test nomi:</span>
                            <p>{testItem.test_name}</p>
                        </div>
                        <div className="test-item-details-container">
                            <span>Jami savollar soni:</span>
                            <p>{testItem.total_questions} ta</p>
                        </div>
                        <div className="test-item-details-container">
                            <span>To'g'ri javoblar soni:</span>
                            <p>{testItem.correct_answer} ta</p>
                        </div>
                        <div className="test-item-details-container">
                            <span>Noto'g'ri javoblar:</span>
                            <p>{testItem.incorrect_answer} ta</p>
                        </div>
                        <div className="test-item-details-container">
                            <span>Belgilanmagan javoblar:</span>
                            <p>{testItem.unanswered} ta</p>
                        </div>
                        <div className="test-item-details-container">
                            <span>Umumiy natija (Foizda):</span>
                            <p>{Math.round(testItem.foiz)}%</p>
                        </div>
                    </div>
                    <div className="divider-line"></div>
                </div>
            ))}

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ‹
                </button>

                {getPaginationRange().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === "number" && handlePageChange(page)}
                        disabled={page === '...'}
                        className={page === currentPage ? "active" : ""}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default ProfileScienceResult;
