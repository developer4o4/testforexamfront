// "use client"
// import React, { useContext, useState } from 'react';
// import "./header.scss"
// import Link from 'next/link';
// import { AccessContext } from '@/contexts/contexts';
// import { usePathname } from 'next/navigation';

// const HeaderSkeleton = () => {
//   return (
//     <>
//       <div className="header-skeleton">
//         <div className="skeleton-profile"></div>
//       </div>
//     </>
//   );
// };

// const Header = () => {
//   const { setLoginStat, profileData, profileLoading } = useContext(AccessContext);
//   const [togg, setTogg] = useState(false);
//   const pathname = usePathname()
//   const toggleMen = () => {
//     setTogg(!togg)
//   }
//   return (
//     <>
//       <header>
//         <div className="header-inner">
//           <div className="logo">
//             <Link href="/">
//               <img src="/logo/logo.png" alt="" />
//             </Link>
//           </div>
//           <div className="hamb" onClick={toggleMen}>
//             <span></span>
//             <span></span>
//             <span></span>
//           </div>
//           <nav className='desk-nav'>
//             <ul>
//               <li>
//                 <Link href="/tests/all" className={pathname === '/tests/all' ? "act" : ""}>Testlar</Link>
//               </li>
//               <li>
//                 <Link href="/about-us" className={pathname === '/about-us' ? "act" : ""}>Biz haqimizda</Link>
//               </li>
//               <li>
//                 <Link href="/contests" className={pathname === '/contests' ? "act" : ""}>Musobaqalar</Link>
//               </li>
//               <li>
//                 <Link href="/works" className={pathname === '/works' ? "act" : ""}>Vazifalar</Link>
//               </li>
//             </ul>
//           </nav>
//           <div className="login-btns desk-btns">
//             {
//               profileLoading ? (
//                 <HeaderSkeleton />
//               ) : profileData !== null ? (
//                 <Link href={profileData.is_superuser ? "/adminPanel/" : "/profile"} className={pathname === '/profile' ? "prof-act" : ""}>{profileData.is_superuser ? "Admin panel" : "Shaxsiy kabinet"}</Link>
//               ) : (
//                 <button onClick={() => setLoginStat(true)}>Kirish</button>
//               )
//             }
//           </div>
//         </div>
//       </header>
//       <div className={`off-shape ${togg ? "act" : ""}`}></div>
//       <div className={`off-can ${togg ? "act" : ""}`}>
//         <div className="hamb" onClick={toggleMen}>
//           <span></span>
//           <span></span>
//         </div>
//         <nav >
//           <ul>
//             <li>
//               <Link href="/tests/all" className={pathname === '/tests/all' ? "act" : ""}>Testlar</Link>
//             </li>
//             <li>
//               <Link href="/learn" className={pathname === '/learn' ? "act" : ""}>O'rganish</Link>
//             </li>
//             <li>
//               <Link href="/contests" className={pathname === '/contests' ? "act" : ""}>Musobaqalar</Link>
//             </li>
//             <li>
//               <Link href="/works" className={pathname === '/works' ? "act" : ""}>Vazifalar</Link>
//             </li>
//           </ul>
//         </nav>
//         <div className="login-btns">
//           {
//             profileLoading ? (
//               <HeaderSkeleton />
//             ) : profileData !== null ? (
//               <>
//                 <Link href={profileData.is_superuser ? "/adminPanel/admin-sciences" : "/profile"} className={pathname === '/profile' ? "prof-act" : ""}>{profileData.is_superuser ? "Admin panel" : "Shaxsiy kabinet"}</Link>
//               </>
//             ) : (
//               <>
//                 <button onClick={() => {
//                   setLoginStat(true)
//                   setTogg(false)
//                 }}>Kirish</button>
//               </>
//             )
//           }
//         </div>
//       </div>
//     </>

//   )
// }

// export default Header


"use client"
import React, { useContext, useState } from 'react';
import "./header.scss"
import Link from 'next/link';
import { AccessContext } from '@/contexts/contexts';
import { usePathname } from 'next/navigation';

const HeaderSkeleton = () => (
  <div className="header-skeleton">
    <div className="skeleton-profile" style={{width: '100px', height: '30px', background: '#eee', borderRadius: '5px'}}></div>
  </div>
);

const Header = () => {
  const { setLoginStat, profileData, profileLoading } = useContext(AccessContext);
  const [togg, setTogg] = useState(false);
  const pathname = usePathname();

  const toggleMen = () => setTogg(!togg);

  // Profil tugmasini generatsiya qilish
  const renderProfileBtn = () => {
    if (profileLoading) return <HeaderSkeleton />;
    
    if (profileData) {
      const isAdmin = profileData.is_superuser || profileData.user_type === 'admin';
      const linkHref = isAdmin ? "/adminPanel" : "/profile";
      const linkText = isAdmin ? "Admin panel" : "Shaxsiy kabinet";
      
      return (
        <Link href={linkHref} className={pathname === linkHref ? "prof-act" : ""}>
          {linkText}
        </Link>
      );
    }

    return <button onClick={() => { setLoginStat(true); setTogg(false); }}>Kirish</button>;
  };

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="logo">
            <Link href="/"><img src="/logo/logo.png" alt="Logo" /></Link>
          </div>
          
          <div className="hamb" onClick={toggleMen}>
            <span></span><span></span><span></span>
          </div>

          <nav className='desk-nav'>
            <ul>
              <li><Link href="/tests/all" className={pathname === '/tests/all' ? "act" : ""}>Testlar</Link></li>
              <li><Link href="/about-us" className={pathname === '/about-us' ? "act" : ""}>Biz haqimizda</Link></li>
              <li><Link href="/contests" className={pathname === '/contests' ? "act" : ""}>Musobaqalar</Link></li>
              <li><Link href="/works" className={pathname === '/works' ? "act" : ""}>Vazifalar</Link></li>
            </ul>
          </nav>

          <div className="login-btns desk-btns">
            {renderProfileBtn()}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`off-shape ${togg ? "act" : ""}`} onClick={toggleMen}></div>
      <div className={`off-can ${togg ? "act" : ""}`}>
        <div className="hamb close" onClick={toggleMen}>✕</div>
        <nav>
          <ul>
            <li><Link href="/tests/all" onClick={() => setTogg(false)}>Testlar</Link></li>
            <li><Link href="/contests" onClick={() => setTogg(false)}>Musobaqalar</Link></li>
            <li><Link href="/works" onClick={() => setTogg(false)}>Vazifalar</Link></li>
          </ul>
        </nav>
        <div className="login-btns">
          {renderProfileBtn()}
        </div>
      </div>
    </>
  );
};

export default Header;