'use client'
import { useMask } from '@react-input/mask';
import React, { useContext, useEffect, useState } from 'react'
import "./page.scss";
import { AccessContext } from '@/contexts/contexts';
import NotFound from '@/app/not-found';

const AddStudent = () => {
  const { profileData, showNewNotification } = useContext(AccessContext);

  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    username: "",
    birthday: "",
    phone_number_1: "",
    phone_number_2: "",
    class_number_id: "",
    class_name_id: "",
    province: "", // This should match the API expectation
    district: "", // Changed from district_id to district
    street: "",
    password: "",
    confirmPassword: "",
    about_us: ""
  });

  const fatherNumberRef = useMask({ mask: '+998 (__) ___-__-__', replacement: { _: /\d/ } });
  const motherNumberRef = useMask({ mask: '+998 (__) ___-__-__', replacement: { _: /\d/ } });
  const birthDateRef = useMask({ mask: '##.##.####',
    replacement: { '#': /\d/ },
    showMask: false,
    separate: true, });

  useEffect(() => {
    if (profileData?.user_type === "teacher") {
      const fetchTeacherClasses = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/teacher-classes/${profileData.username}/`
          );
          const data = await res.json();
          setTeacherClasses(data || []);
        } catch (err) {
          console.error("O'qituvchining sinflarini olishda xatolik:", err);
        }
      };
      fetchTeacherClasses();
    }
  }, [profileData]);

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

  const handleRegionChange = async (event) => {
    const regionId = event.target.value;
    setSelectedRegion(regionId);
    setFormData(prev => ({ ...prev, province: regionId, district: "" }));

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DISTRICTS_API);
      if (response.ok) {
        const data = await response.json();
        const regionDistricts = data.filter(
          (district) => district.region_id === Number(regionId)
        );
        setDistricts(regionDistricts);
      } else {
        console.error("Tumanlarni olishda xatolik!");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setSelectedDistrict("");
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setFormData(prev => ({ ...prev, district: districtId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);

    const cls = teacherClasses.find(item => item.id === Number(classId));
    if (cls) {
      setFormData(prev => ({
        ...prev,
        class_number_id: cls.class_number,
        class_name_id: cls.class_name
      }));
    }
  };

  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.province || !formData.district) {
      showNewNotification("Iltimos, viloyat va tumanni tanlang!", "error");
      return;
    }
    
    try {
      const birthdayValue = birthDateRef.current?.value || "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          birthday: formatDateToISO(birthdayValue)
        }),
      });
      
      const responseData = await res.json();
      
      if (res.ok) {
        showNewNotification("O'quvchi muvaffaqiyatli qo'shildi!", "success");
        setFormData({
          first_name: "",
          last_name: "",
          middle_name: "",
          username: "",
          birthday: "",
          phone_number_1: "",
          phone_number_2: "",
          class_number_id: "",
          class_name_id: "",
          province: "",
          district: "",
          street: "",
          password: "",
          confirmPassword: "",
          about_us: ""
        });
        setSelectedClass("");
        setSelectedRegion("");
        setSelectedDistrict("");
      } else {
        // Show backend validation errors
        const errorMessage = Object.values(responseData.error || {}).flat().join(', ') || "Xatolik yuz berdi!";
        showNewNotification(errorMessage, "error");
      }
    } catch (err) {
      console.error("Xatolik:", err);
      showNewNotification("Server bilan bog'lanishda xatolik!", "error");
    }
  };


  if(profileData?.student_permissions) return <NotFound />

  return (
    <div className='add-student-container'>
      <div className="add-student-content">
        <h2>O'quvchini ro'yxatdan o'tkazish</h2>
        <div className="student-details">
          <form onSubmit={handleSubmit} autoComplete="off">

            <div className="input-row">
              <input type="text" name="first_name" placeholder="Ism *" value={formData.first_name} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input type="text" name="last_name" placeholder="Familiya *" value={formData.last_name} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input type="text" name="middle_name" placeholder="Otasining ismi *" value={formData.middle_name} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input type="text" name="username" placeholder="Foydalanuvchi nomi *" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input ref={birthDateRef} type="tel" name="birthday" placeholder="Tug'ilgan sana (DD.MM.YYYY)" required />
            </div>

            <div className="input-row">
              <input ref={fatherNumberRef} type="tel" name="phone_number_1" placeholder="Otasini telefon raqami *" value={formData.phone_number_1} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input ref={motherNumberRef} type="tel" name="phone_number_2" placeholder="Onasini telefon raqami" value={formData.phone_number_2} onChange={handleChange} />
            </div>

            <div className="input-row">
              <select name="teacher_class" value={selectedClass} onChange={handleClassChange} required>
                <option value="">Sinfni tanlang *</option>
                {teacherClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_number} sinflar {cls.class_name} sinf
                  </option>
                ))}
              </select>
            </div>
            
            <div className="input-row">
              <select
                name="province"
                value={selectedRegion}
                onChange={handleRegionChange}
                required
              >
                <option value="">Viloyatni tanlang *</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name_uz}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-row">
              <select
                name="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedRegion}
                required
              >
                <option value="">Tumanni tanlang *</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name_uz}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="input-row">
              <input type="text" name="street" placeholder="Ko'cha nomi *" value={formData.street} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <input type="password" name="password" placeholder="Parol *" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="input-row w-100">
              <input type="password" name="confirmPassword" placeholder="Parolni tasdiqlang *" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="input-row w-100">
              <textarea name="about_us" placeholder="Biz haqimizda qayerdan eshitdingiz?" value={formData.about_us} onChange={handleChange}></textarea>
            </div>

            <div className="input-row register-submit-button">
              <button type="submit">Qo'shish</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default AddStudent;