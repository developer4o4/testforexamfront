'use client'
import React, { useState } from "react";
import "./teacherProfile.scss";
import Logout from "@/components/logout/logout";
import Link from "next/link";
import TeacherClasses from "../teachersClasses/teachersClasses";

const TeacherProfile = ({ profileData }) => {
  const [editProfileModal, setEditProfileModal] = useState(false);

  const toggleShowModal = () => {
    setEditProfileModal(!editProfileModal)
  }

  return (
    <section id="profile-section" >
      <div className={`edit-profile ${editProfileModal ? "active" : ""}`}>
        <div className={`edit-profile-content ${editProfileModal ? "active" : ""}`}>
          <p>Profildagi bironta ma'lumotni o'zgartirish uchun adminga murojat qiling!</p>
          <div className="edit-actions">
            <button onClick={toggleShowModal}>Tushundim</button>
          </div>
        </div>
      </div>
      <div className="welcome-text">
        <span>Xush kelibsiz, {profileData.first_name}</span>
        <div className="logout">
          <Logout />
        </div>
      </div>
      <div className="top-line">
        <div className="profile-card">
          <button onClick={toggleShowModal}>
            <img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" alt="" />
          </button>
          <img src="/assets/image/profile.jpg" alt="" />
          <div className="profile-card-texts">
            <p>{profileData.first_name} {profileData.last_name}</p>
            <p>{profileData.username}</p>
          </div>
        </div>
        <div className="add-student-card">
          <h2>Sizga berilgan ruxsatlar bo'yicha amallar bajarishingiz mumkun</h2>
          <div className="btn-line">
            {
              profileData.student_permision || profileData.class_permision || profileData.test_permision ? (
                <>
                  {
                    profileData.student_permision && <Link href='/profile/add-student'>O'quvchi qo'shish</Link>
                  }
                  {
                    profileData.class_permision && <Link href='/profile/add-class'>Sinf qo'shish</Link>
                  }
                  {
                    profileData.test_permision && <Link href='/profile/add-tests'>Test qo'shish</Link>
                  }
                </>
              ) : (
                <p>Sizga hech qanday ruxsatlar berilmagan</p>
              )
            }

          </div>
        </div>
      </div>
      <div className="mid-line">
        <TeacherClasses />
      </div>
    </section>
  );
};

export default TeacherProfile;