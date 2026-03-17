"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import "./layout.scss";
import { AccessContext } from '@/contexts/contexts';
import { api } from '@/config';

function Modal({ children, onClose, showModal }) {
  return (
    <div className={`modal-overlay ${showModal ? "active" : ""}`}>
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

const CategoriesSkeleton = () => {
  return (
    <div className="menu skeleton-menu">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton-category"></div>
      ))}
    </div>
  );
};

const TestCardsSkeleton = () => {
  return (
    <div className="tests-content skeleton-tests">
      {[...Array(6)].map((_, index) => (
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
  );
};

export default function TestsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState('all');
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setLoginStat, profileData, setProfileData, showNewNotification } = useContext(AccessContext)
  const [error, setError] = useState('')
  const [stLoading, setStLoading] = useState(false);
  const [cachedTests, setCachedTests] = useState({});
  const [rotateDirections, setRotateDirections] = useState({});
  const [animActive, setAnimActive] = useState({})

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesRes = await fetch('/site/categories');
        const categoriesData = await categoriesRes.json();
        const categoriesArray = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
        const testsRes = await fetch('/site/tests');
        const testsData = await testsRes.json();
        const testsArray = testsData.data;
        setCategories(categoriesArray);
        setTests({ tests: testsArray });
        setFilteredTests({ tests: testsArray });
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setTests({ tests: [] });
        setFilteredTests({ tests: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function formatCategoryLink(title) {
    return title?.toLowerCase().replace(/\s+/g, '-') || '';
  }

  useEffect(() => {
    if (!pathname || loading) return;
    const currentCategory = pathname.split('/').pop();
    if (pathname === '/tests/all' || pathname === '/tests') {
      setActiveButton('all');
      setFilteredTests(tests);
    } else if (currentCategory) {
      setActiveButton(currentCategory);
      const category = categories.find(cat =>
        formatCategoryLink(cat.name) === currentCategory
      );
      if (category) {
        handleCategoryClick(category.id, category.name);
        document.title = `${category.name} - SAPFIR School`;
      }
    }
  }, [pathname, categories, tests, loading]);
  async function handleCategoryClick(categoryId, name) {
    const formattedLink = formatCategoryLink(name);
    setActiveButton(formattedLink);
    router.push('/tests/' + formattedLink);
    if (cachedTests[categoryId]) {
      setFilteredTests({ tests: cachedTests[categoryId] });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/get-test-by-subject-id/?category_id=${categoryId}`);
      if (!res.ok) {
        console.error(`Server returned status ${res.status}`);
        setFilteredTests({ tests: [] });
        return;
      }
      const data = await res.json();
      setFilteredTests({ tests: data });
      setCachedTests(prev => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error("Kategoriya bo‘yicha testlar yuklanmadi:", err);
      setFilteredTests({ tests: [] });
    } finally {
      setLoading(false);
    }
  }
  function handleAllClick() {
    setActiveButton('all');
    router.push('/tests/all');
  }

  function handleTestClick(test) {
    setSelectedTest(test);
    setShowModal(true);
  }

  function formatTestName(testName) {
    return testName?.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  const startTest = async () => {
    setStLoading(true);
    try {
      const token = localStorage.getItem("sapfirAccess");
      if (!token) {
        showNewNotification("Token yo'q, Xisobingizga qayta kiring", "error");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/start-test/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          test_id: selectedTest.id,
          user_id: profileData.id,
        }),
      });

      if (response.ok) {
        showNewNotification("Test muvaffaqiyatli boshlandi!", "success", true);
        router.push(`/tests/${formatTestName(selectedTest.name)}/${selectedTest.id}`);
      } else {
        const errorData = await response.json();
        showNewNotification(
          errorData,
          "error"
        );
        setError(errorData.detail);
      }
    } catch (error) {
      showNewNotification("Xatolik yuz berdi!", "error");
      setError(error);
    } finally {
      setStLoading(false);
    }
  };

  function formatTestTime(timeString) {
    if (!timeString) return "Vaqt cheklanmagan";
    if (typeof timeString === 'string' && timeString.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      if (hours > 0 && minutes > 0) {
        return `${hours} soat ${minutes} daqiqa`;
      } else if (hours > 0) {
        return `${hours} soat`;
      } else if (minutes > 0) {
        return `${minutes} daqiqa`;
      } else {
        return "Vaqt cheklanmagan";
      }
    }

    const timeNumber = Number(timeString);
    if (!isNaN(timeNumber)) {
      if (timeNumber <= 0) return "Vaqt cheklanmagan";

      const hours = Math.floor(timeNumber / 60);
      const minutes = timeNumber % 60;

      if (hours > 0 && minutes > 0) {
        return `${hours} soat ${minutes} daqiqa`;
      } else if (hours > 0) {
        return `${hours} soat`;
      } else {
        return `${minutes} daqiqa`;
      }
    }
    return "Vaqt cheklanmagan";
  }

  if (loading) {
    return (
      <div className='tests-page'>
        <h1 className='page-title'>Testlar</h1>
        <CategoriesSkeleton />
        <TestCardsSkeleton />
      </div>
    );
  }

  const handleMouseEnter = (id) => {
    const randomDirection = Math.random() < 0.5 ? 'left' : 'right';
    setRotateDirections(prev => ({
      ...prev,
      [id]: randomDirection
    }));
    setAnimActive(prev => ({
      ...prev,
      [id]: "active"
    }))
  };

  const handleMouseLeave = (id) => {
    setRotateDirections(prev => ({
      ...prev,
      [id]: null
    }));
    setAnimActive(prev => ({
      ...prev,
      [id]: null
    }))
  };

  return (
    <div className='tests-page'>
      <h1 className='page-title'>Testlar</h1>
      <div className="menu">
        <button
          className={activeButton === 'all' ? 'active' : ''}
          onClick={handleAllClick}
        >
          Barchasi
        </button>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => {
            const formattedLink = formatCategoryLink(category.name);
            return (
              <button
                key={category.id}
                className={activeButton === formattedLink ? 'active' : ''}
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                {category.name}
                {category.isNew && <div className="new active">Yangi</div>}
              </button>
            );
          })
        ) : (
          <div className="no-categories">Kategoriyalar mavjud emas</div>
        )}
      </div>

      <div className="tests-content">
        {Array.isArray(filteredTests?.tests) && filteredTests.tests.length > 0 ? (
          filteredTests.tests.map((test, indx) => {
            const direction = rotateDirections[test.id];

            return (
              <div
                className="test-card"
                key={test.id}
                onClick={() => handleTestClick(test)}
                onMouseEnter={() => handleMouseEnter(test.id)}
                onMouseLeave={() => handleMouseLeave(test.id)}
              >
                <div className="card-top">
                  <div className="card-top-top">
                    <div className={`card-number ${direction === 'left' ? 'rotate-left' :
                      direction === 'right' ? 'rotate-right' : ''
                      }`}>
                      {indx + 1}
                    </div>
                    {test.isNew && <div className="new active">Yangi</div>}
                  </div>
                  <div className={`card-top-bottom ${animActive[test.id] === 'active' ? "active" : ""}`}>
                    <p className='test-count'><span></span> {test.question_count} ta savol</p>
                    <p className='test-time'><span></span> {formatTestTime(test.tests_time) || "0 daqiqa"}</p>
                    <p className='test-title'>{test.name || "Test nomi"}</p>
                  </div>
                </div>
                <div className="card-bottom">
                  <button onMouseEnter={() => handleMouseEnter(test.id)}
                    onMouseLeave={() => handleMouseLeave(test.id)}>
                    <span>Testni boshlash</span>
                    <span>Hoziroq boshlang</span>
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="no-tests">
            <p>Ushbu fanda testlar mavjud emas</p>
          </div>
        )}
      </div>

      <Modal onClose={() => setShowModal(false)} showModal={showModal}>
        {selectedTest && (
          <div className="test-confirmation-modal">
            <h2>{selectedTest.title}</h2>
            <p>{selectedTest.testDescription}</p>
            <div className="test-details">
              <p><span>Savollar soni:</span> {selectedTest.question_count + " ta" || "Mavjud emas"}</p>
              <p><span>Vaqt:</span> {formatTestTime(selectedTest.tests_time)}</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
              {
                profileData !== null ? (
                  <button
                    id='st'
                    type="button"
                    onClick={startTest}
                    disabled={stLoading}
                  >
                    {stLoading ? "Boshlanmoqda..." : "Boshlash"}
                  </button>
                ) : (
                  <button id='st' onClick={() => {
                    setLoginStat(true)
                    setShowModal(false)
                  }}>Kirish</button>
                )
              }
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}