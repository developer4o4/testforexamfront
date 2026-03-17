"use client";
import React, { useContext, useState } from 'react';
import "./layout.scss";
import { AccessContext } from '@/contexts/contexts';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [type, setType] = useState("user"); 
    const [show, setShow] = useState(true);
    const [errors, setErrors] = useState({
        login: '',
        password: '',
        form: '' // Form umumiy xatosi uchun
    });
    const [loading, setLoading] = useState(false);
    const { setLoginStat, loginStat, showNewNotification } = useContext(AccessContext);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Yozishni boshlaganda xatolarni tozalash
        setErrors(prev => ({ ...prev, [name]: '', form: '' }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { login: '', password: '', form: '' };

        if (!formData.login.trim()) {
            newErrors.login = "Login kiritilishi shart";
            isValid = false;
        }
        if (!formData.password) {
            newErrors.password = "Parol kiritilishi shart";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const resetForm = () => {
        setFormData({ login: "", password: "" });
        setErrors({ login: "", password: "", form: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            // API manzilingizni tekshiring: /users/login/ yoki /token/
            const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/login/`;

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.login, // Backend 'username' kutsa
                    password: formData.password,
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // Backenddan kelgan aniq xatolikni ko'rsatish
                throw new Error(result.detail || result.error || 'Login yoki parol xato');
            }

            // --- TOKENLARNI SAQLASH ---
            // Backend SimpleJWT ishlatsa 'access' va 'refresh' qaytaradi
            const accessToken = result.access || result.token;
            const refreshToken = result.refresh;

            if (accessToken) {
                localStorage.setItem('sapfirAccess', accessToken);
                localStorage.setItem('sapfirRefresh', refreshToken || '');
                localStorage.setItem('sapfirUser', result.user_id || result.id || '');
                localStorage.setItem('sapfirType', type);
                
                if (result.user_type) {
                    localStorage.setItem("sapfirUserType", result.user_type);
                }

                showNewNotification("Shaxsiy hisobingizga kirdingiz!", "success", {
                    persist: false, // Odatda true bo'lsa notification ketmay qoladi
                    reloadAfter: true
                });

                setLoginStat(false);
                resetForm();

                // Yo'naltirish (Backenddan kelgan user_type ga qarab)
                if (result.user_type === "teacher") {
                    router.push("/teacher/dashboard");
                }
            } else {
                throw new Error("Token olinmadi. Backend javobini tekshiring.");
            }

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                form: error.message
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={`login-shape ${loginStat ? "popped" : ""}`} onClick={() => setLoginStat(false)}></div>
            <div className={`login-popup ${loginStat ? "popped" : ""}`}>
                <div className="login-container">
                    <div className="close" onClick={() => setLoginStat(false)}>✕</div>
                    <div className="logo">
                        <img src="/logo/logo.png" alt="Logo" />
                    </div>
                    <h1><span>Akkountingizga</span> kiring</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <input
                                type="text"
                                name="login"
                                placeholder="Foydalanuvchi nomi"
                                value={formData.login}
                                onChange={handleChange}
                                className={errors.login ? "error-input" : ""}
                            />
                            {errors.login && <span className="error-text">{errors.login}</span>}
                        </div>

                        <div className="input-row password-field">
                            <input
                                type={show ? "password" : "text"}
                                name="password"
                                placeholder="Parol"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? "error-input" : ""}
                            />
                            <button type='button' className="eye-btn" onClick={() => setShow(!show)}>
                                {show ? "👁️" : "🙈"}
                            </button>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        {errors.form && <div className="error-message-box">{errors.form}</div>}

                        <div className="input-row">
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? 'Kirilmoqda...' : "Kirish"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;