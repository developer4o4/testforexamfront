'use client'
import { AccessContext } from '@/contexts/contexts';
// 2. EditStudentModal.jsx
import { updateData } from '@/services/update';
import { useMask } from '@react-input/mask';
import React, { useContext, useEffect, useState } from 'react';
import "./edit-student.scss";

const EditStudentModal = ({ student, onClose, onSuccess, isStatus }) => {
    const [formData, setFormData] = useState({ ...student });
    const [regions, setRegions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [detailsError, setDetailsError] = useState({});
    const [classLetterOptions, setClassLetterOptions] = useState([]);
    const [selectedClassLetter, setSelectedClassLetter] = useState("");
    const { showNewNotification } = useContext(AccessContext)
    const [classList, setClassList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("");

    useEffect(() => {
        if (isStatus) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isStatus]);

    useEffect(() => {
        const fetchClassList = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes/`);
                const data = await res.json();
                setClassList(data.data);
            } catch (err) {
                console.error("Sinflarni yuklashda xatolik:", err);
            }
        };
        fetchClassList();
    }, []);

    const groupedByGrades = classList.length
        ? classList.reduce((acc, item) => {
            const grade = item.class_name.split("-")[0];
            if (!acc[grade]) acc[grade] = [];
            acc[grade].push(item);
            return acc;
        }, {})
        : {};

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_REGIONS_API);
                if (response.ok) {
                    const data = await response.json();
                    setRegions(data);
                } else {
                    console.error("Viloyatlarni yuklashda xatolik!");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        if (
            student &&
            regions.length > 0 &&
            classList.length > 0
        ) {
            setFormData({ ...student });

            // Sinf raqami va harfi
            if (student.class_name_id) {
                const [grade] = student.class_name_id.split("-");
                setSelectedGrade(String(grade));
                setSelectedClassLetter(student.class_name_id);
            }

            // Viloyat va tuman
            const regionObj = regions.find(r => r.name_uz === student.province);
            if (regionObj) {
                setSelectedRegion(String(regionObj.id));

                fetch(process.env.NEXT_PUBLIC_DISTRICTS_API)
                    .then(res => res.json())
                    .then(data => {
                        const filteredDistricts = data.filter(d => d.region_id === regionObj.id);
                        setDistricts(filteredDistricts);
                        const districtObj = filteredDistricts.find(d => d.name_uz === student.district );
                        if (districtObj) {
                            setSelectedDistrict(String(districtObj.id));
                        }
                    });
            }
        }
    }, [student, regions, classList]);


    const handleRegionChange = async (event) => {
        const regionId = event.target.value;
        setSelectedRegion(regionId);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_DISTRICTS_API);
            if (response.ok) {
                const data = await response.json();
                const regionDistricts = data.filter(
                    (district) => district.region_id === Number(regionId)
                );
                setDistricts(regionDistricts);
            } else {
                console.error("Viloyatlarni olishda xatolik!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setSelectedDistrict("");
    };
    const handleDistrictChange = (event) => {
        setSelectedDistrict(event.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            class_number_id: selectedGrade,
            class_name_id: selectedClassLetter,
            province: regions.find(r => String(r.id) === selectedRegion)?.name_uz || "",
            district: districts.find(d => String(d.id) === selectedDistrict)?.name_uz || "",
            birthday: formatToYYYYMMDD(formData.birthday),
        };
        try {
            await updateData(
                `${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/update/${student.id}/`,
                payload
            );
            onSuccess({ ...payload, id: student.id });
            onClose();
        } catch (err) {
            setError("Yangilashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const fatherNumberRef = useMask({
        mask: '+998 (__) ___-__-__',
        replacement: { _: /\d/ },
        showMask: true,
        separate: true,
    });
    const motherNumberRef = useMask({
        mask: '+998 (__) ___-__-__',
        replacement: { _: /\d/ },
        showMask: true,
        separate: true,
    });
    const birthDateRef = useMask({
        mask: '99.99.9999',
        replacement: { 9: /\d/ },
        showMask: false,
        separate: true,
    });

    function formatToDDMMYYYY(dateString) {
        if (!dateString || !dateString.includes("-")) return dateString;
        const [year, month, day] = dateString.split("-");
        return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
    }

    function formatToYYYYMMDD(dateString) {
        if (!dateString || !dateString.includes(".")) return dateString;
        const [day, month, year] = dateString.split(".");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return (
        <>
            <div className={`modal-backdrop ${isStatus ? "active" : ""}`}>
            </div>
            <div className={`student-edit-modal-content ${isStatus ? "active" : ""}`}>
                <h2>O'quvchini tahrirlash</h2>
                <form action="" onSubmit={handleSubmit} autoComplete='off'>
                    <div className="input-row">
                        <input type="text" autoSave='off' placeholder='Ism *' name='first_name' onChange={handleChange} value={formData.first_name} />
                    </div>
                    <div className="input-row">
                        <input type="text" placeholder='Familiya *' name='last_name' onChange={handleChange} value={formData.last_name} />
                    </div>
                    <div className="input-row">
                        <input type="text" placeholder='Otasining ismi *' name='middle_name' onChange={handleChange} value={formData.middle_name} />
                    </div>
                    <div className="input-row">
                        <input type="text" placeholder='Foydalanuvchi nomi *' name='username' onChange={handleChange} value={formData.username} />
                    </div>
                    <div className="input-row">
                        <input
                            value={formatToDDMMYYYY(formData.birthday)}
                            ref={birthDateRef}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, birthday: e.target.value }))
                            }
                            type="tel"
                            name="birthday"
                            placeholder="Tug'ilgan sanasi (DD.MM.YYYY) *"
                        />
                    </div>

                    <div className="input-row">
                        <input
                            ref={fatherNumberRef}
                            type="tel"
                            name='phone_number_1'
                            value={formData.phone_number_1}
                            onChange={handleChange}
                            placeholder='Otasining telefon raqami *' />
                    </div>
                    <div className="input-row">
                        <input
                            ref={motherNumberRef}
                            type="tel"
                            name='phone_number_2'
                            value={formData.phone_number_2}
                            onChange={handleChange}
                            placeholder='Onasining telefon raqami *' />
                    </div>
                    <div className="input-row">
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            <option value="" disabled>O'quvchini sinfini tanlang</option>
                            {Object.keys(groupedByGrades).map((grade) => (
                                <option key={grade} value={grade}>{grade}-sinf</option>
                            ))}
                        </select>

                    </div>
                    <div className="input-row">
                        <select
                            value={selectedClassLetter}
                            onChange={(e) => setSelectedClassLetter(e.target.value)}
                        >
                            <option value="" disabled>Sinf harfini tanlang</option>
                            {groupedByGrades[selectedGrade]?.map((cls) => (
                                <option key={cls.id} value={cls.class_name}>
                                    {cls.class_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-row">
                        <select
                            value={selectedRegion}
                            onChange={handleRegionChange}
                        >
                            {regions.map(region => (
                                <option key={region.id} value={region.id}>
                                    {region.name_uz}
                                </option>
                            ))}
                        </select>


                    </div>
                    <div className="input-row">
                        <select
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        >
                            {districts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name_uz}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="input-row">
                        <input type="text" value={formData.street} name='street' onChange={handleChange} placeholder="Ko'changiz *" />
                    </div>
                    <div className="input-row w-100">
                        <textarea name="about_us" onChange={handleChange} value={formData.about_us} id="" placeholder='Biz haqimizda qayerdan eshitdingiz'></textarea>
                    </div>
                    <div className="input-row register-submit-button">
                        <button type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Saqlash"}</button>
                        <button type="button" onClick={onClose}>Bekor qilish</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditStudentModal;