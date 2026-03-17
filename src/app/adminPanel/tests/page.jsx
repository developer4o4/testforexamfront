'use client'
import React, { useState } from 'react';
import "./page.scss";
import AddQuestion from '@/components/adminPanel/test/add-question/add-question';
import AddOption from '@/components/adminPanel/test/add-option/add-option';
import TestsTable from '@/components/adminPanel/test/tests-table/tests-table';
import AddCategory from '@/components/adminPanel/test/add-category/add-category';
import AddTestForm from '@/components/adminPanel/test/add-test/add-test';
import CategoryTestList from '@/components/adminPanel/test/tests-categories/categories';

const Tests = () => {
    const [addCategory, setAddCategory] = useState(false);
    const [addTest, setAddTest] = useState(false);
    const [addQuestion, setAddQuestion] = useState(false);
    const [addOption, setAddOption] = useState(false);
    return (
        <div id='tests-page'>
            <div className="add-category">
                <AddCategory isStatus={addCategory} setIsStatus={setAddCategory} />
            </div>
            <div className="add-test-number">
                <AddTestForm isStatus={addTest} setIsStatus={setAddTest} />
            </div>
            <div className="add-test-name">
                <AddQuestion isStatus={addQuestion} setIsStatus={setAddQuestion} />
            </div>
            <div className="add-test-number">
                <AddOption isStatus={addOption} setIsStatus={setAddOption} />
            </div>
            <div className="info-container">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                    <path d="M 25 2 C 12.264481 2 2 12.264481 2 25 C 2 37.735519 12.264481 48 25 48 C 37.735519 48 48 37.735519 48 25 C 48 12.264481 37.735519 2 25 2 z M 25 4 C 36.664481 4 46 13.335519 46 25 C 46 36.664481 36.664481 46 25 46 C 13.335519 46 4 36.664481 4 25 C 4 13.335519 13.335519 4 25 4 z M 25 11 A 3 3 0 0 0 25 17 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 23 23 L 23 36 L 21 36 L 21 38 L 29 38 L 29 36 L 27 36 L 27 21 L 21 21 z"></path>
                </svg>
                <p>Salom, Bu sahifada test bo'limlari uchun savol va variantlar qo'shishingiz mumkun!</p>
            </div>
            <div className="add-test-actions">
                <button onClick={() => { setAddCategory(true) }}>
                    Category qo'shish
                </button>
                <button onClick={() => { setAddTest(true) }}>
                    Test qo'shish
                </button>
                <button onClick={() => { setAddQuestion(true) }}>
                    Test uchun savol qo'shish
                </button>
                <button onClick={() => { setAddOption(true) }}>
                    Test savoli uchun variantlar qo'shish
                </button>
            </div>
            <TestsTable />
            <CategoryTestList />
        </div>
    )
}

export default Tests