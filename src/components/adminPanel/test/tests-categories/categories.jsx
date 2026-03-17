import React, { useContext, useEffect, useState } from 'react';
import "./categories.scss"
import { deleteData } from '@/services/delete';
import AddCategory from '../add-category/add-category';
import { AccessContext } from '@/contexts/contexts';
import AddTestForm from '../add-test/add-test';

const CategoryTestList = () => {
    const [categories, setCategories] = useState([]);
    const [openedCategories, setOpenedCategories] = useState({});
    const [categoryTests, setCategoryTests] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const { showNewNotification } = useContext(AccessContext);
    const [editTestModalOpen, setEditTestModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const handleEditTest = (test) => {
        setSelectedTest(test);
        setEditTestModalOpen(true);
    };

    const handleDeleteCategory = (category) => {
        setDeletingItem(category);
        setDeleteType("category");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteTest = (test) => {
        setDeletingItem(test);
        setDeleteType("test");
        setIsDeleteModalOpen(true);
    };


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/all-category/`)
            .then((res) => res.json())
            .then((data) => setCategories(data.data))
            .catch((err) => console.error(err));
    }, []);

    const toggleCategory = (categoryId) => {
        if (!categoryTests[categoryId]) {
            fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/get-test-by-subject-id/?category_id=${categoryId}`)
                .then((res) => res.json())
                .then((data) => {
                    setCategoryTests(prev => ({
                        ...prev,
                        [categoryId]: data
                    }));
                    setOpenedCategories(prev => ({
                        ...prev,
                        [categoryId]: true
                    }));
                })
                .catch((err) => console.error(err));
        } else {
            setOpenedCategories(prev => ({
                ...prev,
                [categoryId]: !prev[categoryId]
            }));
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;
        setIsDeleteLoading(true);
        try {
            if (deleteType === "category") {
                await deleteData(`${process.env.NEXT_PUBLIC_TESTS_API}/test/delete-category/${deletingItem.id}/`);
                setCategories(prev => prev.filter(cat => cat.id !== deletingItem.id));
                setOpenedCategories(prev => {
                    const updated = { ...prev };
                    delete updated[deletingItem.id];
                    return updated;
                });
                setCategoryTests(prev => {
                    const updated = { ...prev };
                    delete updated[deletingItem.id];
                    return updated;
                });
            } else if (deleteType === "test") {
                await deleteData(`${process.env.NEXT_PUBLIC_TESTS_API}/test/tests/${deletingItem.id}/`);
                setCategoryTests(prev => {
                    const updated = { ...prev };
                    const categoryId = deletingItem.category;
                    if (updated[categoryId]) {
                        updated[categoryId] = updated[categoryId].filter(t => t.id !== deletingItem.id);
                    }
                    return updated;
                });
            }

            setIsDeleteModalOpen(false);
            setDeletingItem(null);
            setDeleteType('');
            showNewNotification("O‘chirish muvaffaqiyatli amalga oshirildi!", "success");

        } catch (error) {
            console.error(error);
            showNewNotification("O‘chirish amalga oshirilmadi!", "error");
        } finally {
            setIsDeleteLoading(false);
        }
    };


    const handleCategoryUpdated = (updatedCategory) => {
        setCategories(prev =>
            prev.map(cat =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
        setEditModalOpen(false);
    };

    const handleTestUpdated = (updatedTest) => {
        setCategoryTests(prev => {
            const updated = { ...prev };
            if (updated[updatedTest.category]) {
                updated[updatedTest.category] = updated[updatedTest.category].map(t =>
                    t.id === updatedTest.id ? updatedTest : t
                );
            }
            return updated;
        });
        setEditTestModalOpen(false);
    };


    return (
        <div className="category-test-wrapper">
            <AddCategory
                isStatus={editModalOpen}
                setIsStatus={setEditModalOpen}
                initialData={selectedCategory}
                onUpdate={handleCategoryUpdated}
            />

            <AddTestForm
                isStatus={editTestModalOpen}
                setIsStatus={setEditTestModalOpen}
                initialData={selectedTest}
                onUpdate={handleTestUpdated} // optional callback
            />
            <h2>Barcha bo'limlar ro'yxati</h2>
            {categories.map((cat) => (
                <div key={cat.id} className="category-block">
                    <div className={`category-header ${openedCategories[cat.id] ? 'active' : ''}`} onClick={() => toggleCategory(cat.id)}>
                        <span>{cat.name}</span>
                        <div className="category-actions">
                            <button onClick={(e) => {
                                e.stopPropagation()
                                handleEditCategory(cat)
                            }
                            }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                </svg>
                            </button>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(cat);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className={`test-list ${openedCategories[cat.id] ? 'show' : ''}`}>
                        {openedCategories[cat.id] && (
                            categoryTests[cat.id]?.length > 0 ? (
                                categoryTests[cat.id].map((test) => (
                                    <div key={test.id} className="test-card-admin">
                                        <h3>{test.name}</h3>
                                        <div className="test-card-actions">
                                            <button onClick={() => handleEditTest(test)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#000000" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDeleteTest(test)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 30 30">
                                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                                </svg>
                                            </button>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Bu kategoriya uchun testlar mavjud emas</p>
                            )
                        )}
                    </div>
                </div>
            ))}
            <div className={`category-delete-alert-modal ${isDeleteModalOpen ? "active" : ""}`}>
                <div className={`category-delete-alert-modal-content ${isDeleteModalOpen ? "active" : ""}`}>
                    <p>
                        <strong>"{deletingItem?.name || deletingItem?.text}"</strong>
                        {
                            deleteType === "category" ? " bo‘limini o‘chirmoqchimisiz?"
                                : deleteType === "test" ? " savolini o‘chirmoqchimisiz?"
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

        </div>
    );
};

export default CategoryTestList;
