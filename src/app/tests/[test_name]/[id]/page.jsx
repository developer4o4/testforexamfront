"use client"
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import "./layout.scss";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse from "html-react-parser";
import Questions from './questions';
import Header from './header';
import Results from './results';
import { AccessContext } from '@/contexts/contexts';
import Loading from '@/components/loading/layout';
import NotFound from '@/app/not-found';
import { api } from '@/config';

export default function TestComponent() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const testId = id;
  const [currentTest, setCurrentTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sciences, setSciences] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStatus, setTestStatus] = useState('loading');
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const { profileData } = useContext(AccessContext);
  const [opTracker, setOpTracker] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [testResult, setTestResult] = useState(null);


  useEffect(() => {
    const fetchTestData = async () => {
      if (!profileData?.id || !testId) return;

      try {
        const token = localStorage.getItem("sapfirAccess");
        setLoading(true);

        const questionsRes = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/start-test/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            test_id: testId,
            user_id: profileData.id,
          }),
        });

        if (!questionsRes.ok) {
          throw new Error('Failed to fetch questions');
        }

        const questionsDataData = await questionsRes.json();
        const data = questionsDataData.data;

        setSessionId(data.session_id);
        const startedAt = new Date(data.started_at);
        const totalMinutes = Math.ceil(data.test.tests_time) || 30;
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startedAt) / 1000);
        const remainingTime = totalMinutes * 60 - elapsedSeconds;

        if (remainingTime <= 0) {
          setTestStatus('timeout');
          return;
        }

        const testData = {
          id: data.test.id,
          testTime: totalMinutes,
          science: [],
          testTitle: data.test.name || "",
        };
        setCurrentTest(testData);
        setTimeLeft(remainingTime);
        const formattedQuestions = data.user_questions.map((userQ) => {
          const q = userQ.question;
          const section = q.section;
          const subject = section.subject;

          return {
            id: q.id,
            text: q.text,
            options: q.options,
            science_id: subject.id,
            science_name: subject.name,
            section_id: section.id,
            section_name: section.name,
            score: 1,
            time: null,
            image: q.text.includes('<img') ? q.text.match(/src="([^"]*)"/)?.[1] : null
          };
        });

        setQuestions(formattedQuestions);

        const uniqueScienceIds = [...new Set(formattedQuestions.map(q => q.science_id))];
        const formattedSciences = uniqueScienceIds.map(id => ({
          id,
          title: formattedQuestions.find(q => q.science_id === id)?.science_name || `Science ${id}`
        }));

        setSciences(formattedSciences);
        setTestStatus('active');

      } catch (error) {
        console.error('Error fetching test data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId, profileData]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      window.history.pushState({ isZoomed: true }, '');
      window.addEventListener('popstate', handleBackButton);
    } else {
      window.removeEventListener('popstate', handleBackButton);
    }
  };

  const handleBackButton = (event) => {
    if (isZoomed) {
      event.preventDefault();
      toggleZoom();
      if (window.history.state?.isZoomed) {
        window.history.back();
      }
    }
  };

  const handleTimeout = () => {
    let finalScore = 0;

    questions.forEach((question, index) => {
      const userAnswerId = selectedAnswers[index];
      const correctOption = question.options.find(opt => opt.is_correct);
      if (userAnswerId && correctOption && userAnswerId === correctOption.id) {
        finalScore++;
      }
    });

    setScore(finalScore);
    setTestStatus('timeout');
  };

  const selectedAnswersRef = useRef({});

  const handleOptionSelect = (questionIndex, optionId) => {
    selectedAnswersRef.current[questionIndex] = optionId;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionId
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (!profileData) {
    return <NotFound />
  }

  if (!currentTest) {
    return <div className="error-container">
      <div className="test-error-content">
        <h2>Test topilmadi!</h2>
        <button onClick={() => router.push('/tests/all/')}>Ortga qaytish</button>
      </div>
    </div>;
  }
  if (testStatus === 'completed' || testStatus === 'timeout') {
    return <Results
      questions={questions}
      testStatus={testStatus}
      score={score}
      selectedAnswers={selectedAnswers}
      resultData={testResult}
    />
  }
  const finishTest = async () => {
    try {
      let finalScore = 0;
      const answersData = [];

      questions.forEach((question, index) => {
        const answerId = selectedAnswersRef.current[index];

        if (!answerId) {
          answersData.push({
            question_id: question.id,
            option_id: null,
          });
          return;
        }

        answersData.push({
          question_id: question.id,
          option_id: answerId,
        });
      });

      const totalTimeTaken = currentTest.testTime * 60 - timeLeft;
      const timePerQuestion = totalTimeTaken / questions.length;
      const [finishResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/submit-answers/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("sapfirAccess")}`
          },
          body: JSON.stringify({
            session_id: sessionId,
            answers: answersData,
            user_id: profileData?.id
          }),
        })
      ]);
      if (!finishResponse.ok) {
        const finishError = await finishResponse.json();
        console.error("Finish error:", finishError);
        throw new Error("Testni yakunlashda xato yuz berdi");
      }

      const finishResult = await finishResponse.json();

      setScore(finalScore);
      setTestResult(finishResult);
      setTestStatus('completed');

    } catch (error) {
      console.error("Testni yakunlashda xato:", error);
    }
  };




  if (questions.length === 0) {
    return (
      <div className="test-container">
        <div className="no-questions">
          <p>Ushbu testda savollar mavjud emas</p>
          <button onClick={() => router.push('/tests/all')}>Orqaga qaytish</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="test-container">
      <Header
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        testStatus={testStatus}
        currentTest={currentTest}
        currentQuestionIndex={currentQuestionIndex}
        questions={questions}
        toggleZoom={toggleZoom}
        handleTimeout={handleTimeout}
        setTestStatus={setTestStatus}
        selectedOption={selectedOption}
        finishTest={finishTest}
      />

      <div className="all-questions">
        <div className="opener" onClick={() => setOpTracker(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144" /></svg>
        </div>
        <ProgressTracker
          test={{
            id: currentTest.id,
            science: currentTest.science,
            questions: questions,
            title: currentTest.testTitle
          }}
          selectedAnswers={selectedAnswers}
          currentQuestionIndex={currentQuestionIndex}
          isTestFinished={testStatus === 'completed' || testStatus === 'timeout'}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          sciences={sciences}
          opener={opTracker}
          setOpener={setOpTracker}
        />
        <Questions
          toggleZoom={toggleZoom}
          currentQuestionIndex={currentQuestionIndex}
          currentQuestion={currentQuestion}
          selectedOption={selectedOption}
          questions={questions}
          setSelectedOption={setSelectedOption}
          setScore={setScore}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          setTestStatus={setTestStatus}
          isZoomed={isZoomed}
          handleBackButton={handleBackButton}
           handleOptionSelect={(optionId) => handleOptionSelect(currentQuestionIndex, optionId)}
          finishTest={finishTest}
        />
      </div>
    </div>
  );
}
const ProgressTracker = ({
  test = {},
  selectedAnswers = {},
  currentQuestionIndex = 0,
  isTestFinished = false,
  setCurrentQuestionIndex = () => { },
  opener,
  setOpener,
}) => {
  const questions = Array.isArray(test.questions) ? test.questions : [];

  const getQuestionStatus = (questionIndex) => {
    const isAnswered = selectedAnswers.hasOwnProperty(questionIndex);
    let answerLetter = "";

    if (isAnswered) {
      const selectedOptionId = selectedAnswers[questionIndex];
      const selectedOptionIndex = questions[questionIndex]?.options?.findIndex(
        opt => opt.id === selectedOptionId
      );
      if (selectedOptionIndex >= 0) {
        answerLetter = String.fromCharCode(65 + selectedOptionIndex);
      }
    }

    if (isTestFinished) {
      if (isAnswered) {
        const correctOption = questions[questionIndex].options.find(opt => opt.is_correct);
        const isCorrect = correctOption?.id === selectedAnswers[questionIndex];
        return {
          status: isCorrect ? "correct" : "incorrect",
          answerLetter
        };
      }
      return {
        status: "unanswered",
        answerLetter
      };
    }

    return {
      status: isAnswered ? "answered" : "neutral",
      answerLetter
    };
  };

  return (
    <div className={`progress-tracker ${opener ? "act" : ""}`}>
      <div className="closer" onClick={() => setOpener(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144" />
        </svg>
      </div>
      <div className="questions-section">
        <p className="question-count">Savollar soni: {questions.length} ta</p>
        <div className="tracker-questions">
          {questions.map((question, index) => {
            const { status, answerLetter } = getQuestionStatus(index);
            const isCurrent = index === currentQuestionIndex;

            return (
              <div
                key={question.id || index}
                className={`circle ${status} ${isCurrent ? "current" : ""}`}
                onClick={() => setCurrentQuestionIndex(index)}
                title={`Savol ${index + 1} - ${answerLetter ? `Tanlangan: ${answerLetter}` : 'Javob berilmagan'}`}
              >
                {index + 1}
                {answerLetter && <span className="selected-option">{answerLetter}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
