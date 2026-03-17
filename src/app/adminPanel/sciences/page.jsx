'use client'
import React, { useState } from 'react';
import "./page.scss";
import AddScience from '@/components/adminPanel/science/add-science/add-science';
import AddScienceSection from '@/components/adminPanel/science/add-science-section/add-science-section';
import SciencesTable from '@/components/adminPanel/science/sciences-table/sciences-table';

const Sciences = () => {
    const [addScience, setAddScience] = useState(false);
    const [addScienceSecion, setAddScienceSection] = useState(false);
    return (
        <div id='sciences-page'>
            <div className="add-science-name">
                <AddScience isStatus={addScience} setIsStatus={setAddScience} />
            </div>
            <div className="add-science-number">
                <AddScienceSection isStatus={addScienceSecion} setIsStatus={setAddScienceSection} />
            </div>
            <div className="info-container">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                    <path d="M 25 2 C 12.264481 2 2 12.264481 2 25 C 2 37.735519 12.264481 48 25 48 C 37.735519 48 48 37.735519 48 25 C 48 12.264481 37.735519 2 25 2 z M 25 4 C 36.664481 4 46 13.335519 46 25 C 46 36.664481 36.664481 46 25 46 C 13.335519 46 4 36.664481 4 25 C 4 13.335519 13.335519 4 25 4 z M 25 11 A 3 3 0 0 0 25 17 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 23 23 L 23 36 L 21 36 L 21 38 L 29 38 L 29 36 L 27 36 L 27 21 L 21 21 z"></path>
                </svg>
                <p>Salom, Siz Sinf qo'shish uchun (1-A, 2-B va hok.) Avvalo sinfni o'z raqami bilan qo'shib olishingiz kerak. Misol uchun avval: 1-sinflar, 2-sinflar va hok. Undan so'ng u sinflarga bog'lab 1-A, 1-B kabi qo'sha olasiz</p>
            </div>
            <div className="add-science-actions">
                <button onClick={() => { setAddScience(true) }}>
                    Fanlarni qo'shish (Ingliz tili, Ona tili)
                </button>
                <button onClick={() => { setAddScienceSection(true) }}>
                    Fan uchun test bo'limlarini qo'shish (Ingliz tili uchun test, Ona tili uchun test)
                </button>
            </div>
            <SciencesTable />
        </div>
    )
}

export default Sciences