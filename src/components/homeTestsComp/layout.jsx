// import "./layout.scss";
// // Skeleton komponenti
// function TestsSkeleton() {
//   return (
//     <div className='tests-container'>
//       <div className="tests-container-inner">
//         <h1>Testlar <div className="skeleton-link"><span>Barchasini ko'rish</span> <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" /></svg></div></h1>

//         <div className="tests-content skeleton-tests">
//           {[...Array(4)].map((_, index) => (
//             <div key={index} className="skeleton-test-card">
//               <div className="skeleton-image"></div>
//               <div className="skeleton-text">
//                 <div className="skeleton-line"></div>
//                 <div className="skeleton-line"></div>
//               </div>
//               <div className="skeleton-footer">
//                 <div className="skeleton-line"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import "./layout.scss";

// 1. Skeleton UI: Yuklanish paytida ko'rinadigan qism
const SkeletonLoader = () => (
  <div className="tests-container">
    <div className="tests-container-inner">
      <h1>
        Testlar 
        <div className="skeleton-link">
          <span>Barchasini ko'rish</span> 
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" />
          </svg>
        </div>
      </h1>

      <div className="tests-content skeleton-tests">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="skeleton-test-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 2. Asosiy Komponent
function TestsSkeleton() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TESTS_API}/test/tests/`
        );
        if (!res.ok) throw new Error("Ma'lumot olishda xatolik");
        const data = await res.json();
        setTests(data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Yuklanayotgan bo'lsa skeletonni ko'rsatish
  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="tests-container">
      <div className="tests-container-inner">
        <h1>Testlar</h1>

        <div className="tests-content">
          {tests.length > 0 ? (
            tests.map((test, index) => (
              <div key={test.id || index} className="test-card">
                <div className="test-image">
                   {/* Agar API'dan rasm kelsa shu yerga qo'ying */}
                </div>

                <div className="test-text">
                  <h3>{test.name}</h3>
                  <p>Vaqti: {test.tests_time} min</p>
                </div>

                <div className="test-footer">
                  <span>{test.category_name || test.category}</span>
                </div>
              </div>
            ))
          ) : (
            <p>Hozircha testlar mavjud emas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestsSkeleton;