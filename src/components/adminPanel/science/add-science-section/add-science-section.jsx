'use client';

import React, { useEffect, useState, useContext } from "react";
import { AccessContext } from "@/contexts/contexts";
import { updateData } from "@/services/update";
import "./add-science-section.scss";

const AddScienceSection = ({ isStatus, setIsStatus, initialData = null }) => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ subject_id: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState({});
  const { showNewNotification } = useContext(AccessContext);

  // Fanlar ro'yxatini olish
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/subjects/`);
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Fanlarni olishda xatolik:", error);
      }
    };
    fetchSubjects();
  }, []);

  // initialData mavjud bo'lsa, formani to' ldirish
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        subject_id: initialData.subject?.id || "",
      });
    } else {
      setFormData({ name: "", subject_id: "" });
    }
  }, [initialData]);

  // Forma validatsiyasi
  const validateForm = () => {
    const errors = {};
    if (!formData.subject_id) errors.subject_id = "Fan tanlanishi kerak!";
    if (!formData.name.trim()) errors.name = "Bo‘lim nomi kiritilishi kerak!";
    setDetailsError(errors);
    return Object.keys(errors).length === 0;
  };

  // Forma yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (initialData) {
        await updateData(
          `${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/${initialData.id}/`,
          formData
        );
        showNewNotification("Bo‘lim muvaffaqiyatli tahrirlandi!", "success");
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/sections/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Bo‘limni yaratishda xatolik!");
        showNewNotification("Bo‘lim muvaffaqiyatli qo‘shildi!", "success");
      }

      setFormData({ subject_id: "", name: "" });
      setIsStatus(false);
      window.location.reload(); // yoki parentdan qayta fetch
    } catch (err) {
      console.error(err);
      setError(err.message);
      showNewNotification("Jarayon davomida xatolik yuz berdi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setIsStatus(false);
    setError("");
    setDetailsError({});
    if (initialData) {
      setFormData({
        name: initialData.name,
        subject_id: initialData.subject?.id || "",
      });
    } else {
      setFormData({ name: "", subject_id: "" });
    }
  };

  return (
    <div className="add-section-container">
      <div className={`add-section-shape ${isStatus ? "active" : ""}`}></div>
      <div className={`add-section-content ${isStatus ? "active" : ""}`}>
        <h3>{initialData ? "Bo‘limni tahrirlash" : "Yangi bo‘lim qo‘shish"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label>Fan tanlang:</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
            >
              <option value="">-- Fan tanlang --</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {detailsError.subject_id && <span>{detailsError.subject_id}</span>}
          </div>

          <div className="input-row">
            <label>Bo‘lim nomi:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masalan: Algebra, Matnli masalalar..."
            />
            {detailsError.name && <span>{detailsError.name}</span>}
          </div>

          <div className="input-row submit-button">
            <button type="button" onClick={handleCancel}>
              Bekor qilish
            </button>
            <button type="submit" disabled={loading}>
              {loading
                ? initialData
                  ? "Saqlanmoqda..."
                  : "Qo‘shilmoqda..."
                : initialData
                  ? "Saqlash"
                  : "Qo‘shish"}
            </button>
          </div>
        </form>

        {error && <p style={{ color: 'red' }}>Xatolik: {error}</p>}
      </div>
    </div>
  );
};

export default AddScienceSection;
