"use client"
import React, { useContext } from "react";
import { AccessContext } from "@/contexts/contexts";
import StudentProfile from "@/components/studentProfile/studentProfile";
import NotFound from "../not-found";
import TeacherProfile from "@/components/teacherProfile/teacherProfile";
import Loading from "@/components/loading/layout";

const ProfileSwitcher = () => {
  const { profileData, profileLoading } = useContext(AccessContext);

  if (profileLoading) return <Loading />
  if (!profileData) return <NotFound />

  return (
    <>
      {profileData.user_type === "teacher" ? (
        <TeacherProfile profileData={profileData} />
      ) : (
        <StudentProfile profileData={profileData} />
      )}
    </>
  )
}

export default ProfileSwitcher;
