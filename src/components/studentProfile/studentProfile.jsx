'use client'
import React, { useState, useEffect } from "react";
import "./studentProfile.scss";
import Waves from "@/components/rankCard/rank-card";
import LineChart from "@/components/rank-chart/chart";
import Logout from "@/components/logout/logout";
import ProfileScienceResult from "../complated-tests/complatedTests";

const StudentProfile = ({ profileData }) => {
  const currentClassRank = profileData.rank_in_class;
  const currentSchoolRank = profileData.rank_in_parallel_classes;

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [rankStatistics, setRankStatistics] = useState({});
  const [classRankData, setClassRankData] = useState([]);
  const [schoolRankData, setSchoolRankData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // API dan statistika ma'lumotlarini olish
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://test.smartcoders.uz/students/students/stat-student/', {
          method: 'POST', // POST so'rovi
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: profileData.id // profileData.id ni POST qilib yuborish
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Ma'lumotlarni qayta ishlash
          const processedStats = processRankStatistics(data.rank_statistics);
          setRankStatistics(processedStats);
          
          // Mavjud yillarni olish
          const years = Object.keys(processedStats).map(year => parseInt(year)).sort();
          setAvailableYears(years);
          
          // Agar tanlangan yil mavjud bo'lmasa, eng so'nggi yilni tanlash
          if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(Math.max(...years));
          }
        } else {
          console.error('API dan ma\'lumot olishda xatolik');
        }
      } catch (error) {
        console.error('Xatolik yuz berdi:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profileData.id) {
      fetchStatistics();
    }
  }, [profileData.id]); // profileData.id o'zgarganda qayta yuklash

  useEffect(() => {
    if (rankStatistics[selectedYear]) {
      const classData = Array(12).fill(null);
      const schoolData = Array(12).fill(null);
      
      rankStatistics[selectedYear].forEach(stat => {
        // Oylar 0-index emas, 1 dan boshlanadi
        classData[stat.month - 1] = stat.class_rank;
        schoolData[stat.month - 1] = stat.parallel_rank;
      });
      
      setClassRankData(classData);
      setSchoolRankData(schoolData);
    } else {
      // Agar tanlangan yil uchun ma'lumot bo'lmasa, bo'sh ma'lumotlar
      setClassRankData(Array(12).fill(null));
      setSchoolRankData(Array(12).fill(null));
    }
  }, [selectedYear, rankStatistics]);

  // API dan kelgan statistika ma'lumotlarini yillarga ko'ra guruhlash
  const processRankStatistics = (stats) => {
    const result = {};
    
    if (stats && stats.length > 0) {
      stats.forEach(stat => {
        const year = stat.year;
        if (!result[year]) {
          result[year] = [];
        }
        result[year].push(stat);
      });
    }
    
    return result;
  };

  const toggleShowModal = () => {
    setEditProfileModal(!editProfileModal);
  };

  if (loading) {
    return (
      <section id="profile-section-students">
        <div className="loading">Yuklanmoqda...</div>
      </section>
    );
  }

  return (
    <section id="profile-section-students">
      {/* Edit modal */}
      <div className={`edit-profile ${editProfileModal ? "active" : ""}`}>
        <div className={`edit-profile-content ${editProfileModal ? "active" : ""}`}>
          <p>Profildagi bironta ma'lumotni o'zgartirish uchun adminga murojat qiling!</p>
          <div className="edit-actions">
            <button onClick={toggleShowModal}>Tushundim</button>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="welcome-text">
        <span>Xush kelibsiz, {profileData.first_name}</span>
        <div className="logout">
          <Logout />
        </div>
      </div>

      {/* Top line */}
      <div className="top-line-student">
        <div className="profile-card">
          <button onClick={toggleShowModal}>
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png"
              alt=""
            />
          </button>
          <img src="/assets/image/profile.jpg" alt="" />
          <div className="profile-card-texts">
            <p>
              {profileData.first_name} {profileData.last_name}
            </p>
            <p>{profileData.username}</p>
            <p>{profileData.class_name_id} o'quvchisi</p>
          </div>
        </div>

        {/* Class rank */}
        <div className="class-rank-card">
          <Waves />
          <p className="c-r">Sinfdagi o‘quvchilar ichidan</p>
          <p className="c-o">{currentClassRank}</p>
          <img
            className={`crown-img ${currentClassRank === 1
                ? "gold"
                : currentClassRank === 2
                  ? "silver"
                  : currentClassRank === 3
                    ? "bronze"
                    : "op-0"
              }`}
            src="/assets/image/gold-crown.png"
            alt="crown"
          />

          <p>O'rindasiz</p>
        </div>

        {/* School rank */}
        <div className="school-rank-card">
          <Waves />
          <p className="c-r">Parallel sinflar ichidan</p>
          <p className="c-o">{currentSchoolRank}</p>
          <img
            className={`crown-img school-crown ${currentSchoolRank === 1
              ? "gold"
              : currentSchoolRank === 2
                ? "silver"
                : currentSchoolRank === 3
                  ? "bronze"
                  : "op-0"
              }`}
            src="/assets/image/school-crown.png"
            alt="crown"
          />

          <p>O'rindasiz</p>
        </div>
      </div>

      {/* Charts */}
      <div className="middle-line">
        <div className="monthly-class-chart">
          <div className="line">
            <p>O'quvchini sinf ichidagi o'rni</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <LineChart year={selectedYear} data={classRankData} />
        </div>

        <div className="monthly-school-chart">
          <div className="line">
            <p>O'quvchini maktab ichidagi o'rni</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <LineChart year={selectedYear} data={schoolRankData} />
        </div>
      </div>

      {/* Science results */}
      <div className="profile-sciences">
        <p className="title-p">Ishlangan testlar natijalari</p>
        <ProfileScienceResult studentId={profileData.id} />
      </div>
    </section>
  );
};

export default StudentProfile;