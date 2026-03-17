'use client'
import { useMask } from '@react-input/mask';
import React, { useContext, useEffect, useState } from 'react'
import "./page.scss";
import { AccessContext } from '@/contexts/contexts';
const AddStudent = () => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    username: "",
    birthday: "",
    phone_number_1: "",
    phone_number_2: "",
    class_number_id: "",
    class_name_id: '',
    street: "",
    password: "",
    confirmPassword: "",
    about_us: ""
  });
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
  const [classNumbers, setClassNumbers] = useState([]);



  useEffect(() => {
    // Sinf raqamlarini olish
    const fetchClassNumbers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes-number/`);
        const data = await res.json();
        setClassNumbers(data.data || []);
      } catch (err) {
        console.error("Sinf raqamlari xatoligi:", err);
      }
    };

    // Harfli sinflarni olish
    const fetchClassList = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes/`);
        const data = await res.json();
        setClassList(data.data || []);
      } catch (err) {
        console.error("Harfli sinflarni olishda xatolik:", err);
      }
    };

    fetchClassNumbers();
    fetchClassList();
  }, []);

  // Barcha viloyatlarni olish
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

  // Qachonki viloyat tanlanganida unga tegishli bo'lgan tumanlar api orqali yuklanadi
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

  // Tumanlar tanlash uchun onChange
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  // Inputlar yozilishi uchun onChange
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "class_number_id") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setSelectedGrade(value);
      setSelectedClassLetter("");
      fetchClassNamesByNumber(value);
    }
    else if (name === "class_letter") {
      setSelectedClassLetter(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validatePhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 12;
  };

  const validateBirthday = (day) => {
    const cleaned = day.replace(/\D/g, '');
    return cleaned.length === 8;
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.first_name.trim()) errors.first_name = "Ism kiritilishi shart!";
    if (!formData.last_name.trim()) errors.last_name = "Familiya kiritilishi shart!";
    if (!formData.middle_name.trim()) errors.middle_name = "Otasini ismi kiritilishi shart!";
    if (!formData.username.trim()) errors.username = "Foydalanuvchi nomi kiritilishi shart!";
    if (formData.password.length < 6) {
      errors.password = "Parollar 6 ta belgidan kam bo'lmasligi shart!";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Parollar mos emas!";
    }
    if (!selectedRegion) errors.region = "Viloyat kiritilishi shart!";
    if (!selectedDistrict) errors.district = "Tuman kiritilishi shart!";
    if (!formData.street.trim()) errors.street = "Ko'cha kiritilishi shart!";
    if (!selectedGrade) errors.class_number_id = "Sinf tanlanishi shart!";
    if (!selectedClassLetter) errors.class_letter = "Sinf harfi tanlanishi shart!";
    if (!validatePhone(formData.phone_number_1)) errors.phone_number_1 = "Telefon raqami to'liq kiritilishi shart!";
    if (!validatePhone(formData.phone_number_2)) errors.phone_number_2 = "Telefon raqami to'liq kiritilishi shart!";
    const birthdayValue = birthDateRef.current?.value || "";
    if (!validateBirthday(birthdayValue)) {
      errors.birthday = "Tug'ilgan sana to'liq kiritilishi shart!";
    }
    if (!formData.about_us.trim()) errors.about_us = "To'ldirilishi shart!"
    setDetailsError(errors);
    return Object.keys(errors).length === 0;
  };
  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }


  // Ro'yxatdan o'tishni yakunlash va apiga so'rov yuborish uchun
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const selectedRegionName = regions.find(region => region.id === Number(selectedRegion));
      const regionName = selectedRegionName ? selectedRegionName.name_uz.replace(/�/g, "'") : "Viloyat nomi olinmadi!";
      const selectedDistrictName = districts.find(district => district.id === Number(selectedDistrict));
      const districtName = selectedDistrictName ? selectedDistrictName.name_uz.replace(/�/g, "'") : "Tuman nomi olinmadi!";
      const { confirmPassword, ...dataToSend } = formData;
      const birthdayValue = birthDateRef.current?.value || "";

      const response = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataToSend,
          province: regionName,
          district: districtName,
          birthday: formatDateToISO(birthdayValue),
          class_name_id: selectedClassLetter,
          class_number_id: selectedGrade
        }),
      })

      if (response.ok) {
        const data = await response.json();
        setSelectedDistrict('');
        setSelectedRegion('');
        if (birthDateRef.current) {
          birthDateRef.current.value = "";
        }
        setSelectedClassLetter("")
        setSelectedGrade("");
        setFormData({
          first_name: "",
          last_name: "",
          middle_name: "",
          username: "",
          birthday: "",
          phone_number_1: "",
          phone_number_2: "",
          class_number_id: "",
          class_name_id: '',
          street: "",
          password: "",
          confirmPassword: "",
          about_us: ""
        })
        showNewNotification("Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi!", "success");
      } else {
        const errorData = await response.json(); // JSON formatda xatoliklar
        if (errorData.error && errorData.error.username) {
          showNewNotification("Foydalanuvchi nomi allaqachon band!", "warning");
        } else {
          showNewNotification("Ro'yxatdan o'tish amalga oshirilmadi!", "error");
        }
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  // Next uchun telefon formati
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
  // Next uchun tug'ulgan sana formati
  const birthDateRef = useMask({
    mask: '##.##.####',
    replacement: { '#': /\d/ },
    showMask: false,
    separate: true,
  });

  const fetchClassNamesByNumber = async (classNumberId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/get-classes-by-number/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class_id: classNumberId }),
      });

      const result = await response.json();
      const classNames = result.classes || [];
      setClassLetterOptions(classNames);
    } catch (error) {
      console.error("Class names fetchda xatolik:", error);
    }
  };


  return (
    <div className='add-student-container'>
      <div className="add-student-content">
        <h2>O'quvchini ro'yxatdan o'tkazish</h2>
        <div className="student-details">
          <form action="" onSubmit={handleSubmit} autoComplete='off'>
            <div className="input-row">
              <input type="text" autoSave='off' placeholder='Ism *' name='first_name' onChange={handleChange} value={formData.first_name} />
              {detailsError.first_name && <span>{detailsError.first_name}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder='Familiya *' name='last_name' onChange={handleChange} value={formData.last_name} />
              {detailsError.last_name && <span>{detailsError.last_name}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder='Otasining ismi *' name='middle_name' onChange={handleChange} value={formData.middle_name} />
              {detailsError.middle_name && <span>{detailsError.middle_name}</span>}
            </div>
            <div className="input-row">
              <input type="text" placeholder='Foydalanuvchi nomi *' name='username' onChange={handleChange} value={formData.username} />
              {detailsError.username && <span>{detailsError.username}</span>}
            </div>
            <div className="input-row">
              <input
                ref={birthDateRef}
                type="tel"
                name="birthday"
                placeholder="Tug'ilgan sanasi (DD.MM.YYYY) *"
              />
              {detailsError.birthday && <span>{detailsError.birthday}</span>}
            </div>

            <div className="input-row">
              <input
                ref={fatherNumberRef}
                type="tel"
                name='phone_number_1'
                value={formData.phone_number_1}
                onChange={handleChange}
                placeholder='Otasining telefon raqami *' />
              {detailsError.phone_number_1 && <span>{detailsError.phone_number_1}</span>}
            </div>
            <div className="input-row">
              <input
                ref={motherNumberRef}
                type="tel"
                name='phone_number_2'
                value={formData.phone_number_2}
                onChange={handleChange}
                placeholder='Onasining telefon raqami *' />
              {detailsError.phone_number_2 && <span>{detailsError.phone_number_2}</span>}
            </div>
            <div className="input-row">
              <select
                name="class_number_id"
                value={selectedGrade}
                onChange={handleChange}  // <-- handleChange chaqirilsin
                className={selectedGrade == "" ? "disabled" : ""}
              >

                <option value="" disabled>O'quvchini sinfini tanlang!</option>
                {classNumbers.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_number}
                  </option>
                ))}
              </select>
              {detailsError.class_number_id && <span>{detailsError.class_number_id}</span>}
            </div>
            <div className="input-row">
              <select
                name="class_name_id"
                value={selectedClassLetter}
                className={selectedGrade === "" ? "disabled" : ""}
                onChange={(e) => {
                  setSelectedClassLetter(e.target.value);
                  setFormData(prev => ({ ...prev, class_name_id: e.target.value }));
                }}
              >
                <option value="">Sinf harfini tanlang</option>
                {classLetterOptions.map(item => (
                  <option key={item.id} value={item.class_name}>
                    {item.class_name}
                  </option>
                ))}
              </select>
              {detailsError.class_letter && <span>{detailsError.class_letter}</span>}
            </div>
            <div className="input-row">
              <select
                id="regionSelect"
                name='region'
                value={selectedRegion}
                onChange={handleRegionChange}
                className={selectedRegion == "" ? "disabled" : ""}
              >
                <option value="" disabled>
                  Viloyatlardan birini tanlang!
                </option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name_uz.replace(/�/g, "'")}
                  </option>
                ))}
              </select>
              {detailsError.region && <span>{detailsError.region}</span>}

            </div>
            <div className="input-row">
              <select
                id="districtSelect"
                name='district'
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className={selectedDistrict == "" ? "disabled" : ""}
              >
                <option value="" disabled>
                  Tumanlardan birini tanlang!
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name_uz.replace(/�/g, "'")}
                  </option>
                ))}
              </select>
              {detailsError.district && <span>{detailsError.district}</span>}

            </div>
            <div className="input-row">
              <input type="text" value={formData.street} name='street' onChange={handleChange} placeholder="Ko'changiz *" />
              {detailsError.street && <span>{detailsError.street}</span>}
            </div>
            <div className="input-row">
              <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Parol kiriting *' />
              {detailsError.password && <span>{detailsError.password}</span>}
              {detailsError.confirmPassword && <span>{detailsError.confirmPassword}</span>}
            </div>
            <div className="input-row">
              <input type="password" name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Parolni takrorlang *' />
              {detailsError.password && <span>{detailsError.password}</span>}
              {detailsError.confirmPassword && <span>{detailsError.confirmPassword}</span>}
            </div>
            <div className="input-row w-100">
              <textarea name="about_us" onChange={handleChange} value={formData.about_us} id="" placeholder='Biz haqimizda qayerdan eshitdingiz'></textarea>
              {
                detailsError.about_us && <span>{detailsError.about_us}</span>
              }
            </div>
            <div className="input-row register-submit-button">
              <button type='submit' disabled={loading}>
                {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudent