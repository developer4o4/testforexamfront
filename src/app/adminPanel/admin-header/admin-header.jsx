'use client'
import React, { useContext } from "react";
import "./admin-header.scss";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logout from "@/components/logout/logout";
import { AccessContext } from "@/contexts/contexts";
import NotFound from "@/app/not-found";
import Header from "@/components/publicHeader/header";
// import logo from "../../../components/header/Logo.png";
// import { NavLink, useNavigate } from "react-router-dom";
// import { AccessContext } from "../../../AccessContext";

const AdminHeader = () => {
  // const { logout } = useContext(AccessContext);
  // const navigate = useRouter();
  // const handleLogout = () => {
  //   logout();
  //   navigate("/");
  // };
  const pathName = usePathname();
  const { profileData } = useContext(AccessContext);

  // if(!profileData || !profileData.is_superuser) {
  //   return <Header />
  // }

  return (
    <>
      {/* <marquee behavior="" direction="">
        Platforma sinov tariqasia ishga tushurilgan!
      </marquee> */}
      <div id="admin-header">
        <div className="admin-header-inner">
          <div className="logo">
            <Link href="/">
              <img src="/logo/logo.png" alt="" />
            </Link>
          </div>
          <div className="menus">
            <div className="menu">
              <Link
                className={pathName === "adminPanel" ? "act" : ""}
                href="/adminPanel"
              >
                Bosh sahifa
              </Link>
            </div>
            <div className="menu">
              <Link
                className={pathName === "adminPanel/sciences" ? "act" : ""}
                href=""
              >
                Ro'yxatdan o'tkazish
              </Link>
              <div className="box">
                <Link href="/adminPanel/add-student">O'quvchi qo'shish</Link>
                <Link href="/adminPanel/add-teacher">O'qituvchi qo'shish</Link>
                <Link href="/adminPanel/classes/">Sinflar qo'shish</Link>
              </div>
            </div>
            <div className="menu">
              <Link
                className={pathName === "adminPanel/sciences" ? "act" : ""}
                href=""
              >
                Fanlar qo'shish
              </Link>
              <div className="box">
                <Link href="/adminPanel/sciences">Fan qo'shish</Link>
                <Link href="/adminPanel/tests">Test qo'shish</Link>
              </div>
            </div>
            <div className="menu">
              <Link
                // className={pathName === "adminPanel/sciences" ? "act" : ""}
                href=""
              >
                Ro'yxatlar
              </Link>
              <div className="box">
                <Link href="/adminPanel/all-students">O'quvchilar ro'yxati</Link>
                <Link href="/adminPanel/all-teachers">O'qituvchilar ro'yxati</Link>
                <Link href="/adminPanel/all-classes">Sinflar ro'yxati</Link>
                <Link href="/adminPanel/all-sciences">Fanlar ro'yxati</Link>
                <Link href="/adminPanel/all-tests">Testlar ro'yxati</Link>
              </div>
            </div>
          </div>
          <div className="admin-name">
            <Logout />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
