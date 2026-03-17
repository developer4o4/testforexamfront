'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AccessContext } from '@/contexts/contexts';
import "./add-test.scss"

const AddTestForm = ({ isStatus, setIsStatus, initialData = null }) => {
    const { showNewNotification } = useContext(AccessContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [testForm, setTestForm] = useState({
        name: '',
        tests_time: 0,
        end_time: 0,
        class_number: '',
        created_date: new Date().toISOString().slice(0, 10),
        created_time: new Date().toLocaleTimeString('it-IT'),
        category: '',
    });

    const [testConfigs, setTestConfigs] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sections, setSections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subjectSections, setSubjectSections] = useState({});


    const [newConfig, setNewConfig] = useState({
        subject: '',
        section: '',
        question_count: '',
    });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/`).then(res => res.json()).then(setSubjects);
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/all-category/`).then(res => res.json()).then(data => setCategories(data.data));

        if (initialData) {
            setTestForm({
                name: initialData.name,
                tests_time: initialData.tests_time,
                end_time: initialData.end_time,
                class_number: initialData.class_number,
                created_date: initialData.created_at,
                created_time: initialData.created_at,
                category: initialData.category,
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (newConfig.subject && !subjectSections[newConfig.subject]) {
            fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/${newConfig.subject}/`)
                .then(res => res.json())
                .then(data => {
                    setSubjectSections(prev => ({
                        ...prev,
                        [newConfig.subject]: data
                    }));
                });
        }
    }, [newConfig.subject]);


    const handleTestChange = (e) => {
        const { name, value } = e.target;
        setTestForm(prev => ({ ...prev, [name]: value }));
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setNewConfig(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'subject') updated.section = ''; // bo‘limni reset qilish
            return updated;
        });
    };


    const addConfig = () => {
        if (!newConfig.subject || !newConfig.section || !newConfig.question_count) {
            showNewNotification("Barcha config maydonlarini to‘ldiring!", "warning");
            return;
        }

        const exists = testConfigs.find(
            c => c.subject === newConfig.subject && c.section === newConfig.section
        );

        if (exists) {
            showNewNotification("Bu fan va bo‘lim kombinatsiyasi allaqachon qo‘shilgan!", "error");
            return;
        }

        setTestConfigs(prev => [...prev, newConfig]);
        setNewConfig({ subject: '', section: '', question_count: '' });
    };

    const removeConfig = (index) => {
        setTestConfigs(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData
                ? `${process.env.NEXT_PUBLIC_TESTS_API}/test/tests/${initialData.id}/`
                : `${process.env.NEXT_PUBLIC_TESTS_API}/test/tests/`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: testForm.name,
                    tests_time: Number(testForm.tests_time),
                    end_time: Number(testForm.end_time),
                    class_number: testForm.class_number,
                    created_at: `${testForm.created_date}T${testForm.created_time}`,
                    category: testForm.category,
                }),
            });

            if (!response.ok) throw new Error(`Testni ${initialData ? "tahrirlashda" : "yaratishda"} xatolik!`);
            const test = await response.json();

            // Test configlar faqat yangi test yaratishda kiritiladi
            if (!initialData) {
                for (let config of testConfigs) {
                    const confRes = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/test-configs/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            test_id: test.id,
                            subject_id: config.subject,
                            section_id: config.section,
                            question_count: Number(config.question_count),
                        }),
                    });

                    if (!confRes.ok) {
                        const err = await confRes.json();
                        console.error(err);
                        throw new Error("Test config qo‘shishda muammo");
                    }
                }
            }

            showNewNotification(
                `Test ${initialData ? "muvaffaqiyatli tahrirlandi!" : "muvaffaqiyatli yaratildi!"}`,
                "success"
            );
            setIsStatus(false);
            setTestForm({
                name: '',
                tests_time: 0,
                end_time: 0,
                class_number: '',
                created_date: new Date().toISOString().slice(0, 10),
                created_time: new Date().toLocaleTimeString('it-IT'),
                category: ''
            });
            setTestConfigs([]);
        } catch (err) {
            setError(err.message);
            showNewNotification(err.message, "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={`add-test-name-container ${isStatus ? 'active' : ''}`}>
            <div className={`add-test-name-shape ${isStatus ? 'active' : ''}`}></div>
            <div className={`add-test-content ${isStatus ? 'active' : ''}`}>
                <h2>{initialData ? "Testni tahrirlash" : "Yangi test qo‘shish"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-row-grid-2">
                        <div className="input-row">
                            <label>Test nomi:</label>
                            <input name="name" value={testForm.name} onChange={handleTestChange} placeholder='Test nomini kiriting' />
                        </div>

                        <div className="input-row">
                            <label>Test davomiyligi (daq.):</label>
                            <input type="number" name="tests_time" value={testForm.tests_time} onChange={handleTestChange} placeholder='Test davomiyligini kiriting (daqiqada)' />
                        </div>
                    </div>

                    <div className="input-row-grid-2">
                        <div className="input-row">
                            <label>Sinf raqami:</label>
                            <input name="class_number" value={testForm.class_number} onChange={handleTestChange} placeholder='Sinf raqamini kiriting (1-A, 2-A)' />
                        </div>

                        <div className="input-row">
                            <label>Kategoriya:</label>
                            <select name="category" value={testForm.category} onChange={handleTestChange}>
                                <option value="" disabled>Tanlang</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <h3>Test Configs</h3>

                    <div className="input-row">
                        <select name="subject" value={newConfig.subject} onChange={handleConfigChange}>
                            <option value="">Fan</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="input-row">
                        <select
                            name="section"
                            value={newConfig.section}
                            onChange={handleConfigChange}
                            disabled={!newConfig.subject}
                        >
                            <option value="">Bo‘lim</option>
                            {(subjectSections[newConfig.subject] || []).map(sec => (
                                <option key={sec.id} value={sec.id}>{sec.name}</option>
                            ))}
                        </select>

                    </div>

                    <div className="input-row">
                        <input type="number" name="question_count" placeholder="Savollar soni" value={newConfig.question_count} onChange={handleConfigChange} />
                    </div>

                    <div className="input-row submit-button">
                        <button type="button" onClick={addConfig}>+</button>
                    </div>

                    <ul>
                        {testConfigs.map((cfg, i) => (
                            <li key={i}>
                                ✅ {subjects.find(s => s.id == cfg.subject)?.name} - {sections.find(sec => sec.id == cfg.section)?.name} - {cfg.question_count} savol
                                <button type="button" onClick={() => removeConfig(i)}>❌</button>
                            </li>
                        ))}
                    </ul>

                    <div className="input-row submit-button">
                        <button type="button" onClick={() => setIsStatus(false)}>Bekor qilish</button>
                        <button type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Saqlash"}</button>
                    </div>
                </form>

                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default AddTestForm;
