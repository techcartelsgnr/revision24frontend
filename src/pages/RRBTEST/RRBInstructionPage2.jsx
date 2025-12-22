import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RRBInstructionPage2 = () => {
  const [isDeclared, setIsDeclared] = useState(false);
  const { state } = useLocation();
  const nav = useNavigate();

  console.log("STATE RRB INSTRUCTION SCREEN 2 ===>", state);

  // Extract test information from state
  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];

  // Calculate total questions and marks
  const totalQuestions = testDetail.reduce((total, subject) => total + parseInt(subject.no_of_question || 0), 0);
  const totalMarks = testDetail.reduce((total, subject) => total + parseInt(subject.marks || 0), 0);

  // Convert negative marking fraction to decimal
  const negativeMarkDecimal = testInfo.negative_mark ;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700">
      {/* Header */}
      <header className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-500">Revision24</span>
          <span className="ml-4 text-gray-600">{testInfo.title || 'Test Information'}</span>
        </div>
      </header>

      <div className="flex">
        {/* Main Content - Added pb-24 for bottom spacing */}
        <main className="flex-grow p-8 pb-24">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {testInfo.title || 'Test Information'}
            </h1>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-semibold">Duration: {testInfo.time || 90} Mins</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Maximum Marks: {totalMarks || testInfo.marks}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold mb-3 text-gray-800">Read the following instructions carefully.</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>The test contains {totalQuestions || testInfo.no_of_question} total questions.</li>
              <li>Each question has 4 options out of which only one is correct.</li>
              <li>You have to finish the test in {testInfo.time || 90} minutes.</li>
              <li>Try not to guess the answer as there is negative marking.</li>
              <li>You will be awarded {state.total_marks/totalQuestions} mark for each correct answer and {negativeMarkDecimal || testInfo.negative_mark} will be deducted for each wrong answer.</li>
              <li>There is no negative marking for the questions that you have not attempted.</li>
              <li>You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser.</li>
            </ol>
          </div>

          {/* Subject-wise breakdown */}
          {testDetail.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3 text-gray-800">Subject-wise Distribution:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {testDetail.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                      <span className="font-medium text-gray-700">{subject.subject_name}</span>
                      <span className="text-blue-600 font-semibold">
                        {subject.no_of_question} Questions ({subject.marks} Marks)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <hr className="my-8" />

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="language" className="font-semibold">Choose your default language:</label>
              <select id="language" name="language" className="border border-gray-300 rounded-md p-1">
                <option>-- Select --</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <p className="text-red-500 text-xs">Please note all questions will appear in your default language. This language can be changed for a particular question later on.</p>

            <div>
              <p className="font-semibold">Declaration:</p>
              <div className="flex items-start mt-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isDeclared}
                  onChange={() => setIsDeclared(!isDeclared)}
                  className="mt-1 mr-2 h-4 w-4"
                />
                <label htmlFor="declaration" className="text-sm text-gray-600">
                  I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Revision24.com will be final in these matters and cannot be appealed.
                </label>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-gray-50 border-l border-gray-200 p-6 flex flex-col items-center">
          {/* User Profile */}
          <img
            src={state.userInfo?.profile}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg object-cover"
          />
          <p className="mt-4 font-bold text-lg text-gray-800 text-center">{state.userInfo?.name}</p>

          {/* Test Summary Card */}
          <div className="mt-6 w-full bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3">
              <h4 className="font-bold text-white text-center text-base">Test Summary</h4>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Questions */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm whitespace-nowrap">Questions:</span>
                <span className="font-bold text-gray-900 text-base ml-2">{totalQuestions || testInfo.no_of_question}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm whitespace-nowrap">Duration:</span>
                <span className="font-bold text-gray-900 text-base ml-2">{testInfo.time} mins</span>
              </div>

              {/* Total Marks */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm whitespace-nowrap">Total Marks:</span>
                <span className="font-bold text-gray-900 text-base ml-2">{totalMarks || testInfo.marks}</span>
              </div>

              {/* Negative Marking */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm whitespace-nowrap">Negative Marking:</span>
                <span className="font-bold text-red-600 text-base ml-2">-{negativeMarkDecimal}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 flex justify-between items-center fixed bottom-0 w-full bg-white">
        <button
          disabled
          className="px-4 py-2 bg-gray-200 text-gray-400 rounded-md cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => nav('/online-exam', { state })}
          disabled={!isDeclared}
          className={`px-4 py-2 rounded-md font-semibold ${
            isDeclared
              ? 'bg-cyan-400 text-white hover:bg-cyan-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          I am ready to begin
        </button>
      </footer>
    </div>
  );
};

export default RRBInstructionPage2;
