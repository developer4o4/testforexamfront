'use client'
import { useMask } from '@react-input/mask';
import React, { useContext, useState } from 'react'
import "./page.scss";
import { AccessContext } from '@/contexts/contexts';

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    class_name: "",
    birth_day: ""
  });
  const [loading, setLoading] = useState(false);
  const [detailsError, setDetailsError] = useState({});
  const { showNewNotification } = useContext(AccessContext);

  // Tug'ilgan sana maskasi
  const birthDateRef = useMask({
    mask: '##.##.####',
    replacement: { '#': /\d/ },
    showMask: false,
    separate: true,
  });

  // Telefon maskasi
  const phoneNumberRef = useMask({
    mask: '+998 (__) ___-__-__',
    replacement: { _: /\d/ },
    showMask: true,
    separate: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.first_name.trim()) errors.first_name = "Ism kiritilishi shart!";
    if (!formData.last_name.trim()) errors.last_name = "Familiya kiritilishi shart!";
    if (!formData.username.trim()) errors.username = "Foydalanuvchi nomi shart!";
    if (!formData.phone_number.trim()) errors.phone_number = "Telefon raqami shart!";
    if (!formData.class_name.trim()) errors.class_name = "Sinf nomi shart!";
    if (!formData.password.trim() || formData.password.length < 6) errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak!";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Parollar mos emas!";
    if (!birthDateRef.current?.value) errors.birth_day = "Tug'ilgan sana kiritilishi shart!";

    setDetailsError(errors);
    return Object.keys(errors).length === 0;
  };

  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const birthdayValue = birthDateRef.current?.value || "";

      const response = await fetch(`https://test.smartcoders.uz/teachers/teacher/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSend,
          birth_day: formatDateToISO(birthdayValue)
        })
      });

      if (response.ok) {
        showNewNotification("O'qituvchi muvaffaqiyatli ro'yxatdan o'tdi!", "success");
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          password: "",
          confirmPassword: "",
          phone_number: "",
          class_name: "",
          birth_day: ""
        });
        if (birthDateRef.current) birthDateRef.current.value = "";
      } else {
        showNewNotification("Xatolik yuz berdi! Ro'yxatdan o'tilmadi.", "error");
      }
    } catch (err) {
      showNewNotification("Server bilan ulanishda xatolik!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-container">
      <div className="add-teacher-content">
        <h2>O'qituvchini ro'yxatdan o'tkazish</h2>
        <div className="student-details">
          <form onSubmit={handleSubmit} autoComplete="off">

            <div className="input-row">
              <input type="text" placeholder="Ism *" name="first_name" value={formData.first_name} onChange={handleChange} />
              {detailsError.first_name && <span>{detailsError.first_name}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder="Familiya *" name="last_name" value={formData.last_name} onChange={handleChange} />
              {detailsError.last_name && <span>{detailsError.last_name}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder="Foydalanuvchi nomi *" name="username" value={formData.username} onChange={handleChange} />
              {detailsError.username && <span>{detailsError.username}</span>}
            </div>
            <div className="input-row">
              <input ref={birthDateRef} type="tel" placeholder="Tug'ilgan sanasi (DD.MM.YYYY) *" />
              {detailsError.birth_day && <span>{detailsError.birth_day}</span>}
            </div>
            <div className="input-row">
              <input ref={phoneNumberRef} type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Telefon raqami *" />
              {detailsError.phone_number && <span>{detailsError.phone_number}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder="Sinf nomi *" name="class_name" value={formData.class_name} onChange={handleChange} />
              {detailsError.class_name && <span>{detailsError.class_name}</span>}
            </div>
            <div className="input-row">
              <input type="password" placeholder="Parol *" name="password" value={formData.password} onChange={handleChange} />
              {detailsError.password && <span>{detailsError.password}</span>}
            </div>
            <div className="input-row">
              <input type="password" placeholder="Parolni takrorlang *" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {detailsError.confirmPassword && <span>{detailsError.confirmPassword}</span>}
            </div>

            <div className="input-row register-submit-button">
              <button type="submit" disabled={loading}>
                {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tkazish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default AddTeacher;
