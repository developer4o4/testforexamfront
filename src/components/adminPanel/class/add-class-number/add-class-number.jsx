'use client';

import React, { useContext, useEffect, useState } from 'react';
import './add-class-number.scss';
import { AccessContext } from '@/contexts/contexts';
import { updateData } from '@/services/update';

const AddClassNumber = ({ isStatus, setIsStatus, initialData = null }) => {
  const [formData, setFormData] = useState({ class_number: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [detailsError, setDetailsError] = useState({});
  const { showNewNotification } = useContext(AccessContext);

  // 🔁 initialData o'zgarsa, formani to'g'ri holatga olib keladi
  useEffect(() => {
    if (initialData) {
      setFormData({ class_number: initialData.class_number });
    } else {
      setFormData({ class_number: '' });
    }
    setError(false);
    setDetailsError({});
  }, [initialData, isStatus]);

  const validateForm = () => {
    let errors = {};
    if (!formData.class_number.trim()) errors.class_number = "Sinf raqami kiritilishi shart!";
    setDetailsError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (initialData) {
        // Tahrirlash (PUT)
        await updateData(
          `${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/update-class-number/${initialData.id}/`,
          formData
        );
        showNewNotification("Sinf muvaffaqiyatli tahrirlandi!", "success");
      } else {
        // Yaratish (POST)
        const response = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/create-class-number/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Yaratishda xatolik!');
        showNewNotification("Yangi sinf raqami muvaffaqiyatli qo'shildi!", "success");
      }

      setIsStatus(false); // modalni yopish
      window.location.reload(); // sahifani yangilash
    } catch (error) {
      showNewNotification("Jarayon davomida xatolik yuz berdi", "error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Bekor qilish: modal yopiladi va forma tozalanadi
  const handleCancel = () => {
    setIsStatus(false);
    setError(false);
    setDetailsError({});
    if (initialData) {
      setFormData({ class_number: initialData.class_number });
    } else {
      setFormData({ class_number: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={`add-class-number-shape ${isStatus ? 'active' : ''}`}></div>
      <div className={`add-class-number-content ${isStatus ? 'active' : ''}`}>
        <h2>{initialData ? "Sinfni tahrirlash" : "Yangi sinf qo'shish"}</h2>
        <div className="add-class-details">
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <input
                type="text"
                name="class_number"
                value={formData.class_number}
                onChange={handleChange}
                placeholder="Sinf nomini kiriting (Masalan: 1-sinf, 2-sinf)"
              />
              {detailsError.class_number && <span>{detailsError.class_number}</span>}
            </div>
            <div className="input-row submit-button">
              <button type="button" onClick={handleCancel}>
                Bekor qilish
              </button>
              <button type="submit" disabled={loading}>
                {loading
                  ? (initialData ? "Saqlanmoqda..." : "Qo'shilmoqda...")
                  : (initialData ? "Saqlash" : "Qo'shish")}
              </button>
            </div>
          </form>
        </div>

        {error && <p style={{ color: 'red' }}>Xatolik: {error}</p>}
      </div>
    </>
  );
};

export default AddClassNumber;
