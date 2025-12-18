// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice 
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;

//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();

//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));

//         setQuestions(formattedQuestions);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmitTest();
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };

//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     // ✅ Add to skipped if not answered
//     if (!isOptionSelected && !skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = isOptionSelected ? 'answered' : 'notAnswered';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;

//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };

//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);

//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };

//   const handleSubmitClick = () => {
//     setShowSubmitModal(true);
//   };

//   const handleCancelSubmit = () => {
//     setShowSubmitModal(false);
//   };

//   // ✅ Fixed Submit Function - Simplified for API
//   // const handleSubmitTest = async () => {
//   //   setShowSubmitModal(false);
//   //   setIsSubmitting(true);

//   //   const currentId = questions[activeQuestionIndex]?.id;
//   //   await updateSpentTime(currentId);

//   //   if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//   //     const updatedSelected = [...optionSelected, currentId];
//   //     await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//   //   }

//   //   const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//   //   const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//   //   const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//   //   const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//   //   const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//   //   const totalAttendedQuestions = optionSelected2.length;
//   //   const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//   //   let correct = 0;
//   //   let in_correct = 0;

//   //   // ✅ Simplified attended questions array
//   //   const allAttendedQuestions = optionSelected2.map((questionId) => {
//   //     const question = questions.find(q => q.id === questionId);
//   //     const selectedAns = selectedOptions2[questionId];
//   //     const rightAns = question?.correctAnswer;

//   //     if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//   //       correct++;
//   //     } else {
//   //       in_correct++;
//   //     }

//   //     return {
//   //       question_id: questionId,
//   //       user_selected_ans: selectedAns,
//   //       right_ans: rightAns
//   //     };
//   //   });

//   //   const negativeMark = parseFloat(testInfo.negative_mark || 0);
//   //   const statMark = parseFloat(testDetail[0]?.marks || 0);
//   //   const markPer_ques = statMark / questions.length;
//   //   const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//   //   const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//   //   // ✅ Simplified submission data - matching SSC format
//   //   const submissionData = {
//   //     test_id: testId,
//   //     total_attend_question: totalAttendedQuestions,
//   //     total_not_answer_question: totalNotAnsweredQuestions,
//   //     correct: correct,
//   //     in_correct: in_correct,
//   //     marks: parseFloat(marksScored.toFixed(2)),
//   //     time: totalTimeSpent,
//   //     negative_mark: negativeMark,
//   //     all_attend_question: allAttendedQuestions,
//   //     spent_time: spentTime,
//   //     skip_question: skippedQuestions2,
//   //     attend_question: optionSelected2,
//   //     mark_for_review: markedForReview2
//   //   };

//   //   console.log('📊 Submission Data:', submissionData);

//   //   try {
//   //     // const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//   //     // console.log('✅ API Response:', res);

//   //     // if (res.status_code == 200) {
//   //     //   await clearAllTestData(testId);

//   //     //   navigate('/analysis', { 
//   //     //     replace: true, 
//   //     //     state: {
//   //     //       ...state,
//   //     //       testResults: submissionData,
//   //     //       allQuestions: questions,
//   //     //     }
//   //     //   });
//   //     // }
//   //        const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//   //       if (res.status_code == 200) {
//   //           await clearAllTestData(testId);
//   //           nav('/analysis', { replace: true, state });
//   //       }
//   //     else {
//   //       console.error('❌ API Error:', res);
//   //       setIsSubmitting(false);
//   //       alert(`Error: ${res.message || 'Failed to submit test'}`);
//   //     }
//   //   } catch (error) {
//   //     console.error("❌ Submit Error:", error);
//   //     setIsSubmitting(false);
//   //     alert('Failed to submit test. Please try again.');
//   //   }
//   // };

//   // ✅ Complete Submit Function with Section-wise Data
// const handleSubmitTest = async () => {
//   setShowSubmitModal(false);
//   setIsSubmitting(true);

//   const currentId = questions[activeQuestionIndex]?.id;
//   await updateSpentTime(currentId);

//   if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     const updatedSelected = [...optionSelected, currentId];
//     await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//   }

//   const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//   const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//   const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//   const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//   const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//   const totalAttendedQuestions = optionSelected2.length;
//   const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//   let correct = 0;
//   let in_correct = 0;

//   const allAttendedQuestions = optionSelected2.map((questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     const selectedAns = selectedOptions2[questionId];
//     const rightAns = question?.correctAnswer;

//     if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//       correct++;
//     } else {
//       in_correct++;
//     }

//     return {
//       question_id: questionId,
//       user_selected_ans: selectedAns,
//       right_ans: rightAns
//     };
//   });

//   const negativeMark = parseFloat(testInfo.negative_mark || 0);
//   const statMark = parseFloat(testDetail[0]?.marks || 0);
//   const markPer_ques = statMark / questions.length;
//   const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//   const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//   // ✅ Calculate Section-wise Statistics
//   const sectionWiseStats = testDetail.map(detail => {
//     const sectionQuestions = questions.filter(q => q.section === detail.subject_name);
//     const sectionAttended = optionSelected2.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       return question?.section === detail.subject_name;
//     });

//     const sectionCorrect = sectionAttended.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       const selectedAns = selectedOptions2[qId];
//       const rightAns = question?.correctAnswer;
//       return selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase();
//     }).length;

//     const sectionIncorrect = sectionAttended.length - sectionCorrect;

//     const sectionSkipped = skippedQuestions2.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       return question?.section === detail.subject_name;
//     }).length;

//     const sectionMarked = markedForReview2.filter(qId => {
//       const question = questions.find(q => q.id === qId);
//       return question?.section === detail.subject_name;
//     }).length;

//     const sectionMarkPer_ques = parseFloat(detail.marks) / detail.no_of_question;
//     const sectionMarks = (sectionCorrect * sectionMarkPer_ques) - (sectionIncorrect * parseFloat(detail.negative_mark));

//     const sectionAccuracy = sectionAttended.length > 0 
//       ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//       : 0;

//     const sectionTimeSpent = spentTime
//       .filter(item => {
//         const question = questions.find(q => q.id === item.questionId);
//         return question?.section === detail.subject_name;
//       })
//       .reduce((acc, item) => acc + (item.time || 0), 0);

//     const avgTimePerQuestion = sectionAttended.length > 0
//       ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//       : 0;

//     return {
//       subject_name: detail.subject_name,
//       chapter_name: detail.chapter_name,
//       total_questions: detail.no_of_question,
//       marks: detail.marks,
//       negative_mark: detail.negative_mark,
//       sectional_time: detail.sectional_time,
//       attempted: sectionAttended.length,
//       correct: sectionCorrect,
//       incorrect: sectionIncorrect,
//       skipped: sectionSkipped,
//       marked: sectionMarked,
//       not_attempted: detail.no_of_question - sectionAttended.length,
//       marks_scored: parseFloat(sectionMarks.toFixed(2)),
//       accuracy: parseFloat(sectionAccuracy),
//       time_spent: sectionTimeSpent,
//       avg_time_per_question: parseFloat(avgTimePerQuestion),
//     };
//   });

//   const submissionData = {
//     test_id: testId,
//     total_attend_question: totalAttendedQuestions,
//     total_not_answer_question: totalNotAnsweredQuestions,
//     correct: correct,
//     in_correct: in_correct,
//     marks: parseFloat(marksScored.toFixed(2)),
//     time: totalTimeSpent,
//     negative_mark: negativeMark,
//     all_attend_question: allAttendedQuestions,
//     spent_time: spentTime,
//     skip_question: skippedQuestions2,
//     attend_question: optionSelected2,
//     mark_for_review: markedForReview2
//   };

//   console.log('📊 Submission Data:', submissionData);
//   console.log('📈 Section-wise Stats:', sectionWiseStats);

//   try {
//     const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//     console.log('✅ API Response:', res);

//     if (res.status_code == 200) {
//       await clearAllTestData(testId);

//       // ✅ Send complete data to analysis screen
//       navigate('/analysis', { 
//         replace: true, 
//         state: {
//           ...state, // Includes userData, testInfo, testId, testDetail
//           testResults: submissionData,
//           sectionWiseStats: sectionWiseStats, // ✅ Section-wise breakdown
//           allQuestions: questions,
//         }
//       });
//     } else {
//       console.error('❌ API Error:', res);
//       setIsSubmitting(false);
//       alert(`Error: ${res.message || 'Failed to submit test'}`);
//     }
//   } catch (error) {
//     console.error("❌ Submit Error:", error);
//     setIsSubmitting(false);
//     alert('Failed to submit test. Please try again.');
//   }
// };


//   // ✅ Fixed Color Function - Red for not answered/skipped
//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId) || markedWithAns.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button 
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>

//               <div className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>

//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label 
//                     key={index} 
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${
//                       selectedOptions[currentQuestion.id] === option
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">
//                         <MathRenderer text={option} />
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex gap-2 mb-4">
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Switch to Full Screen
//             </button>
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Pause
//             </button>
//           </div>

//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img 
//               src={userInfo?.profile || "https://i.pravatar.cc/40"} 
//               alt="User" 
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${
//                     index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length + markedWithAns.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length - markedWithAns.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button 
//               onClick={handleSubmitClick}
//               disabled={isSubmitting}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Test'}
//             </button>
//           </div>
//         </aside>
//       </div>

//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button 
//             onClick={handleMarkForReview} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button 
//             onClick={handleClearResponse} 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button 
//           onClick={handleSaveAndNext} 
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>

//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-2">
//               You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit the test?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelSubmit}
//                 className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
//               >
//                 Yes, Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RRBTestPage;


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';


// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;

//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ NEW: Last Question Modal State
//   const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());


//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);


//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;


//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);


//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };


//     restoreTestData();
//   }, [testId]);


//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();

//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));

//         setQuestions(formattedQuestions);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);


//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmitTest();
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);


//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };


//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);


//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];


//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();


//     await secureSaveTestData(testId, 'spentTime', updated);
//   };


//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);


//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);


//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }


//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };


//   // ✅ UPDATED: Save And Next with Last Question Check
//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);


//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);


//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }


//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }


//     if (!isOptionSelected && !skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }


//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = isOptionSelected ? 'answered' : 'notAnswered';
//     setQuestions(newQuestions);


//     // ✅ CHECK IF LAST QUESTION AND SHOW POPUP
//     if (activeQuestionIndex === questions.length - 1) {
//       setShowLastQuestionModal(true);
//     } else {
//       setActiveQuestionIndex(prev => prev + 1);
//     }
//   };


//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);


//     const isOptionSelected = !!selectedOptions[currentId];


//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }


//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }


//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);


//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };


//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;

//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);


//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }


//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }


//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };


//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);

//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };


//   const handleSubmitClick = () => {
//     setShowSubmitModal(true);
//   };


//   const handleCancelSubmit = () => {
//     setShowSubmitModal(false);
//   };


//   // ✅ Complete Submit Function with Section-wise Data
//   const handleSubmitTest = async () => {
//     setShowSubmitModal(false);
//     setShowLastQuestionModal(false); // ✅ Close last question modal if open
//     setIsSubmitting(true);


//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);


//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }


//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;


//     let correct = 0;
//     let in_correct = 0;


//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;


//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }


//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns
//       };
//     });


//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);


//     // ✅ Calculate Section-wise Statistics
//     const sectionWiseStats = testDetail.map(detail => {
//       const sectionQuestions = questions.filter(q => q.section === detail.subject_name);
//       const sectionAttended = optionSelected2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       });


//       const sectionCorrect = sectionAttended.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         const selectedAns = selectedOptions2[qId];
//         const rightAns = question?.correctAnswer;
//         return selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase();
//       }).length;


//       const sectionIncorrect = sectionAttended.length - sectionCorrect;


//       const sectionSkipped = skippedQuestions2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;


//       const sectionMarked = markedForReview2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;


//       const sectionMarkPer_ques = parseFloat(detail.marks) / detail.no_of_question;
//       const sectionMarks = (sectionCorrect * sectionMarkPer_ques) - (sectionIncorrect * parseFloat(detail.negative_mark));


//       const sectionAccuracy = sectionAttended.length > 0
//         ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//         : 0;


//       const sectionTimeSpent = spentTime
//         .filter(item => {
//           const question = questions.find(q => q.id === item.questionId);
//           return question?.section === detail.subject_name;
//         })
//         .reduce((acc, item) => acc + (item.time || 0), 0);


//       const avgTimePerQuestion = sectionAttended.length > 0
//         ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//         : 0;


//       return {
//         subject_name: detail.subject_name,
//         chapter_name: detail.chapter_name,
//         total_questions: detail.no_of_question,
//         marks: detail.marks,
//         negative_mark: detail.negative_mark,
//         sectional_time: detail.sectional_time,
//         attempted: sectionAttended.length,
//         correct: sectionCorrect,
//         incorrect: sectionIncorrect,
//         skipped: sectionSkipped,
//         marked: sectionMarked,
//         not_attempted: detail.no_of_question - sectionAttended.length,
//         marks_scored: parseFloat(sectionMarks.toFixed(2)),
//         accuracy: parseFloat(sectionAccuracy),
//         time_spent: sectionTimeSpent,
//         avg_time_per_question: parseFloat(avgTimePerQuestion),
//       };
//     });


//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct: correct,
//       in_correct: in_correct,
//       marks: parseFloat(marksScored.toFixed(2)),
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2
//     };


//     console.log('📊 Submission Data:', submissionData);
//     console.log('📈 Section-wise Stats:', sectionWiseStats);


//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//       console.log('✅ API Response:', res);

//       if (res.status_code == 200) {
//         const attendId = res.data?.id || res.data?.attend_id;

//         await clearAllTestData(testId);

//         // ✅ Send complete data to analysis screen
//         navigate('/analysis', {
//           replace: true,
//           state: {
//             ...state,
//             attend_id: attendId,
//             testResults: submissionData,
//             sectionWiseStats: sectionWiseStats,
//             allQuestions: questions,
//             testInfo: {
//               ...testInfo,
//               attend_id: attendId
//             }
//           }
//         });
//       } else {
//         console.error('❌ API Error:', res);
//         setIsSubmitting(false);
//         alert(`Error: ${res.message || 'Failed to submit test'}`);
//       }
//     } catch (error) {
//       console.error("❌ Submit Error:", error);
//       setIsSubmitting(false);
//       alert('Failed to submit test. Please try again.');
//     }
//   };


//   // ✅ Fixed Color Function
//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId) || markedWithAns.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }


//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }


//   const currentQuestion = questions[activeQuestionIndex];


//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>


//       <div className="flex flex-1 overflow-hidden">
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>

//               <div className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>

//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label
//                     key={index}
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${selectedOptions[currentQuestion.id] === option
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">
//                         <MathRenderer text={option} />
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>


//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex gap-2 mb-4">
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Switch to Full Screen
//             </button>
//             <button className="flex-1 text-xs border px-2 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
//               Pause
//             </button>
//           </div>

//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img
//               src={userInfo?.profile || "https://i.pravatar.cc/40"}
//               alt="User"
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>


//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>


//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>


//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>


//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>


//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length + markedWithAns.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length - markedWithAns.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>


//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button
//               onClick={handleSubmitClick}
//               disabled={isSubmitting}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Test'}
//             </button>
//           </div>
//         </aside>
//       </div>


//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button
//             onClick={handleMarkForReview}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button
//             onClick={handleClearResponse}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button
//           onClick={handleSaveAndNext}
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>


//       {/* ✅ Last Question Popup Modal */}
//       {showLastQuestionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               Last Question Reached
//             </h3>
//             <p className="text-gray-600 mb-8 text-lg">
//               You've completed all questions. What would you like to do?
//             </p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   setActiveQuestionIndex(0);
//                 }}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-base"
//               >
//                 Go to First Question
//               </button>
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   handleSubmitTest();
//                 }}
//                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Test'}
//               </button>
//               <button
//                 onClick={() => setShowLastQuestionModal(false)}
//                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold text-base"
//               >
//                 Stay on Current Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* ✅ Submit Confirmation Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-2">
//               You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit the test?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelSubmit}
//                 className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 disabled={isSubmitting}
//                 className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default RRBTestPage;



// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';


// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;

//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState((testInfo.time || 90) * 60);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ NEW: Last Question Modal State
//   const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//   // ✅ NEW: Pause & Full Screen States
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showPauseModal, setShowPauseModal] = useState(false);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());


//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);


//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);


//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();

//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));

//         setQuestions(formattedQuestions);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);


//   useEffect(() => {
//     if (timeLeft <= 0 || loading) {
//       if (timeLeft <= 0) handleSubmitTest();
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, loading]);


//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };


//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);


//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };


//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };


//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     if (!isOptionSelected && !skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = isOptionSelected ? 'answered' : 'notAnswered';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex === questions.length - 1) {
//       setShowLastQuestionModal(true);
//     } else {
//       setActiveQuestionIndex(prev => prev + 1);
//     }
//   };


//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };


//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;

//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };


//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);

//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };


//   const handleSubmitClick = () => {
//     setShowSubmitModal(true);
//   };


//   const handleCancelSubmit = () => {
//     setShowSubmitModal(false);
//   };


//   // ✅ FULLSCREEN FUNCTIONS
//   const enterFullScreen = async () => {
//     try {
//       const elem = document.documentElement;
//       if (elem.requestFullscreen) {
//         await elem.requestFullscreen();
//         setIsFullScreen(true);
//       } else if (elem.webkitRequestFullscreen) {
//         await elem.webkitRequestFullscreen();
//         setIsFullScreen(true);
//       } else if (elem.msRequestFullscreen) {
//         await elem.msRequestFullscreen();
//         setIsFullScreen(true);
//       }
//       console.log('✅ Full screen entered');
//     } catch (error) {
//       console.error('❌ Full screen error:', error);
//     }
//   };

//   const exitFullScreen = async () => {
//     try {
//       if (document.fullscreenElement) {
//         await document.exitFullscreen();
//         setIsFullScreen(false);
//       } else if (document.webkitFullscreenElement) {
//         await document.webkitExitFullscreen();
//         setIsFullScreen(false);
//       } else if (document.msFullscreenElement) {
//         await document.msExitFullscreen();
//         setIsFullScreen(false);
//       }
//       console.log('✅ Full screen exited');
//     } catch (error) {
//       console.error('❌ Exit full screen error:', error);
//     }
//   };

//   const toggleFullScreen = () => {
//     if (isFullScreen) {
//       exitFullScreen();
//     } else {
//       enterFullScreen();
//     }
//   };

//   // ✅ PAUSE FUNCTIONS
//   const handlePauseClick = () => {
//     setShowPauseModal(true);
//   };

//   const handleConfirmPause = async () => {
//     setShowPauseModal(false);

//     try {
//       // Save current test state before pausing
//       const currentTestId = state?.testInfo?.test_id;

//       const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//       const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//       updatedStatus.push({
//         test_id: currentTestId,
//         isPaused: true,
//         pausedAt: new Date().toISOString()
//       });

//       await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//       // Exit fullscreen before navigating
//       if (isFullScreen) {
//         await exitFullScreen();
//       }

//       console.log('✅ Test paused and saved');
//       navigate('/testpakages', { replace: true, state: { testId: state?.testId } });
//     } catch (error) {
//       console.error("❌ Failed to pause test:", error);
//     }
//   };

//   const handleCancelPause = () => {
//     setShowPauseModal(false);
//   };


//   const handleSubmitTest = async () => {
//     setShowSubmitModal(false);
//     setShowLastQuestionModal(false);
//     setIsSubmitting(true);

//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//     let correct = 0;
//     let in_correct = 0;

//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;

//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }

//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns
//       };
//     });

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     const sectionWiseStats = testDetail.map((detail, index) => {
//       const sectionQuestions = questions.filter(q => q.section === detail.subject_name);
//       const sectionAttended = optionSelected2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       });

//       const sectionCorrect = sectionAttended.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         const selectedAns = selectedOptions2[qId];
//         const rightAns = question?.correctAnswer;
//         return selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase();
//       }).length;

//       const sectionIncorrect = sectionAttended.length - sectionCorrect;

//       const sectionSkipped = skippedQuestions2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;

//       const sectionMarked = markedForReview2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;

//       const sectionMarkPer_ques = parseFloat(detail.marks) / detail.no_of_question;
//       const sectionMarks = (sectionCorrect * sectionMarkPer_ques) - (sectionIncorrect * parseFloat(detail.negative_mark));

//       const sectionAccuracy = sectionAttended.length > 0
//         ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//         : 0;

//       const sectionTimeSpent = spentTime
//         .filter(item => {
//           const question = questions.find(q => q.id === item.questionId);
//           return question?.section === detail.subject_name;
//         })
//         .reduce((acc, item) => acc + (item.time || 0), 0);

//       const avgTimePerQuestion = sectionAttended.length > 0
//         ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//         : 0;

//       return {
//         subject_name: detail.subject_name,
//         chapter_name: detail.chapter_name,
//         total_questions: detail.no_of_question,
//         marks: detail.marks,
//         negative_mark: detail.negative_mark,
//         sectional_time: detail.sectional_time,
//         attempted: sectionAttended.length,
//         correct: sectionCorrect,
//         incorrect: sectionIncorrect,
//         skipped: sectionSkipped,
//         marked: sectionMarked,
//         not_attempted: detail.no_of_question - sectionAttended.length,
//         marks_scored: parseFloat(sectionMarks.toFixed(2)),
//         accuracy: parseFloat(sectionAccuracy),
//         time_spent: sectionTimeSpent,
//         avg_time_per_question: parseFloat(avgTimePerQuestion),
//       };
//     });

//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct: correct,
//       in_correct: in_correct,
//       marks: parseFloat(marksScored.toFixed(2)),
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2
//     };

//     console.log('📊 Submission Data:', submissionData);
//     console.log('📈 Section-wise Stats:', sectionWiseStats);

//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//       console.log('✅ API Response:', res);

//       if (res.status_code == 200) {
//         const attendId = res.data?.id || res.data?.attend_id;

//         await clearAllTestData(testId);

//         // Exit fullscreen before navigating
//         if (isFullScreen) {
//           await exitFullScreen();
//         }

//         navigate('/analysis', {
//           replace: true,
//           state: {
//             ...state,
//             attend_id: attendId,
//             testResults: submissionData,
//             sectionWiseStats: sectionWiseStats,
//             allQuestions: questions,
//             testInfo: {
//               ...testInfo,
//               attend_id: attendId
//             }
//           }
//         });
//       } else {
//         console.error('❌ API Error:', res);
//         setIsSubmitting(false);
//         alert(`Error: ${res.message || 'Failed to submit test'}`);
//       }
//     } catch (error) {
//       console.error("❌ Submit Error:", error);
//       setIsSubmitting(false);
//       alert('Failed to submit test. Please try again.');
//     }
//   };


//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId) || markedWithAns.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button
//             onClick={handlePauseClick}
//             className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
//           >
//             Pause
//           </button>
//           <button
//             onClick={toggleFullScreen}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
//           >
//             {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>

//               <div className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>

//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label
//                     key={index}
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${selectedOptions[currentQuestion.id] === option
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">
//                         <MathRenderer text={option} />
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img
//               src={userInfo?.profile || "https://i.pravatar.cc/40"}
//               alt="User"
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length + markedWithAns.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length - markedWithAns.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button
//               onClick={handleSubmitClick}
//               disabled={isSubmitting}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Test'}
//             </button>
//           </div>
//         </aside>
//       </div>

//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button
//             onClick={handleMarkForReview}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button
//             onClick={handleClearResponse}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button
//           onClick={handleSaveAndNext}
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>

//       {/* ✅ Last Question Modal */}
//       {showLastQuestionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               Last Question Reached
//             </h3>
//             <p className="text-gray-600 mb-8 text-lg">
//               You've completed all questions. What would you like to do?
//             </p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   setActiveQuestionIndex(0);
//                 }}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-base"
//               >
//                 Go to First Question
//               </button>
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   handleSubmitTest();
//                 }}
//                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Test'}
//               </button>
//               <button
//                 onClick={() => setShowLastQuestionModal(false)}
//                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold text-base"
//               >
//                 Stay on Current Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Pause Modal */}
//       {showPauseModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Pause Test?</h3>
//             <p className="text-gray-600 mb-8">
//               Your test progress will be saved. You can resume it later.
//             </p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={handleConfirmPause}
//                 className="w-full bg-yellow-600 text-white py-3 px-4 rounded-xl hover:bg-yellow-700 transition-colors font-semibold"
//               >
//                 Yes, Pause Test
//               </button>
//               <button
//                 onClick={handleCancelPause}
//                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//               >
//                 Continue Test
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Submit Confirmation Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-2">
//               You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit the test?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelSubmit}
//                 className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 disabled={isSubmitting}
//                 className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RRBTestPage;


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';


// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;

//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

//   // ✅ FIXED: Initialize time properly with async retrieval
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [timeInitialized, setTimeInitialized] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showPauseModal, setShowPauseModal] = useState(false);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   // ✅ FIXED: Initialize time from storage on component mount
//   useEffect(() => {
//     const initializeTime = async () => {
//       if (!testId) {
//         setTimeLeft((testInfo.time || 90) * 60);
//         setTimeInitialized(true);
//         return;
//       }

//       try {
//         // ✅ Try to get remaining time from storage (from paused test)
//         const savedRemainingTime = await secureGetTestData(testId, "remainingTime");

//         console.log('🔍 Saved remaining time:', savedRemainingTime);
//         console.log('🔍 State pausedTimeLeft:', state?.pausedTimeLeft);

//         if (savedRemainingTime && savedRemainingTime > 0) {
//           console.log('✅ Resuming with saved time:', savedRemainingTime);
//           setTimeLeft(savedRemainingTime);
//         } else if (state?.pausedTimeLeft && state.pausedTimeLeft > 0) {
//           console.log('✅ Resuming with state pausedTimeLeft:', state.pausedTimeLeft);
//           setTimeLeft(state.pausedTimeLeft);
//         } else {
//           // First time taking test
//           const initialTime = (testInfo.time || 90) * 60;
//           console.log('🆕 First time - setting initial time:', initialTime);
//           setTimeLeft(initialTime);
//         }
//       } catch (error) {
//         console.error('❌ Error initializing time:', error);
//         setTimeLeft((testInfo.time || 90) * 60);
//       } finally {
//         setTimeInitialized(true);
//       }
//     };

//     initializeTime();
//   }, [testId, testInfo.time, state?.pausedTimeLeft]);


//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);


//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [
//         storedOptions,
//         storedAttempted,
//         storedMarked,
//         storedSkipped,
//         storedMarkedWithAns,
//       ] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);


//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(
//         getSingleCategoryPackageTestseriesQuestionSlice(testId)
//       ).unwrap();

//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           explanation: question.explanation,
//           status: 'notVisited',
//           userAnswer: null,
//         }));

//         setQuestions(formattedQuestions);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (testId) {
//       getTestSeriesQuestion();
//     }
//   }, [testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);


//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);


//   // ✅ FIXED: Timer with time preservation - Wait for timeInitialized
//   useEffect(() => {
//     if (!timeInitialized || timeLeft === null || timeLeft <= 0 || loading) {
//       if (timeLeft <= 0 && timeInitialized && !loading) {
//         handleSubmitTest();
//       }
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => {
//         const newTime = prev - 1;

//         // Save remaining time to storage every 5 seconds
//         if (newTime % 5 === 0 && testId) {
//           secureSaveTestData(testId, "remainingTime", newTime);
//           console.log('💾 Saved remaining time:', newTime);
//         }

//         return newTime;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, loading, timeInitialized, testId]);

//   // ✅ Save remaining time when component unmounts
//   useEffect(() => {
//     return () => {
//       if (testId && timeLeft && timeLeft > 0) {
//         secureSaveTestData(testId, "remainingTime", timeLeft);
//         console.log('💾 Saved remaining time on unmount:', timeLeft);
//       }
//     };
//   }, [testId, timeLeft]);


//   const formatTime = (seconds) => {
//     if (seconds === null) return "00:00:00";
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };


//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);


//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };


//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);
//     await secureSaveTestData(testId, 'selectedOptions', updated);

//     const newQuestions = [...questions];
//     if (newQuestions[activeQuestionIndex].status === 'notVisited') {
//       newQuestions[activeQuestionIndex].status = 'notAnswered';
//     }
//     newQuestions[activeQuestionIndex].userAnswer = option;
//     setQuestions(newQuestions);

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         const updatedMarkedWithAns = [...markedWithAns, currentId];
//         setMarkedWithAns(updatedMarkedWithAns);
//         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }
//   };


//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];
//     const isAlreadySelected = optionSelected.includes(currentId);

//     if (isOptionSelected && !isAlreadySelected) {
//       const updatedSelected = [...optionSelected, currentId];
//       setOptionSelected(updatedSelected);
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//       const updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     if (!isOptionSelected && !skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = isOptionSelected ? 'answered' : 'notAnswered';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex === questions.length - 1) {
//       setShowLastQuestionModal(true);
//     } else {
//       setActiveQuestionIndex(prev => prev + 1);
//     }
//   };


//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected && !markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = [...markedWithAns, currentId];
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!isOptionSelected && !markedForReview.includes(currentId)) {
//       const updatedMarked = [...markedForReview, currentId];
//       setMarkedForReview(updatedMarked);
//       await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].status = 'marked';
//     setQuestions(newQuestions);

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };


//   const handleClearResponse = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;

//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);
//     await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//     if (markedWithAns.includes(currentId)) {
//       const updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//       setMarkedWithAns(updatedMarkedWithAns);
//       await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     }

//     if (!skippedQuestions.includes(currentId)) {
//       const updatedSkipped = [...skippedQuestions, currentId];
//       setSkippedQuestions(updatedSkipped);
//       await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     }

//     const newQuestions = [...questions];
//     newQuestions[activeQuestionIndex].userAnswer = null;
//     newQuestions[activeQuestionIndex].status = 'notAnswered';
//     setQuestions(newQuestions);
//   };


//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);

//     const newQuestions = [...questions];
//     if (newQuestions[questionIndex].status === 'notVisited') {
//       newQuestions[questionIndex].status = 'notAnswered';
//     }
//     setQuestions(newQuestions);
//   };


//   const handleSubmitClick = () => {
//     setShowSubmitModal(true);
//   };


//   const handleCancelSubmit = () => {
//     setShowSubmitModal(false);
//   };


//   const enterFullScreen = async () => {
//     try {
//       const elem = document.documentElement;
//       if (elem.requestFullscreen) {
//         await elem.requestFullscreen();
//         setIsFullScreen(true);
//       } else if (elem.webkitRequestFullscreen) {
//         await elem.webkitRequestFullscreen();
//         setIsFullScreen(true);
//       } else if (elem.msRequestFullscreen) {
//         await elem.msRequestFullscreen();
//         setIsFullScreen(true);
//       }
//       console.log('✅ Full screen entered');
//     } catch (error) {
//       console.error('❌ Full screen error:', error);
//     }
//   };

//   const exitFullScreen = async () => {
//     try {
//       if (document.fullscreenElement) {
//         await document.exitFullscreen();
//         setIsFullScreen(false);
//       } else if (document.webkitFullscreenElement) {
//         await document.webkitExitFullscreen();
//         setIsFullScreen(false);
//       } else if (document.msFullscreenElement) {
//         await document.msExitFullscreen();
//         setIsFullScreen(false);
//       }
//       console.log('✅ Full screen exited');
//     } catch (error) {
//       console.error('❌ Exit full screen error:', error);
//     }
//   };

//   const toggleFullScreen = () => {
//     if (isFullScreen) {
//       exitFullScreen();
//     } else {
//       enterFullScreen();
//     }
//   };

//   const handlePauseClick = () => {
//     setShowPauseModal(true);
//   };

//   const handleConfirmPause = async () => {
//     setShowPauseModal(false);

//     try {
//       const currentTestId = state?.testInfo?.test_id;

//       // ✅ Save remaining time before pausing
//       if (timeLeft > 0) {
//         await secureSaveTestData(currentTestId, "remainingTime", timeLeft);
//         console.log('✅ Remaining time saved on pause:', timeLeft);
//       }

//       const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//       const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//       updatedStatus.push({
//         test_id: currentTestId,
//         isPaused: true,
//         pausedAt: new Date().toISOString(),
//         remainingTime: timeLeft
//       });

//       await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//       if (isFullScreen) {
//         await exitFullScreen();
//       }

//       console.log('✅ Test paused with remaining time:', timeLeft);
//       navigate('/testpakages', {
//         replace: true,
//         state: {
//           testId: state?.testId,
//           remainingTime: timeLeft
//         }
//       });
//     } catch (error) {
//       console.error("❌ Failed to pause test:", error);
//     }
//   };

//   const handleCancelPause = () => {
//     setShowPauseModal(false);
//   };


//   const handleSubmitTest = async () => {
//     setShowSubmitModal(false);
//     setShowLastQuestionModal(false);
//     setIsSubmitting(true);

//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//       const updatedSelected = [...optionSelected, currentId];
//       await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     }

//     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//     const totalAttendedQuestions = optionSelected2.length;
//     const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

//     let correct = 0;
//     let in_correct = 0;

//     const allAttendedQuestions = optionSelected2.map((questionId) => {
//       const question = questions.find(q => q.id === questionId);
//       const selectedAns = selectedOptions2[questionId];
//       const rightAns = question?.correctAnswer;

//       if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//         correct++;
//       } else {
//         in_correct++;
//       }

//       return {
//         question_id: questionId,
//         user_selected_ans: selectedAns,
//         right_ans: rightAns
//       };
//     });

//     const negativeMark = parseFloat(testInfo.negative_mark || 0);
//     const statMark = parseFloat(testDetail[0]?.marks || 0);
//     const markPer_ques = statMark / questions.length;
//     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     const sectionWiseStats = testDetail.map((detail, index) => {
//       const sectionQuestions = questions.filter(q => q.section === detail.subject_name);
//       const sectionAttended = optionSelected2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       });

//       const sectionCorrect = sectionAttended.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         const selectedAns = selectedOptions2[qId];
//         const rightAns = question?.correctAnswer;
//         return selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase();
//       }).length;

//       const sectionIncorrect = sectionAttended.length - sectionCorrect;

//       const sectionSkipped = skippedQuestions2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;

//       const sectionMarked = markedForReview2.filter(qId => {
//         const question = questions.find(q => q.id === qId);
//         return question?.section === detail.subject_name;
//       }).length;

//       const sectionMarkPer_ques = parseFloat(detail.marks) / detail.no_of_question;
//       const sectionMarks = (sectionCorrect * sectionMarkPer_ques) - (sectionIncorrect * parseFloat(detail.negative_mark));

//       const sectionAccuracy = sectionAttended.length > 0
//         ? ((sectionCorrect / sectionAttended.length) * 100).toFixed(2)
//         : 0;

//       const sectionTimeSpent = spentTime
//         .filter(item => {
//           const question = questions.find(q => q.id === item.questionId);
//           return question?.section === detail.subject_name;
//         })
//         .reduce((acc, item) => acc + (item.time || 0), 0);

//       const avgTimePerQuestion = sectionAttended.length > 0
//         ? (sectionTimeSpent / sectionAttended.length).toFixed(2)
//         : 0;

//       return {
//         subject_name: detail.subject_name,
//         chapter_name: detail.chapter_name,
//         total_questions: detail.no_of_question,
//         marks: detail.marks,
//         negative_mark: detail.negative_mark,
//         sectional_time: detail.sectional_time,
//         attempted: sectionAttended.length,
//         correct: sectionCorrect,
//         incorrect: sectionIncorrect,
//         skipped: sectionSkipped,
//         marked: sectionMarked,
//         not_attempted: detail.no_of_question - sectionAttended.length,
//         marks_scored: parseFloat(sectionMarks.toFixed(2)),
//         accuracy: parseFloat(sectionAccuracy),
//         time_spent: sectionTimeSpent,
//         avg_time_per_question: parseFloat(avgTimePerQuestion),
//       };
//     });

//     const submissionData = {
//       test_id: testId,
//       total_attend_question: totalAttendedQuestions,
//       total_not_answer_question: totalNotAnsweredQuestions,
//       correct: correct,
//       in_correct: in_correct,
//       marks: parseFloat(marksScored.toFixed(2)),
//       time: totalTimeSpent,
//       negative_mark: negativeMark,
//       all_attend_question: allAttendedQuestions,
//       spent_time: spentTime,
//       skip_question: skippedQuestions2,
//       attend_question: optionSelected2,
//       mark_for_review: markedForReview2
//     };

//     console.log('📊 Submission Data:', submissionData);
//     console.log('📈 Section-wise Stats:', sectionWiseStats);

//     try {
//       const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//       console.log('✅ API Response:', res);

//       if (res.status_code == 200) {
//         const attendId = res.data?.id || res.data?.attend_id;

//         await clearAllTestData(testId);

//         if (isFullScreen) {
//           await exitFullScreen();
//         }

//         navigate('/analysis', {
//           replace: true,
//           state: {
//             ...state,
//             attend_id: attendId,
//             testResults: submissionData,
//             sectionWiseStats: sectionWiseStats,
//             allQuestions: questions,
//             testInfo: {
//               ...testInfo,
//               attend_id: attendId
//             }
//           }
//         });
//       } else {
//         console.error('❌ API Error:', res);
//         setIsSubmitting(false);
//         alert(`Error: ${res.message || 'Failed to submit test'}`);
//       }
//     } catch (error) {
//       console.error("❌ Submit Error:", error);
//       setIsSubmitting(false);
//       alert('Failed to submit test. Please try again.');
//     }
//   };


//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white';
//     if (markedForReview.includes(questionId) || markedWithAns.includes(questionId)) return 'bg-purple-500 text-white';
//     if (skippedQuestions.includes(questionId)) return 'bg-red-500 text-white';
//     return 'bg-white text-gray-700 border-gray-300';
//   };


//   if (loading || !timeInitialized) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-lg font-semibold text-gray-700">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-700 mb-2">No questions available</div>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 font-sans">
//       <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
//         <div className="flex items-center">
//           <span className="text-xl font-bold text-blue-500 ml-2">Revision24</span>
//         </div>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-600">
//             Time Left: <span className="font-bold text-red-600 text-lg">{formatTime(timeLeft)}</span>
//           </span>
//           <button
//             onClick={handlePauseClick}
//             className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
//           >
//             Pause
//           </button>
//           <button
//             onClick={toggleFullScreen}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
//           >
//             {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         <main className="flex-1 p-8 overflow-y-auto bg-white">
//           {currentQuestion && (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <p className="text-lg font-bold text-gray-800">
//                   Question No. {currentQuestion.questionNumber}
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
//                   Section: {currentQuestion.section}
//                 </p>
//               </div>

//               <div className="text-gray-800 text-lg mb-8 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>

//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label
//                     key={index}
//                     className={`flex items-start cursor-pointer p-4 border-2 rounded-xl transition-all ${selectedOptions[currentQuestion.id] === option
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 mr-3 w-4 h-4"
//                     />
//                     <div className="flex-1">
//                       <span className="font-bold text-gray-700 mr-2">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-gray-800">
//                         <MathRenderer text={option} />
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </>
//           )}
//         </main>

//         <aside className="w-80 bg-blue-50 border-l p-4 flex flex-col overflow-y-auto">
//           <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
//             <img
//               src={userInfo?.profile || "https://i.pravatar.cc/40"}
//               alt="User"
//               className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
//             />
//             <span className="font-semibold text-gray-800">{userInfo?.name || 'Student'}</span>
//           </div>

//           <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
//             <h4 className="font-bold text-gray-800 mb-3">Test: {testInfo.title}</h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <div>Duration: <span className="font-semibold text-gray-800">{testInfo.time} minutes</span></div>
//               <div>Negative Marking: <span className="font-semibold text-gray-800">{testInfo.negative_mark}</span></div>
//               <div>Total Questions: <span className="font-semibold text-gray-800">{questions.length}</span></div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-xs mb-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-500 rounded"></div>
//               <span>Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-purple-500 rounded"></div>
//               <span>Marked</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-500 rounded"></div>
//               <span>Not Answered</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-white border-2 rounded"></div>
//               <span>Not Visited</span>
//             </div>
//           </div>

//           <div className="flex-1 border-t border-gray-300 pt-4">
//             <div className="mb-4">
//               <p className="font-bold text-sm mb-2">ALL QUESTIONS</p>
//               <p className="text-xs text-gray-600">{questions.length} Questions</p>
//             </div>

//             <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`w-11 h-11 flex items-center justify-center border-2 rounded-lg text-sm font-semibold transition-all ${getStatusColor(q.id)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white p-4 rounded-lg text-xs shadow-sm">
//               <h5 className="font-bold text-sm mb-3">Summary</h5>
//               <div className="space-y-2 text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Total Questions:</span>
//                   <span className="font-semibold text-gray-800">{questions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Answered:</span>
//                   <span className="font-semibold text-green-600">{optionSelected.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Answered:</span>
//                   <span className="font-semibold text-red-600">{skippedQuestions.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Marked for Review:</span>
//                   <span className="font-semibold text-purple-600">{markedForReview.length + markedWithAns.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Not Visited:</span>
//                   <span className="font-semibold text-gray-600">
//                     {questions.length - optionSelected.length - skippedQuestions.length - markedForReview.length - markedWithAns.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Question Paper
//             </button>
//             <button className="bg-white hover:bg-gray-50 py-2 rounded-lg border font-medium transition-colors">
//               Instructions
//             </button>
//             <button
//               onClick={handleSubmitClick}
//               disabled={isSubmitting}
//               className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold mt-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Test'}
//             </button>
//           </div>
//         </aside>
//       </div>

//       <footer className="flex items-center justify-between p-4 bg-white border-t shadow-lg">
//         <div className="flex gap-3">
//           <button
//             onClick={handleMarkForReview}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button
//             onClick={handleClearResponse}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors"
//           >
//             Clear Response
//           </button>
//         </div>
//         <button
//           onClick={handleSaveAndNext}
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-md"
//         >
//           Save & Next
//         </button>
//       </footer>

//       {/* ✅ Last Question Modal */}
//       {showLastQuestionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               Last Question Reached
//             </h3>
//             <p className="text-gray-600 mb-8 text-lg">
//               You've completed all questions. What would you like to do?
//             </p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   setActiveQuestionIndex(0);
//                 }}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-base"
//               >
//                 Go to First Question
//               </button>
//               <button
//                 onClick={() => {
//                   setShowLastQuestionModal(false);
//                   handleSubmitTest();
//                 }}
//                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Test'}
//               </button>
//               <button
//                 onClick={() => setShowLastQuestionModal(false)}
//                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold text-base"
//               >
//                 Stay on Current Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Pause Modal */}
//       {showPauseModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Pause Test?</h3>
//             <p className="text-gray-600 mb-2">
//               Your test progress will be saved.
//             </p>
//             <p className="text-gray-600 mb-8">
//               <span className="font-bold text-red-600">Remaining Time: {formatTime(timeLeft)}</span>
//             </p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={handleConfirmPause}
//                 className="w-full bg-yellow-600 text-white py-3 px-4 rounded-xl hover:bg-yellow-700 transition-colors font-semibold"
//               >
//                 Yes, Pause Test
//               </button>
//               <button
//                 onClick={handleCancelPause}
//                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//               >
//                 Continue Test
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Submit Confirmation Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-2">
//               You have answered <span className="font-bold text-green-600">{optionSelected.length}</span> out of <span className="font-bold">{questions.length}</span> questions.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit the test?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelSubmit}
//                 className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 disabled={isSubmitting}
//                 className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RRBTestPage;


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   getSingleCategoryPackageTestseriesQuestionSlice,
//   attendQuestionSubmitSlice
// } from '../../redux/HomeSlice';
// import {
//   secureSaveTestData,
//   secureGetTestData,
//   clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import MathRenderer from '../../utils/MathRenderer';

// const RRBTestPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const testInfo = state?.testInfo || {};
//   const testDetail = state?.testDetail || [];
//   const testId = state?.testInfo?.test_id;

//   const [questions, setQuestions] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [timeInitialized, setTimeInitialized] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showPauseModal, setShowPauseModal] = useState(false);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [optionSelected, setOptionSelected] = useState([]);
//   const [markedForReview, setMarkedForReview] = useState([]);
//   const [skippedQuestions, setSkippedQuestions] = useState([]);
//   const [markedWithAns, setMarkedWithAns] = useState([]);
//   const [questionStartTime, setQuestionStartTime] = useState(Date.now());

//   // Initialize time
//   useEffect(() => {
//     const initializeTime = async () => {
//       if (!testId) {
//         setTimeLeft((testInfo.time || 90) * 60);
//         setTimeInitialized(true);
//         return;
//       }

//       try {
//         const savedRemainingTime = await secureGetTestData(testId, "remainingTime");

//         if (savedRemainingTime && savedRemainingTime > 0) {
//           setTimeLeft(savedRemainingTime);
//         } else if (state?.pausedTimeLeft && state.pausedTimeLeft > 0) {
//           setTimeLeft(state.pausedTimeLeft);
//         } else {
//           const initialTime = (testInfo.time || 90) * 60;
//           setTimeLeft(initialTime);
//         }
//       } catch (error) {
//         console.error('Error initializing time:', error);
//         setTimeLeft((testInfo.time || 90) * 60);
//       } finally {
//         setTimeInitialized(true);
//       }
//     };

//     initializeTime();
//   }, [testId, testInfo.time, state?.pausedTimeLeft]);

//   useEffect(() => {
//     const loadUserData = async () => {
//       const user = await getUserDataDecrypted();
//       setUserInfo(user);
//     };
//     loadUserData();
//   }, []);

//   useEffect(() => {
//     const restoreTestData = async () => {
//       if (!testId) return;

//       const [storedOptions, storedAttempted, storedMarked, storedSkipped, storedMarkedWithAns] = await Promise.all([
//         secureGetTestData(testId, "selectedOptions"),
//         secureGetTestData(testId, "optionSelected"),
//         secureGetTestData(testId, "markedForReview"),
//         secureGetTestData(testId, "skippedQuestions"),
//         secureGetTestData(testId, "marked_with_ans"),
//       ]);

//       if (storedOptions) setSelectedOptions(storedOptions);
//       if (storedAttempted) setOptionSelected(storedAttempted);
//       if (storedMarked) setMarkedForReview(storedMarked);
//       if (storedSkipped) setSkippedQuestions(storedSkipped);
//       if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//     };

//     restoreTestData();
//   }, [testId]);

//   const getTestSeriesQuestion = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(testId)).unwrap();

//       if (res.status_code === 200 && res.data && res.data.length > 0) {
//         const formattedQuestions = res.data.map((question, index) => ({
//           id: question.id,
//           questionNumber: index + 1,
//           section: question.subject_name || 'General',
//           text: question.question_hindi,
//           options: [
//             question.option_hindi_a,
//             question.option_hindi_b,
//             question.option_hindi_c,
//             question.option_hindi_d
//           ],
//           correctAnswer: question.hindi_ans,
//           status: 'notVisited',
//           userAnswer: null,
//         }));

//         setQuestions(formattedQuestions);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (testId) getTestSeriesQuestion();
//   }, [testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "selectedOptions", selectedOptions);
//   }, [selectedOptions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "optionSelected", optionSelected);
//   }, [optionSelected, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "markedForReview", markedForReview);
//   }, [markedForReview, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//   }, [skippedQuestions, testId]);

//   useEffect(() => {
//     if (!testId) return;
//     secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//   }, [markedWithAns, testId]);

//   // Timer
//   useEffect(() => {
//     if (!timeInitialized || timeLeft === null || timeLeft <= 0 || loading) {
//       if (timeLeft <= 0 && timeInitialized && !loading) {
//         handleSubmitTest();
//       }
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => {
//         const newTime = prev - 1;
//         if (newTime % 5 === 0 && testId) {
//           secureSaveTestData(testId, "remainingTime", newTime);
//         }
//         return newTime;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, loading, timeInitialized, testId]);

//   const formatTime = (seconds) => {
//     if (seconds === null) return "00 : 00 : 00";
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h} : ${m} : ${s}`;
//   };

//   useEffect(() => {
//     setQuestionStartTime(Date.now());
//   }, [activeQuestionIndex]);

//   const updateSpentTime = async (questionId) => {
//     const now = Date.now();
//     const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//     let existing = await secureGetTestData(testId, 'spentTime');
//     existing = existing || [];

//     const updated = (() => {
//       const found = existing.find(item => item.questionId === questionId);
//       if (found) {
//         return existing.map(item =>
//           item.questionId === questionId
//             ? { ...item, time: item.time + timeSpentOnQuestion }
//             : item
//         );
//       } else {
//         return [...existing, { questionId, time: timeSpentOnQuestion }];
//       }
//     })();

//     await secureSaveTestData(testId, 'spentTime', updated);
//   };

//   const handleOptionSelect = async (option) => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updated = { ...selectedOptions, [currentId]: option };
//     setSelectedOptions(updated);

//     if (!optionSelected.includes(currentId)) {
//       setOptionSelected([...optionSelected, currentId]);
//     }

//     if (markedForReview.includes(currentId)) {
//       if (!markedWithAns.includes(currentId)) {
//         setMarkedWithAns([...markedWithAns, currentId]);
//         setMarkedForReview(markedForReview.filter(id => id !== currentId));
//       }
//     }

//     if (skippedQuestions.includes(currentId)) {
//       setSkippedQuestions(skippedQuestions.filter(id => id !== currentId));
//     }
//   };

//   const handleSaveAndNext = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     await updateSpentTime(currentId);

//     if (activeQuestionIndex === questions.length - 1) {
//       setShowLastQuestionModal(true);
//     } else {
//       setActiveQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handleMarkForReview = async () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const isOptionSelected = !!selectedOptions[currentId];

//     if (isOptionSelected) {
//       if (!markedWithAns.includes(currentId)) {
//         setMarkedWithAns([...markedWithAns, currentId]);
//       }
//     } else {
//       if (!markedForReview.includes(currentId)) {
//         setMarkedForReview([...markedForReview, currentId]);
//       }
//     }

//     if (activeQuestionIndex < questions.length - 1) {
//       setActiveQuestionIndex(prev => prev + 1);
//     } else {
//       setActiveQuestionIndex(0);
//     }
//   };

//   const handleClearResponse = () => {
//     const currentId = questions[activeQuestionIndex]?.id;
//     const updatedSelectedOptions = { ...selectedOptions };
//     delete updatedSelectedOptions[currentId];
//     setSelectedOptions(updatedSelectedOptions);

//     setMarkedWithAns(markedWithAns.filter(id => id !== currentId));
//     setOptionSelected(optionSelected.filter(id => id !== currentId));
//   };

//   const handlePaletteClick = (questionIndex) => {
//     setActiveQuestionIndex(questionIndex);
//   };

//   const enterFullScreen = async () => {
//     const elem = document.documentElement;
//     if (elem.requestFullscreen) {
//       await elem.requestFullscreen();
//       setIsFullScreen(true);
//     }
//   };

//   const exitFullScreen = async () => {
//     if (document.fullscreenElement) {
//       await document.exitFullscreen();
//       setIsFullScreen(false);
//     }
//   };

//   const handlePauseClick = () => setShowPauseModal(true);

//   const handleConfirmPause = async () => {
//     setShowPauseModal(false);
//     if (timeLeft > 0) {
//       await secureSaveTestData(testId, "remainingTime", timeLeft);
//     }
//     if (isFullScreen) await exitFullScreen();
//     navigate('/testpakages', { replace: true });
//   };

//   const handleSubmitTest = async () => {
//     setShowSubmitModal(false);
//     setIsSubmitting(true);

//     try {
//       await clearAllTestData(testId);
//       if (isFullScreen) await exitFullScreen();
//       navigate('/analysis', { replace: true, state });
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       setIsSubmitting(false);
//     }
//   };

//   const getStatusColor = (questionId) => {
//     if (optionSelected.includes(questionId)) return 'bg-green-500 text-white border-green-500';
//     if (markedWithAns.includes(questionId)) return 'bg-yellow-500 text-white border-yellow-500';
//     if (markedForReview.includes(questionId)) return 'bg-red-500 text-white border-red-500';
//     return 'bg-white text-gray-800 border-gray-300';
//   };

//   if (loading || !timeInitialized) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-lg font-semibold">Loading...</div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[activeQuestionIndex];

//   return (
//     <div className="flex flex-col h-screen bg-white">
//       {/* ✅ TOP HEADER - RRB Style */}
//       <header className="flex border border-b-[#999] items-center justify-between px-6 py-3  text-white shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
//             <span className="text-teal-600 font-bold text-xl">
//               <img src="/logo.jpeg" alt="Logo" className="w-8 h-8" />
//             </span>
//           </div>
//           <span className="text-xl text-black font-bold">Revision24</span>
//           <span className="text-base font-semibold text-black ml-4">{testInfo.title || 'RRB Group D Full Test 1'}</span>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-[#999999a0] text-gray-900 px-4 py-2 rounded-md">
//             <span className="font-semibold text-sm">Time Left</span>
//             <span className="font-mono font-bold text-base">{formatTime(timeLeft)}</span>
//           </div>
//           <button
//             onClick={() => isFullScreen ? exitFullScreen() : enterFullScreen()}
//             className="border border-[#21BAD4]  bg-opacity-20 hover:bg-opacity-30 px-4 py-2  text-[#21BAD4] rounded-md text-sm font-semibold transition-colors"
//           >
//             {isFullScreen ? 'Exit Full Screen' : 'Switch Full Screen'}
//           </button>
//           <button
//             onClick={handlePauseClick}
//             className="border border-[#21BAD4] hover:bg-gray-100   text-[#21BAD4] px-5 py-2 rounded-md text-sm font-bold transition-colors"
//           >
//             Pause
//           </button>
//           {/* <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-md">
//             <img
//               src={userInfo?.profile || "https://i.pravatar.cc/32"}
//               alt="User"
//               className="w-8 h-8 rounded-full"
//             />
//             <span className="text-sm font-semibold text-amber-300">{userInfo?.name || 'prachi'}</span>
//           </div> */}
//         </div>
//       </header>

//       {/* ✅ SECTION TABS */}
//       <div className="bg-white border-b border-gray-300 px-6 py-2">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-semibold text-gray-600">SECTIONS</span>
//           <button className="px-4 py-1.5 bg-[#21BAD4] text-white rounded text-sm font-semibold">
//             CBT
//           </button>
//         </div>
//       </div>

//       {/* ✅ MAIN CONTENT */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* LEFT - QUESTION AREA */}
//         <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
//           {currentQuestion && (
//             <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
//               {/* Question Header */}
//               <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
//                 <div>
//                   <p className="text-base font-bold text-gray-900">Question No. {currentQuestion.questionNumber}</p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-3 text-sm">
//                     <div className="flex items-center gap-1">
//                       <span className="font-semibold text-gray-700">Marks</span>
//                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">+1</span>
//                       <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">-0.33</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="font-semibold text-gray-700">Time</span>
//                       <span className="font-mono text-gray-900">00:33</span>
//                     </div>
//                   </div>
//                   <select className="border border-gray-300 px-3 py-1.5 rounded text-sm">
//                     <option>View in English</option>
//                     <option>View in Hindi</option>
//                   </select>
//                   <button className="p-2 hover:bg-gray-100 rounded transition-colors">
//                     <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Question Text */}
//               <div className="mb-6 text-base text-gray-900 leading-relaxed">
//                 <MathRenderer text={currentQuestion.text} />
//               </div>

//               {/* Options */}
//               <div className="space-y-3">
//                 {currentQuestion.options.map((option, index) => (
//                   <label
//                     key={index}
//                     className="flex items-start gap-3 cursor-pointer group"
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={selectedOptions[currentQuestion.id] === option}
//                       onChange={() => handleOptionSelect(option)}
//                       className="mt-1 w-4 h-4"
//                     />
//                     <div className="flex-1 text-base text-gray-800">
//                       <MathRenderer text={option} />
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}


//         </main>

//         {/* RIGHT SIDEBAR */}
//         <aside className="w-80 bg-[#D9ECF8] border-l border-gray-300 overflow-y-auto">
//           {/* User Info */}
//           <div className="p-4 bg-white border-b border-gray-300">
//             <div className="flex items-center gap-3">
//               <img
//                 src={userInfo?.profile || "https://i.pravatar.cc/40"}
//                 alt="User"
//                 className="w-10 h-10 rounded-full border-2 border-teal-500"
//               />
//               <div>
//                 <p className="font-semibold text-gray-900">{userInfo?.name || 'prachi'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Status Legend */}
//           <div className="p-4  border-gray-300bg-[#D9ECF8]">
//             <div className="grid grid-cols-2 gap-3 text-xs">
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-600 flex items-center justify-center text-white font-bold">
//                   {optionSelected.length}
//                 </div>
//                 <span className="text-gray-700">Answered</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-yellow-500 rounded border-2 border-yellow-600 flex items-center justify-center text-white font-bold">
//                   {markedWithAns.length}
//                 </div>
//                 <span className="text-gray-700">Marked with Answer</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-600 flex items-center justify-center text-white font-bold">
//                   {markedForReview.length}
//                 </div>
//                 <span className="text-gray-700">Marked without Answer</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-white rounded border-2 border-gray-400 flex items-center justify-center text-gray-700 font-bold">
//                   {questions.length - optionSelected.length - markedForReview.length - markedWithAns.length}
//                 </div>
//                 <span className="text-gray-700">Not Visited</span>
//               </div>
//             </div>
//           </div>

//           {/* Section Info */}
//           <div className="p-2 bg-[#99c2db] border-b border-gray-300">
//             <h4 className="font-bold text-gray-900 text-sm ">SECTION : CBT</h4>
//           </div>

//           {/* Question Palette */}
//           <div className="p-4">
//             <div className="grid grid-cols-5 gap-2 mb-6">
//               {questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => handlePaletteClick(index)}
//                   className={`h-10 flex items-center justify-center border-2 rounded font-semibold text-sm transition-all ${getStatusColor(q.id)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-1 scale-105' : 'hover:scale-105'
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-2">
//               <button className="w-full bg-white hover:bg-gray-50 py-2.5 rounded border border-gray-300 font-semibold text-sm text-gray-700 transition-colors">
//                 Question Paper
//               </button>
//               <button className="w-full bg-white hover:bg-gray-50 py-2.5 rounded border border-gray-300 font-semibold text-sm text-gray-700 transition-colors">
//                 Instructions
//               </button>
//               <button
//                 onClick={() => setShowSubmitModal(true)}
//                 className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-bold text-sm shadow-md transition-colors"
//               >
//                 Submit Test
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>

//       {/* FOOTER - Action Buttons */}
//       <footer className="bg-white border-t border-gray-300 px-4 py-2 flex justify-between shadow-lg">
//         {/* Bottom Action Buttons */}
//         <div className="flex gap-3 mt-2">
//           <button
//             onClick={handleMarkForReview}
//             className="bg-[#A9D1F4] hover:bg-blue-200 text-[#333] font-semibold py-2.5 px-6 rounded transition-colors"
//           >
//             Mark for Review & Next
//           </button>
//           <button
//             onClick={handleClearResponse}
//             className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded transition-colors"
//           >
//             Clear Response
//           </button>


//           <button
//             onClick={handleSaveAndNext}
//             className="bg-[#21BAD4] hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded transition-colors"
//           >
//             Save & Next
//           </button>

//         </div>
//         <div>

//           <button
//             onClick={handleSaveAndNext}
//             className="bg-[#21BAD4] hover:bg-green-700 text-white font-bold py-2.5 px-25 rounded transition-colors"
//           >
//             Submit Test
//           </button>
//         </div>
//       </footer>

//       {/* Modals */}
//       {showLastQuestionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
//             <h3 className="text-xl font-bold mb-4">Last Question</h3>
//             <p className="text-gray-600 mb-6">You've reached the last question.</p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => { setShowLastQuestionModal(false); setActiveQuestionIndex(0); }}
//                 className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
//               >
//                 Go to First
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 className="bg-green-600 text-white py-3 rounded-lg font-semibold"
//               >
//                 Submit Test
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPauseModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
//             <h3 className="text-xl font-bold mb-4">Pause Test?</h3>
//             <p className="text-gray-600 mb-6">Your progress will be saved.</p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowPauseModal(false)}
//                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmPause}
//                 className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-semibold"
//               >
//                 Yes, Pause
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
//             <h3 className="text-xl font-bold mb-4">Submit Test?</h3>
//             <p className="text-gray-600 mb-6">
//               Answered: <span className="font-bold">{optionSelected.length}</span> / {questions.length}
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowSubmitModal(false)}
//                 className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitTest}
//                 disabled={isSubmitting}
//                 className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RRBTestPage;


import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getSingleCategoryPackageTestseriesQuestionSlice,
  attendQuestionSubmitSlice
} from '../../redux/HomeSlice';
import {
  secureSaveTestData,
  secureGetTestData,
  clearAllTestData,
} from '../../helpers/testStorage';
import { getUserDataDecrypted } from '../../helpers/userStorage';
import MathRenderer from '../../utils/MathRenderer';

const RRBTestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];
  const testId = state?.testInfo?.test_id;

  // ✅ EXTRACT DATA FROM STATE PROPERLY
  const testResults = state?.testResults || {};
  const correct = testResults?.correct || 0;
  const inCorrect = testResults?.in_correct || 0;
  const totalAttempted = testResults?.total_attend_question || 0;
  const marksScored = testResults?.marks || 0;
  const totalTime = testResults?.time || 0;



  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeInitialized, setTimeInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [optionSelected, setOptionSelected] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [markedWithAns, setMarkedWithAns] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [currentLanguage, setCurrentLanguage] = useState('hindi');
  const [questionElapsedTime, setQuestionElapsedTime] = useState(0);
  // Initialize time
  // useEffect(() => {
  //   const initializeTime = async () => {
  //     if (!testId) {
  //       setTimeLeft((testInfo.time || 90) * 60);
  //       setTimeInitialized(true);
  //       return;
  //     }

  //     try {
  //       const savedRemainingTime = await secureGetTestData(testId, "remainingTime");

  //       if (savedRemainingTime && savedRemainingTime > 0) {
  //         setTimeLeft(savedRemainingTime);
  //       } else if (state?.pausedTimeLeft && state.pausedTimeLeft > 0) {
  //         setTimeLeft(state.pausedTimeLeft);
  //       } else {
  //         const initialTime = (testInfo.time || 90) * 60;
  //         setTimeLeft(initialTime);
  //       }
  //     } catch (error) {
  //       console.error('Error initializing time:', error);
  //       setTimeLeft((testInfo.time || 90) * 60);
  //     } finally {
  //       setTimeInitialized(true);
  //     }
  //   };

  //   initializeTime();
  // }, [testId, testInfo.time, state?.pausedTimeLeft]);

// Initialize time
useEffect(() => {
    const initializeTime = async () => {
        if (!testId) {
            setTimeLeft((testInfo.time || 90) * 60);
            setTimeInitialized(true);
            return;
        }

        try {
            // ✅ CHECK IF THIS IS A FRESH ATTEMPT OR RESUME
            const isResuming = state?.pausedTimeLeft && state.pausedTimeLeft > 0;
            
            if (isResuming) {
                // ✅ User is RESUMING a paused test
                console.log('🔄 Resuming test with time:', state.pausedTimeLeft);
                setTimeLeft(state.pausedTimeLeft);
            } else {
                // ✅ User is starting FRESH - Clear old data
                console.log('🆕 Starting fresh test - clearing old data');
                await clearAllTestData(testId);
                const initialTime = (testInfo.time || 90) * 60;
                setTimeLeft(initialTime);
                await secureSaveTestData(testId, "remainingTime", initialTime);
            }
        } catch (error) {
            console.error('Error initializing time:', error);
            setTimeLeft((testInfo.time || 90) * 60);
        } finally {
            setTimeInitialized(true);
        }
    };

    initializeTime();
}, [testId, testInfo.time, state?.pausedTimeLeft]);


  useEffect(() => {
    const loadUserData = async () => {
      const user = await getUserDataDecrypted();
      setUserInfo(user);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const restoreTestData = async () => {
      if (!testId) return;

      const [storedOptions, storedAttempted, storedMarked, storedSkipped, storedMarkedWithAns] = await Promise.all([
        secureGetTestData(testId, "selectedOptions"),
        secureGetTestData(testId, "optionSelected"),
        secureGetTestData(testId, "markedForReview"),
        secureGetTestData(testId, "skippedQuestions"),
        secureGetTestData(testId, "marked_with_ans"),
      ]);

      if (storedOptions) setSelectedOptions(storedOptions);
      if (storedAttempted) setOptionSelected(storedAttempted);
      if (storedMarked) setMarkedForReview(storedMarked);
      if (storedSkipped) setSkippedQuestions(storedSkipped);
      if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
    };

    restoreTestData();
  }, [testId]);

  const getTestSeriesQuestion = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(testId)).unwrap();

      if (res.status_code === 200 && res.data && res.data.length > 0) {
        const formattedQuestions = res.data.map((question, index) => ({
          id: question.id,
          questionNumber: index + 1,
          section: question.subject_name || 'General',
          // ✅ STORE BOTH LANGUAGE VERSIONS
          textHindi: question.question_hindi,
          textEnglish: question.question_english,
          optionsHindi: [
            question.option_hindi_a,
            question.option_hindi_b,
            question.option_hindi_c,
            question.option_hindi_d
          ],
          optionsEnglish: [
            question.option_english_a,
            question.option_english_b,
            question.option_english_c,
            question.option_english_d
          ],
          correctAnswer: question.hindi_ans,
          status: 'notVisited',
          userAnswer: null,
        }));

        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    setCurrentLanguage(e.target.value);
  };
  useEffect(() => {
    if (testId) getTestSeriesQuestion();
  }, [testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "selectedOptions", selectedOptions);
  }, [selectedOptions, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "optionSelected", optionSelected);
  }, [optionSelected, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "markedForReview", markedForReview);
  }, [markedForReview, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
  }, [skippedQuestions, testId]);

  useEffect(() => {
    if (!testId) return;
    secureSaveTestData(testId, "marked_with_ans", markedWithAns);
  }, [markedWithAns, testId]);

  // Timer
  useEffect(() => {
    if (!timeInitialized || timeLeft === null || timeLeft <= 0 || loading) {
      if (timeLeft <= 0 && timeInitialized && !loading) {
        handleSubmitTest();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime % 5 === 0 && testId) {
          secureSaveTestData(testId, "remainingTime", newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, timeInitialized, testId]);

  const formatTime = (seconds) => {
    if (seconds === null) return "00 : 00 : 00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [activeQuestionIndex]);

  const updateSpentTime = async (questionId) => {
    const now = Date.now();
    const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

    let existing = await secureGetTestData(testId, 'spentTime');
    existing = existing || [];

    const updated = (() => {
      const found = existing.find(item => item.questionId === questionId);
      if (found) {
        return existing.map(item =>
          item.questionId === questionId
            ? { ...item, time: item.time + timeSpentOnQuestion }
            : item
        );
      } else {
        return [...existing, { questionId, time: timeSpentOnQuestion }];
      }
    })();

    await secureSaveTestData(testId, 'spentTime', updated);
  };

  const handleOptionSelect = async (option) => {
    const currentId = questions[activeQuestionIndex]?.id;
    const updated = { ...selectedOptions, [currentId]: option };
    setSelectedOptions(updated);

    if (!optionSelected.includes(currentId)) {
      setOptionSelected([...optionSelected, currentId]);
    }

    if (markedForReview.includes(currentId)) {
      if (!markedWithAns.includes(currentId)) {
        setMarkedWithAns([...markedWithAns, currentId]);
        setMarkedForReview(markedForReview.filter(id => id !== currentId));
      }
    }

    if (skippedQuestions.includes(currentId)) {
      setSkippedQuestions(skippedQuestions.filter(id => id !== currentId));
    }
  };

  const handleSaveAndNext = async () => {
    const currentId = questions[activeQuestionIndex]?.id;
    await updateSpentTime(currentId);

    if (activeQuestionIndex === questions.length - 1) {
      setShowLastQuestionModal(true);
    } else {
      setActiveQuestionIndex(prev => prev + 1);
    }
  };

  // const handleMarkForReview = async () => {
  //   const currentId = questions[activeQuestionIndex]?.id;
  //   const isOptionSelected = !!selectedOptions[currentId];

  //   if (isOptionSelected) {
  //     if (!markedWithAns.includes(currentId)) {
  //       setMarkedWithAns([...markedWithAns, currentId]);
  //     }
  //   } else {
  //     if (!markedForReview.includes(currentId)) {
  //       setMarkedForReview([...markedForReview, currentId]);
  //     }
  //   }

  //   if (activeQuestionIndex < questions.length - 1) {
  //     setActiveQuestionIndex(prev => prev + 1);
  //   } else {
  //     setActiveQuestionIndex(0);
  //   }
  // };

  const handleMarkForReview = async () => {
    const currentId = questions[activeQuestionIndex]?.id;
    const hasAnswer = !!selectedOptions[currentId];

    if (hasAnswer) {
      // ✅ Question has answer - Mark WITH answer (Purple)
      if (!markedWithAns.includes(currentId)) {
        setMarkedWithAns([...markedWithAns, currentId]);
      }
      // Remove from answered-only list
      setOptionSelected(optionSelected.filter(id => id !== currentId));
      // Remove from marked-without-answer list
      setMarkedForReview(markedForReview.filter(id => id !== currentId));
    } else {
      // ✅ Question has NO answer - Mark for review (Red)
      if (!markedForReview.includes(currentId)) {
        setMarkedForReview([...markedForReview, currentId]);
      }
    }

    // Move to next question
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setActiveQuestionIndex(0);
    }
  };


  const handleClearResponse = () => {
    const currentId = questions[activeQuestionIndex]?.id;
    const updatedSelectedOptions = { ...selectedOptions };
    delete updatedSelectedOptions[currentId];
    setSelectedOptions(updatedSelectedOptions);

    setMarkedWithAns(markedWithAns.filter(id => id !== currentId));
    setOptionSelected(optionSelected.filter(id => id !== currentId));
  };

  const handlePaletteClick = (questionIndex) => {
    setActiveQuestionIndex(questionIndex);
  };

  const enterFullScreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const exitFullScreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handlePauseClick = () => setShowPauseModal(true);

  const handleConfirmPause = async () => {
    setShowPauseModal(false);
    if (timeLeft > 0) {
      await secureSaveTestData(testId, "remainingTime", timeLeft);
    }
    if (isFullScreen) await exitFullScreen();
    navigate('/testpakages', { replace: true });
  };

  // const handleSubmitTest = async () => {
  //   setShowSubmitModal(false);
  //   setIsSubmitting(true);

  //   try {
  //     await clearAllTestData(testId);
  //     if (isFullScreen) await exitFullScreen();
  //     navigate('/analysis', { replace: true, state });
  //   } catch (error) {
  //     console.error("Error submitting test:", error);
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmitTest = async () => {
    setShowSubmitModal(false);
    setShowLastQuestionModal(false);
    setIsSubmitting(true);

    const currentId = questions[activeQuestionIndex]?.id;
    await updateSpentTime(currentId);

    if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
      const updatedSelected = [...optionSelected, currentId];
      await secureSaveTestData(testId, 'optionSelected', updatedSelected);
    }

    const spentTime = await secureGetTestData(testId, 'spentTime') || [];
    const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
    const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
    const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
    const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

    const totalAttendedQuestions = optionSelected2.length;
    const totalNotAnsweredQuestions = questions.length - totalAttendedQuestions;

    let correct = 0;
    let in_correct = 0;

    const allAttendedQuestions = optionSelected2.map((questionId) => {
      const question = questions.find(q => q.id === questionId);
      const selectedAns = selectedOptions2[questionId];
      const rightAns = question?.correctAnswer;

      if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
        correct++;
      } else {
        in_correct++;
      }

      return {
        question_id: questionId,
        user_selected_ans: selectedAns,
        right_ans: rightAns
      };
    });

    const negativeMark = parseFloat(testInfo.negative_mark || 0);
    const statMark = parseFloat(testDetail[0]?.marks || 0);
    const markPer_ques = statMark / questions.length;
    const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
    const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

    const submissionData = {
      test_id: testId,
      total_attend_question: totalAttendedQuestions,
      total_not_answer_question: totalNotAnsweredQuestions,
      correct: correct,
      in_correct: in_correct,
      marks: parseFloat(marksScored.toFixed(2)),
      time: totalTimeSpent,
      negative_mark: negativeMark,
      all_attend_question: allAttendedQuestions,
      spent_time: spentTime,
      skip_question: skippedQuestions2,
      attend_question: optionSelected2,
      mark_for_review: markedForReview2
    };

    console.log('📊 Submission Data:', submissionData);

    try {
      const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
      console.log('✅ API Response:', res);

      if (res.status_code == 200) {
        // ✅ FIXED: Correct way to extract attend_id
        const attendId = res.data?.attend_id || res.data?.id || res.attend_id;

        console.log('🆔 Attend ID:', attendId);

        await clearAllTestData(testId);

        if (isFullScreen) {
          await exitFullScreen();
        }

        // ✅ Navigate with attend_id in state
        navigate('/analysis', {
          replace: true,
          state: {
            testInfo: {
              ...testInfo,
              attend_id: attendId,  // ✅ Add attend_id to testInfo
            },
            testId: testId,
            attend_id: attendId,    // ✅ Also add at root level
            testResults: submissionData,
            allQuestions: questions,
            testDetail: testDetail,
          }
        });
      } else {
        console.error('❌ API Error:', res);
        setIsSubmitting(false);
        alert(`Error: ${res.message || 'Failed to submit test'}`);
      }
    } catch (error) {
      console.error("❌ Submit Error:", error);
      setIsSubmitting(false);
      alert('Failed to submit test. Please try again.');
    }
  };

  // const getStatusColor = (questionId) => {
  //   if (optionSelected.includes(questionId)) return 'bg-green-500 text-white border-green-500';
  //   if (markedWithAns.includes(questionId)) return 'bg-purple-500 text-white border-purple-500';
  //   if (markedForReview.includes(questionId)) return 'bg-red-500 text-white border-red-500';
  //   return 'bg-white text-gray-800 border-gray-300';
  // };

  const getStatusColor = (questionId) => {
    // Priority 1: Marked WITH Answer (Purple) - highest priority
    if (markedWithAns.includes(questionId) || markedForReview.includes(questionId)) {
      return 'bg-purple-600 text-white border-purple-600';
    }
    // Priority 2: Answered ONLY (Green)
    if (optionSelected.includes(questionId)) {
      return 'bg-green-500 text-white border-green-500';
    }
    // // Priority 3: Marked WITHOUT Answer (Red)
    // if (markedForReview.includes(questionId)) {
    //   return 'bg-red-500 text-white border-red-500';
    // }
    // Default: Not Visited (White)
    return 'bg-white text-gray-800 border-gray-300';
  };


  if (loading || !timeInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  const currentQuestion = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ✅ TOP HEADER - Exact Match */}
      <header className="flex border-b border-gray-400 items-center justify-between px-6 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo" className="w-8 h-8" />
          </div>
          <span className="text-xl text-black font-bold">Revision24</span>
          <span className="text-base font-normal text-black ml-4">{testInfo.title || 'RRB Group D Full Test 1'}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-400 bg-opacity-40 text-gray-900 px-4 py-2 rounded-md">
            <span className="font-semibold text-sm">Time Left</span>
            <span className="font-mono font-bold text-base">{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => isFullScreen ? exitFullScreen() : enterFullScreen()}
            className="border border-[#21BAD4] hover:bg-blue-50 px-4 py-2 text-[#21BAD4] rounded-md text-sm font-semibold transition-colors"
          >
            {isFullScreen ? 'Exit Full Screen' : 'Switch Full Screen'}
          </button>
          <button
            onClick={handlePauseClick}
            className="border border-[#21BAD4] hover:bg-blue-50 text-[#21BAD4] px-5 py-2 rounded-md text-sm font-bold transition-colors"
          >
            Pause
          </button>
        </div>
      </header>

      {/* ✅ SECTION TABS - Exact Match */}
      <div className="bg-white border-b border-gray-300 px-6 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">SECTIONS</span>
          <button className="px-4 py-1.5 bg-[#21BAD4] text-white rounded text-sm font-semibold">
            CBT
          </button>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT - QUESTION AREA */}
        <main className="flex-1 p-6 overflow-y-auto bg-white position-relative">
          {currentQuestion && (
            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-base font-bold text-gray-900">Question No. {currentQuestion.questionNumber}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Marks</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">+1</span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">-0.33</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Time</span>
                      <span className="font-mono text-gray-900">00:33</span>
                    </div>
                  </div>
                  <select
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    className="border border-gray-300 px-3 py-1.5 rounded text-sm"
                  >
                    <option value="hindi">View in Hindi</option>
                    <option value="english">View in English</option>
                  </select>

                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6 text-base text-gray-900 leading-relaxed">
                <MathRenderer text={currentLanguage === 'hindi' ? currentQuestion.textHindi : currentQuestion.textEnglish} />
              </div>


              {/* Options */}
              <div className="space-y-3">
                {(currentLanguage === 'hindi' ? currentQuestion.optionsHindi : currentQuestion.optionsEnglish).map((option, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedOptions[currentQuestion.id] === option}
                      onChange={() => handleOptionSelect(option)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1 text-base text-gray-800">
                      <MathRenderer text={option} />
                    </div>
                  </label>
                ))}
              </div>

            </div>
          )}


          {/* ✅ FOOTER - EXACT BUTTON PLACEMENT */}
          <footer className="border-t border-gray-300 absolute w-[75%]  bottom-0  px-1 py-3 flex justify-between items-center shadow-lg">
            {/* Left Side - Two Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleMarkForReview}
                className="bg-[#A9D1F4] hover:bg-[#8fc4ee] text-gray-800 font-semibold py-2.5 px-6 rounded transition-colors"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded transition-colors"
              >
                Clear Response
              </button>
            </div>

            {/* Right Side - Save & Next Button */}
            <button
              onClick={handleSaveAndNext}
              className="bg-[#21BAD4] hover:bg-[#1da5bf] text-white font-bold py-2.5 px-12 rounded transition-colors shadow-md"
            >
              Save & Next
            </button>
          </footer>


        </main>

        {/* RIGHT SIDEBAR - Exact Match */}
        <aside className="w-80 bg-[#D9ECF8] border-l border-gray-300 overflow-y-auto">
          {/* User Info */}
          <div className="p-4 bg-white border-b border-gray-300">
            <div className="flex items-center gap-3">
              <img
                src={userInfo?.profile || "https://i.pravatar.cc/40"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-[#21BAD4]"
              />
              <div>
                <p className="font-semibold text-gray-900">{userInfo?.name || 'prachi'}</p>
              </div>
            </div>
          </div>


          {/* ✅ Status Legend - WITH ANSWERED COUNT */}
          <div className="p-4 bg-white">
            {/* First Row - 3 items */}
            <div className="flex justify-between items-center mb-3">
              {/* Answered - Green circle with COUNT */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {optionSelected.length}
                </div>
                <span className="text-gray-900 text-[10px] font-medium">Answered</span>
              </div>

              {/* Marked - Purple circle */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {markedForReview.filter(id => !selectedOptions[id]).length}
                </div>
                <span className="text-gray-900 text-[10px] font-medium">Marked</span>
              </div>

              {/* Not Visited - White square with border */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded flex items-center justify-center text-gray-900 text-[10px] font-bold">
                  {questions.length - new Set([...optionSelected, ...markedForReview, ...markedWithAns]).size}
                </div>
                <span className="text-gray-900 text-[10px] font-medium">Not Visited</span>
              </div>
            </div>

            {/* Second Row - 2 items */}
            <div className="flex items-center gap-8">
              {/* Marked and answered - Purple circle */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {markedWithAns.length}
                </div>
                <span className="text-gray-900 text-[10px] font-medium">Marked and answered</span>
              </div>

              {/* Not Answered - Red circle */}
              {/* <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {markedForReview.length}
                </div>
                <span className="text-gray-900 text-[10px] font-medium">Not Answered</span>
              </div> */}
            </div>
          </div>


          {/* Section Info */}
          <div className="p-3 bg-[#A9D6F1] border-b border-gray-300">
            <h4 className="font-bold text-gray-900 text-sm">SECTION : CBT</h4>
          </div>

          {/* Question Palette */}
          <div className="">
            <div className="grid grid-cols-5 gap-2 mb-30 p-4">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handlePaletteClick(index)}
                  className={`h-10 flex items-center justify-center border-2 rounded font-semibold text-sm transition-all ${getStatusColor(q.id)} ${index === activeQuestionIndex ? 'ring-2 ring-blue-500 ring-offset-1 scale-105' : 'hover:scale-105'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 absolute bottom-0 bg-[#A9D6F1] w-80 p-4">
              <div className='flex justify-between gap-5 mb-2 w-full '>

                <button className="w-full bg-white hover:bg-gray-50 py-2.5 rounded border border-gray-300 font-semibold text-sm text-gray-700 transition-colors">
                  Question Paper
                </button>
                <button className="w-full bg-white hover:bg-gray-50 py-2.5 rounded border border-gray-300 font-semibold text-sm text-gray-700 transition-colors">
                  Instructions
                </button>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full bg-[#21BAD4] hover:bg-[#1da5bf] text-white py-3 rounded font-bold text-sm shadow-md transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </aside>
      </div>



      {/* Modals */}
      {showLastQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Last Question</h3>
            <p className="text-gray-600 mb-6">You've reached the last question.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowLastQuestionModal(false); setActiveQuestionIndex(0); }}
                className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                Go to First
              </button>
              <button
                onClick={handleSubmitTest}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Pause Test?</h3>
            <p className="text-gray-600 mb-6">Your progress will be saved.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPause}
                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-semibold"
              >
                Yes, Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Submit Test?</h3>
            <p className="text-gray-600 mb-6">
              Answered: <span className="font-bold">{optionSelected.length}</span> / {questions.length}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="flex-1 bg-[#21BAD4] text-white py-3 rounded-lg font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RRBTestPage;
