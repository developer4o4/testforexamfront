'use client'
import React, { useState } from "react";
import "./all-tests.scss";

const tests = [
  {
    id: 1,
    testTitle: "Matematika testi",
    relatedTests: [
      {
        id: 1,
        questionText: "2 * 2",
        options: [
          {
            a: "4",
            b: "5",
            d: "3",
            c: "3",
          }
        ]
      },
      {
        id: 2,
        questionText: "3 * 3",
        options: [
          {
            a: "5",
            b: "6",
            d: "9",
            c: "9",
          }
        ]
      },
    ]
  },
  {
    id: 2,
    testTitle: "Ona tili testi",
    relatedTests: [
      {
        id: 1,
        questionText: "Ot qanday savollarga javob beradi?",
        options: [
          {
            a: "kim",
            b: "nima, qayer",
            d: "barchasiga",
            c: "barchasiga",
          }
        ]
      },
    ]
  }
];

const TestsList = () => {
  const [openedTests, setOpenedTests] = useState([]);

  const toggleTest = (id) => {
    setOpenedTests(prev =>
      prev.includes(id)
        ? prev.filter(openedId => openedId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="all-test-list">
      <div className="tests-list">
      {tests.map((test) => (
        <div key={test.id} className="test-item">
          <div
            className={`test-title ${openedTests.includes(test.id) ? "active" : ""}`}
            onClick={() => toggleTest(test.id)}
          >
            {test.testTitle}
          </div>

          <div
            className={`test-questions-wrapper ${openedTests.includes(test.id) ? "open" : ""}`}
          >
            <div className="test-questions">
              {test.relatedTests.map((question, indx) => (
                <div key={question.id} className="question-block">
                  <div className="question"><span>{indx+1}-savol.</span> {question.questionText}</div>
                  <ul className="options">
                    {Object.entries(question.options[0]).map(([key, value]) => (
                      <li key={key}><strong>{key.toUpperCase()})</strong> {value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TestsList;
