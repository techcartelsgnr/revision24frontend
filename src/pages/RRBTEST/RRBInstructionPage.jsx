import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// A helper component for the legend icons, styled with Tailwind CSS
// const InstructionIcon = ({ bgColor, children }) => (
//     <div className={`w-7 h-5 rounded border border-gray-300 flex justify-center items-center ${bgColor}`}>
//         {children}
//     </div>
// );
// const InstructionIcon = ({ bgColor, hasCheckMark, children }) => (
//     <div className={`w-8 h-8 rounded-full flex justify-center items-center relative ${bgColor}`}>
//         {hasCheckMark && (
//             <div className="absolute bottom-0 right-0">
//                 <svg width="14" height="14" viewBox="0 0 14 14" className="bg-green-500 rounded-full p-0.5">
//                     <path d="M5 7l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//             </div>
//         )}
//         {children}
//     </div>
// );

const InstructionIcon = ({ type, hasCheckMark }) => {
    const shapes = {
        // 1. Square with border (not visited)
        square: (
            <div className="w-8 h-8 border-2 border-gray-400 bg-white"></div>
        ),
        // 2. Semi-circle (red - not answered)
        semicircleRed: (
            <div className="w-8 h-8 bg-[#C0392B] rounded-t-full rotate-180"></div>
        ),
        // 3. Semi-circle (green - answered)
        semicircleGreen: (
            <div className="w-8 h-8 bg-[#28AE60] rounded-t-full"></div>
        ),
        // 4. Oval/Ellipse (purple - marked for review)
        oval: (
            <div className="w-8 h-10 bg-[#9B59B6] rounded-full rotate-90"></div>
        ),
        // 5. Oval with checkmark (answered + marked for review)
        ovalWithCheck: (

            <div className="relative inline-block">
                <div className="w-8 h-10  bg-[#9B59B6] rounded-full rotate-90"></div>
                <div className="absolute top-0.5 -right-0.5">
                    <svg width="18" height="18" viewBox="0 0 14 14" className="text-green-500">
                        <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        ),
    };

    return shapes[type];
};

const RRBInstructionPage = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    console.log("STATE RRB INSTRUCTION SCREEN 1===>", state);

    // Extract test information from state
    const testInfo = state?.testInfo || {};
    const testDetail = state?.testDetail || [];

    // Calculate total questions and marks
    const totalQuestions = testDetail.reduce((total, subject) => total + parseInt(subject.no_of_question), 0);
    const totalMarks = testDetail.reduce((total, subject) => total + parseInt(subject.marks), 0);

    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <h1 className="text-xl font-bold text-blue-500">Revision24</h1>
                <p className="text-sm text-gray-600">{testInfo.title || 'Test Information'}</p>
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto p-5">
                {/* Test Overview Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-bold text-blue-800 mb-3">Test Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded border">
                            <div className="font-semibold text-gray-600">Duration</div>
                            <div className="text-lg font-bold text-blue-600">{testInfo.time || 0} minutes</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="font-semibold text-gray-600">Total Questions</div>
                            <div className="text-lg font-bold text-green-600">{totalQuestions || testInfo.no_of_question}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="font-semibold text-gray-600">Total Marks</div>
                            <div className="text-lg font-bold text-green-600">{totalMarks || testInfo.marks}</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <div className="font-semibold text-gray-600">Negative Marking</div>
                            <div className="text-lg font-bold text-red-600">{testInfo.negative_mark || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Subject-wise Breakdown */}
                {testDetail.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Subject-wise Breakdown:</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Subject</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Questions</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Marks</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Negative Marking</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testDetail.map((subject, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 font-medium">{subject.subject_name}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.no_of_question}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.marks}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-red-600">{subject.negative_mark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <h2 className="text-lg font-bold text-gray-800 mb-4">General Instructions:</h2>

                <p className="text-gray-700 leading-relaxed mb-3">1. The clock will be set at the server. The countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.</p>

                <p className="text-gray-700 leading-relaxed mb-4">2. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>

                {/* Legend for Question Status */}
                {/* <div className="space-y-3 mb-4 ml-2">
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-gray-200" />
                        <span className="ml-4 text-sm text-gray-700">You have not visited the question yet.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#E74C3C]" />
                        <span className="ml-4 text-sm text-gray-700">You have not answered the question.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#2ECC71]" />
                        <span className="ml-4 text-sm text-gray-700">You have answered the question.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#9B59B6]" />
                        <span className="ml-4 text-sm text-gray-700">You have NOT answered the question, but have marked the question for review.</span>
                    </div>
                    <div className="flex items-center">
                        <InstructionIcon bgColor="bg-[#9B59B6]">
                            <div className="w-2 h-2 rounded-full bg-[#2ECC71]"></div>
                        </InstructionIcon>
                        <span className="ml-4 text-sm text-gray-700">You have answered the question, but marked it for review.</span>
                    </div>
                </div> */}
                {/* <div className="space-y-3 mb-4 ml-2">
    <div className="flex items-center gap-3">
        <InstructionIcon bgColor="bg-white border border-gray-400" />
        <span className="text-sm text-gray-700">You have not visited the question yet.</span>
    </div>
    <div className="flex items-center gap-3">
        <InstructionIcon bgColor="bg-red-500" />
        <span className="text-sm text-gray-700">You have not answered the question.</span>
    </div>
    <div className="flex items-center gap-3">
        <InstructionIcon bgColor="bg-green-500" />
        <span className="text-sm text-gray-700">You have answered the question.</span>
    </div>
    <div className="flex items-center gap-3">
        <InstructionIcon bgColor="bg-purple-500" />
        <span className="text-sm text-gray-700">You have NOT answered the question, but have marked the question for review.</span>
    </div>
    <div className="flex items-center gap-3">
        <InstructionIcon bgColor="bg-purple-500" hasCheckMark={true} />
        <span className="text-sm text-gray-700">You have answered the question, but marked it for review.</span>
    </div>
</div> */}
                <div className="space-y-3 mb-4 ml-2">
                    <div className="flex items-center gap-3">
                        <InstructionIcon type="square" />
                        <span className="text-sm text-gray-700">You have not visited the question yet.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <InstructionIcon type="semicircleRed" />
                        <span className="text-sm text-gray-700">You have not answered the question.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <InstructionIcon type="semicircleGreen" />
                        <span className="text-sm text-gray-700">You have answered the question.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <InstructionIcon type="oval" />
                        <span className="text-sm text-gray-700">You have NOT answered the question, but have marked the question for review.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <InstructionIcon type="ovalWithCheck" />
                        <span className="text-sm text-gray-700">You have answered the question, but marked it for review.</span>
                    </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">The Mark For Review status for a question simply indicates that you would like to look at that question again. If a question is answered, but marked for review, then the answer will be considered for evaluation unless the status is modified by the candidate.</p>

                {/* Navigating to a Question */}
                <h3 className="text-base font-bold text-gray-800 mt-6 mb-2">Navigating to a Question:</h3>
                <p className="text-gray-700 leading-relaxed mb-3">3. To answer a question, do the following:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</p>
                    <p className="text-gray-700 leading-relaxed">2. Click on <span className="font-bold">Save & Next</span> to save your answer for the current question and then go to the next question.</p>
                    <p className="text-gray-700 leading-relaxed">3. Click on <span className="font-bold">Mark for Review & Next</span> to save your answer for the current question and also mark it for review, and then go to the next question.</p>
                </div>

                {/* Answering a Question */}
                <h3 className="text-base font-bold text-gray-800 mt-6 mb-2">Answering a Question:</h3>
                <p className="text-gray-700 leading-relaxed mb-3">4. Procedure for answering a multiple choice (MCQ) type question:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. Choose one answer from the 4 options (A,B,C,D) given below the question.</p>
                    <p className="text-gray-700 leading-relaxed">2. To deselect your chosen answer, click on the bubble of the chosen option again or click on the <span className="font-bold">Clear Response</span> button.</p>
                    <p className="text-gray-700 leading-relaxed">3. To change your chosen answer, click on the bubble of another option.</p>
                    <p className="text-gray-700 leading-relaxed">4. To save your answer, you MUST click on the <span className="font-bold">Save & Next</span>.</p>
                </div>

                <p className="text-gray-700 leading-relaxed mt-4 mb-3">5. Procedure for answering a numerical answer type question:</p>
                <div className="ml-5 space-y-3">
                    <p className="text-gray-700 leading-relaxed">1. To enter a number as your answer, use the virtual numerical keypad.</p>
                    <p className="text-gray-700 leading-relaxed">2. A fraction (e.g. 0.3 or .3) can be entered as an answer with or without '0' before the decimal point.</p>
                    <p className="text-gray-700 leading-relaxed">3. To clear your answer, click on the <span className="font-bold">Clear Response</span> button.</p>
                    <p className="text-gray-700 leading-relaxed">4. To save your answer, you MUST click on the <span className="font-bold">Save & Next</span>.</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 flex items-center justify-between border-t border-gray-200">
                <button className="flex items-center text-blue-500 font-semibold hover:text-blue-600">
                    <span className="mr-2 text-xl">←</span>
                    Go to Tests
                </button>
                <button onClick={() => nav('/online-exam-specific-instruction', {
                    state: state
                })
                }
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center">
                    Next
                    <span className="ml-2 text-xl">→</span>
                </button>
            </footer>
        </div>
    );
};

export default RRBInstructionPage;
