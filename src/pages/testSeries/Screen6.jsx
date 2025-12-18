// import React, { useCallback, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
// import Header from '../../components/Header';
// import LeaderBoardTable from '../../components/LeaderBoardTable';

// const Screen6 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log("Analysis Screen State Response", state);

//     const [performance, setPerformance] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [testData, setTestData] = useState({});
//     const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
//     const [rankScore, setRankScore] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // ✅ Single, consolidated fetchUserResult function
//     const fetchUserResult = useCallback(async () => {
//         if (!state) return;

//         // ✅ Check if data is already preloaded from AttemptedTestPage
//         if (state.isDataPreloaded && state.preloadedData) {
//             // console.log('Using preloaded data:', state.preloadedData);

//             try {
//                 setLoading(true);

//                 // Set the data directly without API call
//                 const res = { status_code: 200, data: state.preloadedData };

//                 // Continue with your existing data processing logic
//                 if (res.status_code == 200) {
//                     const test = res.data.test_detail;
//                     const my = res.data.my_detail;
//                     setTestData(res.data);
//                     // console.log("Using preloaded data on screen no 6", res.data);

//                     setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//                     const totalAttempted = my?.total_attend_question || 0;
//                     const totalQuestions = test?.total_no_of_question || 1;
//                     const totalMarks = parseFloat(test?.total_marks || 0);
//                     const negativeMark = parseFloat(test?.negative_mark || 0);
//                     const correct = parseInt(my?.correct || 0);
//                     const inCorrect = parseInt(my?.in_correct || 0);

//                     const markPer_ques = totalMarks / totalQuestions;
//                     const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
//                     setRankScore(calculatedScore);
//                     // console.log('calculatedScore from preloaded data', calculatedScore);

//                     const accuracy = correct && totalAttempted
//                         ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//                         : "0%";

//                     setPerformance({
//                         rank: {
//                             value: my?.my_rank || 0,
//                             total: my?.total_join_user || 0
//                         },
//                         score: {
//                             value: calculatedScore.toFixed(2),
//                             max: totalMarks
//                         },
//                         attempted: {
//                             value: totalAttempted,
//                             max: totalQuestions
//                         },
//                         accuracy,
//                         percentile: (my?.percentile || 0) + "%"
//                     });

//                     const parsedSpent = JSON.parse(my?.spent_time || '[]');
//                     const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//                     setSections([
//                         {
//                             name: "Full Test",
//                             score: calculatedScore.toFixed(2),
//                             maxScore: totalMarks,
//                             attempted: totalAttempted,
//                             accuracy,
//                             time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//                         }
//                     ]);
//                 }
//             } catch (error) {
//                 console.error("ERROR processing preloaded data", error);
//             } finally {
//                 setLoading(false);
//             }
//             return;
//         }

//         // ✅ Fallback to API call if no preloaded data (for other navigation sources)
//         let testId = state?.testInfo?.test_id || 
//                      state?.testInfo?.id ||
//                      state?.testData?.my_detail?.test_id;

//         // console.log('No preloaded data, making API call with testId:', testId);

//         if (!testId) {
//             console.error('No test ID found in state');
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);
//             const res = await dispatch(fetchUserTestSeriesRankSlice(testId)).unwrap();

//             if (res.status_code == 200) {
//                 const test = res.data.test_detail;
//                 const my = res.data.my_detail;
//                 setTestData(res.data);
//                 // console.log("res on screen no 6 from API", res.data);

//                 setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//                 const totalAttempted = my?.total_attend_question || 0;
//                 const totalQuestions = test?.total_no_of_question || 1;
//                 const totalMarks = parseFloat(test?.total_marks || 0);
//                 const negativeMark = parseFloat(test?.negative_mark || 0);
//                 const correct = parseInt(my?.correct || 0);
//                 const inCorrect = parseInt(my?.in_correct || 0);

//                 const markPer_ques = totalMarks / totalQuestions;
//                 const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
//                 setRankScore(calculatedScore);
//                 // console.log('calculatedScore from API', calculatedScore);

//                 const accuracy = correct && totalAttempted
//                     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//                     : "0%";

//                 setPerformance({
//                     rank: {
//                         value: my?.my_rank || 0,
//                         total: my?.total_join_user || 0
//                     },
//                     score: {
//                         value: calculatedScore.toFixed(2),
//                         max: totalMarks
//                     },
//                     attempted: {
//                         value: totalAttempted,
//                         max: totalQuestions
//                     },
//                     accuracy,
//                     percentile: (my?.percentile || 0) + "%"
//                 });

//                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//                 const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//                 setSections([
//                     {
//                         name: "Full Test",
//                         score: calculatedScore.toFixed(2),
//                         maxScore: totalMarks,
//                         attempted: totalAttempted,
//                         accuracy,
//                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//                     }
//                 ]);
//             }
//         } catch (error) {
//             console.error("ERROR IN RESULT SCREEN", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [dispatch, state]);

//     useEffect(() => {
//         fetchUserResult();
//     }, [fetchUserResult]);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600 text-lg">Loading your results...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!performance) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                     <p className="text-red-600 text-xl">Unable to load test results</p>
//                 </div>
//             </div>
//         );
//     }

//     const getScoreStatus = (score, maxScore) => {
//         const percentage = (score / maxScore) * 100;
//         if (percentage >= 80) return { status: 'excellent', color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
//         if (percentage >= 60) return { status: 'good', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
//         if (percentage >= 40) return { status: 'average', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
//         return { status: 'needs-improvement', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
//     };

//     const getAccuracyStatus = (accuracy) => {
//         const acc = parseFloat(accuracy);
//         if (acc >= 80) return { color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
//         if (acc >= 60) return { color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
//         if (acc >= 40) return { color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
//         return { color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
//     };

//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//                 {/* Hero Section */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="text-center">
//                             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
//                                 {testData?.test_detail?.title}
//                             </h1>
//                             <p className="text-indigo-200 text-sm sm:text-base">
//                                 Test completed • {testData?.test_detail?.time} minutes • {testData?.test_detail?.total_no_of_question} questions
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {/* Performance Summary Cards */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
//                             {/* Rank Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-pink-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-pink-600 mb-1">#{performance.rank.value}</div>
//                                 <div className="text-sm text-gray-500 mb-1">out of {performance.rank.total}</div>
//                                 <div className="text-xs font-medium text-gray-700">Your Rank</div>
//                             </div>

//                             {/* Score Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-purple-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-purple-600 mb-1">{performance.score.value}</div>
//                                 <div className="text-sm text-gray-500 mb-1">out of {performance.score.max}</div>
//                                 <div className="text-xs font-medium text-gray-700">Total Score</div>
//                             </div>

//                             {/* Attempted Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-cyan-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-cyan-600 mb-1">{performance.attempted.value}</div>
//                                 <div className="text-sm text-gray-500 mb-1">out of {performance.attempted.max}</div>
//                                 <div className="text-xs font-medium text-gray-700">Questions Attempted</div>
//                             </div>

//                             {/* Accuracy Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-green-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-green-600 mb-1">{performance.accuracy}</div>
//                                 <div className="text-xs font-medium text-gray-700">Accuracy Rate</div>
//                             </div>

//                             {/* Percentile Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-indigo-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-indigo-600 mb-1">{performance.percentile}</div>
//                                 <div className="text-xs font-medium text-gray-700">Percentile</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section Performance Table */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Analysis</h2>
//                         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {sections.map((section, idx) => {
//                                             const scoreStatus = getScoreStatus(section.score, section.maxScore);
//                                             const accuracyStatus = getAccuracyStatus(section.accuracy);
//                                             const scorePercent = (section.score / section.maxScore) * 100;
//                                             const attemptedPercent = (section.attempted / performance.attempted.max) * 100;

//                                             return (
//                                                 <tr key={idx} className="hover:bg-gray-50">
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="font-medium text-gray-900">{section.name}</div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className={`font-semibold ${scoreStatus.textColor}`}>
//                                                                     {section.score} / {section.maxScore}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div 
//                                                                     className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: `${scorePercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className="font-semibold text-blue-700">
//                                                                     {section.attempted} / {performance.attempted.max}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div 
//                                                                     className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                     style={{ width: `${attemptedPercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
//                                                                 {section.accuracy}
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div 
//                                                                     className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: section.accuracy }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-yellow-50 rounded-lg px-3 py-2">
//                                                             <div className="font-semibold text-yellow-800">
//                                                                 {section.time}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 / {testData?.test_detail?.time} min
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Subject-wise Analysis */}
//                     {subjectWiseAnalysis.length > 0 && (
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {subjectWiseAnalysis.map((subject, index) => {
//                                                 const accuracy = subject.total_question_attempted > 0
//                                                     ? ((subject.correct_count / subject.total_question_attempted) * 100).toFixed(1)
//                                                     : '0';
//                                                 const accuracyStatus = getAccuracyStatus(accuracy);
//                                                 const attemptPercent = (subject.total_question_attempted / subject.total_assign_question) * 100;

//                                                 return (
//                                                     <tr key={index} className="hover:bg-gray-50">
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="font-medium text-gray-900">{subject.subject_name}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <span className="font-semibold text-gray-700">{subject.total_assign_question}</span>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <div className="flex items-center">
//                                                                 <span className="font-semibold text-blue-600 mr-2">
//                                                                     {subject.total_question_attempted}
//                                                                 </span>
//                                                                 <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
//                                                                     <div 
//                                                                         className="bg-blue-500 h-2 rounded-full"
//                                                                         style={{ width: `${attemptPercent}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                 {subject.correct_count}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                 {subject.incorrect_count}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <div className="flex items-center">
//                                                                 <span className={`font-semibold ${accuracyStatus.textColor} mr-2`}>
//                                                                     {accuracy}%
//                                                                 </span>
//                                                                 <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-16">
//                                                                     <div 
//                                                                         className={`bg-${accuracyStatus.color}-500 h-2 rounded-full`}
//                                                                         style={{ width: `${accuracy}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4">
//                                                             <span className="text-sm text-gray-600">{subject.spent_time}</span>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Leaderboard */}
//                     <div className="mb-8">
//                         <LeaderBoardTable data={testData?.leaderboard || []} rankScore={rankScore} />
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                         <button 
//                             onClick={() => nav('/test-solutions', { state: { testData, state } })}
//                             className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                         >
//                             <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                             </svg>
//                             View Solutions & Analysis
//                         </button>

//                         <button 
//                             onClick={() => nav('/')}
//                             className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//                         >
//                             Back to Dashboard
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Screen6;


// import React, { useCallback, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
// import Header from '../../components/Header';
// import LeaderBoardTable from '../../components/LeaderBoardTable';
// import { secureGetTestData } from '../../helpers/testStorage';

// const Screen6 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     // const { state } = useLocation();
//     const state = useLocation().state || {};
//     console.log("Analysis Screen State Response", state);

//     const [performance, setPerformance] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [testData, setTestData] = useState({});
//     const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
//     const [rankScore, setRankScore] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [qualifyingSections, setQualifyingSections] = useState([]);
//     const [isSectionalTest, setIsSectionalTest] = useState(false);
//     const [attempts, setAttempts] = useState([]);
//     const [selectedAttemptId, setSelectedAttemptId] = useState("");






//     useEffect(() => {
//         if (!state) return;

//         if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
//             setSubjectWiseAnalysis(state.subjectWiseAnalysis);
//             const qualifying = state.subjectWiseAnalysis.filter(s => s.is_qualified_section);
//             setQualifyingSections(qualifying);
//             setIsSectionalTest(!!state.isSectionalTest);
//         }
//     }, [state]);

//     // 🔽 NEW
//     // const [selectedAttemptId, setSelectedAttemptId] = useState(
//     //     state.currentAttemptId || state.attend_id || state.testInfo?.attend_id
//     // );
//     // const [attempts, setAttempts] = useState(state.allAttempts || []);

//     // Fetch User Result ////////////////////////////////////////////////////////////////////////////////////////////
//     //  const fetchUserResult = useCallback(async () => {
//     //     if (!state) {
//     //         console.error('No state provided to Analysis screen');
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     // ✅ PRIORITY 1: Direct test results from RRB test submission
//     //     if (state.testResults && state.allQuestions) {
//     //         console.log('✅ Using direct test results from submission:', state.testResults);

//     //         try {
//     //             setLoading(true);

//     //             const results = state.testResults;
//     //             const questions = state.allQuestions;
//     //             const testInfo = state.testInfo || {};
//     //             const testDetail = state.testDetail?.[0] || {};

//     //             // ✅ Extract data from submission
//     //             const totalAttempted = results.total_attend_question || 0;
//     //             const totalQuestions = questions.length || 100;
//     //             const totalMarks = parseFloat(testDetail.marks || 100);
//     //             const negativeMark = parseFloat(testInfo.negative_mark || 0.33);
//     //             const correct = results.correct || 0;
//     //             const inCorrect = results.in_correct || 0;
//     //             const marksScored = parseFloat(results.marks || 0);

//     //             console.log('📊 Direct Test Analysis Data:', {
//     //                 totalAttempted,
//     //                 totalQuestions,
//     //                 correct,
//     //                 inCorrect,
//     //                 marksScored,
//     //                 totalMarks
//     //             });

//     //             const accuracy = totalAttempted > 0
//     //                 ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: 0,
//     //                     total: 0
//     //                 },
//     //                 score: {
//     //                     value: marksScored.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: "0%"
//     //             });

//     //             const totalTimeSpent = results.time || 0;

//     //             // ✅ Section Analysis with correct/incorrect
//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: marksScored.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     inCorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);

//     //             // ✅ Calculate subject-wise analysis from questions
//     //             const subjectMap = {};

//     //             questions.forEach(q => {
//     //                 const subject = q.section || 'General';
//     //                 if (!subjectMap[subject]) {
//     //                     subjectMap[subject] = {
//     //                         subject_name: subject,
//     //                         total_assign_question: 0,
//     //                         total_question_attempted: 0,
//     //                         correct_count: 0,
//     //                         incorrect_count: 0,
//     //                         spent_time: 0
//     //                     };
//     //                 }

//     //                 subjectMap[subject].total_assign_question++;

//     //                 // Check if question was attempted
//     //                 if (results.attend_question?.includes(q.id)) {
//     //                     subjectMap[subject].total_question_attempted++;

//     //                     // Find the attended question data
//     //                     const attendedQ = results.all_attend_question?.find(aq => aq.question_id === q.id);
//     //                     if (attendedQ) {
//     //                         if (attendedQ.user_selected_ans?.toLowerCase() === attendedQ.right_ans?.toLowerCase()) {
//     //                             subjectMap[subject].correct_count++;
//     //                         } else {
//     //                             subjectMap[subject].incorrect_count++;
//     //                         }
//     //                     }
//     //                 }

//     //                 // Calculate spent time
//     //                 const timeData = results.spent_time?.find(t => t.questionId === q.id);
//     //                 if (timeData) {
//     //                     subjectMap[subject].spent_time += timeData.time || 0;
//     //                 }
//     //             });

//     //             // Convert to array and format time
//     //             const subjectAnalysis = Object.values(subjectMap).map(subject => ({
//     //                 ...subject,
//     //                 spent_time: `${Math.floor(subject.spent_time / 60)}:${(subject.spent_time % 60).toString().padStart(2, '0')}`
//     //             }));

//     //             console.log('📚 Subject-wise Analysis:', subjectAnalysis);
//     //             setSubjectWiseAnalysis(subjectAnalysis);

//     //             setTestData({
//     //                 test_detail: {
//     //                     title: testInfo.title || 'Test Analysis',
//     //                     time: testInfo.time || 90,
//     //                     total_no_of_question: totalQuestions,
//     //                     total_marks: totalMarks,
//     //                     negative_mark: negativeMark
//     //                 },
//     //                 my_detail: results,
//     //                 leaderboard: [] // ✅ Initialize empty leaderboard
//     //             });

//     //             setLoading(false);

//     //             // ✅ NEW: Try to fetch leaderboard data if attend_id is available
//     //             const attendId = state.attend_id || state.testInfo?.attend_id;
//     //             const testIdForAPI = state.testId || testInfo.test_id || testInfo.id;

//     //             if (attendId && testIdForAPI) {
//     //                 console.log('🏆 Fetching leaderboard with:', { test_id: testIdForAPI, attend_id: attendId });

//     //                 try {
//     //                     const apiRes = await dispatch(fetchUserTestSeriesRankSlice({
//     //                         test_id: testIdForAPI,
//     //                         attend_id: attendId
//     //                     })).unwrap();

//     //                     console.log('✅ Leaderboard API Response:', apiRes);

//     //                     if (apiRes.status_code === 200 && apiRes.data?.leaderboard) {
//     //                         // ✅ Update testData with leaderboard
//     //                         setTestData(prev => ({
//     //                             ...prev,
//     //                             leaderboard: apiRes.data.leaderboard
//     //                         }));
//     //                         console.log('🏆 Leaderboard loaded:', apiRes.data.leaderboard.length, 'entries');
//     //                     }
//     //                 } catch (leaderboardError) {
//     //                     console.warn('⚠️ Leaderboard not available yet:', leaderboardError);
//     //                     // Don't show error - leaderboard may not be ready yet
//     //                 }
//     //             } else {
//     //                 console.log('⚠️ No attend_id available for leaderboard');
//     //             }

//     //             return; // ✅ Exit early, don't call API
//     //         } catch (error) {
//     //             console.error("❌ ERROR processing direct test results", error);
//     //             setLoading(false);
//     //             return;
//     //         }
//     //     }

//     //     // ✅ PRIORITY 2: Preloaded data from AttemptedTestPage
//     //     if (state.isDataPreloaded && state.preloadedData) {
//     //         console.log('✅ Using preloaded data:', state.preloadedData);

//     //         try {
//     //             setLoading(true);

//     //             const res = { status_code: 200, data: state.preloadedData };

//     //             if (res.status_code == 200) {
//     //                 const test = res.data.test_detail;
//     //                 const my = res.data.my_detail;
//     //                 setTestData(res.data);
//     //                 console.log("✅ Using preloaded data on Analysis screen", res.data);

//     //                 setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //                 const totalAttempted = my?.total_attend_question || 0;
//     //                 const totalQuestions = test?.total_no_of_question || 1;
//     //                 const totalMarks = parseFloat(test?.total_marks || 0);
//     //                 const negativeMark = parseFloat(test?.negative_mark || 0);
//     //                 const correct = parseInt(my?.correct || 0);
//     //                 const inCorrect = parseInt(my?.in_correct || 0);

//     //                 const markPer_ques = totalMarks / totalQuestions;
//     //                 const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
//     //                 setRankScore(calculatedScore);
//     //                 console.log('✅ Calculated Score from preloaded data:', calculatedScore);

//     //                 const accuracy = correct && totalAttempted
//     //                     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                     : "0%";

//     //                 setPerformance({
//     //                     rank: {
//     //                         value: my?.my_rank || 0,
//     //                         total: my?.total_join_user || 0
//     //                     },
//     //                     score: {
//     //                         value: calculatedScore.toFixed(2),
//     //                         max: totalMarks
//     //                     },
//     //                     attempted: {
//     //                         value: totalAttempted,
//     //                         max: totalQuestions
//     //                     },
//     //                     accuracy,
//     //                     percentile: (my?.percentile || 0) + "%"
//     //                 });

//     //                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //                 const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //                 setSections([
//     //                     {
//     //                         name: "Full Test",
//     //                         score: calculatedScore.toFixed(2),
//     //                         maxScore: totalMarks,
//     //                         attempted: totalAttempted,
//     //                         totalQuestions: totalQuestions,
//     //                         correct: correct,
//     //                         inCorrect: inCorrect,
//     //                         accuracy,
//     //                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                     }
//     //                 ]);
//     //             }
//     //         } catch (error) {
//     //             console.error("❌ ERROR processing preloaded data", error);
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //         return;
//     //     }

//     //     // ✅ PRIORITY 3: API call (for SSC exams or when attend_id is available)
//     //     let testId = state?.testInfo?.test_id ||
//     //         state?.testInfo?.id ||
//     //         state?.testData?.my_detail?.test_id ||
//     //         state?.actualTestId;

//     //     let attendId = state?.attend_id ||
//     //         state?.testInfo?.attend_id ||
//     //         state?.testData?.my_detail?.attend_id;

//     //     // ✅ FIX: Don't use await here - secureGetTestData is likely not async
//     //     if (!attendId) {
//     //         const storedTest = secureGetTestData('currentTest');
//     //         attendId = storedTest?.attend_id;
//     //     }

//     //     console.log('📡 Making API call with:', {
//     //         test_id: testId,
//     //         attend_id: attendId,
//     //         fullState: state
//     //     });

//     //     if (!testId || !attendId) {
//     //         console.error('❌ Missing test_id or attend_id in state:', {
//     //             testId,
//     //             attendId,
//     //             fullState: state
//     //         });
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         setLoading(true);

//     //         const res = await dispatch(fetchUserTestSeriesRankSlice({
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         })).unwrap();

//     //         console.log('✅ API Response received:', res);

//     //         if (res.status_code == 200) {
//     //             const test = res.data.test_detail;
//     //             const my = res.data.my_detail;
//     //             setTestData(res.data);
//     //             console.log("✅ Data set from API on Analysis screen", res.data);

//     //             setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //             const totalAttempted = my?.total_attend_question || 0;
//     //             const totalQuestions = test?.total_no_of_question || 1;
//     //             const totalMarks = parseFloat(test?.total_marks || 0);
//     //             const negativeMark = parseFloat(test?.negative_mark || 0);
//     //             const correct = parseInt(my?.correct || 0);
//     //             const inCorrect = parseInt(my?.in_correct || 0);

//     //             const markPer_ques = totalMarks / totalQuestions;
//     //             const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);
//     //             setRankScore(calculatedScore);
//     //             console.log('✅ Calculated Score from API:', calculatedScore);

//     //             const accuracy = correct && totalAttempted
//     //                 ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: my?.my_rank || 0,
//     //                     total: my?.total_join_user || 0
//     //                 },
//     //                 score: {
//     //                     value: calculatedScore.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: (my?.percentile || 0) + "%"
//     //             });

//     //             const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //             const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: calculatedScore.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     inCorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ ERROR IN RESULT SCREEN API CALL", error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // }, [dispatch, state]);

//     // const fetchUserResult = useCallback(async () => {
//     //     if (!state) {
//     //         console.error("No state provided to Analysis screen");
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         setLoading(true);

//     //         // ✅ PRIORITY 1: Direct test results from RRB test submission
//     //         if (state.testResults && state.allQuestions) {
//     //             console.log("✅ Using direct test results from Screen5 submission", state.testResults);

//     //             const results = state.testResults;
//     //             const questions = state.allQuestions;
//     //             const testInfo = state.testInfo || {};
//     //             const testDetail = state.testDetail?.[0] || {};

//     //             // Calculate overall performance metrics
//     //             const totalQuestions = questions.length;
//     //             const attempted = results.total_attend_question || 0;
//     //             const correct = results.correct || 0;
//     //             const incorrect = results.in_correct || 0;
//     //             const unattempted = totalQuestions - attempted;
//     //             const marks = parseFloat(results.marks || 0);
//     //             const timeSpent = results.time || 0;
//     //             const totalMarks = parseFloat(testDetail.marks || testInfo.total_marks || 100);

//     //             console.log("📊 Performance Metrics:", {
//     //                 totalQuestions,
//     //                 attempted,
//     //                 correct,
//     //                 incorrect,
//     //                 unattempted,
//     //                 marks,
//     //                 timeSpent,
//     //                 totalMarks
//     //             });

//     //             // ✅ Calculate accuracy
//     //             const accuracy = attempted > 0
//     //                 ? ((correct / attempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             // ✅ Set initial performance (rank will be updated by leaderboard API)
//     //             setPerformance({
//     //                 rank: {
//     //                     value: 0,
//     //                     total: 0
//     //                 },
//     //                 score: {
//     //                     value: marks.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: attempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: "0%"
//     //             });

//     //             // Calculate subject-wise analysis
//     //             const subjectMap = {};

//     //             questions.forEach(q => {
//     //                 const subject = q.section || 'General';
//     //                 if (!subjectMap[subject]) {
//     //                     subjectMap[subject] = {
//     //                         subject_name: subject,
//     //                         total_assign_question: 0,
//     //                         total_question_attempted: 0,
//     //                         correct_count: 0,
//     //                         incorrect_count: 0,
//     //                         spent_time: 0
//     //                     };
//     //                 }

//     //                 subjectMap[subject].total_assign_question++;

//     //                 // Check if question was attempted
//     //                 if (results.attend_question?.includes(q.id)) {
//     //                     subjectMap[subject].total_question_attempted++;

//     //                     // Find the attended question data
//     //                     const attendedQ = results.all_attend_question?.find(aq => aq.question_id === q.id);
//     //                     if (attendedQ) {
//     //                         if (attendedQ.user_selected_ans?.toLowerCase() === attendedQ.right_ans?.toLowerCase()) {
//     //                             subjectMap[subject].correct_count++;
//     //                         } else {
//     //                             subjectMap[subject].incorrect_count++;
//     //                         }
//     //                     }
//     //                 }

//     //                 // Calculate spent time
//     //                 const timeData = results.spent_time?.find(t => t.questionId === q.id);
//     //                 if (timeData) {
//     //                     subjectMap[subject].spent_time += timeData.time || 0;
//     //                 }
//     //             });

//     //             // Convert to array and format time
//     //             const subjectAnalysis = Object.values(subjectMap).map(subject => ({
//     //                 ...subject,
//     //                 spent_time: `${Math.floor(subject.spent_time / 60)}:${(subject.spent_time % 60).toString().padStart(2, '0')}`
//     //             }));

//     //             console.log('📚 Subject-wise Analysis:', subjectAnalysis);
//     //             setSubjectWiseAnalysis(subjectAnalysis);

//     //             // ✅ Section Analysis
//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: marks.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: attempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: incorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);

//     //             // ✅ Set testData
//     //             setTestData({
//     //                 test_detail: {
//     //                     title: testInfo.title || 'Test Analysis',
//     //                     time: testInfo.time || 90,
//     //                     total_no_of_question: totalQuestions,
//     //                     total_marks: totalMarks,
//     //                     negative_mark: parseFloat(testInfo.negative_mark || 0)
//     //                 },
//     //                 my_detail: results,
//     //                 leaderboard: []
//     //             });

//     //             setLoading(false);

//     //             // ✅ Fetch leaderboard and update rank
//     //             const attendId = state.attend_id || state.testInfo?.attend_id;
//     //             const testIdForAPI = state.testId || testInfo.test_id || testInfo.id;

//     //             if (attendId && testIdForAPI) {
//     //                 console.log('🏆 Fetching leaderboard with:', { test_id: testIdForAPI, attend_id: attendId });

//     //                 try {
//     //                     const apiRes = await dispatch(fetchUserTestSeriesRankSlice({
//     //                         test_id: testIdForAPI,
//     //                         attend_id: attendId
//     //                     })).unwrap();

//     //                     console.log('✅ Leaderboard API Response:', apiRes);

//     //                     if (apiRes.status_code === 200 && apiRes.data) {
//     //                         // ✅ Update testData with leaderboard
//     //                         setTestData(prev => ({
//     //                             ...prev,
//     //                             leaderboard: apiRes.data.leaderboard || [],
//     //                             my_detail: apiRes.data.my_detail || prev.my_detail
//     //                         }));

//     //                         // ✅ Extract and update rank from API response
//     //                         const myDetail = apiRes.data.my_detail;
//     //                         if (myDetail) {
//     //                             setPerformance(prev => ({
//     //                                 ...prev,
//     //                                 rank: {
//     //                                     value: myDetail.my_rank || 0,
//     //                                     total: myDetail.total_join_user || 0
//     //                                 },
//     //                                 percentile: (myDetail.percentile || 0) + "%"
//     //                             }));

//     //                             console.log("✅ Rank updated from leaderboard:", {
//     //                                 rank: myDetail.my_rank,
//     //                                 total: myDetail.total_join_user
//     //                             });
//     //                         }

//     //                         console.log('🏆 Leaderboard loaded:', apiRes.data.leaderboard?.length || 0, 'entries');
//     //                     }
//     //                 } catch (leaderboardError) {
//     //                     console.warn('⚠️ Leaderboard not available:', leaderboardError);
//     //                 }
//     //             }

//     //             return;
//     //         }

//     //         // ✅ PRIORITY 2: Preloaded data from AttemptedTestPage
//     //         if (state.isDataPreloaded && state.preloadedData) {
//     //             console.log('✅ Using preloaded data:', state.preloadedData);

//     //             const res = { status_code: 200, data: state.preloadedData };

//     //             if (res.status_code == 200) {
//     //                 const test = res.data.test_detail;
//     //                 const my = res.data.my_detail;
//     //                 setTestData(res.data);

//     //                 setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //                 const totalAttempted = my?.total_attend_question || 0;
//     //                 const totalQuestions = test?.total_no_of_question || 1;
//     //                 const totalMarks = parseFloat(test?.total_marks || 0);
//     //                 const negativeMark = parseFloat(test?.negative_mark || 0);
//     //                 const correct = parseInt(my?.correct || 0);
//     //                 const inCorrect = parseInt(my?.in_correct || 0);

//     //                 const markPer_ques = totalMarks / totalQuestions;
//     //                 const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //                 const accuracy = correct && totalAttempted
//     //                     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                     : "0%";

//     //                 setPerformance({
//     //                     rank: {
//     //                         value: my?.my_rank || 0,
//     //                         total: my?.total_join_user || 0
//     //                     },
//     //                     score: {
//     //                         value: calculatedScore.toFixed(2),
//     //                         max: totalMarks
//     //                     },
//     //                     attempted: {
//     //                         value: totalAttempted,
//     //                         max: totalQuestions
//     //                     },
//     //                     accuracy,
//     //                     percentile: (my?.percentile || 0) + "%"
//     //                 });

//     //                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //                 const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //                 setSections([
//     //                     {
//     //                         name: "Full Test",
//     //                         score: calculatedScore.toFixed(2),
//     //                         maxScore: totalMarks,
//     //                         attempted: totalAttempted,
//     //                         totalQuestions: totalQuestions,
//     //                         correct: correct,
//     //                         incorrect: inCorrect,
//     //                         accuracy,
//     //                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                     }
//     //                 ]);
//     //             }

//     //             setLoading(false);
//     //             return;
//     //         }

//     //         // ✅ PRIORITY 3: API call (for SSC exams or when attend_id is available)
//     //         let testId = state?.testInfo?.test_id ||
//     //             state?.testInfo?.id ||
//     //             state?.testData?.my_detail?.test_id ||
//     //             state?.actualTestId;

//     //         let attendId = state?.attend_id ||
//     //             state?.testInfo?.attend_id ||
//     //             state?.testData?.my_detail?.attend_id;

//     //         if (!attendId) {
//     //             const storedTest = secureGetTestData('currentTest');
//     //             attendId = storedTest?.attend_id;
//     //         }

//     //         console.log('📡 Making API call with:', {
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         });

//     //         if (!testId || !attendId) {
//     //             console.error('❌ Missing test_id or attend_id');
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         const res = await dispatch(fetchUserTestSeriesRankSlice({
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         })).unwrap();

//     //         console.log('✅ API Response received:', res);

//     //         if (res.status_code == 200) {
//     //             const test = res.data.test_detail;
//     //             const my = res.data.my_detail;
//     //             setTestData(res.data);

//     //             setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //             const totalAttempted = my?.total_attend_question || 0;
//     //             const totalQuestions = test?.total_no_of_question || 1;
//     //             const totalMarks = parseFloat(test?.total_marks || 0);
//     //             const negativeMark = parseFloat(test?.negative_mark || 0);
//     //             const correct = parseInt(my?.correct || 0);
//     //             const inCorrect = parseInt(my?.in_correct || 0);

//     //             const markPer_ques = totalMarks / totalQuestions;
//     //             const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //             const accuracy = correct && totalAttempted
//     //                 ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: my?.my_rank || 0,
//     //                     total: my?.total_join_user || 0
//     //                 },
//     //                 score: {
//     //                     value: calculatedScore.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: (my?.percentile || 0) + "%"
//     //             });

//     //             const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //             const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: calculatedScore.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);
//     //         }

//     //         setLoading(false);

//     //     } catch (error) {
//     //         console.error("❌ Error in fetchUserResult:", error);
//     //         setLoading(false);
//     //     }
//     // }, [state, dispatch]);

//     // const fetchUserResult = useCallback(async () => {
//     //     if (!state) {
//     //         console.error("No state provided to Analysis screen");
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         setLoading(true);

//     //         // ✅ PRIORITY 1: Direct test results from RRB test submission
//     //         if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
//     //             console.log("✅ Using direct test results from Screen5 submission", state.testResults);

//     //             const results = state.testResults;
//     //             const questions = state.allQuestions;
//     //             const testInfo = state.testInfo || {};
//     //             const testDetail = state.testDetail?.[0] || {};

//     //             // Calculate overall performance metrics
//     //             const totalQuestions = questions.length;
//     //             const attempted = results.total_attend_question || 0;
//     //             const correct = results.correct || 0;
//     //             const incorrect = results.in_correct || 0;
//     //             const unattempted = totalQuestions - attempted;
//     //             const marks = parseFloat(results.marks || 0);
//     //             const timeSpent = results.time || 0;
//     //             const totalMarks = parseFloat(testDetail.marks || testInfo.total_marks || 100);

//     //             console.log("📊 Performance Metrics:", {
//     //                 totalQuestions,
//     //                 attempted,
//     //                 correct,
//     //                 incorrect,
//     //                 unattempted,
//     //                 marks,
//     //                 timeSpent,
//     //                 totalMarks
//     //             });

//     //             const accuracy = attempted > 0
//     //                 ? ((correct / attempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: 0,
//     //                     total: 0
//     //                 },
//     //                 score: {
//     //                     value: marks.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: attempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: "0%"
//     //             });

//     //             // ✅ Calculate subject-wise analysis
//     //             const subjectMap = {};

//     //             questions.forEach(q => {
//     //                 const subject = q.section || 'General';
//     //                 if (!subjectMap[subject]) {
//     //                     subjectMap[subject] = {
//     //                         subject_name: subject,
//     //                         total_assign_question: 0,
//     //                         total_question_attempted: 0,
//     //                         correct_count: 0,
//     //                         incorrect_count: 0,
//     //                         spent_time: 0
//     //                     };
//     //                 }

//     //                 subjectMap[subject].total_assign_question++;

//     //                 if (results.attend_question?.includes(q.id)) {
//     //                     subjectMap[subject].total_question_attempted++;

//     //                     const attendedQ = results.all_attend_question?.find(aq => aq.question_id === q.id);
//     //                     if (attendedQ) {
//     //                         if (attendedQ.user_selected_ans?.toLowerCase() === attendedQ.right_ans?.toLowerCase()) {
//     //                             subjectMap[subject].correct_count++;
//     //                         } else {
//     //                             subjectMap[subject].incorrect_count++;
//     //                         }
//     //                     }
//     //                 }

//     //                 const timeData = results.spent_time?.find(t => t.questionId === q.id);
//     //                 if (timeData) {
//     //                     subjectMap[subject].spent_time += timeData.time || 0;
//     //                 }
//     //             });

//     //             const subjectAnalysis = Object.values(subjectMap).map(subject => ({
//     //                 ...subject,
//     //                 spent_time: `${Math.floor(subject.spent_time / 60)}:${(subject.spent_time % 60).toString().padStart(2, '0')}`
//     //             }));

//     //             console.log('📚 Subject-wise Analysis:', subjectAnalysis);
//     //             setSubjectWiseAnalysis(subjectAnalysis);

//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: marks.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: attempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: incorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);

//     //             setTestData({
//     //                 test_detail: {
//     //                     title: testInfo.title || 'Test Analysis',
//     //                     time: testInfo.time || 90,
//     //                     total_no_of_question: totalQuestions,
//     //                     total_marks: totalMarks,
//     //                     negative_mark: parseFloat(testInfo.negative_mark || 0)
//     //                 },
//     //                 my_detail: results,
//     //                 leaderboard: []
//     //             });

//     //             setLoading(false);

//     //             // Fetch leaderboard
//     //             const attendId = state.attend_id || state.testInfo?.attend_id;
//     //             const testIdForAPI = state.testId || testInfo.test_id || testInfo.id;

//     //             if (attendId && testIdForAPI) {
//     //                 try {
//     //                     const apiRes = await dispatch(fetchUserTestSeriesRankSlice({
//     //                         test_id: testIdForAPI,
//     //                         attend_id: attendId
//     //                     })).unwrap();

//     //                     if (apiRes.status_code === 200 && apiRes.data) {
//     //                         setTestData(prev => ({
//     //                             ...prev,
//     //                             leaderboard: apiRes.data.leaderboard || [],
//     //                             my_detail: apiRes.data.my_detail || prev.my_detail
//     //                         }));

//     //                         const myDetail = apiRes.data.my_detail;
//     //                         if (myDetail) {
//     //                             setPerformance(prev => ({
//     //                                 ...prev,
//     //                                 rank: {
//     //                                     value: myDetail.my_rank || 0,
//     //                                     total: myDetail.total_join_user || 0
//     //                                 },
//     //                                 percentile: (myDetail.percentile || 0) + "%"
//     //                             }));
//     //                         }
//     //                     }
//     //                 } catch (leaderboardError) {
//     //                     console.warn('⚠️ Leaderboard not available:', leaderboardError);
//     //                 }
//     //             }

//     //             return;
//     //         }

//     //         // ✅ PRIORITY 2: Preloaded data from AttemptedTestPage
//     //         if (state.isDataPreloaded && state.preloadedData) {
//     //             console.log('✅ Using preloaded data:', state.preloadedData);

//     //             const res = { status_code: 200, data: state.preloadedData };

//     //             if (res.status_code == 200) {
//     //                 const test = res.data.test_detail;
//     //                 const my = res.data.my_detail;
//     //                 setTestData(res.data);

//     //                 // ✅ Use subject_wise_analysis from API
//     //                 console.log('📚 Subject-wise Analysis from API:', res?.data?.subject_wise_analysis);
//     //                 setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //                 const totalAttempted = my?.total_attend_question || 0;
//     //                 const totalQuestions = test?.total_no_of_question || 1;
//     //                 const totalMarks = parseFloat(test?.total_marks || 0);
//     //                 const negativeMark = parseFloat(test?.negative_mark || 0);
//     //                 const correct = parseInt(my?.correct || 0);
//     //                 const inCorrect = parseInt(my?.in_correct || 0);

//     //                 const markPer_ques = totalMarks / totalQuestions;
//     //                 const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //                 const accuracy = correct && totalAttempted
//     //                     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                     : "0%";

//     //                 setPerformance({
//     //                     rank: {
//     //                         value: my?.my_rank || 0,
//     //                         total: my?.total_join_user || 0
//     //                     },
//     //                     score: {
//     //                         value: calculatedScore.toFixed(2),
//     //                         max: totalMarks
//     //                     },
//     //                     attempted: {
//     //                         value: totalAttempted,
//     //                         max: totalQuestions
//     //                     },
//     //                     accuracy,
//     //                     percentile: (my?.percentile || 0) + "%"
//     //                 });

//     //                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //                 const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //                 setSections([
//     //                     {
//     //                         name: "Full Test",
//     //                         score: calculatedScore.toFixed(2),
//     //                         maxScore: totalMarks,
//     //                         attempted: totalAttempted,
//     //                         totalQuestions: totalQuestions,
//     //                         correct: correct,
//     //                         incorrect: inCorrect,
//     //                         accuracy,
//     //                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                     }
//     //                 ]);
//     //             }

//     //             setLoading(false);
//     //             return;
//     //         }

//     //         // ✅ PRIORITY 3: API call (for SSC exams or when attend_id is available)
//     //         let testId = state?.testInfo?.test_id ||
//     //             state?.testInfo?.id ||
//     //             state?.testData?.my_detail?.test_id ||
//     //             state?.actualTestId;

//     //         let attendId = state?.attend_id ||
//     //             state?.testInfo?.attend_id ||
//     //             state?.testData?.my_detail?.attend_id;

//     //         if (!attendId) {
//     //             const storedTest = secureGetTestData('currentTest');
//     //             attendId = storedTest?.attend_id;
//     //         }

//     //         console.log('📡 Making API call with:', {
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         });

//     //         if (!testId || !attendId) {
//     //             console.error('❌ Missing test_id or attend_id');
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         const res = await dispatch(fetchUserTestSeriesRankSlice({
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         })).unwrap();

//     //         console.log('✅ API Response received:', res);

//     //         if (res.status_code == 200) {
//     //             const test = res.data.test_detail;
//     //             const my = res.data.my_detail;
//     //             setTestData(res.data);

//     //             // ✅ Use subject_wise_analysis from API
//     //             console.log('📚 Subject-wise Analysis from API:', res?.data?.subject_wise_analysis);
//     //             setSubjectWiseAnalysis(res?.data?.subject_wise_analysis || []);

//     //             const totalAttempted = my?.total_attend_question || 0;
//     //             const totalQuestions = test?.total_no_of_question || 1;
//     //             const totalMarks = parseFloat(test?.total_marks || 0);
//     //             const negativeMark = parseFloat(test?.negative_mark || 0);
//     //             const correct = parseInt(my?.correct || 0);
//     //             const inCorrect = parseInt(my?.in_correct || 0);

//     //             const markPer_ques = totalMarks / totalQuestions;
//     //             const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //             const accuracy = correct && totalAttempted
//     //                 ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: my?.my_rank || 0,
//     //                     total: my?.total_join_user || 0
//     //                 },
//     //                 score: {
//     //                     value: calculatedScore.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: (my?.percentile || 0) + "%"
//     //             });

//     //             const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //             const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: calculatedScore.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);
//     //         }

//     //         setLoading(false);

//     //     } catch (error) {
//     //         console.error("❌ Error in fetchUserResult:", error);
//     //         setLoading(false);
//     //     }
//     // }, [state, dispatch]);

//     // const fetchUserResult = useCallback(async () => {
//     //     if (!state) {
//     //         console.error("No state provided to Analysis screen");
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         setLoading(true);

//     //         // ✅ PRIORITY 1: Direct test results from RRB test submission
//     //         if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
//     //             console.log("✅ PRIORITY 1: Using direct test results from Screen5 submission");
//     //             console.log("📊 Test Results:", state.testResults);
//     //             console.log("📝 All Questions:", state.allQuestions);

//     //             const results = state.testResults;
//     //             const questions = state.allQuestions;
//     //             const testInfo = state.testInfo || {};
//     //             const testDetail = state.testDetail?.[0] || {};

//     //             // Calculate overall performance metrics
//     //             const totalQuestions = questions.length;
//     //             const attempted = results.total_attend_question || 0;
//     //             const correct = results.correct || 0;
//     //             const incorrect = results.in_correct || 0;
//     //             const marks = parseFloat(results.marks || 0);
//     //             const timeSpent = results.time || 0;
//     //             const totalMarks = parseFloat(testDetail.marks || testInfo.total_marks || 100);

//     //             const accuracy = attempted > 0
//     //                 ? ((correct / attempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: 0,
//     //                     total: 0
//     //                 },
//     //                 score: {
//     //                     value: marks.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: attempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: "0%"
//     //             });

//     //             // ✅ USE SUBJECT-WISE ANALYSIS FROM STATE (if available)
//     //             if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
//     //                 console.log('📚 PRIORITY 1 - Using Subject-wise Analysis from STATE:', state.subjectWiseAnalysis);
//     //                 // 🔹 ADD THESE LINES:
//     //                 const qualifying = state.subjectWiseAnalysis.filter(
//     //                     (s) => s.is_qualified_section
//     //                 );
//     //                 setQualifyingSections(qualifying);
//     //                 setIsSectionalTest(!!state.isSectionalTest);
//     //             } else {
//     //                 // Fallback: Calculate from questions (for Railway tests)
//     //                 const subjectMap = {};

//     //                 questions.forEach(q => {
//     //                     const subject = q.section || 'General';
//     //                     if (!subjectMap[subject]) {
//     //                         subjectMap[subject] = {
//     //                             subject_name: subject,
//     //                             total_assign_question: 0,
//     //                             total_question_attempted: 0,
//     //                             correct_count: 0,
//     //                             incorrect_count: 0,
//     //                             spent_time: 0
//     //                         };
//     //                     }

//     //                     subjectMap[subject].total_assign_question++;

//     //                     if (results.attend_question?.includes(q.id)) {
//     //                         subjectMap[subject].total_question_attempted++;

//     //                         const attendedQ = results.all_attend_question?.find(aq => aq.question_id === q.id);
//     //                         if (attendedQ) {
//     //                             if (attendedQ.user_selected_ans?.toLowerCase() === attendedQ.right_ans?.toLowerCase()) {
//     //                                 subjectMap[subject].correct_count++;
//     //                             } else {
//     //                                 subjectMap[subject].incorrect_count++;
//     //                             }
//     //                         }
//     //                     }

//     //                     const timeData = results.spent_time?.find(t => t.questionId === q.id);
//     //                     if (timeData) {
//     //                         subjectMap[subject].spent_time += timeData.time || 0;
//     //                     }
//     //                 });

//     //                 // const subjectAnalysis = Object.values(subjectMap).map(subject => ({
//     //                 //     ...subject,
//     //                 //     spent_time: `${Math.floor(subject.spent_time / 60)}:${(subject.spent_time % 60).toString().padStart(2, '0')}`
//     //                 // }));
//     //                 const subjectAnalysis = Object.values(subjectMap).map(subject => {
//     //                     const detailMeta = (state.testDetail || []).find(
//     //                         d => d.subject_name === subject.subject_name
//     //                     );

//     //                     const marksPerQ =
//     //                         detailMeta && detailMeta.no_of_question
//     //                             ? detailMeta.marks / detailMeta.no_of_question
//     //                             : 0;

//     //                     const obtainedMarks = subject.correct_count * marksPerQ;

//     //                     const isQualifying =
//     //                         detailMeta && Number(detailMeta.is_qualified_section) === 1;

//     //                     const minPassing = isQualifying
//     //                         ? parseFloat(detailMeta.min_passing_marks || 0)
//     //                         : null;

//     //                     const isPassed =
//     //                         isQualifying && obtainedMarks >= minPassing;

//     //                     return {
//     //                         ...subject,
//     //                         spent_time: `${Math.floor(subject.spent_time / 60)}:${(
//     //                             subject.spent_time % 60
//     //                         )
//     //                             .toString()
//     //                             .padStart(2, '0')}`,
//     //                         is_qualified_section: isQualifying,
//     //                         min_passing_marks: minPassing,
//     //                         obtained_marks: Number(obtainedMarks.toFixed(2)),
//     //                         is_passed: isPassed,
//     //                     };
//     //                 });

//     //                 console.log('📚 PRIORITY 1 - Subject-wise Analysis CALCULATED:', subjectAnalysis);
//     //                 setSubjectWiseAnalysis(subjectAnalysis);
//     //                 setQualifyingSections(subjectAnalysis.filter(s => s.is_qualified_section));
//     //                 setIsSectionalTest(true); // for mains tests
//     //             }


//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: marks.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: attempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: incorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);

//     //             setTestData({
//     //                 test_detail: {
//     //                     title: testInfo.title || 'Test Analysis',
//     //                     time: testInfo.time || 90,
//     //                     total_no_of_question: totalQuestions,
//     //                     total_marks: totalMarks,
//     //                     negative_mark: parseFloat(testInfo.negative_mark || 0)
//     //                 },
//     //                 my_detail: results,
//     //                 leaderboard: []
//     //             });

//     //             setLoading(false);

//     //             // Fetch leaderboard
//     //             const attendId = state.attend_id || state.testInfo?.attend_id;
//     //             const testIdForAPI = state.testId || testInfo.test_id || testInfo.id;

//     //             if (attendId && testIdForAPI) {
//     //                 try {
//     //                     const apiRes = await dispatch(fetchUserTestSeriesRankSlice({
//     //                         test_id: testIdForAPI,
//     //                         attend_id: attendId
//     //                     })).unwrap();

//     //                     if (apiRes.status_code === 200 && apiRes.data) {
//     //                         setTestData(prev => ({
//     //                             ...prev,
//     //                             leaderboard: apiRes.data.leaderboard || [],
//     //                             my_detail: apiRes.data.my_detail || prev.my_detail
//     //                         }));

//     //                         const myDetail = apiRes.data.my_detail;
//     //                         if (myDetail) {
//     //                             setPerformance(prev => ({
//     //                                 ...prev,
//     //                                 rank: {
//     //                                     value: myDetail.my_rank || 0,
//     //                                     total: myDetail.total_join_user || 0
//     //                                 },
//     //                                 percentile: (myDetail.percentile || 0) + "%"
//     //                             }));
//     //                         }
//     //                     }
//     //                 } catch (leaderboardError) {
//     //                     console.warn('⚠️ Leaderboard not available:', leaderboardError);
//     //                 }
//     //             }

//     //             return;
//     //         }

//     //         // ✅ PRIORITY 2: Preloaded data from AttemptedTestPage
//     //         if (state.isDataPreloaded && state.preloadedData) {
//     //             console.log('✅ PRIORITY 2: Using preloaded data');
//     //             console.log('📦 Preloaded Data:', state.preloadedData);

//     //             const res = { status_code: 200, data: state.preloadedData };

//     //             if (res.status_code == 200) {
//     //                 const test = res.data.test_detail;
//     //                 const my = res.data.my_detail;
//     //                 setTestData(res.data);

//     //                 // ✅ CRITICAL: Use subject_wise_analysis from API
//     //                 const apiSubjectAnalysis = res?.data?.subject_wise_analysis || [];
//     //                 console.log('📚 PRIORITY 2 - Subject-wise Analysis from API:', apiSubjectAnalysis);
//     //                 console.log('📚 PRIORITY 2 - Subject count:', apiSubjectAnalysis.length);
//     //                 setSubjectWiseAnalysis(apiSubjectAnalysis);

//     //                 const totalAttempted = my?.total_attend_question || 0;
//     //                 const totalQuestions = test?.total_no_of_question || 1;
//     //                 const totalMarks = parseFloat(test?.total_marks || 0);
//     //                 const negativeMark = parseFloat(test?.negative_mark || 0);
//     //                 const correct = parseInt(my?.correct || 0);
//     //                 const inCorrect = parseInt(my?.in_correct || 0);

//     //                 const markPer_ques = totalMarks / totalQuestions;
//     //                 const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //                 const accuracy = correct && totalAttempted
//     //                     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                     : "0%";

//     //                 setPerformance({
//     //                     rank: {
//     //                         value: my?.my_rank || 0,
//     //                         total: my?.total_join_user || 0
//     //                     },
//     //                     score: {
//     //                         value: calculatedScore.toFixed(2),
//     //                         max: totalMarks
//     //                     },
//     //                     attempted: {
//     //                         value: totalAttempted,
//     //                         max: totalQuestions
//     //                     },
//     //                     accuracy,
//     //                     percentile: (my?.percentile || 0) + "%"
//     //                 });

//     //                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //                 const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //                 setSections([
//     //                     {
//     //                         name: "Full Test",
//     //                         score: calculatedScore.toFixed(2),
//     //                         maxScore: totalMarks,
//     //                         attempted: totalAttempted,
//     //                         totalQuestions: totalQuestions,
//     //                         correct: correct,
//     //                         incorrect: inCorrect,
//     //                         accuracy,
//     //                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                     }
//     //                 ]);
//     //             }

//     //             setLoading(false);
//     //             return;
//     //         }

//     //         // ✅ PRIORITY 3: API call (for SSC exams or when attend_id is available)
//     //         console.log('✅ PRIORITY 3: Making API call');

//     //         let testId = state?.testInfo?.test_id ||
//     //             state?.testInfo?.id ||
//     //             state?.testData?.my_detail?.test_id ||
//     //             state?.actualTestId;

//     //         let attendId = state?.attend_id ||
//     //             state?.testInfo?.attend_id ||
//     //             state?.testData?.my_detail?.attend_id;

//     //         if (!attendId) {
//     //             const storedTest = secureGetTestData('currentTest');
//     //             attendId = storedTest?.attend_id;
//     //         }

//     //         console.log('📡 API Call Parameters:', {
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         });

//     //         if (!testId || !attendId) {
//     //             console.error('❌ Missing test_id or attend_id');
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         const res = await dispatch(fetchUserTestSeriesRankSlice({
//     //             test_id: testId,
//     //             attend_id: attendId
//     //         })).unwrap();

//     //         console.log('✅ PRIORITY 3 - API Response received:', res);

//     //         if (res.status_code == 200) {
//     //             const test = res.data.test_detail;
//     //             const my = res.data.my_detail;
//     //             setTestData(res.data);

//     //             // ✅ CRITICAL: Use subject_wise_analysis from API
//     //             const apiSubjectAnalysis = res?.data?.subject_wise_analysis || [];
//     //             console.log('📚 PRIORITY 3 - Subject-wise Analysis from API:', apiSubjectAnalysis);
//     //             console.log('📚 PRIORITY 3 - Subject count:', apiSubjectAnalysis.length);
//     //             setSubjectWiseAnalysis(apiSubjectAnalysis);

//     //             const totalAttempted = my?.total_attend_question || 0;
//     //             const totalQuestions = test?.total_no_of_question || 1;
//     //             const totalMarks = parseFloat(test?.total_marks || 0);
//     //             const negativeMark = parseFloat(test?.negative_mark || 0);
//     //             const correct = parseInt(my?.correct || 0);
//     //             const inCorrect = parseInt(my?.in_correct || 0);

//     //             const markPer_ques = totalMarks / totalQuestions;
//     //             const calculatedScore = (correct * markPer_ques) - (inCorrect * negativeMark);

//     //             const accuracy = correct && totalAttempted
//     //                 ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     //                 : "0%";

//     //             setPerformance({
//     //                 rank: {
//     //                     value: my?.my_rank || 0,
//     //                     total: my?.total_join_user || 0
//     //                 },
//     //                 score: {
//     //                     value: calculatedScore.toFixed(2),
//     //                     max: totalMarks
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions
//     //                 },
//     //                 accuracy,
//     //                 percentile: (my?.percentile || 0) + "%"
//     //             });

//     //             const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //             const totalTimeSpent = parsedSpent.reduce((acc, item) => acc + (item?.time || 0), 0);

//     //             setSections([
//     //                 {
//     //                     name: "Full Test",
//     //                     score: calculatedScore.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions: totalQuestions,
//     //                     correct: correct,
//     //                     incorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60).toString().padStart(2, '0')}`
//     //                 }
//     //             ]);
//     //         }

//     //         setLoading(false);

//     //     } catch (error) {
//     //         console.error("❌ Error in fetchUserResult:", error);
//     //         setLoading(false);
//     //     }
//     // }, [state, dispatch]);


//     // const fetchUserResult = useCallback(async () => {
//     //     if (!state) {
//     //         console.error('No state provided to Analysis screen');
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     try {
//     //         setLoading(true);

//     //         // =============== PRIORITY 1: Direct test results from submission (Railway) =============== //
//     //         if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
//     //             console.log('✅ PRIORITY 1: Using direct test results from Screen5 submission');

//     //             const results = state.testResults;
//     //             const questions = state.allQuestions;
//     //             const testInfo = state.testInfo || {};
//     //             const testDetail = state.testDetail?.[0] || {};

//     //             const totalQuestions = questions.length;
//     //             const attempted = results.total_attend_question || 0;
//     //             const correct = results.correct || 0;
//     //             const incorrect = results.in_correct || 0;
//     //             const marks = parseFloat(results.marks || 0);
//     //             const timeSpent = results.time || 0;
//     //             const totalMarks = parseFloat(testDetail.marks || testInfo.total_marks || 100);

//     //             const accuracy =
//     //                 attempted > 0 ? ((correct / attempted) * 100).toFixed(2) + '%' : '0%';

//     //             setPerformance({
//     //                 rank: { value: 0, total: 0 },
//     //                 score: { value: marks.toFixed(2), max: totalMarks },
//     //                 attempted: { value: attempted, max: totalQuestions },
//     //                 accuracy,
//     //                 percentile: '0%',
//     //             });

//     //             // subject-wise from state (if any)
//     //             if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
//     //                 const qualifying = state.subjectWiseAnalysis.filter(
//     //                     s => s.is_qualified_section
//     //                 );
//     //                 setSubjectWiseAnalysis(state.subjectWiseAnalysis);
//     //                 setQualifyingSections(qualifying);
//     //                 setIsSectionalTest(!!state.isSectionalTest);
//     //             } else {
//     //                 // fallback calculate subject-wise
//     //                 const subjectMap = {};

//     //                 questions.forEach(q => {
//     //                     const subject = q.section || 'General';
//     //                     if (!subjectMap[subject]) {
//     //                         subjectMap[subject] = {
//     //                             subject_name: subject,
//     //                             total_assign_question: 0,
//     //                             total_question_attempted: 0,
//     //                             correct_count: 0,
//     //                             incorrect_count: 0,
//     //                             spent_time: 0,
//     //                         };
//     //                     }

//     //                     subjectMap[subject].total_assign_question++;

//     //                     if (results.attend_question?.includes(q.id)) {
//     //                         subjectMap[subject].total_question_attempted++;

//     //                         const attendedQ = results.all_attend_question?.find(
//     //                             aq => aq.question_id === q.id
//     //                         );
//     //                         if (attendedQ) {
//     //                             if (
//     //                                 attendedQ.user_selected_ans?.toLowerCase() ===
//     //                                 attendedQ.right_ans?.toLowerCase()
//     //                             ) {
//     //                                 subjectMap[subject].correct_count++;
//     //                             } else {
//     //                                 subjectMap[subject].incorrect_count++;
//     //                             }
//     //                         }
//     //                     }

//     //                     const timeData = results.spent_time?.find(
//     //                         t => t.questionId === q.id
//     //                     );
//     //                     if (timeData) {
//     //                         subjectMap[subject].spent_time += timeData.time || 0;
//     //                     }
//     //                 });

//     //                 const subjectAnalysis = Object.values(subjectMap).map(subject => {
//     //                     const detailMeta = (state.testDetail || []).find(
//     //                         d => d.subject_name === subject.subject_name
//     //                     );

//     //                     const marksPerQ =
//     //                         detailMeta && detailMeta.no_of_question
//     //                             ? detailMeta.marks / detailMeta.no_of_question
//     //                             : 0;

//     //                     const obtainedMarks = subject.correct_count * marksPerQ;

//     //                     const isQualifying =
//     //                         detailMeta && Number(detailMeta.is_qualified_section) === 1;

//     //                     const minPassing = isQualifying
//     //                         ? parseFloat(detailMeta.min_passing_marks || 0)
//     //                         : null;

//     //                     const isPassed = isQualifying && obtainedMarks >= minPassing;

//     //                     return {
//     //                         ...subject,
//     //                         spent_time: `${Math.floor(subject.spent_time / 60)}:${(
//     //                             subject.spent_time % 60
//     //                         )
//     //                             .toString()
//     //                             .padStart(2, '0')}`,
//     //                         is_qualified_section: isQualifying,
//     //                         min_passing_marks: minPassing,
//     //                         obtained_marks: Number(obtainedMarks.toFixed(2)),
//     //                         is_passed: isPassed,
//     //                     };
//     //                 });

//     //                 setSubjectWiseAnalysis(subjectAnalysis);
//     //                 setQualifyingSections(
//     //                     subjectAnalysis.filter(s => s.is_qualified_section)
//     //                 );
//     //                 setIsSectionalTest(true);
//     //             }

//     //             setSections([
//     //                 {
//     //                     name: 'Full Test',
//     //                     score: marks.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted,
//     //                     totalQuestions,
//     //                     correct,
//     //                     incorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60)
//     //                         .toString()
//     //                         .padStart(2, '0')}`,
//     //                 },
//     //             ]);

//     //             setTestData({
//     //                 test_detail: {
//     //                     title: testInfo.title || 'Test Analysis',
//     //                     time: testInfo.time || 90,
//     //                     total_no_of_question: totalQuestions,
//     //                     total_marks: totalMarks,
//     //                     negative_mark: parseFloat(testInfo.negative_mark || 0),
//     //                 },
//     //                 my_detail: results,
//     //                 leaderboard: [],
//     //             });

//     //             // optional leaderboard
//     //             const attendIdLb = state.attend_id || state.testInfo?.attend_id;
//     //             const testIdLb = state.testId || testInfo.test_id || testInfo.id;

//     //             if (attendIdLb && testIdLb) {
//     //                 try {
//     //                     const apiRes = await dispatch(
//     //                         fetchUserTestSeriesRankSlice({
//     //                             test_id: testIdLb,
//     //                             attend_id: attendIdLb,
//     //                         })
//     //                     ).unwrap();

//     //                     if (apiRes.status_code === 200 && apiRes.data) {
//     //                         setTestData(prev => ({
//     //                             ...prev,
//     //                             leaderboard: apiRes.data.leaderboard || [],
//     //                             my_detail: apiRes.data.my_detail || prev.my_detail,
//     //                         }));

//     //                         const myDetail = apiRes.data.my_detail;
//     //                         if (myDetail) {
//     //                             setPerformance(prev => ({
//     //                                 ...prev,
//     //                                 rank: {
//     //                                     value: myDetail.my_rank || 0,
//     //                                     total: myDetail.total_join_user || 0,
//     //                                 },
//     //                                 percentile: (myDetail.percentile || 0) + '%',
//     //                             }));
//     //                         }
//     //                     }
//     //                 } catch (leaderboardError) {
//     //                     console.warn('⚠️ Leaderboard not available:', leaderboardError);
//     //                 }
//     //             }

//     //             setLoading(false);
//     //             return;
//     //         }

//     //         // =============== PRIORITY 2: Preloaded data (from AttemptedTestPage / package) ===============
//     //         if (state.isDataPreloaded && state.preloadedData) {
//     //             console.log('✅ PRIORITY 2: Using preloaded data');

//     //             const res = { status_code: 200, data: state.preloadedData };

//     //             if (res.status_code === 200) {
//     //                 const test = res.data.test_detail;
//     //                 const my = res.data.my_detail;
//     //                 setTestData(res.data);

//     //                 const apiSubjectAnalysis = res.data.subject_wise_analysis || [];
//     //                 setSubjectWiseAnalysis(apiSubjectAnalysis);

//     //                 const totalAttempted = my?.total_attend_question || 0;
//     //                 const totalQuestions = test?.total_no_of_question || 1;
//     //                 const totalMarks = parseFloat(test?.total_marks || 0);
//     //                 const negativeMark = parseFloat(test?.negative_mark || 0);
//     //                 const correct = parseInt(my?.correct || 0, 10);
//     //                 const inCorrect = parseInt(my?.in_correct || 0, 10);

//     //                 const markPerQ = totalMarks / totalQuestions || 0;
//     //                 const calculatedScore = correct * markPerQ - inCorrect * negativeMark;

//     //                 const accuracy =
//     //                     correct && totalAttempted
//     //                         ? ((correct / totalAttempted) * 100).toFixed(2) + '%'
//     //                         : '0%';

//     //                 setPerformance({
//     //                     rank: {
//     //                         value: my?.my_rank || 0,
//     //                         total: my?.total_join_user || 0,
//     //                     },
//     //                     score: {
//     //                         value: calculatedScore.toFixed(2),
//     //                         max: totalMarks,
//     //                     },
//     //                     attempted: {
//     //                         value: totalAttempted,
//     //                         max: totalQuestions,
//     //                     },
//     //                     accuracy,
//     //                     percentile: (my?.percentile || 0) + '%',
//     //                 });

//     //                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //                 const totalTimeSpent = parsedSpent.reduce(
//     //                     (acc, item) => acc + (item?.time || 0),
//     //                     0
//     //                 );

//     //                 setSections([
//     //                     {
//     //                         name: 'Full Test',
//     //                         score: calculatedScore.toFixed(2),
//     //                         maxScore: totalMarks,
//     //                         attempted: totalAttempted,
//     //                         totalQuestions,
//     //                         correct,
//     //                         incorrect: inCorrect,
//     //                         accuracy,
//     //                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
//     //                             .toString()
//     //                             .padStart(2, '0')}`,
//     //                     },
//     //                 ]);
//     //             }

//     //             setLoading(false);
//     //             return;
//     //         }

//     //         // =============== PRIORITY 3: API call (SSC & generic) =============== //
//     //         console.log('✅ PRIORITY 3: Making API call');

//     //         const testId =
//     //             state?.testInfo?.test_id ||
//     //             state?.testInfo?.id ||
//     //             state?.testData?.my_detail?.test_id ||
//     //             state?.actualTestId;

//     //         // use selectedAttemptId first, then fall back
//     //         let attendId =
//     //             selectedAttemptId ||
//     //             state?.attend_id ||
//     //             state?.testInfo?.attend_id ||
//     //             state?.testData?.my_detail?.attend_id;

//     //         if (!attendId) {
//     //             const storedTest = secureGetTestData('currentTest');
//     //             attendId = storedTest?.attend_id;
//     //         }

//     //         console.log('📡 API Call Parameters:', { test_id: testId, attend_id: attendId });

//     //         if (!testId || !attendId) {
//     //             console.error('❌ Missing test_id or attend_id');
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         const res = await dispatch(
//     //             fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attendId })
//     //         ).unwrap();

//     //         console.log('✅ PRIORITY 3 - API Response received:', res);

//     //         if (res.status_code === 200) {
//     //             const test = res.data.test_detail;
//     //             const my = res.data.my_detail;
//     //             setTestData(res.data);

//     //             const apiSubjectAnalysis = res.data.subject_wise_analysis || [];
//     //             setSubjectWiseAnalysis(apiSubjectAnalysis);

//     //             const totalAttempted = my?.total_attend_question || 0;
//     //             const totalQuestions = test?.total_no_of_question || 1;
//     //             const totalMarks = parseFloat(test?.total_marks || 0);
//     //             const negativeMark = parseFloat(test?.negative_mark || 0);
//     //             const correct = parseInt(my?.correct || 0, 10);
//     //             const inCorrect = parseInt(my?.in_correct || 0, 10);

//     //             const markPerQ = totalMarks / totalQuestions || 0;
//     //             const calculatedScore = correct * markPerQ - inCorrect * negativeMark;

//     //             const accuracy =
//     //                 correct && totalAttempted
//     //                     ? ((correct / totalAttempted) * 100).toFixed(2) + '%'
//     //                     : '0%';

//     //             setPerformance({
//     //                 rank: {
//     //                     value: my?.my_rank || 0,
//     //                     total: my?.total_join_user || 0,
//     //                 },
//     //                 score: {
//     //                     value: calculatedScore.toFixed(2),
//     //                     max: totalMarks,
//     //                 },
//     //                 attempted: {
//     //                     value: totalAttempted,
//     //                     max: totalQuestions,
//     //                 },
//     //                 accuracy,
//     //                 percentile: (my?.percentile || 0) + '%',
//     //             });

//     //             const parsedSpent = JSON.parse(my?.spent_time || '[]');
//     //             const totalTimeSpent = parsedSpent.reduce(
//     //                 (acc, item) => acc + (item?.time || 0),
//     //                 0
//     //             );

//     //             setSections([
//     //                 {
//     //                     name: 'Full Test',
//     //                     score: calculatedScore.toFixed(2),
//     //                     maxScore: totalMarks,
//     //                     attempted: totalAttempted,
//     //                     totalQuestions,
//     //                     correct,
//     //                     incorrect: inCorrect,
//     //                     accuracy,
//     //                     time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
//     //                         .toString()
//     //                         .padStart(2, '0')}`,
//     //                 },
//     //             ]);
//     //         }

//     //         setLoading(false);
//     //     } catch (error) {
//     //         console.error('❌ Error in fetchUserResult:', error);
//     //         setLoading(false);
//     //     }
//     // }, [state, dispatch, selectedAttemptId]);
// const buildAnalysisFromAttempt = useCallback((attempt, test) => {
//   if (!attempt || !test) return;

//   const totalAttempted = attempt.total_attend_question || 0;
//   const totalQuestions = test.total_no_of_question || 1;
//   const totalMarks = parseFloat(test.total_marks || 0);
//   const negativeMark = parseFloat(test.negative_mark || 0);
//   const correct = parseInt(attempt.correct || 0, 10);
//   const inCorrect = parseInt(attempt.in_correct || 0, 10);

//   const markPerQ = totalMarks / totalQuestions || 0;
//   const calculatedScore = correct * markPerQ - inCorrect * negativeMark;

//   const accuracy =
//     correct && totalAttempted
//       ? ((correct / totalAttempted) * 100).toFixed(2) + '%'
//       : '0%';

//   setPerformance({
//     rank: {
//       value: attempt.my_rank || 0,
//       total: attempt.total_join_user || 0,
//     },
//     score: {
//       value: calculatedScore.toFixed(2),
//       max: totalMarks,
//     },
//     attempted: {
//       value: totalAttempted,
//       max: totalQuestions,
//     },
//     accuracy,
//     percentile: (attempt.percentile || 0) + '%',
//   });

//   const parsedSpent = JSON.parse(attempt.spent_time || '[]');
//   const totalTimeSpent = parsedSpent.reduce(
//     (acc, item) => acc + (item?.time || 0),
//     0
//   );

//   setSections([
//     {
//       name: 'Full Test',
//       score: calculatedScore.toFixed(2),
//       maxScore: totalMarks,
//       attempted: totalAttempted,
//       totalQuestions,
//       correct,
//       incorrect: inCorrect,
//       accuracy,
//       time: `${Math.floor(totalTimeSpent / 60)}:${(
//         totalTimeSpent % 60
//       )
//         .toString()
//         .padStart(2, '0')}`,
//     },
//   ]);
// }, []);


//     const fetchUserResult = useCallback(async () => {
//         if (!state) {
//             console.error('No state provided to Analysis screen');
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);

//             // =============== PRIORITY 1: Direct test results from submission (Railway) =============== //
//             if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
//                 console.log('✅ PRIORITY 1: Using direct test results from Screen5 submission');

//                 const results = state.testResults;
//                 const questions = state.allQuestions;
//                 const testInfo = state.testInfo || {};
//                 const testDetail = state.testDetail?.[0] || {};

//                 const totalQuestions = questions.length;
//                 const attempted = results.total_attend_question || 0;
//                 const correct = results.correct || 0;
//                 const incorrect = results.in_correct || 0;
//                 const marks = parseFloat(results.marks || 0);
//                 const timeSpent = results.time || 0;
//                 const totalMarks = parseFloat(testDetail.marks || testInfo.total_marks || 100);

//                 const accuracy =
//                     attempted > 0 ? ((correct / attempted) * 100).toFixed(2) + '%' : '0%';

//                 setPerformance({
//                     rank: { value: 0, total: 0 },
//                     score: { value: marks.toFixed(2), max: totalMarks },
//                     attempted: { value: attempted, max: totalQuestions },
//                     accuracy,
//                     percentile: '0%',
//                 });

//                 // subject-wise from state (if any)
//                 if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
//                     const qualifying = state.subjectWiseAnalysis.filter(
//                         s => s.is_qualified_section
//                     );
//                     setSubjectWiseAnalysis(state.subjectWiseAnalysis);
//                     setQualifyingSections(qualifying);
//                     setIsSectionalTest(!!state.isSectionalTest);
//                 } else {
//                     // fallback calculate subject-wise
//                     const subjectMap = {};

//                     questions.forEach(q => {
//                         const subject = q.section || 'General';
//                         if (!subjectMap[subject]) {
//                             subjectMap[subject] = {
//                                 subject_name: subject,
//                                 total_assign_question: 0,
//                                 total_question_attempted: 0,
//                                 correct_count: 0,
//                                 incorrect_count: 0,
//                                 spent_time: 0,
//                             };
//                         }

//                         subjectMap[subject].total_assign_question++;

//                         if (results.attend_question?.includes(q.id)) {
//                             subjectMap[subject].total_question_attempted++;

//                             const attendedQ = results.all_attend_question?.find(
//                                 aq => aq.question_id === q.id
//                             );
//                             if (attendedQ) {
//                                 if (
//                                     attendedQ.user_selected_ans?.toLowerCase() ===
//                                     attendedQ.right_ans?.toLowerCase()
//                                 ) {
//                                     subjectMap[subject].correct_count++;
//                                 } else {
//                                     subjectMap[subject].incorrect_count++;
//                                 }
//                             }
//                         }

//                         const timeData = results.spent_time?.find(
//                             t => t.questionId === q.id
//                         );
//                         if (timeData) {
//                             subjectMap[subject].spent_time += timeData.time || 0;
//                         }
//                     });

//                     const subjectAnalysis = Object.values(subjectMap).map(subject => {
//                         const detailMeta = (state.testDetail || []).find(
//                             d => d.subject_name === subject.subject_name
//                         );

//                         const marksPerQ =
//                             detailMeta && detailMeta.no_of_question
//                                 ? detailMeta.marks / detailMeta.no_of_question
//                                 : 0;

//                         const obtainedMarks = subject.correct_count * marksPerQ;

//                         const isQualifying =
//                             detailMeta && Number(detailMeta.is_qualified_section) === 1;

//                         const minPassing = isQualifying
//                             ? parseFloat(detailMeta.min_passing_marks || 0)
//                             : null;

//                         const isPassed = isQualifying && obtainedMarks >= minPassing;

//                         return {
//                             ...subject,
//                             spent_time: `${Math.floor(subject.spent_time / 60)}:${(
//                                 subject.spent_time % 60
//                             )
//                                 .toString()
//                                 .padStart(2, '0')}`,
//                             is_qualified_section: isQualifying,
//                             min_passing_marks: minPassing,
//                             obtained_marks: Number(obtainedMarks.toFixed(2)),
//                             is_passed: isPassed,
//                         };
//                     });

//                     setSubjectWiseAnalysis(subjectAnalysis);
//                     setQualifyingSections(
//                         subjectAnalysis.filter(s => s.is_qualified_section)
//                     );
//                     setIsSectionalTest(true);
//                 }

//                 setSections([
//                     {
//                         name: 'Full Test',
//                         score: marks.toFixed(2),
//                         maxScore: totalMarks,
//                         attempted,
//                         totalQuestions,
//                         correct,
//                         incorrect,
//                         accuracy,
//                         time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60)
//                             .toString()
//                             .padStart(2, '0')}`,
//                     },
//                 ]);

//                 setTestData({
//                     test_detail: {
//                         title: testInfo.title || 'Test Analysis',
//                         time: testInfo.time || 90,
//                         total_no_of_question: totalQuestions,
//                         total_marks: totalMarks,
//                         negative_mark: parseFloat(testInfo.negative_mark || 0),
//                     },
//                     my_detail: results,
//                     leaderboard: [],
//                 });

//                 // optional leaderboard
//                 const attendIdLb = state.attend_id || state.testInfo?.attend_id;
//                 const testIdLb = state.testId || testInfo.test_id || testInfo.id;

//                 if (attendIdLb && testIdLb) {
//                     try {
//                         const apiRes = await dispatch(
//                             fetchUserTestSeriesRankSlice({
//                                 test_id: testIdLb,
//                                 attend_id: attendIdLb,
//                             })
//                         ).unwrap();

//                         if (apiRes.status_code === 200 && apiRes.data) {
//                             setTestData(prev => ({
//                                 ...prev,
//                                 leaderboard: apiRes.data.leaderboard || [],
//                                 my_detail: apiRes.data.my_detail || prev.my_detail,
//                             }));

//                             const myDetail = apiRes.data.my_detail;
//                             if (myDetail) {
//                                 setPerformance(prev => ({
//                                     ...prev,
//                                     rank: {
//                                         value: myDetail.my_rank || 0,
//                                         total: myDetail.total_join_user || 0,
//                                     },
//                                     percentile: (myDetail.percentile || 0) + '%',
//                                 }));
//                             }
//                         }
//                     } catch (leaderboardError) {
//                         console.warn('⚠️ Leaderboard not available:', leaderboardError);
//                     }
//                 }

//                 setLoading(false);
//                 return;
//             }

//             // =============== PRIORITY 2: Preloaded data (from AttemptedTestPage / package) ===============
//             if (state.isDataPreloaded && state.preloadedData) {
//                 console.log('✅ PRIORITY 2: Using preloaded data');

//                 const res = { status_code: 200, data: state.preloadedData };

//                 if (res.status_code === 200) {
//                     const test = res.data.test_detail;
//                     const my = res.data.my_detail;
//                     setTestData(res.data);

//                     setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);
// setAttempts(res.data.my_all_attempts || []);
// if (!selectedAttemptId && res.data.my_all_attempts?.length) {
//   setSelectedAttemptId(res.data.my_all_attempts[0].attend_id);
// }
//                     // const apiSubjectAnalysis = res.data.subject_wise_analysis || [];
//                     // setSubjectWiseAnalysis(apiSubjectAnalysis);

//                     const totalAttempted = my?.total_attend_question || 0;
//                     const totalQuestions = test?.total_no_of_question || 1;
//                     const totalMarks = parseFloat(test?.total_marks || 0);
//                     const negativeMark = parseFloat(test?.negative_mark || 0);
//                     const correct = parseInt(my?.correct || 0, 10);
//                     const inCorrect = parseInt(my?.in_correct || 0, 10);

//                     const markPerQ = totalMarks / totalQuestions || 0;
//                     const calculatedScore =
//                         correct * markPerQ - inCorrect * negativeMark;

//                     const accuracy =
//                         correct && totalAttempted
//                             ? ((correct / totalAttempted) * 100).toFixed(2) + '%'
//                             : '0%';

//                     setPerformance({
//                         rank: {
//                             value: my?.my_rank || 0,
//                             total: my?.total_join_user || 0,
//                         },
//                         score: {
//                             value: calculatedScore.toFixed(2),
//                             max: totalMarks,
//                         },
//                         attempted: {
//                             value: totalAttempted,
//                             max: totalQuestions,
//                         },
//                         accuracy,
//                         percentile: (my?.percentile || 0) + '%',
//                     });

//                     const parsedSpent = JSON.parse(my?.spent_time || '[]');
//                     const totalTimeSpent = parsedSpent.reduce(
//                         (acc, item) => acc + (item?.time || 0),
//                         0
//                     );

//                     setSections([
//                         {
//                             name: 'Full Test',
//                             score: calculatedScore.toFixed(2),
//                             maxScore: totalMarks,
//                             attempted: totalAttempted,
//                             totalQuestions,
//                             correct,
//                             incorrect: inCorrect,
//                             accuracy,
//                             time: `${Math.floor(totalTimeSpent / 60)}:${(
//                                 totalTimeSpent % 60
//                             )
//                                 .toString()
//                                 .padStart(2, '0')}`,
//                         },
//                     ]);
//                 }

//                 setLoading(false);
//                 return;
//             }

//             // =============== PRIORITY 3: API call (SSC & generic) =============== //
//             console.log('✅ PRIORITY 3: Making API call');

//             const testId =
//                 state?.testInfo?.test_id ||
//                 state?.testInfo?.id ||
//                 state?.testData?.my_detail?.test_id ||
//                 state?.actualTestId;

//             // use selectedAttemptId first, then fall back
//             let attendId =
//                 selectedAttemptId ||
//                 state?.attend_id ||
//                 state?.testInfo?.attend_id ||
//                 state?.testData?.my_detail?.attend_id;

//             if (!attendId) {
//                 const storedTest = secureGetTestData('currentTest');
//                 attendId = storedTest?.attend_id;
//             }

//             console.log('📡 API Call Parameters:', { test_id: testId, attend_id: attendId });

//             if (!testId || !attendId) {
//                 console.error('❌ Missing test_id or attend_id');
//                 setLoading(false);
//                 return;
//             }

//             const res = await dispatch(
//                 fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attendId })
//             ).unwrap();

//             console.log('✅ PRIORITY 3 - API Response received:', res);

//                 if (res.status_code === 200) {
//                 const test = res.data.test_detail;
//                 setTestData(res.data);

//                 if (Array.isArray(res.data.my_all_attempts)) {
//                     setAttempts(res.data.my_all_attempts);
//                     if (!selectedAttemptId && res.data.my_all_attempts.length > 0) {
//                     setSelectedAttemptId(res.data.my_all_attempts[0].attend_id);
//                     }
//                 }

//                 const apiSubjectAnalysis = res.data.subject_wise_analysis || [];
//                 setSubjectWiseAnalysis(apiSubjectAnalysis);

//                 const totalAttempted = my?.total_attend_question || 0;
//                 const totalQuestions = test?.total_no_of_question || 1;
//                 const totalMarks = parseFloat(test?.total_marks || 0);
//                 const negativeMark = parseFloat(test?.negative_mark || 0);
//                 const correct = parseInt(my?.correct || 0, 10);
//                 const inCorrect = parseInt(my?.in_correct || 0, 10);

//                 const markPerQ = totalMarks / totalQuestions || 0;
//                 const calculatedScore = correct * markPerQ - inCorrect * negativeMark;

//                 const accuracy =
//                     correct && totalAttempted
//                         ? ((correct / totalAttempted) * 100).toFixed(2) + '%'
//                         : '0%';

//                 setPerformance({
//                     rank: {
//                         value: my?.my_rank || 0,
//                         total: my?.total_join_user || 0,
//                     },
//                     score: {
//                         value: calculatedScore.toFixed(2),
//                         max: totalMarks,
//                     },
//                     attempted: {
//                         value: totalAttempted,
//                         max: totalQuestions,
//                     },
//                     accuracy,
//                     percentile: (my?.percentile || 0) + '%',
//                 });

//                 const parsedSpent = JSON.parse(my?.spent_time || '[]');
//                 const totalTimeSpent = parsedSpent.reduce(
//                     (acc, item) => acc + (item?.time || 0),
//                     0
//                 );

//                 setSections([
//                     {
//                         name: 'Full Test',
//                         score: calculatedScore.toFixed(2),
//                         maxScore: totalMarks,
//                         attempted: totalAttempted,
//                         totalQuestions,
//                         correct,
//                         incorrect: inCorrect,
//                         accuracy,
//                         time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
//                             .toString()
//                             .padStart(2, '0')}`,
//                     },
//                 ]);
//             }

//             setLoading(false);
//         } catch (error) {
//             console.error('❌ Error in fetchUserResult:', error);
//             setLoading(false);
//         }
//     }, [state, dispatch, selectedAttemptId]);


//     useEffect(() => {
//         fetchUserResult();
//     }, [fetchUserResult]);

// const buildAnalysis = useCallback((attempt, test) => {
//   if (!attempt || !test) return;

//   const totalAttempted = attempt.total_attend_question || 0;
//   const totalQuestions = test.total_no_of_question || 1;
//   const totalMarks = parseFloat(test.total_marks || 0);
//   const negativeMark = parseFloat(test.negative_mark || 0);
//   const correct = parseInt(attempt.correct || 0, 10);
//   const inCorrect = parseInt(attempt.in_correct || 0, 10);

//   const markPerQues = totalMarks / totalQuestions;
//   const calculatedScore = (correct * markPerQues) - (inCorrect * negativeMark);
//   const accuracy = totalAttempted
//     ? ((correct / totalAttempted) * 100).toFixed(2) + "%"
//     : "0%";

//   setPerformance({
//     rank: {
//       value: attempt.my_rank || 0,
//       total: attempt.total_join_user || 0,
//     },
//     score: {
//       value: calculatedScore.toFixed(2),
//       max: totalMarks,
//     },
//     attempted: {
//       value: totalAttempted,
//       max: totalQuestions,
//     },
//     accuracy,
//     percentile: (attempt.percentile || 0) + "%",
//   });

//   const parsedSpent = JSON.parse(attempt.spent_time || "[]");
//   const totalTimeSpent = parsedSpent.reduce(
//     (acc, item) => acc + (item?.time || 0),
//     0
//   );

//   setSections([
//     {
//       name: "Full Test",
//       score: calculatedScore.toFixed(2),
//       maxScore: totalMarks,
//       attempted: totalAttempted,
//       totalQuestions: totalQuestions,
//       correct,
//       incorrect: inCorrect,
//       accuracy,
//       time: `${Math.floor(totalTimeSpent / 60)}:${(
//         totalTimeSpent % 60
//       )
//         .toString()
//         .padStart(2, "0")}`,
//     },
//   ]);
// }, []);

// // useEffect(() => {
// //   if (!selectedAttemptId || !attempts.length || !testData) return;
// //   const attempt = attempts.find(a => a.attempt_id === selectedAttemptId);
// //   buildAnalysis(attempt, testData);
// // }, [selectedAttemptId, attempts, testData, buildAnalysis]);

// useEffect(() => {
//   if (!selectedAttemptId || !attempts.length || !testData?.test_detail) return;
//   const attempt = attempts.find(a => a.attend_id === selectedAttemptId);
//   if (!attempt) return;
//   buildAnalysisFromAttempt(attempt, testData.test_detail);
// }, [selectedAttemptId, attempts, testData, buildAnalysisFromAttempt]);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600 text-lg">Loading your results...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!performance) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                     <p className="text-red-600 text-xl font-semibold mb-2">Unable to load test results</p>
//                     <p className="text-red-500 text-sm">Please try again or contact support</p>
//                     <button
//                         onClick={() => nav('/')}
//                         className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                     >
//                         Back to Dashboard
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const getScoreStatus = (score, maxScore) => {
//         const percentage = (score / maxScore) * 100;
//         if (percentage >= 80) return { status: 'excellent', color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
//         if (percentage >= 60) return { status: 'good', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
//         if (percentage >= 40) return { status: 'average', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
//         return { status: 'needs-improvement', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
//     };

//     const getAccuracyStatus = (accuracy) => {
//         const acc = parseFloat(accuracy);
//         if (acc >= 80) return { color: 'emerald', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' };
//         if (acc >= 60) return { color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
//         if (acc >= 40) return { color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
//         return { color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
//     };


//     const selectedAttempt = attempts?.find(
//         a => a.attend_id === selectedAttemptId  // use attend_id if that’s your key
//     );

//     const selectedIndex = attempts
//         ? attempts.findIndex(a => a.attend_id === selectedAttemptId)
//         : -1;

//     const attemptLabel = selectedIndex >= 0 ? selectedIndex + 1 : 1;

//     let formattedAttemptDate = 'Unknown date';
//     if (selectedAttempt?.attended_at) {
//         formattedAttemptDate = new Date(selectedAttempt.attended_at).toLocaleDateString(
//             'en-GB',
//             { day: '2-digit', month: 'short', year: 'numeric' }
//         );
//     }


//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//                 {/* Hero Section */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="text-center">
//                             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
//                                 {testData?.test_detail?.title || 'Test Analysis'}
//                             </h1>
//                             <p className="text-indigo-200 text-sm sm:text-base">
//                                 Test completed • {testData?.test_detail?.time} minutes • {testData?.test_detail?.total_no_of_question} questions
//                             </p>
//                         </div>
//                     </div>
//                     <div className='mt-2' style={{display:'flex',justifyContent:'center'}}>
//                     {testData?.my_all_attempts?.length > 0 && (
//                         <div className="mb-4 w-xs">
//                             <label className="block text-x text-center font-medium mb-1" style={{textTransform:'uppercase'}}>
//                                 Select Attempt
//                             </label>
//                             <select
//                                 className="border rounded px-3 py-2 w-full"
//                                 value={selectedAttemptId || ""}
//                                 onChange={(e) => setSelectedAttemptId(e.target.value)}
//                             >
//                                 <option value="">Latest Attempt</option>
//                                 {testData.my_all_attempts.map((att, index) => (
//                                     <option key={att.attempt_id} value={att.attempt_id}>
//                                         Attempt {index + 1} (Marks: {att.marks})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}
//                 </div>
//                 </div>



//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {/* Performance Summary Cards */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
//                             {/* Rank Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-pink-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-pink-600 mb-1">
//                                     {performance?.rank?.value > 0 ? `#${performance.rank.value}` : '#N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {performance?.rank?.total || 0}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Your Rank</div>
//                             </div>

//                             {/* Score Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-purple-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-purple-600 mb-1">
//                                     {performance?.score?.value || '0.00'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {performance?.score?.max || 100}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Total Score</div>
//                             </div>

//                             {/* Attempted Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-cyan-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-cyan-600 mb-1">
//                                     {performance?.attempted?.value || 0}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {performance?.attempted?.max || 0}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Questions Attempted</div>
//                             </div>

//                             {/* Accuracy Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-green-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-green-600 mb-1">
//                                     {performance?.accuracy || '0.00%'}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Accuracy Rate</div>
//                             </div>

//                             {/* Time Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-indigo-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-indigo-600 mb-1">
//                                     {sections[0]?.time || '0:00'}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Time Spent</div>
//                             </div>
//                         </div>
//                     </div>


//                     {/* Section Performance Table */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Analysis</h2>
//                         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {sections.map((section, idx) => {
//                                             const scoreStatus = getScoreStatus(section.score, section.maxScore);
//                                             const accuracyStatus = getAccuracyStatus(section.accuracy);
//                                             const scorePercent = (section.score / section.maxScore) * 100;
//                                             const attemptedPercent = (section.attempted / performance.attempted.max) * 100;

//                                             return (
//                                                 <tr key={idx} className="hover:bg-gray-50">
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="font-medium text-gray-900">{section.name}</div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className={`font-semibold ${scoreStatus.textColor}`}>
//                                                                     {section.score} / {section.maxScore}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: `${scorePercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className="font-semibold text-blue-700">
//                                                                     {section.attempted} / {performance.attempted.max}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                     style={{ width: `${attemptedPercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
//                                                                 {section.accuracy}
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: section.accuracy }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-yellow-50 rounded-lg px-3 py-2">
//                                                             <div className="font-semibold text-yellow-800">
//                                                                 {section.time}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 / {testData?.test_detail?.time} min
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Subject-wise Analysis */}
//                     {/* {subjectWiseAnalysis.length > 0 && (
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                             </tr>
//                                         </thead>


//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {sections.map((section, idx) => {
//                                                 const scoreStatus = getScoreStatus(section.score, section.maxScore);
//                                                 const accuracyStatus = getAccuracyStatus(section.accuracy);
//                                                 const scorePercent = (section.score / section.maxScore) * 100;
//                                                 const attemptedPercent = (section.attempted / (section.totalQuestions || performance.attempted.max)) * 100;

//                                                 return (
//                                                     <tr key={idx} className="hover:bg-gray-50">

//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="font-medium text-gray-900">{section.name}</div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className={`font-semibold ${scoreStatus.textColor}`}>
//                                                                         {section.score} / {section.maxScore}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                         style={{ width: `${Math.max(0, scorePercent)}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className="font-semibold text-blue-700">
//                                                                         {section.attempted} / {section.totalQuestions || performance.attempted.max}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                         style={{ width: `${attemptedPercent}%` }}
//                                                                     ></div>
//                                                                 </div>

//                                                                 {section.correct !== undefined && (
//                                                                     <div className="flex gap-2 mt-2 text-xs">
//                                                                         <span className="text-green-700">✓ {section.correct}</span>
//                                                                         <span className="text-red-700">✗ {section.inCorrect}</span>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </td>

//                         \
//                                                         <td className="px-6 py-4">
//                                                             <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
//                                                                     {section.accuracy}
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                         style={{ width: section.accuracy }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-yellow-50 rounded-lg px-3 py-2">
//                                                                 <div className="font-semibold text-yellow-800">
//                                                                     {section.time}
//                                                                 </div>
//                                                                 <div className="text-sm text-gray-500">
//                                                                     / {testData?.test_detail?.time} min
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>



//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )} */}

//                     {/* Subject-wise Analysis */}
//                     {subjectWiseAnalysis.length > 0 && (
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {subjectWiseAnalysis.map((subject, index) => {
//                                                 const accuracy = subject.total_question_attempted > 0
//                                                     ? ((subject.correct_count / subject.total_question_attempted) * 100).toFixed(1)
//                                                     : '0';
//                                                 const accuracyStatus = getAccuracyStatus(accuracy);
//                                                 const attemptPercent = (subject.total_question_attempted / subject.total_assign_question) * 100;

//                                                 return (
//                                                     <tr key={index} className="hover:bg-gray-50">
//                                                         {/* Subject Name */}
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="font-medium text-gray-900">{subject.subject_name}</div>
//                                                         </td>

//                                                         {/* Questions */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="font-semibold text-gray-700">{subject.total_assign_question}</span>
//                                                         </td>

//                                                         {/* Attempted */}
//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className="font-semibold text-blue-700">
//                                                                         {subject.total_question_attempted} / {subject.total_assign_question}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{attemptPercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                         style={{ width: `${attemptPercent}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                                 {/* ✅ SHOW CORRECT/INCORRECT BELOW */}
//                                                                 <div className="flex gap-2 mt-2 text-xs">
//                                                                     <span className="text-green-700">✓ {subject.correct_count}</span>
//                                                                     <span className="text-red-700">✗ {subject.incorrect_count}</span>
//                                                                 </div>
//                                                             </div>
//                                                         </td>

//                                                         {/* Correct */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                 {subject.correct_count}
//                                                             </span>
//                                                         </td>

//                                                         {/* Incorrect */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                 {subject.incorrect_count}
//                                                             </span>
//                                                         </td>

//                                                         {/* Accuracy */}
//                                                         <td className="px-6 py-4">
//                                                             <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className="flex items-center justify-between">
//                                                                     <span className={`font-semibold ${accuracyStatus.textColor}`}>
//                                                                         {accuracy}%
//                                                                     </span>
//                                                                     <div className="flex-1 ml-2 bg-gray-200 rounded-full h-2 max-w-16">
//                                                                         <div
//                                                                             className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                             style={{ width: `${accuracy}%` }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>

//                                                         {/* Time */}
//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-yellow-50 rounded-lg px-2 py-1">
//                                                                 <span className="text-sm font-medium text-yellow-800">{subject.spent_time}</span>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {isSectionalTest && qualifyingSections.length > 0 && (
//                         <section className="mt-6 bg-white shadow-md rounded-xl p-4">
//                             <h2 className="text-lg font-semibold mb-3">
//                                 Qualifying Sections (Pass / Fail)
//                             </h2>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full text-sm text-left">
//                                     <thead>
//                                         <tr className="border-b">
//                                             <th className="py-2 pr-4">Section</th>
//                                             <th className="py-2 pr-4">Required Marks</th>
//                                             <th className="py-2 pr-4">Obtained Marks</th>
//                                             <th className="py-2 pr-4">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {qualifyingSections.map((sec, idx) => (
//                                             <tr key={idx} className="border-b last:border-0">
//                                                 <td className="py-2 pr-4">
//                                                     {sec.subject_name}
//                                                 </td>
//                                                 <td className="py-2 pr-4">
//                                                     {sec.min_passing_marks}
//                                                 </td>
//                                                 <td className="py-2 pr-4">
//                                                     {sec.obtained_marks}
//                                                 </td>
//                                                 <td className="py-2 pr-4 font-semibold">
//                                                     <span
//                                                         className={
//                                                             sec.is_passed ? 'text-green-600' : 'text-red-600'
//                                                         }
//                                                     >
//                                                         {sec.is_passed ? 'Qualify' : 'Disqualify'}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </section>
//                     )}

//                     {/* Leaderboard */}
//                     {/* <div className="mb-8">
//                         <LeaderBoardTable data={testData?.leaderboard || []} rankScore={rankScore} />
//                     </div> */}

//                     {/* 🏆 Leaderboard Section - Only show if data exists */}
//                     {testData.leaderboard && testData.leaderboard.length > 0 ? (
//                         <div className="mt-6">
//                             <div className="flex items-center mb-4">
//                                 <span className="text-2xl mr-2">🏆</span>
//                                 <h2 className="text-xl font-semibold">Leaderboard</h2>
//                             </div>
//                             <LeaderBoardTable
//                                 data={testData.leaderboard}
//                                 userRankScore={rankScore}
//                             />
//                         </div>
//                     ) : (
//                         <div className="mt-6">
//                             <div className="flex items-center mb-4">
//                                 <span className="text-2xl mr-2">🏆</span>
//                                 <h2 className="text-xl font-semibold">Leaderboard</h2>
//                             </div>
//                             <div className="bg-white rounded-lg shadow p-8 text-center">
//                                 <p className="text-gray-500">Leaderboard not available for this test</p>
//                             </div>
//                         </div>
//                     )}


//                     {/* Leaderboard */}
//                     {/* <div className="mb-8">
//                         {testData?.leaderboard && testData.leaderboard.length > 0 ? (
//                             <LeaderBoardTable data={testData.leaderboard} rankScore={rankScore} />
//                         ) : (
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
//                                 <div className="flex items-center justify-center">
//                                     <div className="text-center">
//                                         <div className="text-6xl mb-4">🏆</div>
//                                         <h3 className="text-xl font-bold text-gray-800 mb-2">Leaderboard</h3>
//                                         <p className="text-gray-500">
//                                             {state.testResults
//                                                 ? "Leaderboard will be available after other users complete the test"
//                                                 : "There are no records to display"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div> */}


//                     {/* ✅ FIXED: Action Buttons with attend_id */}
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                         <button
//                             onClick={() => {
//                                 const attendId = state?.attend_id || state?.testInfo?.attend_id;
//                                 console.log('🔍 Navigating to solutions with attend_id:', attendId);

//                                 nav('/test-solutions', {
//                                     state: {
//                                         testData,
//                                         state,
//                                         attend_id: attendId  // ✅ Pass attend_id
//                                     }
//                                 });
//                             }}
//                             className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                         >
//                             <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                             </svg>
//                             View Solutions & Analysis
//                         </button>

//                         <button
//                             onClick={() => nav('/')}
//                             className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//                         >
//                             Back to Dashboard
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Screen6;


// import React, { useCallback, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
// import Header from '../../components/Header';
// import LeaderBoardTable from '../../components/LeaderBoardTable';
// import { secureGetTestData } from '../../helpers/testStorage';

// const Screen6 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const state = useLocation().state || {};
//     console.log('Analysis Screen State Response', state);

//     const [performance, setPerformance] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [testData, setTestData] = useState({});
//     const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
//     const [rankScore, setRankScore] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [qualifyingSections, setQualifyingSections] = useState([]);
//     const [isSectionalTest, setIsSectionalTest] = useState(false);

//     const [attempts, setAttempts] = useState([]);
//     const [selectedAttemptId, setSelectedAttemptId] = useState(
//         state.currentAttemptId || state.attend_id || state.testInfo?.attend_id || ''
//     );

//     // ========= Helper: build analysis from a single attempt =========
//     const buildAnalysisFromAttempt = useCallback((attempt, testDetail) => {
//         if (!attempt || !testDetail) return;

//         const totalQuestions =
//             Number(testDetail.total_no_of_question) ||
//             Number(attempt.no_of_question) ||
//             1;
//         const totalMarks =
//             parseFloat(testDetail.total_marks) || parseFloat(attempt.marks) || 0;
//         const negativeMark = parseFloat(testDetail.negative_mark || 0);

//         const correct = Number(attempt.correct || 0);
//         const inCorrect = Number(attempt.in_correct || 0);
//         const attempted =
//             Number(attempt.total_attend_question) || correct + inCorrect;

//         const markPerQ = totalMarks / totalQuestions || 0;
//         const calculatedScore = correct * markPerQ - inCorrect * negativeMark;
//         setRankScore(calculatedScore);

//         const accuracy =
//             attempted > 0 ? ((correct / attempted) * 100).toFixed(2) + '%' : '0%';

//         setPerformance({
//             rank: {
//                 value: attempt.my_rank || 0,
//                 total: attempt.total_join_user || 0,
//             },
//             score: {
//                 value: calculatedScore.toFixed(2),
//                 max: totalMarks,
//             },
//             attempted: {
//                 value: attempted,
//                 max: totalQuestions,
//             },
//             accuracy,
//             percentile: (attempt.percentile || 0) + '%',
//         });

//         const totalTimeSpent = Number(attempt.time || 0);

//         setSections([
//             {
//                 name: 'Full Test',
//                 score: calculatedScore.toFixed(2),
//                 maxScore: totalMarks,
//                 attempted,
//                 totalQuestions,
//                 correct,
//                 inCorrect,
//                 accuracy,
//                 time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
//                     .toString()
//                     .padStart(2, '0')}`,
//             },
//         ]);
//     }, []);
//     console.log('performance', performance)


//     // ========= Subject-wise from state (if already sent) =========
//     useEffect(() => {
//         if (!state) return;

//         if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
//             setSubjectWiseAnalysis(state.subjectWiseAnalysis);
//             const qualifying = state.subjectWiseAnalysis.filter(
//                 s => s.is_qualified_section
//             );
//             setQualifyingSections(qualifying);
//             setIsSectionalTest(!!state.isSectionalTest);
//         }
//     }, [state]);

//     // ========= Fetch result with 3-priority logic =========
//     const fetchUserResult = useCallback(async () => {
//         if (!state) {
//             console.error('No state provided to Analysis screen');
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);

//             // ----- PRIORITY 1: Direct submission (Railway) -----
//             if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
//                 console.log(
//                     '✅ PRIORITY 1: Using direct test results from Screen5 submission'
//                 );

//                 const results = state.testResults;
//                 const questions = state.allQuestions;
//                 const testInfo = state.testInfo || {};
//                 const testDetail = state.testDetail?.[0] || {};

//                 const totalQuestions = questions.length;
//                 const attempted = results.total_attend_question || 0;
//                 const correct = results.correct || 0;
//                 const incorrect = results.in_correct || 0;
//                 const marks = parseFloat(results.marks || 0);
//                 const timeSpent = results.time || 0;
//                 const totalMarks = parseFloat(
//                     testDetail.marks || testInfo.total_marks || 100
//                 );

//                 const accuracy =
//                     attempted > 0
//                         ? ((correct / attempted) * 100).toFixed(2) + '%'
//                         : '0%';

//                 setPerformance({
//                     rank: { value: 0, total: 0 },
//                     score: { value: marks.toFixed(2), max: totalMarks },
//                     attempted: { value: attempted, max: totalQuestions },
//                     accuracy,
//                     percentile: '0%',
//                 });

//                 const pseudoAttempt = {
//                     attend_id: state.attend_id || state.testInfo?.attend_id || 0,
//                     correct,
//                     in_correct: incorrect,
//                     total_attend_question: attempted,
//                     time: timeSpent,
//                     marks,
//                 };
//                 setAttempts([pseudoAttempt]);
//                 setSelectedAttemptId(pseudoAttempt.attend_id);

//                 setSections([
//                     {
//                         name: 'Full Test',
//                         score: marks.toFixed(2),
//                         maxScore: totalMarks,
//                         attempted,
//                         totalQuestions,
//                         correct,
//                         inCorrect: incorrect,
//                         accuracy,
//                         time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60)
//                             .toString()
//                             .padStart(2, '0')}`,
//                     },
//                 ]);

//                 setTestData({
//                     test_detail: {
//                         title: testInfo.title || 'Test Analysis',
//                         time: testInfo.time || 90,
//                         total_no_of_question: totalQuestions,
//                         total_marks: totalMarks,
//                         negative_mark: parseFloat(testInfo.negative_mark || 0),
//                     },
//                 });

//                 setLoading(false);
//                 return;
//             }

//             // ----- PRIORITY 2: Preloaded data from AttemptedTestPage -----
//             if (state.isDataPreloaded && state.preloadedData) {
//                 console.log('✅ PRIORITY 2: Using preloaded data');

//                 const res = { status_code: 200, data: state.preloadedData };

//                 if (res.status_code === 200) {
//                     const test = res.data.test_detail;
//                     const my = res.data.my_detail;

//                     setTestData(res.data);
//                     setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);

//                     if (Array.isArray(state.allAttempts) && state.allAttempts.length) {
//                         setAttempts(state.allAttempts);
//                         if (!selectedAttemptId) {
//                             setSelectedAttemptId(
//                                 state.currentAttemptId || state.allAttempts[0].attend_id
//                             );
//                         }
//                     } else {
//                         setAttempts([
//                             {
//                                 ...my,
//                                 attend_id: state.attend_id || my.attend_id,
//                             },
//                         ]);
//                         if (!selectedAttemptId) {
//                             setSelectedAttemptId(
//                                 state.attend_id || my.attend_id || state.currentAttemptId
//                             );
//                         }
//                     }

//                     buildAnalysisFromAttempt(
//                         {
//                             ...my,
//                             attend_id: state.attend_id || my.attend_id,
//                         },
//                         test
//                     );
//                 }

//                 setLoading(false);
//                 return;
//             }

//             // ----- PRIORITY 3: API call (SSC & generic) -----
//             console.log('✅ PRIORITY 3: Making API call');

//             const testId =
//                 state?.testInfo?.test_id ||
//                 state?.testInfo?.id ||
//                 state?.testData?.my_detail?.test_id ||
//                 state?.actualTestId;

//             let attendId =
//                 selectedAttemptId ||
//                 state?.attend_id ||
//                 state?.testInfo?.attend_id ||
//                 state?.testData?.my_detail?.attend_id;

//             if (!attendId) {
//                 const storedTest = secureGetTestData('currentTest');
//                 attendId = storedTest?.attend_id;
//             }

//             console.log('📡 API Call Parameters:', { test_id: testId, attend_id: attendId });

//             if (!testId || !attendId) {
//                 console.error('❌ Missing test_id or attend_id');
//                 setLoading(false);
//                 return;
//             }

//             const res = await dispatch(
//                 fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attendId })
//             ).unwrap();

//             console.log('✅ PRIORITY 3 - API Response received:', res);

//             if (res.status_code === 200) {
//                 const test = res.data.test_detail;
//                 const my = res.data.my_detail;

//                 setTestData(res.data);
//                 setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);

//                 // if (Array.isArray(res.data.my_all_attempts)) {
//                 //     setAttempts(res.data.my_all_attempts);
//                 //     if (!selectedAttemptId && res.data.my_all_attempts.length > 0) {
//                 //         setSelectedAttemptId(res.data.my_all_attempts[0].attend_id);
//                 //     }
//                 // } else {
//                 //     setAttempts([{ ...my }]);
//                 //     if (!selectedAttemptId) setSelectedAttemptId(my.attend_id);
//                 // }

//                 if (Array.isArray(res.data.my_all_attempts)) {
//                     setAttempts(res.data.my_all_attempts);

//                     if (!selectedAttemptId && res.data.my_all_attempts.length > 0) {
//                         setSelectedAttemptId(res.data.my_all_attempts[0].attempt_id); // 👈 attend_id nahi
//                     }
//                 } else {
//                     setAttempts([{ ...my }]);
//                     if (!selectedAttemptId) setSelectedAttemptId(my.attempt_id || my.attend_id);
//                 }
//                 // buildAnalysisFromAttempt(my, test);
//             }

//             setLoading(false);
//         } catch (error) {
//             console.error('❌ Error in fetchUserResult:', error);
//             setLoading(false);
//         }
//     }, [state, dispatch]);
//     //   }, [state, dispatch, selectedAttemptId, buildAnalysisFromAttempt]);

//     useEffect(() => {
//         fetchUserResult();
//     }, [fetchUserResult]);

//   const fetchAttemptDetail = async (attemptId) => {
//         try {
//             const testId = testData?.test_detail?.id || state.test_id;
//             if (!testId) return;

//             setLoading(true);

//             const res = await dispatch(
//                 fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attemptId })
//             ).unwrap();

//             if (res.status_code === 200) {
//                 const test = res.data.test_detail;
//                 const my = res.data.my_detail;

//                 setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);
//                 setTestData(res.data);

//                 // UI update 🔥
//                 buildAnalysisFromAttempt(my, test);
//             }

//             setLoading(false);
//         } catch (e) {
//             console.log("Fetch Attempt Details Error:", e);
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         if (!selectedAttemptId) return;

//         fetchAttemptDetail(selectedAttemptId);
//     }, [selectedAttemptId]);

//     useEffect(() => {
//         console.log('attempts length', attempts.length, attempts);
//     }, [attempts]);

//     useEffect(() => {
//         console.log('selectedAttemptId changed', selectedAttemptId);
//     }, [selectedAttemptId]);

//     // useEffect(() => {
//     //     if (!selectedAttemptId || !attempts.length || !testData?.test_detail) return;

//     //     const attempt =
//     //         attempts.find(a => a.attend_id === selectedAttemptId) ||
//     //         attempts.find(a => a.id === selectedAttemptId);

//     //     if (!attempt) return;

//     //     buildAnalysisFromAttempt(attempt, testData.test_detail);
//     // }, [selectedAttemptId, attempts, testData, buildAnalysisFromAttempt]);
//     useEffect(() => {
//         if (!selectedAttemptId || !attempts.length || !testData?.test_detail) return;

//         const attempt = attempts.find(a =>
//             Number(a.attempt_id) === Number(selectedAttemptId) ||
//             Number(a.attend_id) === Number(selectedAttemptId) ||
//             Number(a.id) === Number(selectedAttemptId)
//         );

//         if (!attempt) return;

//         buildAnalysisFromAttempt(attempt, testData.test_detail);
//     }, [selectedAttemptId, attempts, testData, buildAnalysisFromAttempt]);


//     if (loading) return <div>Loading...</div>;


//     // Helpers for section score & accuracy badges
//     const getScoreStatus = (score, maxScore) => {
//         const percent = maxScore ? (score / maxScore) * 100 : 0;

//         if (percent >= 80) {
//             return {
//                 color: 'green',
//                 bgColor: 'bg-green-50',
//                 textColor: 'text-green-700',
//                 label: 'Excellent',
//             };
//         }
//         if (percent >= 60) {
//             return {
//                 color: 'blue',
//                 bgColor: 'bg-blue-50',
//                 textColor: 'text-blue-700',
//                 label: 'Good',
//             };
//         }
//         if (percent >= 40) {
//             return {
//                 color: 'yellow',
//                 bgColor: 'bg-yellow-50',
//                 textColor: 'text-yellow-700',
//                 label: 'Average',
//             };
//         }
//         return {
//             color: 'red',
//             bgColor: 'bg-red-50',
//             textColor: 'text-red-700',
//             label: 'Needs Improvement',
//         };
//     };

//     const getAccuracyStatus = accuracyStr => {
//         const accuracy = parseFloat(String(accuracyStr).replace('%', '')) || 0;

//         if (accuracy >= 80) {
//             return {
//                 color: 'green',
//                 bgColor: 'bg-green-50',
//                 textColor: 'text-green-700',
//                 label: 'High',
//             };
//         }
//         if (accuracy >= 60) {
//             return {
//                 color: 'blue',
//                 bgColor: 'bg-blue-50',
//                 textColor: 'text-blue-700',
//                 label: 'Good',
//             };
//         }
//         if (accuracy >= 40) {
//             return {
//                 color: 'yellow',
//                 bgColor: 'bg-yellow-50',
//                 textColor: 'text-yellow-700',
//                 label: 'Moderate',
//             };
//         }
//         return {
//             color: 'red',
//             bgColor: 'bg-red-50',
//             textColor: 'text-red-700',
//             label: 'Low',
//         };
//     };




//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//                 {/* Hero Section */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="text-center">
//                             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
//                                 {testData?.test_detail?.title || 'Test Analysis'}
//                             </h1>
//                             <p className="text-indigo-200 text-sm sm:text-base">
//                                 Test completed • {testData?.test_detail?.time} minutes • {testData?.test_detail?.total_no_of_question} questions
//                             </p>
//                         </div>
//                     </div>
//                     <div className='mt-2' style={{ display: 'flex', justifyContent: 'center' }}>
//                         {testData?.my_all_attempts?.length > 0 && (
//                             <div className="mb-4 w-xs">
//                                 <label className="block text-x text-center font-medium mb-1" style={{ textTransform: 'uppercase' }}>
//                                     Select Attempt
//                                 </label>
//                                 {/* <select
//                                 className="border rounded px-3 py-2 w-full"
//                                 value={selectedAttemptId || ""}
//                                 onChange={(e) => setSelectedAttemptId(e.target.value)}
//                             >
//                                 <option value="">Latest Attempt</option>
//                                 {testData.my_all_attempts.map((att, index) => (
//                                     <option key={att.attempt_id} value={att.attempt_id}>
//                                         Attempt {index + 1} (Marks: {att.marks})
//                                     </option>
//                                 ))}
//                             </select> */}
//                                 <select
//                                     value={selectedAttemptId || ""}
//                                     onChange={(e) => setSelectedAttemptId(Number(e.target.value))}
//                                 >
//                                     <option value="">Select Attempt</option>
//                                     {testData.my_all_attempts.map((att, index) => (
//                                         <option key={att.attempt_id} value={att.attempt_id}>
//                                             Attempt {index + 1} (Marks: {att.marks})
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}
//                     </div>
//                 </div>



//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {/* Performance Summary Cards */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
//                             {/* Rank Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-pink-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-pink-600 mb-1">
//                                     {performance?.rank?.value > 0 ? `#${performance.rank.value}` : '#N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {performance?.rank?.total || 0}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Your Rank</div>
//                             </div>

//                             {/* Score Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-purple-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-purple-600 mb-1">
//                                     {testData?.my_all_attempts?.score?.value || '0.00'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {testData?.my_all_attempts?.score?.max || 100}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Total Score</div>
//                             </div>

//                             {/* Attempted Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-cyan-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-cyan-600 mb-1">
//                                     {performance?.attempted?.value || 0}
//                                 </div>
//                                 <div className="text-sm text-gray-500 mb-1">
//                                     out of {performance?.attempted?.max || 0}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Questions Attempted</div>
//                             </div>

//                             {/* Accuracy Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-green-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-green-600 mb-1">
//                                     {performance?.accuracy || '0.00%'}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Accuracy Rate</div>
//                             </div>

//                             {/* Time Card */}
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="p-2 bg-indigo-100 rounded-lg">
//                                         <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="text-3xl font-bold text-indigo-600 mb-1">
//                                     {sections[0]?.time || '0:00'}
//                                 </div>
//                                 <div className="text-xs font-medium text-gray-700">Time Spent</div>
//                             </div>
//                         </div>
//                     </div>


//                     {/* Section Performance Table */}
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Analysis</h2>
//                         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {sections.map((section, idx) => {
//                                             const scoreStatus = getScoreStatus(section.score, section.maxScore);
//                                             const accuracyStatus = getAccuracyStatus(section.accuracy);
//                                             const scorePercent = (section.score / section.maxScore) * 100;
//                                             const attemptedPercent = (section.attempted / performance.attempted.max) * 100;

//                                             return (
//                                                 <tr key={idx} className="hover:bg-gray-50">
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="font-medium text-gray-900">{section.name}</div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className={`font-semibold ${scoreStatus.textColor}`}>
//                                                                     {section.score} / {section.maxScore}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: `${scorePercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className="font-semibold text-blue-700">
//                                                                     {section.attempted} / {performance.attempted.max}
//                                                                 </span>
//                                                                 <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                     style={{ width: `${attemptedPercent}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                             <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
//                                                                 {section.accuracy}
//                                                             </div>
//                                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                     style={{ width: section.accuracy }}
//                                                                 ></div>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4">
//                                                         <div className="bg-yellow-50 rounded-lg px-3 py-2">
//                                                             <div className="font-semibold text-yellow-800">
//                                                                 {section.time}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 / {testData?.test_detail?.time} min
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Subject-wise Analysis */}
//                     {/* {subjectWiseAnalysis.length > 0 && (
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                             </tr>
//                                         </thead>


//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {sections.map((section, idx) => {
//                                                 const scoreStatus = getScoreStatus(section.score, section.maxScore);
//                                                 const accuracyStatus = getAccuracyStatus(section.accuracy);
//                                                 const scorePercent = (section.score / section.maxScore) * 100;
//                                                 const attemptedPercent = (section.attempted / (section.totalQuestions || performance.attempted.max)) * 100;

//                                                 return (
//                                                     <tr key={idx} className="hover:bg-gray-50">

//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="font-medium text-gray-900">{section.name}</div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className={`font-semibold ${scoreStatus.textColor}`}>
//                                                                         {section.score} / {section.maxScore}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{scorePercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                         style={{ width: `${Math.max(0, scorePercent)}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className="font-semibold text-blue-700">
//                                                                         {section.attempted} / {section.totalQuestions || performance.attempted.max}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{attemptedPercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                         style={{ width: `${attemptedPercent}%` }}
//                                                                     ></div>
//                                                                 </div>

//                                                                 {section.correct !== undefined && (
//                                                                     <div className="flex gap-2 mt-2 text-xs">
//                                                                         <span className="text-green-700">✓ {section.correct}</span>
//                                                                         <span className="text-red-700">✗ {section.inCorrect}</span>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </td>

//                         \
//                                                         <td className="px-6 py-4">
//                                                             <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className={`font-semibold ${accuracyStatus.textColor} mb-1`}>
//                                                                     {section.accuracy}
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                         style={{ width: section.accuracy }}
//                                                                     ></div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>


//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-yellow-50 rounded-lg px-3 py-2">
//                                                                 <div className="font-semibold text-yellow-800">
//                                                                     {section.time}
//                                                                 </div>
//                                                                 <div className="text-sm text-gray-500">
//                                                                     / {testData?.test_detail?.time} min
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>



//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )} */}

//                     {/* Subject-wise Analysis */}
//                     {subjectWiseAnalysis.length > 0 && (
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Performance</h2>
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incorrect</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
//                                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {subjectWiseAnalysis.map((subject, index) => {
//                                                 const accuracy = subject.total_question_attempted > 0
//                                                     ? ((subject.correct_count / subject.total_question_attempted) * 100).toFixed(1)
//                                                     : '0';
//                                                 const accuracyStatus = getAccuracyStatus(accuracy);
//                                                 const attemptPercent = (subject.total_question_attempted / subject.total_assign_question) * 100;

//                                                 return (
//                                                     <tr key={index} className="hover:bg-gray-50">
//                                                         {/* Subject Name */}
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="font-medium text-gray-900">{subject.subject_name}</div>
//                                                         </td>

//                                                         {/* Questions */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="font-semibold text-gray-700">{subject.total_assign_question}</span>
//                                                         </td>

//                                                         {/* Attempted */}
//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-blue-50 rounded-lg px-3 py-2">
//                                                                 <div className="flex justify-between items-center mb-1">
//                                                                     <span className="font-semibold text-blue-700">
//                                                                         {subject.total_question_attempted} / {subject.total_assign_question}
//                                                                     </span>
//                                                                     <span className="text-sm text-gray-600">{attemptPercent.toFixed(1)}%</span>
//                                                                 </div>
//                                                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                                                     <div
//                                                                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                                                                         style={{ width: `${attemptPercent}%` }}
//                                                                     ></div>
//                                                                 </div>
//                                                                 {/* ✅ SHOW CORRECT/INCORRECT BELOW */}
//                                                                 <div className="flex gap-2 mt-2 text-xs">
//                                                                     <span className="text-green-700">✓ {subject.correct_count}</span>
//                                                                     <span className="text-red-700">✗ {subject.incorrect_count}</span>
//                                                                 </div>
//                                                             </div>
//                                                         </td>

//                                                         {/* Correct */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                 {subject.correct_count}
//                                                             </span>
//                                                         </td>

//                                                         {/* Incorrect */}
//                                                         <td className="px-6 py-4">
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                 {subject.incorrect_count}
//                                                             </span>
//                                                         </td>

//                                                         {/* Accuracy */}
//                                                         <td className="px-6 py-4">
//                                                             <div className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}>
//                                                                 <div className="flex items-center justify-between">
//                                                                     <span className={`font-semibold ${accuracyStatus.textColor}`}>
//                                                                         {accuracy}%
//                                                                     </span>
//                                                                     <div className="flex-1 ml-2 bg-gray-200 rounded-full h-2 max-w-16">
//                                                                         <div
//                                                                             className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
//                                                                             style={{ width: `${accuracy}%` }}
//                                                                         ></div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>

//                                                         {/* Time */}
//                                                         <td className="px-6 py-4">
//                                                             <div className="bg-yellow-50 rounded-lg px-2 py-1">
//                                                                 <span className="text-sm font-medium text-yellow-800">{subject.spent_time}</span>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {isSectionalTest && qualifyingSections.length > 0 && (
//                         <section className="mt-6 bg-white shadow-md rounded-xl p-4">
//                             <h2 className="text-lg font-semibold mb-3">
//                                 Qualifying Sections (Pass / Fail)
//                             </h2>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full text-sm text-left">
//                                     <thead>
//                                         <tr className="border-b">
//                                             <th className="py-2 pr-4">Section</th>
//                                             <th className="py-2 pr-4">Required Marks</th>
//                                             <th className="py-2 pr-4">Obtained Marks</th>
//                                             <th className="py-2 pr-4">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {qualifyingSections.map((sec, idx) => (
//                                             <tr key={idx} className="border-b last:border-0">
//                                                 <td className="py-2 pr-4">
//                                                     {sec.subject_name}
//                                                 </td>
//                                                 <td className="py-2 pr-4">
//                                                     {sec.min_passing_marks}
//                                                 </td>
//                                                 <td className="py-2 pr-4">
//                                                     {sec.obtained_marks}
//                                                 </td>
//                                                 <td className="py-2 pr-4 font-semibold">
//                                                     <span
//                                                         className={
//                                                             sec.is_passed ? 'text-green-600' : 'text-red-600'
//                                                         }
//                                                     >
//                                                         {sec.is_passed ? 'Qualify' : 'Disqualify'}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </section>
//                     )}

//                     {/* Leaderboard */}
//                     {/* <div className="mb-8">
//                         <LeaderBoardTable data={testData?.leaderboard || []} rankScore={rankScore} />
//                     </div> */}

//                     {/* 🏆 Leaderboard Section - Only show if data exists */}
//                     {testData.leaderboard && testData.leaderboard.length > 0 ? (
//                         <div className="mt-6">
//                             <div className="flex items-center mb-4">
//                                 <span className="text-2xl mr-2">🏆</span>
//                                 <h2 className="text-xl font-semibold">Leaderboard</h2>
//                             </div>
//                             <LeaderBoardTable
//                                 data={testData.leaderboard}
//                                 userRankScore={rankScore}
//                             />
//                         </div>
//                     ) : (
//                         <div className="mt-6">
//                             <div className="flex items-center mb-4">
//                                 <span className="text-2xl mr-2">🏆</span>
//                                 <h2 className="text-xl font-semibold">Leaderboard</h2>
//                             </div>
//                             <div className="bg-white rounded-lg shadow p-8 text-center">
//                                 <p className="text-gray-500">Leaderboard not available for this test</p>
//                             </div>
//                         </div>
//                     )}


//                     {/* Leaderboard */}
//                     {/* <div className="mb-8">
//                         {testData?.leaderboard && testData.leaderboard.length > 0 ? (
//                             <LeaderBoardTable data={testData.leaderboard} rankScore={rankScore} />
//                         ) : (
//                             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
//                                 <div className="flex items-center justify-center">
//                                     <div className="text-center">
//                                         <div className="text-6xl mb-4">🏆</div>
//                                         <h3 className="text-xl font-bold text-gray-800 mb-2">Leaderboard</h3>
//                                         <p className="text-gray-500">
//                                             {state.testResults
//                                                 ? "Leaderboard will be available after other users complete the test"
//                                                 : "There are no records to display"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div> */}


//                     {/* ✅ FIXED: Action Buttons with attend_id */}
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                         <button
//                             onClick={() => {
//                                 const attendId = state?.attend_id || state?.testInfo?.attend_id;
//                                 console.log('🔍 Navigating to solutions with attend_id:', attendId);

//                                 nav('/test-solutions', {
//                                     state: {
//                                         testData,
//                                         state,
//                                         attend_id: attendId  // ✅ Pass attend_id
//                                     }
//                                 });
//                             }}
//                             className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                         >
//                             <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                             </svg>
//                             View Solutions & Analysis
//                         </button>

//                         <button
//                             onClick={() => nav('/')}
//                             className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
//                         >
//                             Back to Dashboard
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Screen6;


import React, { use, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { attendQuestionSubmitSlice, fetchUserTestSeriesRankSlice } from '../../redux/HomeSlice';
import Header from '../../components/Header';
import LeaderBoardTable from '../../components/LeaderBoardTable';
import { secureGetTestData } from '../../helpers/testStorage';

const Screen6 = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const state = useLocation().state || {};
    // console.log('state 6 screen', state)
    const [performance, setPerformance] = useState(null);
    const [sections, setSections] = useState([]);
    const [testData, setTestData] = useState({});
    const [subjectWiseAnalysis, setSubjectWiseAnalysis] = useState([]);
    const [rankScore, setRankScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qualifyingSections, setQualifyingSections] = useState([]);
    const [isSectionalTest, setIsSectionalTest] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);


    const [attempts, setAttempts] = useState([]);
    const [selectedAttemptId, setSelectedAttemptId] = useState(
        state.currentAttemptId ||
        state.attend_id ||
        state.testInfo?.attend_id ||
        ''
    );

    useEffect(() => {
        // console.log("DEBUG Screen6 state:", state);

        // Use leaderboard sent from Screen 5
        if (state.leaderboard && state.leaderboard.length) {
            setLeaderboardData(state.leaderboard);
        }
    }, [state]);

    // ========= Helper: build analysis from a single attempt =========
    const buildAnalysisFromAttempt = useCallback(
        (attempt, testDetail, rankMeta = {}) => {
            if (!attempt || !testDetail) return;
            console.log("DEBUG Screen6 buildAnalysisFromAttempt called", {
                attempt,
                testDetail,
                rankMeta,
            });

            // Use test meta, not attempt, for totals
            const totalQuestions =
                Number(testDetail.total_no_of_question) ||
                Number(attempt.total_attend_question) ||
                1;

            const totalMarks = parseFloat(testDetail.total_marks) || 0; // e.g. 200
            const negativeMark = parseFloat(testDetail.negative_mark || 0);

            const correct = Number(attempt.correct || 0);
            const inCorrect = Number(attempt.in_correct || 0);
            const attempted =
                Number(attempt.total_attend_question) || correct + inCorrect;

            const markPerQ = totalMarks / totalQuestions || 0; // 200 / 100 = 2
            const calculatedScore = correct * markPerQ - inCorrect * negativeMark;

            const myRank = Number(rankMeta.my_rank ?? 0);
            const totalJoinUser = Number(rankMeta.total_join_user ?? 0);
            const pct = rankMeta.percentile ?? 0;
            // console.log("DEBUG Screen6 rankMeta:", rankMeta);

            setRankScore(myRank);

            const accuracy =
                attempted > 0 ? ((correct / attempted) * 100).toFixed(2) + "%" : "0%";

            setPerformance({
                rank: {
                    value: myRank,
                    total: totalJoinUser,
                },
                score: {
                    value: calculatedScore.toFixed(2), // 10.00
                    max: totalMarks,                   // 200
                },
                attempted: {
                    value: attempted,
                    max: totalQuestions,
                },
                accuracy,
                percentile: pct + "%",
            });

            const totalTimeSpent = Number(attempt.time || 0);

            setSections([
                {
                    name: "Full Test",
                    score: calculatedScore.toFixed(2),
                    maxScore: totalMarks,
                    attempted,
                    totalQuestions,
                    correct,
                    inCorrect,
                    accuracy,
                    time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
                        .toString()
                        .padStart(2, "0")}`,
                },
            ]);
        },
        []
    );

    // const buildAnalysisFromAttempt = useCallback(
    //     (attempt, testDetail, rankMeta = {}) => {
    //         if (!attempt || !testDetail) return;
    //         console.log("DEBUG Screen6 buildAnalysisFromAttempt called", { attempt, testDetail, rankMeta });
    //         const totalQuestions =state?.total_questions || attempt.no_of_question || 1;

    //         const totalMarks =state?.total_marks || parseFloat(attempt.marks) || 0;

    //         const negativeMark = parseFloat(testDetail.negative_mark || 0);

    //         const correct = Number(attempt.correct || 0);
    //         const inCorrect = Number(attempt.in_correct || 0);
    //         const attempted =
    //             Number(attempt.total_attend_question) || correct + inCorrect;

    //         const markPerQ = totalMarks / totalQuestions || 0;
    //         const calculatedScore = (correct * markPerQ) - (inCorrect * negativeMark);
    //         //  const marksScored = (correct * markPerques) - (in_correct * negativeMark);
    //         // ✅ use rank from rankMeta (root), fallback to 0
    //         const myRank = Number(rankMeta.my_rank ?? 0);
    //         const totalJoinUser = Number(rankMeta.total_join_user ?? 0);
    //         const pct = rankMeta.percentile ?? 0;
    //         console.log("DEBUG Screen6 rankMeta:", rankMeta);
    //         setRankScore(myRank); 

    //         const accuracy =
    //             attempted > 0 ? ((correct / attempted) * 100).toFixed(2) + "%" : "0%";

    //         setPerformance({
    //             rank: {
    //                 value: myRank,
    //                 total: totalJoinUser,
    //             },
    //             score: {
    //                 value: calculatedScore.toFixed(2),
    //                 max: totalMarks,
    //             },
    //             attempted: {
    //                 value: attempted,
    //                 max: totalQuestions,
    //             },
    //             accuracy,
    //             percentile: pct + "%",
    //         });

    //         const totalTimeSpent = Number(attempt.time || 0);

    //         setSections([
    //             {
    //                 name: "Full Test",
    //                 score: calculatedScore.toFixed(2),
    //                 maxScore: totalMarks,
    //                 attempted,
    //                 totalQuestions,
    //                 correct,
    //                 inCorrect,
    //                 accuracy,
    //                 time: `${Math.floor(totalTimeSpent / 60)}:${(totalTimeSpent % 60)
    //                     .toString()
    //                     .padStart(2, "0")}`,
    //             },
    //         ]);
    //     },
    //     []
    // );


    // ========= Subject-wise from state (if already sent) =========
    useEffect(() => {
        if (!state) return;

        if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
            setSubjectWiseAnalysis(state.subjectWiseAnalysis);
            const qualifying = state.subjectWiseAnalysis.filter(
                s => s.is_qualified_section
            );
            setQualifyingSections(qualifying);
            setIsSectionalTest(!!state.isSectionalTest);
        }
    }, [state]);

    // ========= Fetch result with 3-priority logic =========
    const fetchUserResult = useCallback(async () => {
        if (!state) {
            console.error('No state provided to Analysis screen');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // ----- PRIORITY 1: Direct submission (Railway) -----
            // if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
            //     const results = state.testResults;
            //     const questions = state.allQuestions;
            //     const testInfo = state.testInfo || {};
            //     const testDetail = state.testDetail?.[0] || {};

            //     const totalQuestions = questions.length;
            //     const attempted = results.total_attend_question || 0;
            //     const correct = results.correct || 0;
            //     const incorrect = results.in_correct || 0;
            //     const marks = parseFloat(results.marks || 0);
            //     const timeSpent = results.time || 0;
            //     const totalMarks = parseFloat(
            //         testDetail.marks || testInfo.total_marks || 100
            //     );

            //     const accuracy =
            //         attempted > 0
            //             ? ((correct / attempted) * 100).toFixed(2) + '%'
            //             : '0%';

            //     setPerformance({
            //         rank: { value: 0, total: 0 },
            //         score: { value: marks.toFixed(2), max: totalMarks },
            //         attempted: { value: attempted, max: totalQuestions },
            //         accuracy,
            //         percentile: '0%',
            //     });

            //     const pseudoAttempt = {
            //         attend_id: state.attend_id || state.testInfo?.attend_id || 0,
            //         correct,
            //         in_correct: incorrect,
            //         total_attend_question: attempted,
            //         time: timeSpent,
            //         marks,
            //     };

            //     setAttempts([pseudoAttempt]);
            //     setSelectedAttemptId(pseudoAttempt.attend_id);

            //     setSections([
            //         {
            //             name: 'Full Test',
            //             score: marks.toFixed(2),
            //             maxScore: totalMarks,
            //             attempted,
            //             totalQuestions,
            //             correct,
            //             inCorrect: incorrect,
            //             accuracy,
            //             time: `${Math.floor(timeSpent / 60)}:${(timeSpent % 60)
            //                 .toString()
            //                 .padStart(2, '0')}`,
            //         },
            //     ]);

            //     setTestData({
            //         test_detail: {
            //             title: testInfo.title || 'Test Analysis',
            //             time: testInfo.time || 90,
            //             total_no_of_question: totalQuestions,
            //             total_marks: totalMarks,
            //             negative_mark: parseFloat(testInfo.negative_mark || 0),
            //         },
            //     });
            //     // NEW: buildAnalysisFromAttempt using results as "attempt"
            //     buildAnalysisFromAttempt(
            //         {
            //             correct,
            //             in_correct: incorrect,
            //             total_attend_question: attempted,
            //             marks,
            //             time: timeSpent,
            //         },
            //         {
            //             total_no_of_question: totalQuestions,
            //             total_marks: totalMarks,
            //             negative_mark: testInfo.negative_mark || 0,
            //         },
            //         {
            //             my_rank: state.my_rank || 0,
            //             total_join_user: state.total_join_user || 0,
            //             percentile: state.percentile || 0,
            //         }
            //     );

            //     setLoading(false);
            //     return;
            // }

            // if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
            //     const results = state.testResults;
            //     const questions = state.allQuestions;
            //     const testInfo = state.testInfo || {};
            //     const testDetail0 = state.testDetail?.[0] || {};

            //     const totalQuestions = questions.length;
            //     const totalMarks = parseFloat(
            //         testDetail0.total_marks || testInfo.total_marks || 0
            //     );

            //     const attempt = {
            //         correct: results.correct,
            //         in_correct: results.in_correct,
            //         total_attend_question: results.total_attend_question,
            //         marks: results.marks,
            //         time: results.time,
            //     };

            //     const testDetail = {
            //         total_no_of_question: totalQuestions,
            //         total_marks: totalMarks,
            //         negative_mark: testInfo.negative_mark || 0,
            //     };

            //     buildAnalysisFromAttempt(attempt, testDetail, {
            //         my_rank: state.my_rank || 0,
            //         total_join_user: state.total_join_user || 0,
            //         percentile: state.percentile || 0,
            //     });

            //     setSubjectWiseAnalysis(state.subjectWiseAnalysis || []);
            //     setIsSectionalTest(!!state.isSectionalTest);
            //     setLoading(false);
            //     return;
            // }

            // ----- PRIORITY 1: Direct submission (from Screen5) -----
            // if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
            //     const results = state.testResults;          // what Screen5 sent
            //     const questions = state.allQuestions;
            //     const testInfo = state.testInfo || {};
            //     const testDetail0 = state.testDetail?.[0] || {};

            //     // totals from test meta
            //     const totalQuestions =
            //         Number(testDetail0.total_no_of_question) || questions.length || 1;
            //     const totalMarks = parseFloat(
            //         testDetail0.total_marks || testInfo.total_marks || 0
            //     );
            //     const negativeMark = parseFloat(testInfo.negative_mark || 0);

            //     // attempt from results
            //     const attempt = {
            //         correct: Number(results.correct || 0),
            //         in_correct: Number(results.in_correct || 0),
            //         total_attend_question: Number(results.total_attend_question || 0),
            //         marks: parseFloat(results.marks || 0),
            //         time: Number(results.time || 0),
            //     };

            //     // testDetail object in same shape as API
            //     const testDetail = {
            //         total_no_of_question: totalQuestions,
            //         total_marks: totalMarks,
            //         negative_mark: negativeMark,
            //     };

            //     // subject-wise and flags from state
            //     if (state.subjectWiseAnalysis && state.subjectWiseAnalysis.length > 0) {
            //         setSubjectWiseAnalysis(state.subjectWiseAnalysis);
            //         const qualifying = state.subjectWiseAnalysis.filter(
            //             s => s.is_qualified_section
            //         );
            //         setQualifyingSections(qualifying);
            //         setIsSectionalTest(!!state.isSectionalTest);
            //     }

            //     // run the same analysis helper as API path
            //     buildAnalysisFromAttempt(attempt, testDetail, {
            //         my_rank: state.my_rank ?? 0,
            //         total_join_user: state.total_join_user ?? 0,
            //         percentile: state.percentile ?? 0,
            //     });

            //     // also store test meta for header if you need it
            //     setTestData({
            //         test_detail: {
            //             title: testInfo.title || 'Test Analysis',
            //             time: testInfo.time || 90,
            //             total_no_of_question: totalQuestions,
            //             total_marks: totalMarks,
            //             negative_mark: negativeMark,
            //         },
            //     });

            //     setLoading(false);
            //     return;
            // }

            // ----- PRIORITY 1: Direct submission (from Screen5) -----
            if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
                const results = state.testResults;
                const questions = state.allQuestions;
                const testInfo = state.testInfo || {};
                const testDetail0 = state.testDetail?.[0] || {};

                const totalQuestions =
                    Number(testDetail0.total_no_of_question) ||
                    Number(state.total_questions) ||
                    questions.length ||
                    1;

                const totalMarks = parseFloat(
                    testDetail0.total_marks ||
                    state.total_marks ||
                    testInfo.total_marks ||
                    0
                );

                const negativeMark = parseFloat(
                    testInfo.negative_mark ?? results.negative_mark ?? 0
                );

                const attempt = {
                    correct: Number(results.correct || 0),
                    in_correct: Number(results.in_correct || 0),
                    total_attend_question: Number(results.total_attend_question || 0),
                    marks: parseFloat(results.marks || 0),
                    time: Number(results.time || 0),
                };

                const testDetail = {
                    total_no_of_question: totalQuestions,
                    total_marks: totalMarks,
                    negative_mark: negativeMark,
                };

                buildAnalysisFromAttempt(attempt, testDetail, {
                    my_rank: state.my_rank ?? 0,
                    total_join_user: state.total_join_user ?? 0,
                    percentile: state.percentile ?? 0,
                });

                setSubjectWiseAnalysis(state.subjectWiseAnalysis || []);
                setIsSectionalTest(!!state.isSectionalTest);
                setLoading(false);
                return;
            }


            // ----- PRIORITY 2: Preloaded data from AttemptedTestPage -----
            // if (state.isDataPreloaded && state.preloadedData) {
            //     const res = { status_code: 200, data: state.preloadedData };

            //     if (res.status_code === 200) {
            //         const test = res.data.test_detail;
            //         const my = res.data.my_detail;

            //         setTestData(res.data);
            //         setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);

            //         if (Array.isArray(state.allAttempts) && state.allAttempts.length) {
            //             setAttempts(state.allAttempts);
            //             if (!selectedAttemptId) {
            //                 setSelectedAttemptId(
            //                     state.currentAttemptId || state.allAttempts[0].attend_id
            //                 );
            //             }
            //         } else {
            //             setAttempts([
            //                 {
            //                     ...my,
            //                     attend_id: state.attend_id || my.attend_id,
            //                 },
            //             ]);
            //             if (!selectedAttemptId) {
            //                 setSelectedAttemptId(
            //                     state.attend_id || my.attend_id || state.currentAttemptId
            //                 );
            //             }
            //         }

            //         buildAnalysisFromAttempt(
            //             {
            //                 ...my,
            //                 attend_id: state.attend_id || my.attend_id,
            //             },
            //             test
            //         );
            //     }

            //     setLoading(false);
            //     return;
            // }
            if (state.isDataPreloaded && state.preloadedData) {
                const res = { status_code: 200, data: state.preloadedData };

                if (res.status_code === 200) {
                    const test = res.data.test_detail;
                    const my = res.data.my_detail;

                    setTestData(res.data);
                    setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);
                    setLeaderboardData(res.data.leaderboard || []);

                    if (Array.isArray(state.allAttempts) && state.allAttempts.length) {
                        setAttempts(state.allAttempts);
                        if (!selectedAttemptId) {
                            setSelectedAttemptId(
                                state.currentAttemptId || state.allAttempts[0].attend_id
                            );
                        }
                    } else {
                        setAttempts([
                            {
                                ...my,
                                attend_id: state.attend_id || my.attend_id,
                            },
                        ]);
                        if (!selectedAttemptId) {
                            setSelectedAttemptId(
                                state.attend_id || my.attend_id || state.currentAttemptId
                            );
                        }
                    }

                    buildAnalysisFromAttempt(
                        my,
                        {
                            total_no_of_question: test.total_no_of_question,
                            total_marks: test.total_marks,
                            negative_mark: test.negative_mark,
                        },
                        {
                            my_rank: my.my_rank,
                            total_join_user: my.total_join_user,
                            percentile: my.percentile,
                        }
                    );
                }

                setLoading(false);
                return;
            }

            // ----- PRIORITY 3: API call (SSC & generic) -----
            const testId =
                state?.testInfo?.test_id ||
                state?.testInfo?.id ||
                state?.testData?.my_detail?.test_id ||
                state?.actualTestId;

            let attendId =
                selectedAttemptId ||
                state?.attend_id ||
                state?.testInfo?.attend_id ||
                state?.testData?.my_detail?.attend_id;

            if (!attendId) {
                const storedTest = secureGetTestData('currentTest');
                attendId = storedTest?.attend_id;
            }

            if (!testId || !attendId) {
                console.error('❌ Missing test_id or attend_id');
                setLoading(false);
                return;
            }

            // const res = await dispatch(
            //     fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attendId })
            // ).unwrap();

            // if (res.status_code === 200) {
            //     const test = res.data.test_detail;
            //     const my = res.data.my_detail;

            //     setTestData(res.data);
            //     setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);

            //     if (Array.isArray(res.data.my_all_attempts)) {
            //         setAttempts(res.data.my_all_attempts);

            //         if (!selectedAttemptId && res.data.my_all_attempts.length > 0) {
            //             setSelectedAttemptId(res.data.my_all_attempts[0].attempt_id);
            //         }
            //     } else {
            //         setAttempts([{ ...my }]);
            //         if (!selectedAttemptId) {
            //             setSelectedAttemptId(my.attempt_id || my.attend_id);
            //         }
            //     }

            //     // Initial analysis for the attempt whose detail we just fetched
            //     buildAnalysisFromAttempt(my, test);
            // }

            const res = await dispatch(
                fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attendId })
            ).unwrap();

            if (res.status_code === 200) {
                const test = res.data.test_detail;
                const my = res.data.my_detail;

                setTestData(res.data);
                setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);
                setLeaderboardData(res.data.leaderboard || []);

                if (Array.isArray(res.data.my_all_attempts)) {
                    setAttempts(res.data.my_all_attempts);
                    if (!selectedAttemptId && res.data.my_all_attempts.length > 0) {
                        setSelectedAttemptId(res.data.my_all_attempts[0].attempt_id);
                    }
                } else {
                    setAttempts([{ ...my }]);
                    if (!selectedAttemptId) {
                        setSelectedAttemptId(my.attempt_id || my.attend_id);
                    }
                }

                buildAnalysisFromAttempt(
                    my,
                    {
                        total_no_of_question: test.total_no_of_question,
                        total_marks: test.total_marks,
                        negative_mark: test.negative_mark,
                    },
                    {
                        my_rank: my.my_rank,
                        total_join_user: my.total_join_user,
                        percentile: my.percentile,
                    }
                );
            }


            setLoading(false);
        } catch (error) {
            console.error('❌ Error in fetchUserResult:', error);
            setLoading(false);
        }
    }, [state, dispatch, selectedAttemptId, buildAnalysisFromAttempt]);

    // Initial fetch
    useEffect(() => {
        fetchUserResult();
    }, [fetchUserResult]);

    // ========= Fetch details for a specific attempt (from dropdown) =========
    const fetchAttemptDetail = async attemptId => {
        if (!attemptId) return;

        try {
            const testId =
                state?.testInfo?.test_id ||
                state?.testInfo?.id ||
                state?.testData?.my_detail?.test_id ||
                state?.actualTestId ||
                testData?.my_detail?.test_id;

            if (!testId) return;

            setLoading(true);

            const res = await dispatch(
                fetchUserTestSeriesRankSlice({ test_id: testId, attend_id: attemptId })
            ).unwrap();

            // console.log("Analysis button click then Response", res)

            if (res.status_code === 200) {
                const test = res.data.test_detail;
                const my = res.data.my_detail;

                setTestData(res.data);
                setSubjectWiseAnalysis(res.data.subject_wise_analysis || []);

                // Rebuild overview from this attempt
                buildAnalysisFromAttempt(my, test);
            }

            setLoading(false);
        } catch (e) {
            console.log('Fetch Attempt Details Error:', e);
            setLoading(false);
        }
    };

    if (loading || !performance) return <div>Loading...</div>;

    // ===== Helpers for section score & accuracy badges =====
    const getScoreStatus = (score, maxScore) => {
        const percent = maxScore ? (score / maxScore) * 100 : 0;

        if (percent >= 80) {
            return {
                color: 'green',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                label: 'Excellent',
            };
        }
        if (percent >= 60) {
            return {
                color: 'blue',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
                label: 'Good',
            };
        }
        if (percent >= 40) {
            return {
                color: 'yellow',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                label: 'Average',
            };
        }
        return {
            color: 'red',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            label: 'Needs Improvement',
        };
    };

    const getAccuracyStatus = accuracyStr => {
        const accuracy = parseFloat(String(accuracyStr).replace('%', '')) || 0;

        if (accuracy >= 80) {
            return {
                color: 'green',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                label: 'High',
            };
        }
        if (accuracy >= 60) {
            return {
                color: 'blue',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
                label: 'Good',
            };
        }
        if (accuracy >= 40) {
            return {
                color: 'yellow',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                label: 'Moderate',
            };
        }
        return {
            color: 'red',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            label: 'Low',
        };
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                {testData?.test_detail?.title || 'Test Analysis'}
                            </h1>
                            <p className="text-indigo-200 text-sm sm:text-base">
                                Test completed • {testData?.test_detail?.time} minutes •{' '}
                                {testData?.test_detail?.total_no_of_question} questions
                            </p>
                        </div>
                    </div>

                    {/* Attempts dropdown */}
                    <div
                        className="mt-2"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        {testData?.my_all_attempts?.length > 0 && (
                            <div className="mb-4 w-xs">
                                <label
                                    className="block text-x text-center font-medium mb-1"
                                    style={{ textTransform: 'uppercase' }}
                                >
                                    Select Attempt
                                </label>
                                <select
                                    className="border rounded px-3 py-2 w-full text-white"
                                    value={selectedAttemptId || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (!val) {
                                            setSelectedAttemptId('');
                                            return;
                                        }
                                        const id = Number(val);
                                        setSelectedAttemptId(id);
                                        fetchAttemptDetail(id);
                                    }}
                                >
                                    <option value="">Latest Attempt</option>
                                    {testData.my_all_attempts.map((att, index) => (
                                        <option key={att.attempt_id} value={att.attempt_id}>
                                            Attempt {index + 1} (Marks: {att.marks})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Performance Summary Cards */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Performance Overview
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                            {/* Rank Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-pink-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-pink-600 mb-1">
                                    {performance?.rank?.value > 0
                                        ? `#${performance.rank.value}`
                                        : '#N/A'}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    out of {performance?.rank?.total || 0}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Your Rank
                                </div>
                            </div>

                            {/* Score Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-1">
                                    {performance?.score?.value || '0.00'}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    out of{' '}
                                    {performance?.score?.max ||
                                        testData?.test_detail?.total_marks ||
                                        0}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Total Score
                                </div>
                            </div>

                            {/* Attempted Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-cyan-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-cyan-600 mb-1">
                                    {performance?.attempted?.value || 0}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    out of {performance?.attempted?.max || 0}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Questions Attempted
                                </div>
                            </div>

                            {/* Accuracy Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                    {performance?.accuracy || '0.00%'}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Accuracy Rate
                                </div>
                            </div>

                            {/* Time Card */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-indigo-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">
                                    {sections[0]?.time || '0:00'}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Time Spent
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Performance Table */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Section Analysis
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Section
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Attempted
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Accuracy
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time Spent
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sections.map((section, idx) => {
                                            const scoreStatus = getScoreStatus(
                                                section.score,
                                                section.maxScore
                                            );
                                            const accuracyStatus = getAccuracyStatus(section.accuracy);
                                            const scorePercent =
                                                (section.score / section.maxScore) * 100;
                                            const attemptedPercent =
                                                performance?.attempted?.max > 0
                                                    ? (section.attempted /
                                                        performance.attempted.max) *
                                                    100
                                                    : 0;

                                            return (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {section.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`${scoreStatus.bgColor} rounded-lg px-3 py-2`}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span
                                                                    className={`font-semibold ${scoreStatus.textColor}`}
                                                                >
                                                                    {section.score} / {section.maxScore}
                                                                </span>
                                                                <span className="text-sm text-gray-600">
                                                                    {scorePercent.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`bg-${scoreStatus.color}-500 h-2 rounded-full transition-all duration-500`}
                                                                    style={{ width: `${scorePercent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="bg-blue-50 rounded-lg px-3 py-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold text-blue-700">
                                                                    {section.attempted} /{' '}
                                                                    {performance?.attempted?.max || 0}
                                                                </span>
                                                                <span className="text-sm text-gray-600">
                                                                    {attemptedPercent.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${attemptedPercent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div
                                                            className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}
                                                        >
                                                            <div
                                                                className={`font-semibold ${accuracyStatus.textColor} mb-1`}
                                                            >
                                                                {section.accuracy}
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
                                                                    style={{ width: section.accuracy }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="bg-yellow-50 rounded-lg px-3 py-2">
                                                            <div className="font-semibold text-yellow-800">
                                                                {section.time}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                / {testData?.test_detail?.time} min
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Subject-wise Analysis */}
                    {subjectWiseAnalysis.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Subject-wise Performance
                            </h2>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Questions
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Attempted
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Correct
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Incorrect
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Accuracy
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {subjectWiseAnalysis.map((subject, index) => {
                                                const accuracy =
                                                    subject.total_question_attempted > 0
                                                        ? (
                                                            (subject.correct_count /
                                                                subject.total_question_attempted) *
                                                            100
                                                        ).toFixed(1)
                                                        : '0';

                                                const accuracyStatus = getAccuracyStatus(accuracy);
                                                const attemptPercent =
                                                    (subject.total_question_attempted /
                                                        subject.total_assign_question) *
                                                    100;

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">
                                                                {subject.subject_name}
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-gray-700">
                                                                {subject.total_assign_question}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <div className="bg-blue-50 rounded-lg px-3 py-2">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="font-semibold text-blue-700">
                                                                        {subject.total_question_attempted} /{' '}
                                                                        {subject.total_assign_question}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {attemptPercent.toFixed(1)}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                                        style={{ width: `${attemptPercent}%` }}
                                                                    ></div>
                                                                </div>
                                                                <div className="flex gap-2 mt-2 text-xs">
                                                                    <span className="text-green-700">
                                                                        ✓ {subject.correct_count}
                                                                    </span>
                                                                    <span className="text-red-700">
                                                                        ✗ {subject.incorrect_count}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {subject.correct_count}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                {subject.incorrect_count}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <div
                                                                className={`${accuracyStatus.bgColor} rounded-lg px-3 py-2`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span
                                                                        className={`font-semibold ${accuracyStatus.textColor}`}
                                                                    >
                                                                        {accuracy}%
                                                                    </span>
                                                                    <div className="flex-1 ml-2 bg-gray-200 rounded-full h-2 max-w-16">
                                                                        <div
                                                                            className={`bg-${accuracyStatus.color}-500 h-2 rounded-full transition-all duration-500`}
                                                                            style={{ width: `${accuracy}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <div className="bg-yellow-50 rounded-lg px-2 py-1">
                                                                <span className="text-sm font-medium text-yellow-800">
                                                                    {subject.spent_time}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sectional Test Qualifying Table */}
                    {isSectionalTest && qualifyingSections.length > 0 && (
                        <section className="mt-6 bg-white shadow-md rounded-xl p-4">
                            <h2 className="text-lg font-semibold mb-3">
                                Qualifying Section
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 pr-4">Section</th>
                                            <th className="py-2 pr-4">Required Marks</th>
                                            <th className="py-2 pr-4">Obtained Marks</th>
                                            <th className="py-2 pr-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {qualifyingSections.map((sec, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="py-2 pr-4">{sec.subject_name}</td>
                                                <td className="py-2 pr-4">{sec.min_passing_marks}</td>
                                                <td className="py-2 pr-4">{sec.obtained_marks}</td>
                                                <td className="py-2 pr-4 font-semibold">
                                                    <span
                                                        className={
                                                            sec.is_passed ? 'text-green-600' : 'text-red-600'
                                                        }
                                                    >
                                                        {sec.is_passed ? 'Qualify' : 'Disqualify'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}


                    {leaderboardData && leaderboardData.length > 0 ? (
                        <div className="mt-6">
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🏆</span>
                                <h2 className="text-xl font-semibold">Leaderboard</h2>
                            </div>
                            <LeaderBoardTable
                                data={leaderboardData}
                                userRankScore={rankScore}
                            />
                        </div>
                    ) : (
                        <div className="mt-6">
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🏆</span>
                                <h2 className="text-xl font-semibold">Leaderboard</h2>
                            </div>
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">
                                    Leaderboard not available for this test
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <button
                            onClick={() => {
                                const attendId =
                                    state?.attend_id || state?.testInfo?.attend_id;
                                nav('/test-solutions', {
                                    state: {
                                        testData,
                                        state,
                                        attend_id: attendId,
                                    },
                                });
                            }}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <svg
                                className="w-5 h-5 inline-block mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            View Solutions & Analysis
                        </button>

                        <button
                            onClick={() => nav('/')}
                            className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Screen6;
