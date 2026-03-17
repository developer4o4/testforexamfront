// AddTestForm.jsx
'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AccessContext } from '@/contexts/contexts';

const AddTestForm = () => {
    const { showNewNotification } = useContext(AccessContext);

    // Test form fields
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

    // Current config being added
    const [newConfig, setNewConfig] = useState({
        subject: '',
        section: '',
        question_count: '',
    });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/`).then(res => res.json()).then(setSubjects);
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/all-category/`).then(res => res.json()).then(data => setCategories(data.data));
    }, []);

    useEffect(() => {
        if (newConfig.subject) {
            fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/?subject=${newConfig.subject}`)
                .then(res => res.json()).then(setSections);
        } else {
            setSections([]);
        }
    }, [newConfig.subject]);

    const handleTestChange = (e) => {
        const { name, value } = e.target;
        setTestForm(prev => ({ ...prev, [name]: value }));
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setNewConfig(prev => ({ ...prev, [name]: value }));
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

        try {
            // 1. Asosiy testni yaratish
            const testRes = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/tests/`, {
                method: 'POST',
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

            if (!testRes.ok) throw new Error("Testni yaratishda xatolik");
            const test = await testRes.json();

            // 2. Har bir configni yuborish
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
                    console.error("Xatolik:", err);
                    throw new Error("Test config qo‘shishda muammo");
                }
            }

            showNewNotification("Test va konfiguratsiyalar muvaffaqiyatli qo‘shildi!", "success");

            // Reset
            setTestForm({
                name: '', tests_time: 0, end_time: 0, class_number: '',
                created_date: new Date().toISOString().slice(0, 10),
                created_time: new Date().toLocaleTimeString('it-IT'),
                category: ''
            });
            setTestConfigs([]);

        } catch (err) {
            showNewNotification(err.message, "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-test-form">
            <h2>Add test</h2>

            <label>Name:</label>
            <input type="text" name="name" value={testForm.name} onChange={handleTestChange} />

            <label>Tests time:</label>
            <input type="number" name="tests_time" value={testForm.tests_time} onChange={handleTestChange} />

            <label>End time:</label>
            <input type="number" name="end_time" value={testForm.end_time} onChange={handleTestChange} />

            <label>Class number:</label>
            <input type="text" name="class_number" value={testForm.class_number} onChange={handleTestChange} />

            <label>Created date:</label>
            <input type="date" name="created_date" value={testForm.created_date} onChange={handleTestChange} />

            <label>Time:</label>
            <input type="time" name="created_time" value={testForm.created_time} onChange={handleTestChange} />

            <label>Category:</label>
            <select name="category" value={testForm.category} onChange={handleTestChange}>
                <option value="">Tanlang</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <h3>TEST CONFIGS</h3>

            <div className="test-configs-table">
                <select name="subject" value={newConfig.subject} onChange={handleConfigChange}>
                    <option value="">Fan</option>
                    {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <select name="section" value={newConfig.section} onChange={handleConfigChange}>
                    <option value="">Bo‘lim</option>
                    {sections.map(sec => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                </select>

                <input type="number" name="question_count" placeholder="Savollar soni"
                       value={newConfig.question_count} onChange={handleConfigChange} />

                <button type="button" onClick={addConfig}>+</button>
            </div>

            <ul>
                {testConfigs.map((cfg, i) => (
                    <li key={i}>
                        ✅ Fan: {subjects.find(s => s.id == cfg.subject)?.name}, 
                        Bo‘lim: {sections.find(sec => sec.id == cfg.section)?.name}, 
                        Savollar: {cfg.question_count}
                        <button type="button" onClick={() => removeConfig(i)}>❌</button>
                    </li>
                ))}
            </ul>

            <button type="submit">Testni Saqlash</button>
        </form>
    );
};

export default AddTestForm;
