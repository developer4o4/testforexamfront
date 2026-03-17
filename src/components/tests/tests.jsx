// // 'use client'
// // import React, { useEffect, useState } from 'react';
// // import Link from 'next/link';
// // import "./tests.scss";
// // import TestsSkeleton from '../homeTestsComp/layout';

// // const formatCategoryLink = (title) => {
// //   return title?.toLowerCase().replace(/\s+/g, '-') || 'default';
// // };

// // export default function Tests() {
// //   const [loading, setLoading] = useState(true);
// //   const [tests, setTests] = useState(null);
// //   const [rotateDirections, setRotateDirections] = useState({});

// //   useEffect(() => {
// //     const fetchTests = async () => {
// //       try {
// //         const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
// //         const response = await fetch(`/site/categories`, {
// //           cache: 'no-store'
// //         });

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const result = await response.json();

// //         if (!result.success) {
// //           throw new Error(result.error || 'Failed to fetch tests');
// //         }

// //         const mappedData = result.data.map(category => ({
// //           id: category.id,
// //           testImage: category.img || "https://cdn.testbor.com/0/quiz-category/01JPMA7KTREH7RMB957PAQG926.png",
// //           isNew: category.is_new || false,
// //           testTitle: category.name,
// //           testCount: category.test_count > 0 ? `${category.test_count} ta test` : "Cheksiz testlar",
// //         }));


// //         setTests(mappedData);
// //       } catch (error) {
// //         console.error('Fetch error:', error);
// //         setTests(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTests();
// //   }, []);

// //   if (loading) {
// //     return <TestsSkeleton />;
// //   }

// //   if (!tests) {
// //     return (
// //       <div className='tests-container'>
// //         <div className="tests-container-inner">
// //           <h1>Testlar <Link href="/tests/all">Barchasini ko'rish <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" /></svg></Link></h1>
// //           <div className="error-message">
// //             Testlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urunib ko'ring.
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const handleMouseEnter = (id) => {
// //     const randomDirection = Math.random() < 0.5 ? 'left' : 'right';
// //     setRotateDirections(prev => ({
// //       ...prev,
// //       [id]: randomDirection
// //     }));
// //   };

// //   const handleMouseLeave = (id) => {
// //     setRotateDirections(prev => ({
// //       ...prev,
// //       [id]: null
// //     }));
// //   };



// //   return (
// //     <div className='tests-container'>
// //       <div className="tests-container-inner">
// //         <h1>Test bo'limlari <Link href="/tests/all">Barchasini ko'rish <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" /></svg></Link></h1>

// //         <div className="tests-content">
// //           {tests.map((test, indx) => {
// //             const direction = rotateDirections[test.id];

// //             return (
// //               <div className="test-card" key={test.id}>
// //                 <Link href={`/tests/${formatCategoryLink(test.testTitle)}`}>
// //                   <div
// //                     className="card-top"
// //                     onMouseEnter={() => handleMouseEnter(test.id)}
// //                     onMouseLeave={() => handleMouseLeave(test.id)}
// //                   >
// //                     <div className="card-top-top">
// //                       <div className={`card-number ${direction === 'left' ? 'rotate-left' :
// //                         direction === 'right' ? 'rotate-right' : ''
// //                         }`}>
// //                         {indx + 1}
// //                       </div>
// //                       {test.isNew && <div className="new active">Yangi</div>}
// //                     </div>
// //                     <div className="card-top-bottom">
// //                       {test.testTitle}
// //                     </div>
// //                   </div>
// //                   <div className="card-bottom">
// //                     <button onMouseEnter={() => handleMouseEnter(test.id)}
// //                       onMouseLeave={() => handleMouseLeave(test.id)}>
// //                       <span>Bo'lim testlariga o'tish</span>
// //                       <span>Hoziroq boshlang</span>
// //                     </button>
// //                   </div>
// //                 </Link>
// //               </div>
// //             );
// //           })}


// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client'
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import "./tests.scss";
// import TestsSkeleton from '../homeTestsComp/layout';

// const formatCategoryLink = (slug, title) => {
//   return slug || title?.toLowerCase().replace(/\s+/g, '-') || 'default';
// };

// export default function Tests() {
//   const [loading, setLoading] = useState(true);
//   const [tests, setTests] = useState([]); 
//   const [rotateDirections, setRotateDirections] = useState({});

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         // Muhim: Agar env o'zgaruvchisi ishlamasa, urlni tekshiring
//         const apiUrl = process.env.NEXT_PUBLIC_TESTS_API || 'Sizning_API_Manzilingiz';
//         const response = await fetch(`${apiUrl}/test/tests/`, {
//           cache: 'no-store'
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const result = await response.json();
        
//         // Debug uchun: Ma'lumot kelyaptimi yoki yo'q, terminal/console da ko'rasiz
//         console.log("API Result:", result);

//         // API array qaytarsa to'g'ridan-to'g'ri olamiz
//         const dataArray = Array.isArray(result) ? result : (result.data || []);

//         const mappedData = dataArray.map((category, index) => ({
//           id: category.id || index, 
//           slug: category.slug,
//           testTitle: category.title || category.name, 
//           price: category.price,
//           testImage: category.img || "https://cdn.testbor.com/0/quiz-category/01JPMA7KTREH7RMB957PAQG926.png",
//           isNew: true,
//         }));

//         setTests(mappedData);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTests();
//   }, []);

//   const handleMouseEnter = (id) => {
//     const randomDirection = Math.random() < 0.5 ? 'left' : 'right';
//     setRotateDirections(prev => ({ ...prev, [id]: randomDirection }));
//   };

//   const handleMouseLeave = (id) => {
//     setRotateDirections(prev => ({ ...prev, [id]: null }));
//   };

//   if (loading) return <TestsSkeleton />;

//   return (
//     <div className='tests-container'>
//       <div className="tests-container-inner">
//         <h1>
//           Testlar
//           <Link href="/tests/all">
//             Barchasini ko'rish 
//             <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
//               <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" />
//             </svg>
//           </Link>
//         </h1>

//         <div className="tests-content">
//           {tests.length > 0 ? (
//             tests.map((test, indx) => {
//               const direction = rotateDirections[test.id];
//               return (
//                 <div className="test-card" key={test.id}>
//                   <Link href={`/tests/${test.slug}`}>
//                     <div
//                       className="card-top"
//                       onMouseEnter={() => handleMouseEnter(test.id)}
//                       onMouseLeave={() => handleMouseLeave(test.id)}
//                     >
//                       <div className="card-top-top">
//                         <div className={`card-number ${
//                           direction === 'left' ? 'rotate-left' :
//                           direction === 'right' ? 'rotate-right' : ''
//                         }`}>
//                           {indx + 1}
//                         </div>
//                         {test.isNew && <div className="new active">Yangi</div>}
//                       </div>
//                       <div className="card-top-bottom">
//                         {test.testTitle}
//                         <div style={{fontSize: '14px', marginTop: '5px', opacity: 0.8}}>
//                           Narxi: {test.price} so'm
//                         </div>
//                       </div>
//                     </div>
//                     <div className="card-bottom">
//                       <button>
//                         <span>Hoziroq boshlang</span>
//                         <span>Testni yechish</span>
//                       </button>
//                     </div>
//                     <Modal onClose={() => setShowModal(false)} showModal={showModal}>
//         {selectedTest && (
//           <div className="test-confirmation-modal">
//             <h2>{selectedTest.title}</h2>
//             <p>{selectedTest.testDescription}</p>
//             <div className="test-details">
//               <p><span>Savollar soni:</span> {selectedTest.question_count + " ta" || "Mavjud emas"}</p>
//               <p><span>Vaqt:</span> {formatTestTime(selectedTest.tests_time)}</p>
//             </div>
//             <div className="modal-actions">
//               <button className="cancel-button" onClick={() => setShowModal(false)}>
//                 Bekor qilish
//               </button>
//               {
//                 profileData !== null ? (
//                   <button
//                     id='st'
//                     type="button"
//                     onClick={startTest}
//                     disabled={stLoading}
//                   >
//                     {stLoading ? "Boshlanmoqda..." : "Boshlash"}
//                   </button>
//                 ) : (
//                   <button id='st' onClick={() => {
//                     setLoginStat(true)
//                     setShowModal(false)
//                   }}>Kirish</button>
//                 )
//               }
//             </div>
//           </div>
//         )}
//       </Modal>
//                   </Link>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="error-message">Hozircha testlar topilmadi.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import "./tests.scss";
import TestsSkeleton from '../homeTestsComp/layout';
import Modal from '@/components/modal/layout'; // Modal komponentingiz yo'li
import { AccessContext } from '@/contexts/contexts';

export default function Tests() {
  const { profileData, setLoginStat } = useContext(AccessContext);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [rotateDirections, setRotateDirections] = useState({});
  
  // Modal uchun statelar
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [stLoading, setStLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_TESTS_API || '';
        const response = await fetch(`${apiUrl}/test/tests/`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : (result.data || []);

        const mappedData = dataArray.map((category, index) => ({
          ...category,
          id: category.id || index,
          testTitle: category.title || category.name,
          isNew: true,
        }));
        setTests(mappedData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleOpenModal = (e, test) => {
    e.preventDefault(); // Link ishlashini to'xtatadi
    setSelectedTest(test);
    setShowModal(true);
  };

  const startTest = async () => {
    setStLoading(true);
    // Bu yerda testni boshlash logikasi (masalan, router.push)
    setTimeout(() => {
        window.location.href = `/tests/process/${selectedTest.slug}`;
        setStLoading(false);
    }, 1000);
  };

  const formatTestTime = (time) => {
    if (!time) return "Belgilanmagan";
    return `${time} daqiqa`;
  };

  if (loading) return <TestsSkeleton />;

  return (
    <div className='tests-container'>
      <div className="tests-container-inner">
        <h1>
          Testlar
          <Link href="/tests/all">
            Barchasini ko'rish 
            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" />
            </svg>
          </Link>
        </h1>

        <div className="tests-content">
          {tests.length > 0 ? (
            tests.map((test, indx) => (
              <div className="test-card" key={test.id}>
                {/* Linkni faqat card ustiga qo'yamiz, lekin modal ochish funksiyasini chaqiramiz */}
                <div onClick={(e) => handleOpenModal(e, test)} style={{ cursor: 'pointer' }}>
                  <div className="card-top">
                    <div className="card-top-top">
                      <div className="card-number">{indx + 1}</div>
                      {test.isNew && <div className="new active">Yangi</div>}
                    </div>
                    <div className="card-top-bottom">
                      {test.testTitle}
                      <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
                        Narxi: {test.price} so'm
                      </div>
                    </div>
                  </div>
                  <div className="card-bottom">
                    <button type="button">
                      <span>Hoziroq boshlang</span>
                      <span>Testni yechish</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="error-message">Hozircha testlar topilmadi.</div>
          )}
        </div>
      </div>

      {/* Modal - Loopdan tashqarida bitta bo'lishi kerak */}
      <Modal onClose={() => setShowModal(false)} showModal={showModal}>
        {selectedTest && (
          <div className="test-confirmation-modal">
            <h2>{selectedTest.testTitle}</h2>
            <p>{selectedTest.description || "Ushbu test bo'yicha ma'lumotlar bilan tanishing."}</p>
            <div className="test-details">
              <p><span>Savollar soni:</span> {selectedTest.question_count ? `${selectedTest.question_count} ta` : "Mavjud emas"}</p>
              <p><span>Vaqt:</span> {formatTestTime(selectedTest.tests_time)}</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Bekor qilish{profileData}
              </button>
              {profileData !== null ? (
                <button
                  className="start-button"
                  id="st"
                  type="button"
                  onClick={startTest}
                  disabled={stLoading}
                >
                  {stLoading ? "Boshlanmoqda..." : "Boshlash"}
                </button>
              ) : (
                <button 
                  className="start-button"
                  id="st" 
                  onClick={() => {
                    setLoginStat(true);
                    setShowModal(false);
                  }}
                >
                  Kirish
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}