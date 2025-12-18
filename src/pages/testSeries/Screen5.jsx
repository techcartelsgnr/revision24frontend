// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log('Screen5(Test Screen) State Data', state)
//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // Restore Test Data
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             if (!testId) return;

//             const [
//                 storedOptions,
//                 storedAttempted,
//                 storedMarked,
//                 storedSkipped,
//                 storedMarkedWithAns,
//             ] = await Promise.all([
//                 secureGetTestData(testId, "selectedOptions"),
//                 secureGetTestData(testId, "optionSelected"),
//                 secureGetTestData(testId, "markedForReview"),
//                 secureGetTestData(testId, "skippedQuestions"),
//                 secureGetTestData(testId, "marked_with_ans"),
//             ]);

//             if (storedOptions) setSelectedOptions(storedOptions);
//             if (storedAttempted) setOptionSelected(storedAttempted);
//             if (storedMarked) setMarkedForReview(storedMarked);
//             if (storedSkipped) setSkippedQuestions(storedSkipped);
//             if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
//         };

//         restoreEncryptedTestData();
//     }, [testId]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionId = questionsState[currentQuestion]?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     // Replace the existing handleReportQuestion function with this:
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionId = questionsState[currentQuestion]?.id;

//         try {
//             // ✅ API call with proper data structure
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id, // Optional: if you want to track which test
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Group Questions
//     const groupedQuestions = questionsState.reduce((acc, question) => {
//         const subject = acc.find((grp) => grp.subject_name === question.subject_name);
//         if (subject) {
//             subject.questions.push(question);
//         } else {
//             acc.push({
//                 subject_name: question.subject_name,
//                 questions: [question],
//             });
//         }
//         return acc;
//     }, []);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const testId = state?.testInfo?.test_id;
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Save And Next
//     const handleSaveAndNext = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Next Question
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (currentQuestion === questionsState.length - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
//         const testId = state?.testInfo?.test_id;

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // Current Question
//     const current = questionsState[currentQuestion];
//     if (!current) return (
//         <div className="p-4-400 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // Pause Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // Submit Test
//     const handleSubmit = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentId = questionsState[currentQuestion]?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const statMark = parseFloat(state?.testDetail[0]?.marks || 0);
//         const markPer_ques = statMark / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview
//         };

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//             if (res.status_code == 200) {
//                 await clearAllTestData(testId);
//                 nav('/analysis', { replace: true, state });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//                     <TestTimer
//                         textleft={'Time Left:'}
//                         testId={state?.testInfo?.test_id}
//                         timeInMinutes={state?.testInfo?.time}
//                         onTimeUp={() => handleSubmit()}
//                     />
//                 </div>
//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>
//                     <div className="text-right w-full lg:w-auto">
//                         <TestTimer
//                             timeClr='text-blue-800'
//                             textleft={'LAST'}
//                             textBg='text-red-600'
//                             timeTextSize='text-2xl'
//                             textRight={'Minutes'}
//                             showSeconds={false}
//                             testId={state?.testInfo?.test_id}
//                             timeInMinutes={state?.testInfo?.time}
//                             onTimeUp={() => handleSubmit()}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 <QuestionGridModal
//                     question={questionsState}
//                     groupedQuestions={groupedQuestions}
//                     currentQuestion={currentQuestion}
//                     optionSelected={optionSelected}
//                     markedForReview={markedForReview}
//                     markedForReviewAns={markedWithAns}
//                     skippedQuestions={skippedQuestions}
//                     setCurrentQuestion={(index) => setCurrentQuestion(index)}
//                     onClose={() => setShowModal(false)}
//                     onProceed={() => { }}
//                 />

//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header with Bookmark & Report */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{questionsState.length}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;

// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log('Screen5(Test Screen) State Data', state);

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     console.log('🎯 Is Sectional Test:', isSectionalTest);

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Group questions by subject (for sectional tests)
//     const groupedQuestions = questionsState.reduce((acc, question) => {
//         const subject = acc.find((grp) => grp.subject_name === question.subject_name);
//         if (subject) {
//             subject.questions.push(question);
//         } else {
//             acc.push({
//                 subject_name: question.subject_name,
//                 questions: [question],
//             });
//         }
//         return acc;
//     }, []);

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = state?.testDetail[currentSection];
//         const sectionQuestions = groupedQuestions[currentSection]?.questions || [];

//         return {
//             sectionName: groupedQuestions[currentSection]?.subject_name || `Section ${currentSection + 1}`,
//             sectionTime: sectionData?.sectional_time || 0,
//             totalQuestions: sectionQuestions.length,
//             questions: sectionQuestions
//         };
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Handle Section Submit (NO API CALL - Only state update)
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         // ✅ Mark current section as completed (NO API CALL)
//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // ✅ Move to next section or show final submit
//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             // ✅ All sections completed - Show submit test button
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up (Auto-advance to next section, NO API CALL)
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         // Mark section as completed
//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // Auto-move to next section
//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Time up! Moving to Section ${currentSection + 2}`);
//         } else {
//             // ✅ Last section time up - Submit entire test
//             showSuccessToast('Test time completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Initialize Sectional Test - Clear old data on fresh start
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             // ✅ Check if this is a fresh start
//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             console.log('📊 Existing data check:', {
//                 hasOptions: !!existingOptions,
//                 optionsCount: existingOptions ? Object.keys(existingOptions).length : 0,
//                 currentSection: existingSection,
//                 completedSections: existingCompleted
//             });

//             // ✅ If no previous data, this is a fresh attempt
//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting sectional data');
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             }
//         };

//         // ✅ Only run after questions are loaded
//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data with validation
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             if (!testId) return;

//             const [
//                 storedOptions,
//                 storedAttempted,
//                 storedMarked,
//                 storedSkipped,
//                 storedMarkedWithAns,
//                 storedCurrentSection,
//                 storedCompletedSections
//             ] = await Promise.all([
//                 secureGetTestData(testId, "selectedOptions"),
//                 secureGetTestData(testId, "optionSelected"),
//                 secureGetTestData(testId, "markedForReview"),
//                 secureGetTestData(testId, "skippedQuestions"),
//                 secureGetTestData(testId, "marked_with_ans"),
//                 secureGetTestData(testId, "currentSection"),
//                 secureGetTestData(testId, "sectionCompleted"),
//             ]);

//             if (storedOptions) setSelectedOptions(storedOptions);
//             if (storedAttempted) setOptionSelected(storedAttempted);
//             if (storedMarked) setMarkedForReview(storedMarked);
//             if (storedSkipped) setSkippedQuestions(storedSkipped);
//             if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//             // ✅ Only restore section data if it's valid and we have questions loaded
//             if (isSectionalTest && groupedQuestions.length > 0) {
//                 if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                     setCurrentSection(storedCurrentSection);
//                 } else {
//                     setCurrentSection(0);
//                 }

//                 if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                     // ✅ Filter out invalid section numbers
//                     const validCompleted = storedCompletedSections.filter(
//                         sec => sec >= 0 && sec < groupedQuestions.length
//                     );
//                     setSectionCompleted(validCompleted);
//                 } else {
//                     setSectionCompleted([]);
//                 }
//             }
//         };

//         // ✅ Only restore after questions are loaded
//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const testId = state?.testInfo?.test_id;
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (Updated for sectional)
//     const handleSaveAndNext = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         // ✅ Navigate within section or to next question
//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review (Updated for sectional)
//     const handleMarkForReview = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question (Updated for sectional)
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
//         const testId = state?.testInfo?.test_id;

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question based on test type
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // Pause Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test (ONLY ONE API CALL - With section-wise data)
//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);

//     //     // ✅ Calculate marks based on all test details (section-wise)
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     // ✅ One submission data for entire test
//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview
//     //     };

//     //     console.log('📤 Submitting ONE test entry:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//     //         if (res.status_code == 200) {
//     //             await clearAllTestData(testId);
//     //             nav('/analysis', { replace: true, state });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //     }
//     // };

//     // ✅ Updated Submit Test with Subject Information
//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected2.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns,
//     //             subject_id: question?.subject_id || null,
//     //             subject_name: question?.subject_name || null
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions2,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview2
//     //     };

//     //     console.log('📤 Submitting test with subject info:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//     //         console.log('✅ Exam Submit Response:', res);

//     //         if (res.status_code == 200) {
//     //             // ✅ GET THE ATTEND_ID FROM RESPONSE
//     //             const attendId = res.data?.id || res.data?.attend_id;

//     //             console.log('✅ Attend ID from submission:', attendId);

//     //             // ✅ Store it in encrypted storage
//     //             await secureSaveTestData(testId, 'attend_id', attendId);

//     //             // ✅ Clear other test data
//     //             await clearAllTestData(testId);

//     //             // ✅ Navigate with attend_id included in state
//     //             nav('/analysis', { 
//     //                 replace: true, 
//     //                 state: {
//     //                     ...state,
//     //                     attend_id: attendId,  // ✅ ADD THIS
//     //                     testInfo: {
//     //                         ...state.testInfo,
//     //                         attend_id: attendId,  // ✅ ADD THIS TOO
//     //                         test_id: testId
//     //                     }
//     //                 }
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //     }
//     // };

//     const handleSubmit = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test with subject info:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 // ✅ CAPTURE THE ATTEND_ID FROM RESPONSE (id: 878)
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID from submission:', attendId);

//                 // ✅ Store it in encrypted storage
//                 await secureSaveTestData(testId, 'attend_id', attendId);

//                 // ✅ Clear other test data
//                 await clearAllTestData(testId);

//                 // ✅ Navigate with attend_id in ALL required places
//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,  // ✅ 1. Top-level attend_id
//                         testInfo: {
//                             ...state.testInfo,
//                             attend_id: attendId,  // ✅ 2. Inside testInfo
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId  // ✅ 3. Inside testData.my_detail (ADDED)
//                             }
//                         }
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             alert('Failed to submit test. Please try again.');
//         }
//     };



//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     // ✅ Check if all sections are completed
//     const allSectionsCompleted = isSectionalTest && sectionCompleted.length === groupedQuestions.length;

//     // return (
//     //     <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//     //         {/* Header */}
//     //         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//     //             <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//     //             {/* ✅ Timer - Sectional or Total */}
//     //             <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//     //                 {isSectionalTest ? (
//     //                     <TestTimer
//     //                         textleft={`Section ${currentSection + 1} Time:`}
//     //                         testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//     //                         timeInMinutes={currentSectionData?.sectionTime || 0}
//     //                         onTimeUp={handleSectionTimeUp}
//     //                     />
//     //                 ) : (
//     //                     <TestTimer
//     //                         textleft={'Time Left:'}
//     //                         testId={state?.testInfo?.test_id}
//     //                         timeInMinutes={state?.testInfo?.time}
//     //                         onTimeUp={() => handleSubmit()}
//     //                     />
//     //                 )}
//     //             </div>

//     //             <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//     //                 <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//     //                 {isFullScreen ? (
//     //                     <button
//     //                         onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//     //                         className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//     //                     >
//     //                         Exit Full Screen
//     //                     </button>
//     //                 ) : (
//     //                     <button
//     //                         onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//     //                         className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//     //                     >
//     //                         Full Screen
//     //                     </button>
//     //                 )}
//     //                 <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//     //             </div>
//     //         </div>

//     //         {/* ✅ Section Progress Bar (for sectional tests) - FIXED */}
//     //         {isSectionalTest && groupedQuestions.length > 0 && (
//     //             <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
//     //                 <div className="flex justify-between items-center mb-2">
//     //                     <h3 className="font-bold text-lg">
//     //                         Section {currentSection + 1}: {currentSectionData?.sectionName}
//     //                     </h3>
//     //                     <span className="text-sm text-gray-600">
//     //                         Section {currentSection + 1} of {groupedQuestions.length}
//     //                     </span>
//     //                 </div>
//     //                 <div className="w-full bg-gray-200 rounded-full h-2">
//     //                     <div
//     //                         className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//     //                         style={{
//     //                             width: `${((currentSection + 1) / groupedQuestions.length) * 100}%`
//     //                         }}
//     //                     ></div>
//     //                 </div>
//     //                 <div className="mt-2 text-xs text-gray-600">
//     //                     {/* ✅ Fixed: Show completed sections correctly */}
//     //                     Sections Completed: {sectionCompleted.length} / {groupedQuestions.length}
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* Top Controls */}
//     //         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//     //             <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//     //                 <button
//     //                     onMouseEnter={() => setIsModalOpen(true)}
//     //                     className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//     //                 >
//     //                     SYMBOLS
//     //                 </button>
//     //                 <button
//     //                     onMouseEnter={() => setOpenModal(true)}
//     //                     className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//     //                 >
//     //                     INSTRUCTIONS
//     //                 </button>
//     //             </div>

//     //             <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//     //                 <div className="flex flex-wrap gap-2">
//     //                     {selectedOptions[current.id] && (
//     //                         <button
//     //                             onClick={() => handleOptionDeselect(current.id)}
//     //                             className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//     //                         >
//     //                             Clear Option
//     //                         </button>
//     //                     )}
//     //                     <button
//     //                         onClick={handleMarkForReview}
//     //                         className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//     //                     >
//     //                         Mark for Review
//     //                     </button>
//     //                     {selectedOptions[current.id] ? (
//     //                         <button
//     //                             onClick={handleSaveAndNext}
//     //                             className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//     //                         >
//     //                             Save & Next
//     //                         </button>
//     //                     ) : (
//     //                         <button
//     //                             onClick={handleNextQuestion}
//     //                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//     //                         >
//     //                             Next
//     //                         </button>
//     //                     )}

//     //                     {/* ✅ Section Submit Button (Only saves state, no API call) */}
//     //                     {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//     //                         <button
//     //                             onClick={handleSectionSubmit}
//     //                             className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//     //                         >
//     //                             Submit Section {currentSection + 1}
//     //                         </button>
//     //                     )}

//     //                     {/* ✅ Submit Test Button (ONLY ONE API CALL) */}
//     //                     {(!isSectionalTest || allSectionsCompleted || currentSection === groupedQuestions.length - 1) && (
//     //                         <button
//     //                             onClick={() => setConfirmSubmit(true)}
//     //                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//     //                         >
//     //                             Submit Test
//     //                         </button>
//     //                     )}
//     //                 </div>

//     //                 {/* ✅ Timer Display */}
//     //                 <div className="text-right w-full lg:w-auto">
//     //                     {isSectionalTest ? (
//     //                         <TestTimer
//     //                             timeClr='text-blue-800'
//     //                             textleft={'SECTION'}
//     //                             textBg='text-red-600'
//     //                             timeTextSize='text-2xl'
//     //                             textRight={'Minutes'}
//     //                             showSeconds={false}
//     //                             testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//     //                             timeInMinutes={currentSectionData?.sectionTime || 0}
//     //                             onTimeUp={handleSectionTimeUp}
//     //                         />
//     //                     ) : (
//     //                         <TestTimer
//     //                             timeClr='text-blue-800'
//     //                             textleft={'LAST'}
//     //                             textBg='text-red-600'
//     //                             timeTextSize='text-2xl'
//     //                             textRight={'Minutes'}
//     //                             showSeconds={false}
//     //                             testId={state?.testInfo?.test_id}
//     //                             timeInMinutes={state?.testInfo?.time}
//     //                             onTimeUp={() => handleSubmit()}
//     //                         />
//     //                     )}
//     //                 </div>
//     //             </div>
//     //         </div>

//     //         {/* Main Body */}
//     //         <div className="flex flex-col lg:flex-row gap-4 w-full">
//     //             <QuestionGridModal
//     //                 question={isSectionalTest ? currentSectionData?.questions : questionsState}
//     //                 groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
//     //                 currentQuestion={currentQuestion}
//     //                 optionSelected={optionSelected}
//     //                 markedForReview={markedForReview}
//     //                 markedForReviewAns={markedWithAns}
//     //                 skippedQuestions={skippedQuestions}
//     //                 setCurrentQuestion={(index) => setCurrentQuestion(index)}
//     //                 onClose={() => setShowModal(false)}
//     //                 onProceed={() => { }}
//     //             />

//     //             <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//     //                 {/* Question Header with Bookmark & Report */}
//     //                 <div className="flex justify-between items-center mb-4 pb-3 border-b">
//     //                     <div className="flex items-center gap-4">
//     //                         <div className="text-base font-bold text-gray-900">
//     //                             Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//     //                             {isSectionalTest && (
//     //                                 <span className="ml-2 text-sm text-gray-600">
//     //                                     (Section {currentSection + 1})
//     //                                 </span>
//     //                             )}
//     //                         </div>
//     //                         <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//     //                             Time: {formatTime(elapsedSeconds)}
//     //                         </div>
//     //                     </div>

//     //                     {/* Bookmark & Report Icons */}
//     //                     <div className="flex items-center gap-2">
//     //                         <select
//     //                             value={language}
//     //                             onChange={(e) => setLanguage(e.target.value)}
//     //                             className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//     //                         >
//     //                             <option value="en">English</option>
//     //                             <option value="hi">Hindi</option>
//     //                         </select>

//     //                         <button
//     //                             onClick={handleToggleBookmark}
//     //                             disabled={bookmarkLoading}
//     //                             className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//     //                                 ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//     //                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//     //                                 }`}
//     //                             title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//     //                         >
//     //                             {bookmarkLoading ? (
//     //                                 <Loader2 size={20} className="animate-spin" />
//     //                             ) : isCurrentBookmarked ? (
//     //                                 <BookmarkCheck size={20} />
//     //                             ) : (
//     //                                 <Bookmark size={20} />
//     //                             )}
//     //                         </button>

//     //                         <button
//     //                             onClick={() => setShowReportModal(true)}
//     //                             className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//     //                             title="Report Question"
//     //                         >
//     //                             <Flag size={20} />
//     //                         </button>
//     //                     </div>
//     //                 </div>

//     //                 {/* Question Text */}
//     //                 <div className="mb-6">
//     //                     <MathRenderer text={questionText} />
//     //                 </div>

//     //                 {/* Options */}
//     //                 <div className="flex flex-col gap-3">
//     //                     {Object.entries(options).map(([key, value]) => (
//     //                         <label
//     //                             key={key}
//     //                             className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//     //                                 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//     //                                 : 'border-gray-200'
//     //                                 }`}
//     //                         >
//     //                             <input
//     //                                 type="radio"
//     //                                 name={`question_${current.id}`}
//     //                                 value={key}
//     //                                 checked={selectedOptions[current.id] === key}
//     //                                 onChange={() => handleOptionChange(current.id, key)}
//     //                                 className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//     //                             />
//     //                             <div className="flex-1 option-content text-sm">
//     //                                 <MathRenderer text={value} />
//     //                             </div>
//     //                         </label>
//     //                     ))}
//     //                 </div>
//     //             </div>
//     //         </div>

//     //         {/* ✅ Section Submit Confirmation Modal (No API call) */}
//     //         {showSectionSubmitConfirm && (
//     //             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//     //                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//     //                     <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//     //                     <p className="text-gray-600 mb-6">
//     //                         This will mark Section {currentSection + 1} as complete.
//     //                         {currentSection < groupedQuestions.length - 1
//     //                             ? ' You will move to the next section.'
//     //                             : ' After this, you can submit the entire test.'}
//     //                     </p>
//     //                     <div className="flex gap-3">
//     //                         <button
//     //                             onClick={() => setShowSectionSubmitConfirm(false)}
//     //                             className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//     //                         >
//     //                             Cancel
//     //                         </button>
//     //                         <button
//     //                             onClick={confirmSectionSubmit}
//     //                             className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//     //                         >
//     //                             Confirm
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* Report Modal */}
//     //         {showReportModal && (
//     //             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//     //                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//     //                     <div className="flex justify-between items-center mb-4">
//     //                         <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//     //                             <Flag className="text-red-600" size={24} />
//     //                             Report Question
//     //                         </h3>
//     //                         <button
//     //                             onClick={() => {
//     //                                 setShowReportModal(false);
//     //                                 setReportReason('');
//     //                             }}
//     //                             className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//     //                         >
//     //                             <X size={22} className="text-gray-600" />
//     //                         </button>
//     //                     </div>

//     //                     <p className="text-sm text-gray-600 mb-4">
//     //                         Help us improve! Please describe the issue with this question:
//     //                     </p>

//     //                     <textarea
//     //                         value={reportReason}
//     //                         onChange={(e) => setReportReason(e.target.value)}
//     //                         placeholder="E.g., Wrong answer, unclear question, typo..."
//     //                         className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//     //                         rows={5}
//     //                     />

//     //                     <div className="flex gap-3 mt-6">
//     //                         <button
//     //                             onClick={() => {
//     //                                 setShowReportModal(false);
//     //                                 setReportReason('');
//     //                             }}
//     //                             className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//     //                         >
//     //                             Cancel
//     //                         </button>
//     //                         <button
//     //                             onClick={handleReportQuestion}
//     //                             disabled={reportLoading || !reportReason.trim()}
//     //                             className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//     //                         >
//     //                             {reportLoading ? (
//     //                                 <>
//     //                                     <Loader2 size={18} className="animate-spin" />
//     //                                     Submitting...
//     //                                 </>
//     //                             ) : (
//     //                                 'Submit Report'
//     //                             )}
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             </div>
//     //         )}

//     //         {/* All Other Modals */}
//     //         <PauseTestModal
//     //             isOpen={showPauseModal}
//     //             onConfirm={handleConfirmPause}
//     //             onCancel={handleCancelPause}
//     //         />
//     //         <ConfirmTestSubmitModal
//     //             show={confirmSubmit}
//     //             onClose={() => setConfirmSubmit(false)}
//     //             onConfirm={handleSubmit}
//     //         />
//     //         <ExamInstructionsModal
//     //             isOpen={openModal}
//     //             onClose={() => setOpenModal(false)}
//     //             onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//     //             testInfo={state?.testInfo || {}}
//     //             testData={state?.testDetail || []}
//     //         />
//     //         <SymbolModal
//     //             isOpen={isModalOpen}
//     //             onClose={() => setIsModalOpen(false)}
//     //         />
//     //     </div>
//     // );
//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Sectional or Total */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm">
//                     {isSectionalTest ? (
//                         <TestTimer
//                             textleft={`Section ${currentSection + 1} Time:`}
//                             testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                             timeInMinutes={currentSectionData?.sectionTime || 0}
//                             onTimeUp={handleSectionTimeUp}
//                         />
//                     ) : (
//                         <TestTimer
//                             textleft={'Time Left:'}
//                             testId={state?.testInfo?.test_id}
//                             timeInMinutes={state?.testInfo?.time}
//                             onTimeUp={() => handleSubmit()}
//                         />
//                     )}
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* ❌ REMOVED: Section Progress Bar completely */}

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* ✅ KEPT: Submit Section Button (for sectional tests only) */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* ✅ NEW: Submit Test Button (always visible for whole exam submission) */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* ✅ Timer Display */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'SECTION'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={false}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                             />
//                         ) : (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'LAST'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={false}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={state?.testInfo?.time}
//                                 onTimeUp={() => handleSubmit()}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 <QuestionGridModal
//                     question={isSectionalTest ? currentSectionData?.questions : questionsState}
//                     groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
//                     currentQuestion={currentQuestion}
//                     optionSelected={optionSelected}
//                     markedForReview={markedForReview}
//                     markedForReviewAns={markedWithAns}
//                     skippedQuestions={skippedQuestions}
//                     setCurrentQuestion={(index) => setCurrentQuestion(index)}
//                     onClose={() => setShowModal(false)}
//                     onProceed={() => { }}
//                 />

//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header with Bookmark & Report */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ KEPT: Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );

// };

// export default Screen5;



// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();
//     console.log('Screen5(Test Screen) State Data', state);

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     console.log('🎯 Is Sectional Test:', isSectionalTest);

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);
//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Prevent browser back button and show pause confirmation
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true); // Show pause modal on back button
//         };

//         // Push a dummy state to history to intercept back button
//         window.history.pushState(null, '', window.location.pathname);

//         // Listen for popstate (back button)
//         window.addEventListener('popstate', handleBackButton);

//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // ✅ Group questions by subject (for sectional tests)
//     // const groupedQuestions = questionsState.reduce((acc, question) => {
//     //     const subject = acc.find((grp) => grp.subject_name === question.subject_name);
//     //     if (subject) {
//     //         subject.questions.push(question);
//     //     } else {
//     //         acc.push({
//     //             subject_name: question.subject_name,
//     //             questions: [question],
//     //         });
//     //     }
//     //     return acc;
//     // }, []);

//     // // ✅ Get current section data
//     // const getCurrentSectionData = () => {
//     //     if (!isSectionalTest || groupedQuestions.length === 0) return null;

//     //     const sectionData = state?.testDetail[currentSection];
//     //     const sectionQuestions = groupedQuestions[currentSection]?.questions || [];

//     //     return {
//     //         sectionName: groupedQuestions[currentSection]?.subject_name || `Section ${currentSection + 1}`,
//     //         sectionTime: sectionData?.sectional_time || 0,
//     //         totalQuestions: sectionQuestions.length,
//     //         questions: sectionQuestions
//     //     };
//     // };

//     // ✅ Group questions by section (using testDetail)
//     // const groupedQuestions = React.useMemo(() => {
//     //     if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//     //         return [];
//     //     }

//     //     const grouped = [];
//     //     let startIndex = 0;

//     //     state.testDetail.forEach((section, sectionIndex) => {
//     //         const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//     //         const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);

//     //         grouped.push({
//     //             subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//     //             sectionTime: parseInt(section.sectional_time) || 0,
//     //             marks: parseFloat(section.marks) || 0,
//     //             negative_mark: section.negative_mark || "1",
//     //             totalQuestions: sectionQuestionCount,
//     //             questions: sectionQuestions
//     //         });

//     //         startIndex += sectionQuestionCount;
//     //     });

//     //     console.log('📦 Grouped Questions by Section:', grouped);
//     //     console.log('📊 Section Details:');
//     //     grouped.forEach((section, idx) => {
//     //         console.log(`  Section ${idx + 1}: ${section.subject_name} - ${section.questions.length} questions`);
//     //     });

//     //     return grouped;
//     // }, [questionsState, isSectionalTest, state?.testDetail]);


//     const groupedQuestions = useMemo(() => {
//         if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//             return [];
//         }

//         const grouped = [];
//         let startIndex = 0;

//         state.testDetail.forEach((section, sectionIndex) => {
//             const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//             const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);

//             // ✅ Parse sectionTime as integer
//             const sectionTime = parseInt(section.sectional_time) || 0;

//             console.log(`📦 Section ${sectionIndex + 1} Setup:`, {
//                 subject: section.subject_name,
//                 questionCount: sectionQuestionCount,
//                 sectionTime: sectionTime,  // ← Should be 60 for Section 2
//                 rawValue: section.sectional_time
//             });

//             grouped.push({
//                 subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//                 sectionTime: sectionTime,  // ✅ Make sure this is correct
//                 marks: parseFloat(section.marks) || 0,
//                 negative_mark: section.negative_mark || "1",
//                 totalQuestions: sectionQuestionCount,
//                 questions: sectionQuestions
//             });

//             startIndex += sectionQuestionCount;
//         });

//         console.log('📦 All Grouped Sections:', grouped);
//         return grouped;
//     }, [questionsState, isSectionalTest, state?.testDetail]);



//     // ✅ Get current section data (simplified)
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         console.log(`✅ Current Section ${currentSection + 1}:`, {
//             name: sectionData.subject_name,
//             totalQuestions: sectionData.totalQuestions,
//             actualQuestions: sectionData.questions.length,
//             sectionTime: sectionData.sectionTime
//         });

//         return sectionData;
//     };



//     const currentSectionData = getCurrentSectionData();

//     // ✅ Handle Section Submit (NO API CALL - Only state update)
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         // ✅ Mark current section as completed (NO API CALL)
//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // ✅ Move to next section or show final submit
//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up (Auto-advance to next section, NO API CALL)
//     // const handleSectionTimeUp = async () => {
//     //     console.log('⏰ Section time up!');

//     //     const updatedCompleted = [...sectionCompleted, currentSection];
//     //     setSectionCompleted(updatedCompleted);
//     //     await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//     //     if (currentSection < groupedQuestions.length - 1) {
//     //         setCurrentSection(prev => prev + 1);
//     //         setCurrentQuestion(0);
//     //         showSuccessToast(`Time up! Moving to Section ${currentSection + 2}`);
//     //     } else {
//     //         showSuccessToast('Test time completed! Submitting test...');
//     //         await handleSubmit();
//     //     }
//     // };

//     // ✅ For MAINS tests (sectional)
//     // ✅ CORRECTED SECTION 1: Fix both timer types

//     // ✅ For MAINS tests (sectional)
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ For NON-MAINS tests (regular single test)
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };




//     // ✅ Initialize Sectional Test
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting sectional data');
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data
//     // useEffect(() => {
//     //     const restoreEncryptedTestData = async () => {
//     //         if (!testId) return;

//     //         const [
//     //             storedOptions,
//     //             storedAttempted,
//     //             storedMarked,
//     //             storedSkipped,
//     //             storedMarkedWithAns,
//     //             storedCurrentSection,
//     //             storedCompletedSections
//     //         ] = await Promise.all([
//     //             secureGetTestData(testId, "selectedOptions"),
//     //             secureGetTestData(testId, "optionSelected"),
//     //             secureGetTestData(testId, "markedForReview"),
//     //             secureGetTestData(testId, "skippedQuestions"),
//     //             secureGetTestData(testId, "marked_with_ans"),
//     //             secureGetTestData(testId, "currentSection"),
//     //             secureGetTestData(testId, "sectionCompleted"),
//     //         ]);

//     //         if (storedOptions) setSelectedOptions(storedOptions);
//     //         if (storedAttempted) setOptionSelected(storedAttempted);
//     //         if (storedMarked) setMarkedForReview(storedMarked);
//     //         if (storedSkipped) setSkippedQuestions(storedSkipped);
//     //         if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//     //         if (isSectionalTest && groupedQuestions.length > 0) {
//     //             if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//     //                 setCurrentSection(storedCurrentSection);
//     //             } else {
//     //                 setCurrentSection(0);
//     //             }

//     //             if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//     //                 const validCompleted = storedCompletedSections.filter(
//     //                     sec => sec >= 0 && sec < groupedQuestions.length
//     //                 );
//     //                 setSectionCompleted(validCompleted);
//     //             } else {
//     //                 setSectionCompleted([]);
//     //             }
//     //         }
//     //     };

//     //     if (questionsState.length > 0) {
//     //         restoreEncryptedTestData();
//     //     }
//     // }, [testId, questionsState.length]);

//     // ✅ Restore Test Data - IMPROVED VERSION
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             // if (!testId) {
//             //     console.log('❌ No testId found, skipping restoration');
//             //     return;
//             // }

//             // console.log('🔄 Attempting to restore test data for testId:', testId);

//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state:', state);
//                 return;
//             }

//             console.log(`🔑 Using testId for restoration: ${testIdToUse}`);
//             console.log('🎯 State data:', state);

//             try {
//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 console.log('📦 Restored Data:', {
//                     selectedOptions: storedOptions ? Object.keys(storedOptions).length : 0,
//                     optionSelected: storedAttempted ? storedAttempted.length : 0,
//                     markedForReview: storedMarked ? storedMarked.length : 0,
//                     skippedQuestions: storedSkipped ? storedSkipped.length : 0,
//                     markedWithAns: storedMarkedWithAns ? storedMarkedWithAns.length : 0,
//                     currentSection: storedCurrentSection,
//                     completedSections: storedCompletedSections ? storedCompletedSections.length : 0,
//                 });

//                 // ✅ Restore state
//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                     console.log('✅ Restored selectedOptions');
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                     console.log('✅ Restored optionSelected');
//                 }

//                 if (storedMarked) setMarkedForReview(storedMarked);
//                 if (storedSkipped) setSkippedQuestions(storedSkipped);
//                 if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//                 // ✅ Restore section data
//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                         console.log(`✅ Restored currentSection: ${storedCurrentSection}`);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                         console.log('✅ Restored completedSections:', validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 // ✅ Clear pause status AFTER restoration
//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                     console.log('✅ Cleared pause status for testId:', testId);
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         // ✅ Run restoration when questions are loaded
//         if (questionsState.length > 0) {
//             console.log(`✅ Questions loaded (${questionsState.length}), starting restoration`);
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const testId = state?.testInfo?.test_id;
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const testId = state?.testInfo?.test_id;

//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next
//     // const handleSaveAndNext = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     await updateSpentTime(currentId);

//     //     const isOptionSelected = !!selectedOptions[currentId];
//     //     const isAlreadySelected = optionSelected.includes(currentId);
//     //     const isAlreadyMarked = markedForReview.includes(currentId);
//     //     const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//     //     let updatedSelected = optionSelected;
//     //     let updatedSkipped = skippedQuestions;
//     //     let updatedMarkedWithAns = markedWithAns;
//     //     let updatedMarked = markedForReview;

//     //     if (isOptionSelected && !isAlreadySelected) {
//     //         updatedSelected = [...optionSelected, currentId];
//     //         setOptionSelected(updatedSelected);
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     if (isOptionSelected && skippedQuestions.includes(currentId)) {
//     //         updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//     //         setSkippedQuestions(updatedSkipped);
//     //         await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//     //     }

//     //     if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//     //         updatedMarkedWithAns = [...markedWithAns, currentId];
//     //         setMarkedWithAns(updatedMarkedWithAns);
//     //         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//     //         updatedMarked = markedForReview.filter(id => id !== currentId);
//     //         setMarkedForReview(updatedMarked);
//     //         await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     //     }

//     //     if (isAlreadyMarkedWithAns) {
//     //         updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//     //         setMarkedWithAns(updatedMarkedWithAns);
//     //         await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//     //     }

//     //     if (isAlreadyMarked) {
//     //         updatedMarked = markedForReview.filter(id => id !== currentId);
//     //         setMarkedForReview(updatedMarked);
//     //         await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//     //     }

//     //     const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//     //     if (currentQuestion === totalQuestions - 1) {
//     //         setCurrentQuestion(0);
//     //     } else {
//     //         setCurrentQuestion(prev => prev + 1);
//     //     }
//     // };

//     const handleSaveAndNext = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         // ✅ CHECK IF LAST QUESTION
//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true); // Show confirmation popup
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };


//     // ✅ Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question
//     const handleNextQuestion = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);
//         const testId = state?.testInfo?.test_id;

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // ✅ Pause/Back Functions (unified handler for both pause button and back button)
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         // ✅ Push state again to prevent actual back navigation
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test (ONE API CALL)
//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected2.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns,
//     //             subject_id: question?.subject_id || null,
//     //             subject_name: question?.subject_name || null
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview
//     //     };

//     //     console.log('📤 Submitting test:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
//     //         if (res.status_code == 200) {
//     //             await clearAllTestData(testId);
//     //             nav('/analysis', { replace: true, state });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //     }
//     // };

//     // const handleSubmit = async () => {
//     //     const testId = state?.testInfo?.test_id;
//     //     const currentQuestionData = isSectionalTest
//     //         ? currentSectionData?.questions[currentQuestion]
//     //         : questionsState[currentQuestion];
//     //     const currentId = currentQuestionData?.id;

//     //     if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//     //         const updatedSelected = [...optionSelected, currentId];
//     //         await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//     //     }

//     //     const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//     //     const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//     //     const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//     //     const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//     //     const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];
//     //     const totalAttendedQuestions = optionSelected2.length;
//     //     const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//     //     let correct = 0;
//     //     let in_correct = 0;

//     //     const allAttendedQuestions = optionSelected2.map((questionId) => {
//     //         const question = questionsState.find(q => q.id === questionId);
//     //         const selectedAns = selectedOptions2[questionId];
//     //         const rightAns = question?.hindi_ans;

//     //         if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//     //             correct++;
//     //         } else {
//     //             in_correct++;
//     //         }

//     //         return {
//     //             question_id: questionId,
//     //             user_selected_ans: selectedAns,
//     //             right_ans: rightAns,
//     //             subject_id: question?.subject_id || null,
//     //             subject_name: question?.subject_name || null
//     //         };
//     //     });

//     //     const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//     //     const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//     //     const markPer_ques = totalMarks / questionsState.length;
//     //     const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//     //     const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//     //     const submissionData = {
//     //         test_id: testId,
//     //         total_attend_question: totalAttendedQuestions,
//     //         total_not_answer_question: totalNotAnsweredQuestions,
//     //         correct,
//     //         in_correct,
//     //         marks: marksScored,
//     //         time: totalTimeSpent,
//     //         negative_mark: negativeMark,
//     //         all_attend_question: allAttendedQuestions,
//     //         spent_time: spentTime,
//     //         skip_question: skippedQuestions2,
//     //         attend_question: optionSelected2,
//     //         mark_for_review: markedForReview2
//     //     };

//     //     console.log('📤 Submitting test with subject info:', submissionData);

//     //     try {
//     //         const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//     //         console.log('✅ Exam Submit Response:', res);

//     //         if (res.status_code == 200) {
//     //             // ✅ CAPTURE THE ATTEND_ID FROM RESPONSE (id: 878)
//     //             const attendId = res.data?.id || res.data?.attend_id;

//     //             console.log('✅ Attend ID from submission:', attendId);

//     //             // ✅ Store it in encrypted storage
//     //             await secureSaveTestData(testId, 'attend_id', attendId);

//     //             // ✅ Clear other test data
//     //             await clearAllTestData(testId);

//     //             // ✅ Navigate with attend_id in ALL required places
//     //             nav('/analysis', {
//     //                 replace: true,
//     //                 state: {
//     //                     ...state,
//     //                     attend_id: attendId,  // ✅ 1. Top-level attend_id
//     //                     testInfo: {
//     //                         ...state.testInfo,
//     //                         attend_id: attendId,  // ✅ 2. Inside testInfo
//     //                         test_id: testId
//     //                     },
//     //                     testData: {
//     //                         my_detail: {
//     //                             test_id: testId,
//     //                             attend_id: attendId  // ✅ 3. Inside testData.my_detail (ADDED)
//     //                         }
//     //                     }
//     //                 }
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Error in Submitting Test:", error);
//     //         alert('Failed to submit test. Please try again.');
//     //     }
//     // };

//     const handleSubmit = async () => {
//         const testId = state?.testInfo?.test_id;
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         // ✅ Save current question if answered
//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         // ✅ Get all saved data
//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         // ✅ Calculate correct/incorrect answers
//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         // ✅ Calculate marks
//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         // ✅ Prepare submission data
//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 // ✅ CAPTURE attend_id from response
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID captured:', attendId);

//                 // ✅ Store attend_id in encrypted storage
//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 // ✅ Clear test data
//                 await clearAllTestData(testId);

//                 // ✅ Navigate with attend_id in state
//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,  // ✅ Top-level attend_id
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,  // ✅ Inside testInfo
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId  // ✅ Inside testData.my_detail
//                             }
//                         },
//                         userData: userInfo  // ✅ Include user data
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };


//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">


//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Show Total Time instead of Section Time */}
//                 {/* <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     {isSectionalTest ? (
//                         // ✅ For Sectional Test: Show "Total Time" with testInfo.time
//                         <div className="flex items-center gap-2 text-base font-semibold">
//                             <span>Total Time:</span>
//                             <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                         </div>
//                     ) : (
//                         // ✅ For Regular Test: Show actual countdown timer
//                         <TestTimer
//                             textleft={'Time Left:'}
//                             testId={state?.testInfo?.test_id}
//                             timeInMinutes={state?.testInfo?.time}
//                             onTimeUp={() => handleSubmit()}
//                         />
//                     )}
//                 </div> */}

//                 {/* <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <TestTimer
//                         textleft={isSectionalTest ? 'SECTION TIME:' : 'TIME LEFT:'}
//                         testId={isSectionalTest
//                             ? `${state?.testInfo?.test_id}_section_${currentSection}`
//                             : state?.testInfo?.test_id
//                         }
//                         timeInMinutes={isSectionalTest
//                             ? currentSectionData?.sectionTime || 0
//                             : parseInt(state?.testInfo?.time) || 0
//                         }
//                         onTimeUp={isSectionalTest ? handleSectionTimeUp : handleTimeUp}
//                         showSeconds={true}
//                         timeClr='text-white'
//                         timeTextSize='text-lg'
//                     />

//                 </div> */}

//                 {/* Header shows total time (static) */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* Submit Section Button */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* Submit Test Button */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* Last Question Confirmation Modal */}
//                     {showLastQuestionModal && (
//                         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                                 <h3 className="text-xl font-bold text-gray-900 mb-4">
//                                     Last Question Reached
//                                 </h3>
//                                 <p className="text-gray-600 mb-6">
//                                     You've completed all questions. Would you like to:
//                                 </p>
//                                 <div className="flex flex-col gap-3">
//                                     <button
//                                         onClick={() => {
//                                             setShowLastQuestionModal(false);
//                                             setCurrentQuestion(0);
//                                         }}
//                                         className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                                     >
//                                         Go to First Question
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             setShowLastQuestionModal(false);
//                                             setConfirmSubmit(true);
//                                         }}
//                                         className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                                     >
//                                         Submit Test
//                                     </button>
//                                     <button
//                                         onClick={() => setShowLastQuestionModal(false)}
//                                         className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                                     >
//                                         Stay on Current Question
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}


//                     {/* Timer Display */}
//                     <div className="text-right w-full lg:w-auto">
//                         {/* {isSectionalTest ? (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'SECTION'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={true}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                             />

//                         ) : (
//                             <TestTimer
//                                 timeClr='text-blue-800'
//                                 textleft={'LAST'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={false}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={state?.testInfo?.time}
//                                 onTimeUp={() => handleSubmit()}
//                             />
//                         )} */}

//                         {/* {isSectionalTest ? (
//                             <TestTimer
//                                 key={`section_${currentSection}_${questionsState.length}`}
//                                 timeClr='text-blue-800'
//                                 textleft={'SECTION'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={'Minutes'}
//                                 showSeconds={true}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}_${questionsState.length}`}
//                                 timeClr='text-blue-800'
//                                 textleft={'TIME LEFT'}
//                                 textBg='text-red-600'
//                                 timeTextSize='text-2xl'
//                                 textRight={''}
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.test_time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )} */}

//                         {isSectionalTest ? (
//                             <TestTimer
//                                 key={`section_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${state?.testInfo?.testid}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.testid}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.testid}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}


//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 <QuestionGridModal
//                     question={isSectionalTest ? currentSectionData?.questions : questionsState}
//                     groupedQuestions={isSectionalTest ? [currentSectionData] : groupedQuestions}
//                     currentQuestion={currentQuestion}
//                     optionSelected={optionSelected}
//                     markedForReview={markedForReview}
//                     markedForReviewAns={markedWithAns}
//                     skippedQuestions={skippedQuestions}
//                     setCurrentQuestion={(index) => setCurrentQuestion(index)}
//                     onClose={() => setShowModal(false)}
//                     onProceed={() => { }}
//                 />

//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;


// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);

//     // ✅ Last Question Confirmation Modal
//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Prevent browser back button
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true);
//         };
//         window.history.pushState(null, '', window.location.pathname);
//         window.addEventListener('popstate', handleBackButton);
//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // ✅ Group questions by section (using testDetail)
//     const groupedQuestions = useMemo(() => {
//         if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//             return [];
//         }

//         const grouped = [];
//         let startIndex = 0;

//         state.testDetail.forEach((section, sectionIndex) => {
//             const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//             const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);
//             const sectionTime = parseInt(section.sectional_time) || 0;

//             grouped.push({
//                 subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//                 sectionTime: sectionTime,
//                 marks: parseFloat(section.marks) || 0,
//                 negative_mark: section.negative_mark || "1",
//                 totalQuestions: sectionQuestionCount,
//                 questions: sectionQuestions
//             });

//             startIndex += sectionQuestionCount;
//         });

//         return grouped;
//     }, [questionsState, isSectionalTest, state?.testDetail]);

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         return sectionData;
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Handle Section Submit
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Handle Test Time Up (for non-sectional tests)
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };

//     // ✅ Initialize Sectional Test
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting sectional data');
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state');
//                 return;
//             }

//             try {
//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                 }

//                 if (storedMarked) setMarkedForReview(storedMarked);
//                 if (storedSkipped) setSkippedQuestions(storedSkipped);
//                 if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (WITH LAST QUESTION POPUP)
//     const handleSaveAndNext = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         // ✅ CHECK IF LAST QUESTION AND SHOW POPUP
//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true); // Show confirmation popup
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question
//     const handleNextQuestion = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // ✅ Pause/Back Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test (WITH ATTEND_ID CAPTURE)
//     const handleSubmit = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID captured:', attendId);

//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 await clearAllTestData(testId);

//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId
//                             }
//                         },
//                         userData: userInfo
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Show Total Time (static) */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* Submit Section Button */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* Submit Test Button */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* Timer Display */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 key={`section_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 {/* ✅ Question Navigation Grid */}
//                 <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
//                     <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest ? `Section ${currentSection + 1}` : 'All Questions'}
//                     </h3>

//                     {/* Status Legend */}
//                     <div className="mb-4 space-y-2 text-xs">
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-green-500 rounded"></div>
//                             <span>Attempted ({optionSelected.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-yellow-500 rounded"></div>
//                             <span>Marked with Answer ({markedWithAns.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-red-500 rounded"></div>
//                             <span>Marked without Answer ({markedForReview.length})</span>
//                         </div>
//                     </div>

//                     {/* Question Numbers Grid */}
//                     <div className="grid grid-cols-5 gap-2">
//                         {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
//                             const isAttempted = optionSelected.includes(q.id);
//                             const isMarkedWithAns = markedWithAns.includes(q.id);
//                             const isMarked = markedForReview.includes(q.id);
//                             const isCurrent = index === currentQuestion;

//                             let bgColor = 'bg-gray-200'; // Not visited
//                             if (isAttempted) bgColor = 'bg-green-500 text-white';
//                             if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
//                             if (isMarked) bgColor = 'bg-red-500 text-white';

//                             return (
//                                 <button
//                                     key={q.id}
//                                     onClick={() => setCurrentQuestion(index)}
//                                     className={`w-10 h-10 rounded font-semibold text-sm transition-all hover:scale-110 ${bgColor} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Question Display Area */}
//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ LAST QUESTION CONFIRMATION MODAL */}
//             {showLastQuestionModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">
//                             Last Question Reached
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             You've completed all questions. Would you like to:
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setCurrentQuestion(0);
//                                 }}
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                             >
//                                 Go to First Question
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setConfirmSubmit(true);
//                                 }}
//                                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                             >
//                                 Submit Test
//                             </button>
//                             <button
//                                 onClick={() => setShowLastQuestionModal(false)}
//                                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Stay on Current Question
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;



// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);
//     const [sectionTimerKeys, setSectionTimerKeys] = useState({}); // ✅ Track timer keys per section

//     // ✅ Last Question Confirmation Modal
//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Prevent browser back button
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true);
//         };
//         window.history.pushState(null, '', window.location.pathname);
//         window.addEventListener('popstate', handleBackButton);
//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // ✅ Group questions by section (using testDetail)
//     const groupedQuestions = useMemo(() => {
//         if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//             return [];
//         }

//         const grouped = [];
//         let startIndex = 0;

//         state.testDetail.forEach((section, sectionIndex) => {
//             const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//             const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);
//             const sectionTime = parseInt(section.sectional_time) || 0;

//             grouped.push({
//                 subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//                 sectionTime: sectionTime,
//                 marks: parseFloat(section.marks) || 0,
//                 negative_mark: section.negative_mark || "1",
//                 totalQuestions: sectionQuestionCount,
//                 questions: sectionQuestions
//             });

//             startIndex += sectionQuestionCount;
//         });

//         return grouped;
//     }, [questionsState, isSectionalTest, state?.testDetail]);

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         return sectionData;
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Initialize section timer keys on section change
//     useEffect(() => {
//         if (!isSectionalTest) return;

//         // Create a new unique key for each section time display
//         setSectionTimerKeys(prev => ({
//             ...prev,
//             [currentSection]: `section_${testId}_${currentSection}_${Date.now()}`
//         }));
//     }, [currentSection, isSectionalTest, testId]);

//     // ✅ Handle Section Submit
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Handle Test Time Up (for non-sectional tests)
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };

//     // ✅ Initialize Sectional Test
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting sectional data');
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state');
//                 return;
//             }

//             try {
//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                 }

//                 if (storedMarked) setMarkedForReview(storedMarked);
//                 if (storedSkipped) setSkippedQuestions(storedSkipped);
//                 if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (WITH LAST QUESTION POPUP)
//     const handleSaveAndNext = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         // ✅ CHECK IF LAST QUESTION AND SHOW POPUP
//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true); // Show confirmation popup
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question
//     const handleNextQuestion = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // ✅ Pause/Back Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//             exitFullScreen();
//             nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//         } catch (error) {
//             console.error("❌ Failed to pause test securely:", error);
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test (WITH ATTEND_ID CAPTURE)
//     const handleSubmit = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID captured:', attendId);

//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 await clearAllTestData(testId);

//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId
//                             }
//                         },
//                         userData: userInfo
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Show Total Time (static) */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* Submit Section Button */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* Submit Test Button */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* ✅ TIMER DISPLAY - INDEPENDENT PER SECTION */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${state?.testInfo?.test_id}_section_${currentSection}_timer`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={false}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 {/* ✅ Question Navigation Grid */}
//                 <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
//                     <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest ? `Section ${currentSection + 1}` : 'All Questions'}
//                     </h3>

//                     {/* Status Legend */}
//                     <div className="mb-4 space-y-2 text-xs">
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-green-500 rounded"></div>
//                             <span>Attempted ({optionSelected.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-yellow-500 rounded"></div>
//                             <span>Marked with Answer ({markedWithAns.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-red-500 rounded"></div>
//                             <span>Marked without Answer ({markedForReview.length})</span>
//                         </div>
//                     </div>

//                     {/* Question Numbers Grid */}
//                     <div className="grid grid-cols-5 gap-2">
//                         {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
//                             const isAttempted = optionSelected.includes(q.id);
//                             const isMarkedWithAns = markedWithAns.includes(q.id);
//                             const isMarked = markedForReview.includes(q.id);
//                             const isCurrent = index === currentQuestion;

//                             let bgColor = 'bg-gray-200'; // Not visited
//                             if (isAttempted) bgColor = 'bg-green-500 text-white';
//                             if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
//                             if (isMarked) bgColor = 'bg-red-500 text-white';

//                             return (
//                                 <button
//                                     key={q.id}
//                                     onClick={() => setCurrentQuestion(index)}
//                                     className={`w-10 h-10 rounded font-semibold text-sm transition-all hover:scale-110 ${bgColor} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Question Display Area */}
//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ LAST QUESTION CONFIRMATION MODAL */}
//             {showLastQuestionModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">
//                             Last Question Reached
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             You've completed all questions. Would you like to:
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setCurrentQuestion(0);
//                                 }}
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                             >
//                                 Go to First Question
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setConfirmSubmit(true);
//                                 }}
//                                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                             >
//                                 Submit Test
//                             </button>
//                             <button
//                                 onClick={() => setShowLastQuestionModal(false)}
//                                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Stay on Current Question
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;


// Mains Test working findKey, and questions according to section, section submit////////////////////////////////////////////

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();

//     // ✅ Check if sectional test
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);
//     const [sectionTimerKeys, setSectionTimerKeys] = useState({});
//     const [testStarted, setTestStarted] = useState(false); // ✅ Track if test is fresh

//     // ✅ Last Question Confirmation Modal
//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Prevent browser back button
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true);
//         };
//         window.history.pushState(null, '', window.location.pathname);
//         window.addEventListener('popstate', handleBackButton);
//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // ✅ Group questions by section (using testDetail)
//     const groupedQuestions = useMemo(() => {
//         if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//             return [];
//         }

//         const grouped = [];
//         let startIndex = 0;

//         state.testDetail.forEach((section, sectionIndex) => {
//             const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//             const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);
//             const sectionTime = parseInt(section.sectional_time) || 0;

//             grouped.push({
//                 subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//                 sectionTime: sectionTime,
//                 marks: parseFloat(section.marks) || 0,
//                 negative_mark: section.negative_mark || "1",
//                 totalQuestions: sectionQuestionCount,
//                 questions: sectionQuestions
//             });

//             startIndex += sectionQuestionCount;
//         });

//         return grouped;
//     }, [questionsState, isSectionalTest, state?.testDetail]);

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         return sectionData;
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Initialize section timer keys on section change - WITH FRESH START CHECK
//     useEffect(() => {
//         if (!isSectionalTest) return;

//         // ✅ Create a new unique key for each section timer
//         setSectionTimerKeys(prev => ({
//             ...prev,
//             [currentSection]: `section_${testId}_${currentSection}_${Date.now()}_${Math.random()}`
//         }));
//     }, [currentSection, isSectionalTest, testId]);

//     // ✅ Handle Section Submit
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         // ✅ Clear section timer storage on time up
//         const timerStorageKey = `${testId}_section_${currentSection}_timer`;
//         try {
//             const storage = window.localStorage || window.sessionStorage;
//             storage.removeItem(timerStorageKey);
//         } catch (error) {
//             console.error('Error clearing timer:', error);
//         }

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Handle Test Time Up (for non-sectional tests)
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };

//     // ✅ Initialize Sectional Test - CLEAR OLD TIMERS
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting ALL sectional data including timers');

//                 // ✅ CLEAR ALL OLD SECTION TIMERS FROM STORAGE
//                 try {
//                     const storage = window.localStorage || window.sessionStorage;
//                     const keysToDelete = [];

//                     for (let i = 0; i < storage.length; i++) {
//                         const key = storage.key(i);
//                         if (key && key.includes(`${testId}_section_`) && key.includes('_timer')) {
//                             keysToDelete.push(key);
//                         }
//                     }

//                     keysToDelete.forEach(key => {
//                         storage.removeItem(key);
//                         console.log(`✅ Cleared timer: ${key}`);
//                     });
//                 } catch (error) {
//                     console.error('Error clearing timers:', error);
//                 }

//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 setTestStarted(true); // ✅ Mark as fresh test
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             } else {
//                 console.log('📂 Resuming existing test - Keeping timer data');
//                 setTestStarted(false); // ✅ Resuming old test
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length, groupedQuestions.length]);

//     // ✅ Restore Test Data
//     // useEffect(() => {
//     //     const restoreEncryptedTestData = async () => {
//     //         const testIdToUse = state?.testInfo?.test_id;

//     //         if (!testIdToUse) {
//     //             console.error('❌ No testId found in state');
//     //             return;
//     //         }

//     //         try {
//     //             const [
//     //                 storedOptions,
//     //                 storedAttempted,
//     //                 storedMarked,
//     //                 storedSkipped,
//     //                 storedMarkedWithAns,
//     //                 storedCurrentSection,
//     //                 storedCompletedSections
//     //             ] = await Promise.all([
//     //                 secureGetTestData(testId, "selectedOptions"),
//     //                 secureGetTestData(testId, "optionSelected"),
//     //                 secureGetTestData(testId, "markedForReview"),
//     //                 secureGetTestData(testId, "skippedQuestions"),
//     //                 secureGetTestData(testId, "marked_with_ans"),
//     //                 secureGetTestData(testId, "currentSection"),
//     //                 secureGetTestData(testId, "sectionCompleted"),
//     //             ]);

//     //             if (storedOptions && Object.keys(storedOptions).length > 0) {
//     //                 setSelectedOptions(storedOptions);
//     //             }

//     //             if (storedAttempted && storedAttempted.length > 0) {
//     //                 setOptionSelected(storedAttempted);
//     //             }

//     //             if (storedMarked) setMarkedForReview(storedMarked);
//     //             if (storedSkipped) setSkippedQuestions(storedSkipped);
//     //             if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//     //             if (isSectionalTest && groupedQuestions.length > 0) {
//     //                 if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//     //                     setCurrentSection(storedCurrentSection);
//     //                 } else {
//     //                     setCurrentSection(0);
//     //                 }

//     //                 if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//     //                     const validCompleted = storedCompletedSections.filter(
//     //                         sec => sec >= 0 && sec < groupedQuestions.length
//     //                     );
//     //                     setSectionCompleted(validCompleted);
//     //                 } else {
//     //                     setSectionCompleted([]);
//     //                 }
//     //             }

//     //             if (state?.isResuming) {
//     //                 const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//     //                 const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//     //                 await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//     //             }

//     //         } catch (error) {
//     //             console.error('❌ Error restoring test data:', error);
//     //         }
//     //     };

//     //     if (questionsState.length > 0) {
//     //         restoreEncryptedTestData();
//     //     }
//     // }, [testId, questionsState.length, state?.isResuming]);

//     // ✅ FIXED: Restore Test Data with Logging
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state');
//                 return;
//             }

//             try {
//                 console.log('🔄 Restoring test data for testId:', testIdToUse);

//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentQuestion,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentQuestion"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 console.log('✅ Retrieved stored data:', {
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns
//                 });

//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                     console.log('✅ Restored selectedOptions:', storedOptions);
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                     console.log('✅ Restored optionSelected:', storedAttempted);
//                 }

//                 if (storedMarked && storedMarked.length > 0) {
//                     setMarkedForReview(storedMarked);
//                     console.log('✅ Restored markedForReview:', storedMarked);
//                 }

//                 if (storedSkipped && storedSkipped.length > 0) {
//                     setSkippedQuestions(storedSkipped);
//                     console.log('✅ Restored skippedQuestions:', storedSkipped);
//                 }

//                 if (storedMarkedWithAns && storedMarkedWithAns.length > 0) {
//                     setMarkedWithAns(storedMarkedWithAns);
//                     console.log('✅ Restored markedWithAns:', storedMarkedWithAns);
//                 }

//                 if (storedCurrentQuestion !== null && storedCurrentQuestion !== undefined) {
//                     setCurrentQuestion(storedCurrentQuestion);
//                     console.log('✅ Restored currentQuestion:', storedCurrentQuestion);
//                 }

//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                         console.log('✅ Restored currentSection:', storedCurrentSection);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                         console.log('✅ Restored sectionCompleted:', validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                     console.log('✅ Cleared pause status');
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming, isSectionalTest, groupedQuestions.length]);


//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (WITH LAST QUESTION POPUP)
//     const handleSaveAndNext = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         // ✅ CHECK IF LAST QUESTION AND SHOW POPUP
//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question
//     const handleNextQuestion = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // ✅ Pause/Back Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     // const handleConfirmPause = async () => {
//     //     setShowPauseModal(false);
//     //     const currentTestId = state?.testInfo?.test_id;

//     //     try {
//     //         const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//     //         const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//     //         updatedStatus.push({
//     //             test_id: currentTestId,
//     //             isPaused: true,
//     //         });

//     //         await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//     //         exitFullScreen();
//     //         nav('/testpakages', { replace: true, state: { testId: state?.testId } });
//     //     } catch (error) {
//     //         console.error("❌ Failed to pause test securely:", error);
//     //     }
//     // };\

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             console.log('💾 Saving all test state before pause...');

//             // ✅ SAVE ALL TEST STATE BEFORE PAUSING
//             await Promise.all([
//                 secureSaveTestData(testId, "selectedOptions", selectedOptions),
//                 secureSaveTestData(testId, "optionSelected", optionSelected),
//                 secureSaveTestData(testId, "markedForReview", markedForReview),
//                 secureSaveTestData(testId, "skippedQuestions", skippedQuestions),
//                 secureSaveTestData(testId, "marked_with_ans", markedWithAns),
//                 secureSaveTestData(testId, "currentQuestion", currentQuestion),
//                 secureSaveTestData(testId, "currentSection", currentSection),
//                 secureSaveTestData(testId, "sectionCompleted", sectionCompleted),
//             ]);

//             console.log('✅ All test state saved');
//             console.log('📊 Saved optionSelected:', optionSelected);
//             console.log('📊 Saved selectedOptions:', selectedOptions);
//             console.log('📊 Saved markedForReview:', markedForReview);

//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//                 pausedAt: new Date().toISOString()
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//             console.log('✅ Test paused successfully');
//             exitFullScreen();

//             nav('/testpakages', {
//                 replace: true,
//                 state: {
//                     testId: state?.testId,
//                     isResuming: true
//                 }
//             });
//         } catch (error) {
//             console.error("❌ Failed to pause test:", error);
//             showErrorToast('Failed to pause test. Please try again.');
//         }
//     };


//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test (WITH ATTEND_ID CAPTURE)
//     const handleSubmit = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         console.log('📤 Submitting test:', submissionData);

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             console.log('✅ Exam Submit Response:', res);

//             if (res.status_code == 200) {
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 console.log('✅ Attend ID captured:', attendId);

//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 await clearAllTestData(testId);

//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId
//                             }
//                         },
//                         userData: userInfo
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Show Total Time (static) */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* Submit Section Button */}
//                         {isSectionalTest && !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* Submit Test Button */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* ✅ TIMER DISPLAY - INDEPENDENT PER SECTION WITH FRESH START */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${testId}_section_${currentSection}_timer`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={testStarted}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 {/* ✅ Question Navigation Grid */}
//                 <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
//                     <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest ? `Section ${currentSection + 1}` : 'All Questions'}
//                     </h3>

//                     {/* Status Legend */}
//                     <div className="mb-4 space-y-2 text-xs">
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-green-500 rounded"></div>
//                             <span>Attempted ({optionSelected.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-yellow-500 rounded"></div>
//                             <span>Marked with Answer ({markedWithAns.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-red-500 rounded"></div>
//                             <span>Marked without Answer ({markedForReview.length})</span>
//                         </div>
//                     </div>

//                     {/* Question Numbers Grid */}
//                     <div className="grid grid-cols-5 gap-2">
//                         {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
//                             const isAttempted = optionSelected.includes(q.id);
//                             const isMarkedWithAns = markedWithAns.includes(q.id);
//                             const isMarked = markedForReview.includes(q.id);
//                             const isCurrent = index === currentQuestion;

//                             let bgColor = 'bg-gray-200';
//                             if (isAttempted) bgColor = 'bg-green-500 text-white';
//                             if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
//                             if (isMarked) bgColor = 'bg-red-500 text-white';

//                             return (
//                                 <button
//                                     key={q.id}
//                                     onClick={() => setCurrentQuestion(index)}
//                                     className={`w-10 h-10 rounded font-semibold text-sm transition-all hover:scale-110 ${bgColor} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Question Display Area */}
//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/{isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1})
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ LAST QUESTION CONFIRMATION MODAL */}
//             {showLastQuestionModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">
//                             Last Question Reached
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             You've completed all questions. Would you like to:
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setCurrentQuestion(0);
//                                 }}
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                             >
//                                 Go to First Question
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setConfirmSubmit(true);
//                                 }}
//                                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                             >
//                                 Submit Test
//                             </button>
//                             <button
//                                 onClick={() => setShowLastQuestionModal(false)}
//                                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Stay on Current Question
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();

//     // ✅ Check if sectional test - UPDATED CONDITION
//     const isSectionalTest =
//         state?.packageDetail?.exam_category?.title === 'SSC' &&
//         state?.testInfo?.test_series_type === 'mains';

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // ✅ Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);
//     const [sectionTimerKeys, setSectionTimerKeys] = useState({});
//     const [testStarted, setTestStarted] = useState(false);

//     // ✅ Last Question Confirmation Modal
//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ Prevent browser back button
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true);
//         };
//         window.history.pushState(null, '', window.location.pathname);
//         window.addEventListener('popstate', handleBackButton);
//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // ✅ Group questions by section (using testDetail)
//     // const groupedQuestions = useMemo(() => {
//     //     if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//     //         return [];
//     //     }

//     //     const grouped = [];
//     //     let startIndex = 0;

//     //     state.testDetail.forEach((section, sectionIndex) => {
//     //         const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//     //         const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);
//     //         const sectionTime = parseInt(section.sectional_time) || 0;

//     //         grouped.push({
//     //             subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//     //             sectionTime: sectionTime,
//     //             marks: parseFloat(section.marks) || 0,
//     //             negative_mark: section.negative_mark || "1",
//     //             totalQuestions: sectionQuestionCount,
//     //             questions: sectionQuestions
//     //         });

//     //         startIndex += sectionQuestionCount;
//     //     });

//     //     return grouped;
//     // }, [questionsState, isSectionalTest, state?.testDetail]);

//     // ✅ CORRECTED: Group questions by section using testDetail
// const groupedQuestions = useMemo(() => {
//     if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//         console.log('❌ Skipping grouping - not sectional test or no data');
//         return [];
//     }

//     console.log('📊 Starting question grouping...');
//     console.log('Total questions from API:', questionsState.length);
//     console.log('Sections from testDetail:', state.testDetail);

//     const grouped = [];
//     let startIndex = 0;

//     state.testDetail.forEach((section, sectionIndex) => {
//         const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//         const sectionTime = parseInt(section.sectional_time) || 0;

//         // ✅ SLICE questions from the flat array based on section count
//         const sectionQuestions = questionsState.slice(
//             startIndex, 
//             startIndex + sectionQuestionCount
//         );

//         console.log(`\n📌 Section ${sectionIndex + 1}: ${section.subject_name}`);
//         console.log(`  - Start Index: ${startIndex}`);
//         console.log(`  - End Index: ${startIndex + sectionQuestionCount}`);
//         console.log(`  - Questions count: ${sectionQuestions.length}`);
//         console.log(`  - First question ID:`, sectionQuestions[0]?.id);
//         console.log(`  - Last question ID:`, sectionQuestions[sectionQuestions.length - 1]?.id);

//         grouped.push({
//             subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//             sectionTime: sectionTime,
//             marks: parseFloat(section.marks) || 0,
//             negative_mark: section.negative_mark || "0.50",
//             totalQuestions: sectionQuestionCount,
//             questions: sectionQuestions,
//             startQuestionNumber: startIndex + 1, // For display purposes
//             endQuestionNumber: startIndex + sectionQuestionCount
//         });

//         startIndex += sectionQuestionCount;
//     });

//     console.log('\n✅ Grouped Questions:', grouped);
//     console.log('Total sections created:', grouped.length);

//     return grouped;
// }, [questionsState, isSectionalTest, state?.testDetail]);



//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         return sectionData;
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ Initialize section timer keys on section change
//     useEffect(() => {
//         if (!isSectionalTest) return;

//         setSectionTimerKeys(prev => ({
//             ...prev,
//             [currentSection]: `section_${testId}_${currentSection}_${Date.now()}_${Math.random()}`
//         }));
//     }, [currentSection, isSectionalTest, testId]);

//     // ✅ Handle Section Submit
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0); // ✅ RESET to first question
//             await secureSaveTestData(testId, 'currentQuestion', 0); // ✅ SAVE IT
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // ✅ Handle Section Time Up
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         const timerStorageKey = `${testId}_section_${currentSection}_timer`;
//         try {
//             const storage = window.localStorage || window.sessionStorage;
//             storage.removeItem(timerStorageKey);
//         } catch (error) {
//             console.error('Error clearing timer:', error);
//         }

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0); // ✅ RESET to first question
//             await secureSaveTestData(testId, 'currentQuestion', 0); // ✅ SAVE IT
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // ✅ Handle Test Time Up (for non-sectional tests)
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };

//     // ✅ Initialize Sectional Test - CLEAR OLD TIMERS & RESET TO QUESTION 1
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");
//             const existingSection = await secureGetTestData(testId, "currentSection");
//             const existingCompleted = await secureGetTestData(testId, "sectionCompleted");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh test attempt - Resetting ALL sectional data');

//                 // Clear all old timers
//                 try {
//                     const storage = window.localStorage || window.sessionStorage;
//                     const keysToDelete = [];

//                     for (let i = 0; i < storage.length; i++) {
//                         const key = storage.key(i);
//                         if (key && key.includes(`${testId}_section_`) && key.includes('_timer')) {
//                             keysToDelete.push(key);
//                         }
//                     }

//                     keysToDelete.forEach(key => {
//                         storage.removeItem(key);
//                         console.log(`✅ Cleared timer: ${key}`);
//                     });
//                 } catch (error) {
//                     console.error('Error clearing timers:', error);
//                 }

//                 // ✅ RESET CURRENT QUESTION TO 0 FOR FRESH TEST
//                 setCurrentQuestion(0);
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 setTestStarted(true);

//                 await secureSaveTestData(testId, "currentQuestion", 0);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             } else {
//                 console.log('📂 Resuming existing test');
//                 setTestStarted(false);
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length, groupedQuestions.length]);

//     // ✅ Initialize NON-SECTIONAL Test - RESET TO QUESTION 1
//     useEffect(() => {
//         const initializeNonSectionalTest = async () => {
//             if (!testId || isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh non-sectional test - Reset to question 1');
//                 setCurrentQuestion(0);
//                 await secureSaveTestData(testId, "currentQuestion", 0);
//             }
//         };

//         if (questionsState.length > 0) {
//             initializeNonSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // ✅ Restore Test Data
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state');
//                 return;
//             }

//             try {
//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentQuestion,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentQuestion"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                 }

//                 if (storedMarked) setMarkedForReview(storedMarked);
//                 if (storedSkipped) setSkippedQuestions(storedSkipped);
//                 if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//                 if (storedCurrentQuestion !== null && storedCurrentQuestion !== undefined) {
//                     setCurrentQuestion(storedCurrentQuestion);
//                 }

//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming, isSectionalTest, groupedQuestions.length]);

//     // ✅ Save current question on every change
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "currentQuestion", currentQuestion);
//     }, [currentQuestion, testId]);

//     // ✅ Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // ✅ Handle Save And Next (WITH LAST QUESTION POPUP)
//     const handleSaveAndNext = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         // ✅ CHECK IF LAST QUESTION AND SHOW POPUP
//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // ✅ Handle Next Question
//     const handleNextQuestion = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // ✅ Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // ✅ Pause/Back Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             console.log('💾 Saving all test state before pause...');

//             await Promise.all([
//                 secureSaveTestData(testId, "selectedOptions", selectedOptions),
//                 secureSaveTestData(testId, "optionSelected", optionSelected),
//                 secureSaveTestData(testId, "markedForReview", markedForReview),
//                 secureSaveTestData(testId, "skippedQuestions", skippedQuestions),
//                 secureSaveTestData(testId, "marked_with_ans", markedWithAns),
//                 secureSaveTestData(testId, "currentQuestion", currentQuestion),
//                 secureSaveTestData(testId, "currentSection", currentSection),
//                 secureSaveTestData(testId, "sectionCompleted", sectionCompleted),
//             ]);

//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//                 pausedAt: new Date().toISOString()
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//             console.log('✅ Test paused successfully');
//             exitFullScreen();

//             nav('/testpakages', {
//                 replace: true,
//                 state: {
//                     testId: state?.testId,
//                     isResuming: true
//                 }
//             });
//         } catch (error) {
//             console.error("❌ Failed to pause test:", error);
//             showErrorToast('Failed to pause test. Please try again.');
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // ✅ Submit Test
//     const handleSubmit = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             if (res.status_code == 200) {
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 await clearAllTestData(testId);

//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId
//                             }
//                         },
//                         userData: userInfo
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 {/* ✅ Timer - Show Total Time (static) */}
//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* ✅ Submit Section Button - ONLY FOR MAINS EXAMS */}
//                         {isSectionalTest && 
//                          state?.testInfo?.test_series_type === 'mains' && 
//                          !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         {/* Submit Test Button */}
//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* ✅ TIMER DISPLAY */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest ? (
//                             <TestTimer
//                                 key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${testId}_section_${currentSection}_timer`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={testStarted}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 {/* ✅ Question Navigation Grid */}
//                 <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
//                     {/* <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest 
//                             ? `${currentSectionData?.subject_name || `Section ${currentSection + 1}`} (Questions 1-${currentSectionData?.totalQuestions})` 
//                             : 'All Questions (1-100)'}
//                     </h3> */}

//                     <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest ? (
//                             <>
//                                 <div className="text-base">{currentSectionData?.subject_name || `Section ${currentSection + 1}`}</div>
//                                 <div className="text-xs text-gray-600 mt-1">
//                                     Questions {currentSectionData?.startQuestionNumber} - {currentSectionData?.endQuestionNumber}
//                                     <span className="ml-2 text-blue-600 font-semibold">
//                                         ({currentSectionData?.totalQuestions} total)
//                                     </span>
//                                 </div>
//                             </>
//                         ) : (
//                             'All Questions (1-100)'
//                         )}
//                     </h3>

//                     {/* Status Legend */}
//                     <div className="mb-4 space-y-2 text-xs">
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-green-500 rounded"></div>
//                             <span>Attempted ({optionSelected.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-yellow-500 rounded"></div>
//                             <span>Marked with Answer ({markedWithAns.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-red-500 rounded"></div>
//                             <span>Marked without Answer ({markedForReview.length})</span>
//                         </div>
//                     </div>

//                     {/* ✅ Question Numbers Grid - SHOWS 1-25 FOR EACH SECTION */}
//                     <div className="grid grid-cols-5 gap-2">
//                         {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
//                             const isAttempted = optionSelected.includes(q.id);
//                             const isMarkedWithAns = markedWithAns.includes(q.id);
//                             const isMarked = markedForReview.includes(q.id);
//                             const isCurrent = index === currentQuestion;

//                             let bgColor = 'bg-gray-200';
//                             if (isAttempted) bgColor = 'bg-green-500 text-white';
//                             if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
//                             if (isMarked) bgColor = 'bg-red-500 text-white';

//                             return (
//                                 <button
//                                     key={q.id}
//                                     onClick={() => setCurrentQuestion(index)}
//                                     className={`w-10 h-10 rounded font-semibold text-sm transition-all hover:scale-110 ${bgColor} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
//                                         }`}
//                                 >
//                                     {/* ✅ SHOWS 1-25 for each section */}
//                                     {index + 1}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Question Display Area */}
//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             {/* <div className="text-base font-bold text-gray-900">
//                                 Question {currentQuestion + 1}/
//                                 {isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length}
//                                 {isSectionalTest && (
//                                     <span className="ml-2 text-sm text-gray-600">
//                                         (Section {currentSection + 1}: {currentSectionData?.subject_name})
//                                     </span>
//                                 )}
//                             </div> */}

//                             <div className="text-base font-bold text-gray-900">
//                                 {isSectionalTest ? (
//                                     <>
//                                         Question {currentQuestion + 1} of {currentSectionData?.totalQuestions}
//                                         <span className="ml-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
//                                             Section {currentSection + 1}: {currentSectionData?.subject_name}
//                                         </span>
//                                         <span className="ml-2 text-xs text-gray-500">
//                                             (Global: Q{(currentSectionData?.startQuestionNumber || 0) + currentQuestion})
//                                         </span>
//                                     </>
//                                 ) : (
//                                     <>Question {currentQuestion + 1}/{questionsState.length}</>
//                                 )}
//                             </div>

//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ LAST QUESTION CONFIRMATION MODAL */}
//             {showLastQuestionModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">
//                             Last Question Reached
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             You've completed all questions. Would you like to:
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setCurrentQuestion(0);
//                                 }}
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                             >
//                                 Go to First Question
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setConfirmSubmit(true);
//                                 }}
//                                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                             >
//                                 Submit Test
//                             </button>
//                             <button
//                                 onClick={() => setShowLastQuestionModal(false)}
//                                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Stay on Current Question
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Section Submit Confirmation Modal */}
//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Report Modal */}
//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* All Other Modals */}
//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     attendQuestionSubmitSlice,
//     getSingleCategoryPackageTestseriesQuestionSlice,
//     saveCollectionSlice,
//     removeUserCollectionSlice,
//     getUserCollectionDetailSlice
// } from '../../redux/HomeSlice';
// import QuestionGridModal from '../../components/QuestionGridModal';
// import TestTimer from '../../components/TestTimer';
// import PauseTestModal from '../../components/PauseTestModal';
// import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
// import ExamInstructionsModal from '../../components/ExamInstructionsModal';
// import SymbolModal from '../../components/SymbolModal';
// import MathRenderer from '../../utils/MathRenderer';
// import { Flag, Bookmark, BookmarkCheck, Loader2, X } from 'lucide-react';
// import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
// import {
//     secureSaveTestData,
//     secureGetTestData,
//     clearAllTestData,
// } from '../../helpers/testStorage';
// import { getUserDataDecrypted } from '../../helpers/userStorage';
// import { secureGet } from '../../helpers/storeValues';
// import 'katex/dist/katex.min.css';
// import { reportedQuestionSlice } from '../../redux/authSlice';

// const Screen5 = () => {
//     const nav = useNavigate();
//     const dispatch = useDispatch();
//     const { state } = useLocation();

//     // ✅ FIXED: Check if test has sections - ONLY check if testDetail exists with multiple sections
//     const isSectionalTest = useMemo(() => {
//         const hasMultipleSections = state?.testDetail && 
//                                    Array.isArray(state.testDetail) && 
//                                    state.testDetail.length > 1;

//         console.log('🔍 Checking if sectional test:');
//         console.log('  - testDetail exists:', !!state?.testDetail);
//         console.log('  - testDetail length:', state?.testDetail?.length);
//         console.log('  - Is Sectional:', hasMultipleSections);

//         return hasMultipleSections;
//     }, [state?.testDetail]);

//     // ✅ Check if it's a MAINS exam (for section submit button visibility)
//     const isMainsExam = state?.testInfo?.test_series_type === 'mains';

//     // Basic States
//     const [userInfo, setUserInfo] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [questionsState, setQuestionsState] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [questionStartTime, setQuestionStartTime] = useState(Date.now());
//     const [language, setLanguage] = useState('en');
//     const [showPauseModal, setShowPauseModal] = useState(false);
//     const [confirmSubmit, setConfirmSubmit] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Sectional Test States
//     const [currentSection, setCurrentSection] = useState(0);
//     const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
//     const [sectionCompleted, setSectionCompleted] = useState([]);
//     const [sectionTimerKeys,  ] = useState({});
//     const [testStarted, setTestStarted] = useState(false);
//     const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

//     // Question States
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [optionSelected, setOptionSelected] = useState([]);
//     const [markedForReview, setMarkedForReview] = useState([]);
//     const [skippedQuestions, setSkippedQuestions] = useState([]);
//     const [markedWithAns, setMarkedWithAns] = useState([]);

//     // Bookmark & Report States
//     const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//     const [bookmarkLoading, setBookmarkLoading] = useState(false);
//     const [showReportModal, setShowReportModal] = useState(false);
//     const [reportReason, setReportReason] = useState('');
//     const [reportLoading, setReportLoading] = useState(false);

//     const testId = state?.testInfo?.test_id;

//     // ✅ FIXED: Group questions by section properly
//     const groupedQuestions = useMemo(() => {
//         if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
//             console.log('❌ Skipping grouping - not sectional test or no data');
//             return [];
//         }

//         console.log('📊 Starting question grouping...');
//         console.log('Total questions from API:', questionsState.length);
//         console.log('Sections from testDetail:', state.testDetail);

//         const grouped = [];
//         let startIndex = 0;

//         state.testDetail.forEach((section, sectionIndex) => {
//             const sectionQuestionCount = parseInt(section.no_of_question) || 0;
//             const sectionTime = parseInt(section.sectional_time) || 0;

//             const sectionQuestions = questionsState.slice(
//                 startIndex, 
//                 startIndex + sectionQuestionCount
//             );

//             console.log(`\n📌 Section ${sectionIndex + 1}: ${section.subject_name}`);
//             console.log(`  - Start Index: ${startIndex}`);
//             console.log(`  - End Index: ${startIndex + sectionQuestionCount}`);
//             console.log(`  - Questions count: ${sectionQuestions.length}`);
//             if (sectionQuestions.length > 0) {
//                 console.log(`  - First question ID:`, sectionQuestions[0]?.id);
//                 console.log(`  - Last question ID:`, sectionQuestions[sectionQuestions.length - 1]?.id);
//             }

//             grouped.push({
//                 subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
//                 sectionTime: sectionTime,
//                 marks: parseFloat(section.marks) || 0,
//                 negative_mark: section.negative_mark || "0.50",
//                 totalQuestions: sectionQuestionCount,
//                 questions: sectionQuestions,
//                 startQuestionNumber: startIndex + 1,
//                 endQuestionNumber: startIndex + sectionQuestionCount
//             });

//             startIndex += sectionQuestionCount;
//         });

//         console.log('\n✅ Grouped Questions:', grouped);
//         console.log('Total sections created:', grouped.length);

//         return grouped;
//     }, [questionsState, isSectionalTest, state?.testDetail]);

//     // ✅ Get current section data
//     const getCurrentSectionData = () => {
//         if (!isSectionalTest || groupedQuestions.length === 0) return null;

//         const sectionData = groupedQuestions[currentSection];

//         if (!sectionData) {
//             console.error(`❌ Section ${currentSection} data not found!`);
//             return null;
//         }

//         return sectionData;
//     };

//     const currentSectionData = getCurrentSectionData();

//     // ✅ DEBUG: Verify grouping
//     useEffect(() => {
//         if (groupedQuestions.length > 0) {
//             console.log('\n🔍 GROUPED QUESTIONS VERIFICATION:');
//             groupedQuestions.forEach((section, idx) => {
//                 console.log(`\nSection ${idx + 1}: ${section.subject_name}`);
//                 console.log(`  Questions: ${section.startQuestionNumber}-${section.endQuestionNumber}`);
//                 console.log(`  Total: ${section.totalQuestions}`);
//                 console.log(`  Actual questions array length: ${section.questions.length}`);
//                 if (section.questions.length > 0) {
//                     console.log(`  First 3 question IDs:`, section.questions.slice(0, 3).map(q => q.id));
//                 }
//             });
//         }
//     }, [groupedQuestions]);

//     // Prevent browser back button
//     useEffect(() => {
//         const handleBackButton = (e) => {
//             e.preventDefault();
//             setShowPauseModal(true);
//         };
//         window.history.pushState(null, '', window.location.pathname);
//         window.addEventListener('popstate', handleBackButton);
//         return () => {
//             window.removeEventListener('popstate', handleBackButton);
//         };
//     }, []);

//     // Initialize section timer keys
//     useEffect(() => {
//         if (!isSectionalTest) return;

//         setSectionTimerKeys(prev => ({
//             ...prev,
//             [currentSection]: `section_${testId}_${currentSection}_${Date.now()}_${Math.random()}`
//         }));
//     }, [currentSection, isSectionalTest, testId]);

//     // Handle Section Submit
//     const handleSectionSubmit = () => {
//         setShowSectionSubmitConfirm(true);
//     };

//     const confirmSectionSubmit = async () => {
//         setShowSectionSubmitConfirm(false);

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             await secureSaveTestData(testId, 'currentQuestion', 0);
//             showSuccessToast(`Section ${currentSection + 1} completed! Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Please submit the test.');
//         }
//     };

//     // Handle Section Time Up
//     const handleSectionTimeUp = async () => {
//         console.log('⏰ Section time up!');

//         const updatedCompleted = [...sectionCompleted, currentSection];
//         setSectionCompleted(updatedCompleted);
//         await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

//         const timerStorageKey = `${testId}_section_${currentSection}_timer`;
//         try {
//             const storage = window.localStorage || window.sessionStorage;
//             storage.removeItem(timerStorageKey);
//         } catch (error) {
//             console.error('Error clearing timer:', error);
//         }

//         if (currentSection < groupedQuestions.length - 1) {
//             setCurrentSection(prev => prev + 1);
//             setCurrentQuestion(0);
//             await secureSaveTestData(testId, 'currentQuestion', 0);
//             showSuccessToast(`Moving to Section ${currentSection + 2}`);
//         } else {
//             showSuccessToast('All sections completed! Submitting test...');
//             await handleSubmit();
//         }
//     };

//     // Handle Test Time Up
//     const handleTimeUp = async () => {
//         console.log('⏰ Test time up!');
//         showSuccessToast('Time up! Submitting test...');
//         await handleSubmit();
//     };

//     // ✅ Initialize Sectional Test
//     useEffect(() => {
//         const initializeSectionalTest = async () => {
//             if (!testId || !isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh sectional test - Resetting ALL data');

//                 // Clear old timers
//                 try {
//                     const storage = window.localStorage || window.sessionStorage;
//                     const keysToDelete = [];

//                     for (let i = 0; i < storage.length; i++) {
//                         const key = storage.key(i);
//                         if (key && key.includes(`${testId}_section_`) && key.includes('_timer')) {
//                             keysToDelete.push(key);
//                         }
//                     }

//                     keysToDelete.forEach(key => {
//                         storage.removeItem(key);
//                         console.log(`✅ Cleared timer: ${key}`);
//                     });
//                 } catch (error) {
//                     console.error('Error clearing timers:', error);
//                 }

//                 setCurrentQuestion(0);
//                 setCurrentSection(0);
//                 setSectionCompleted([]);
//                 setTestStarted(true);

//                 await secureSaveTestData(testId, "currentQuestion", 0);
//                 await secureSaveTestData(testId, "currentSection", 0);
//                 await secureSaveTestData(testId, "sectionCompleted", []);
//             } else {
//                 console.log('📂 Resuming existing sectional test');
//                 setTestStarted(false);
//             }
//         };

//         if (questionsState.length > 0 && groupedQuestions.length > 0) {
//             initializeSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length, groupedQuestions.length]);

//     // ✅ Initialize NON-SECTIONAL Test
//     useEffect(() => {
//         const initializeNonSectionalTest = async () => {
//             if (!testId || isSectionalTest) return;

//             const existingOptions = await secureGetTestData(testId, "selectedOptions");

//             if (!existingOptions || Object.keys(existingOptions).length === 0) {
//                 console.log('🆕 Fresh non-sectional test - Reset to question 1');
//                 setCurrentQuestion(0);
//                 await secureSaveTestData(testId, "currentQuestion", 0);
//             }
//         };

//         if (questionsState.length > 0) {
//             initializeNonSectionalTest();
//         }
//     }, [testId, isSectionalTest, questionsState.length]);

//     // Restore Test Data
//     useEffect(() => {
//         const restoreEncryptedTestData = async () => {
//             const testIdToUse = state?.testInfo?.test_id;

//             if (!testIdToUse) {
//                 console.error('❌ No testId found in state');
//                 return;
//             }

//             try {
//                 const [
//                     storedOptions,
//                     storedAttempted,
//                     storedMarked,
//                     storedSkipped,
//                     storedMarkedWithAns,
//                     storedCurrentQuestion,
//                     storedCurrentSection,
//                     storedCompletedSections
//                 ] = await Promise.all([
//                     secureGetTestData(testId, "selectedOptions"),
//                     secureGetTestData(testId, "optionSelected"),
//                     secureGetTestData(testId, "markedForReview"),
//                     secureGetTestData(testId, "skippedQuestions"),
//                     secureGetTestData(testId, "marked_with_ans"),
//                     secureGetTestData(testId, "currentQuestion"),
//                     secureGetTestData(testId, "currentSection"),
//                     secureGetTestData(testId, "sectionCompleted"),
//                 ]);

//                 if (storedOptions && Object.keys(storedOptions).length > 0) {
//                     setSelectedOptions(storedOptions);
//                 }

//                 if (storedAttempted && storedAttempted.length > 0) {
//                     setOptionSelected(storedAttempted);
//                 }

//                 if (storedMarked) setMarkedForReview(storedMarked);
//                 if (storedSkipped) setSkippedQuestions(storedSkipped);
//                 if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);

//                 if (storedCurrentQuestion !== null && storedCurrentQuestion !== undefined) {
//                     setCurrentQuestion(storedCurrentQuestion);
//                 }

//                 if (isSectionalTest && groupedQuestions.length > 0) {
//                     if (storedCurrentSection !== null && storedCurrentSection < groupedQuestions.length) {
//                         setCurrentSection(storedCurrentSection);
//                     } else {
//                         setCurrentSection(0);
//                     }

//                     if (storedCompletedSections && Array.isArray(storedCompletedSections)) {
//                         const validCompleted = storedCompletedSections.filter(
//                             sec => sec >= 0 && sec < groupedQuestions.length
//                         );
//                         setSectionCompleted(validCompleted);
//                     } else {
//                         setSectionCompleted([]);
//                     }
//                 }

//                 if (state?.isResuming) {
//                     const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//                     const updatedStatus = existingStatus.filter(item => item.test_id !== testId);
//                     await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);
//                 }

//             } catch (error) {
//                 console.error('❌ Error restoring test data:', error);
//             }
//         };

//         if (questionsState.length > 0) {
//             restoreEncryptedTestData();
//         }
//     }, [testId, questionsState.length, state?.isResuming, isSectionalTest, groupedQuestions.length]);

//     // Save current question
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "currentQuestion", currentQuestion);
//     }, [currentQuestion, testId]);

//     // Save section progress
//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "currentSection", currentSection);
//     }, [currentSection, testId, isSectionalTest]);

//     useEffect(() => {
//         if (!testId || !isSectionalTest) return;
//         secureSaveTestData(testId, "sectionCompleted", sectionCompleted);
//     }, [sectionCompleted, testId, isSectionalTest]);

//     // Load User Data
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         const lang = await secureGet("language");
//         setLanguage(lang);
//         setUserInfo(user);
//     };

//     useEffect(() => {
//         loadUserData();
//     }, []);

//     // Fetch Bookmarked Questions
//     useEffect(() => {
//         const fetchBookmarks = async () => {
//             try {
//                 const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//                 if (res.status_code === 200) {
//                     const questionIds = (res.data.question_id?.data || []).map(item => item.id);
//                     setBookmarkedQuestions(questionIds);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bookmarks:', error);
//             }
//         };
//         fetchBookmarks();
//     }, [dispatch]);

//     // Toggle Bookmark
//     const handleToggleBookmark = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;
//         const isBookmarked = bookmarkedQuestions.includes(currentQuestionId);

//         setBookmarkLoading(true);

//         if (isBookmarked) {
//             setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//         } else {
//             setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//         }

//         try {
//             let result;
//             if (isBookmarked) {
//                 result = await dispatch(removeUserCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             } else {
//                 result = await dispatch(saveCollectionSlice({
//                     video_id: [],
//                     lession_id: [],
//                     class_note_id: [],
//                     study_note_id: [],
//                     article_id: [],
//                     news_id: [],
//                     question_id: [currentQuestionId],
//                     test_series_id: [],
//                     package_id: []
//                 })).unwrap();
//             }

//             if (result.status_code === 200) {
//                 showSuccessToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
//             } else {
//                 if (isBookmarked) {
//                     setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//                 } else {
//                     setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//                 }
//                 showErrorToast('Failed to update bookmark');
//             }
//         } catch (error) {
//             console.error('Bookmark error:', error);
//             if (isBookmarked) {
//                 setBookmarkedQuestions(prev => [...prev, currentQuestionId]);
//             } else {
//                 setBookmarkedQuestions(prev => prev.filter(id => id !== currentQuestionId));
//             }
//             showErrorToast('Something went wrong');
//         } finally {
//             setBookmarkLoading(false);
//         }
//     };

//     // Handle Report Question
//     const handleReportQuestion = async () => {
//         if (!reportReason.trim()) {
//             showErrorToast('Please enter a reason');
//             return;
//         }

//         setReportLoading(true);
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentQuestionId = currentQuestionData?.id;

//         try {
//             const reportData = {
//                 question_id: currentQuestionId,
//                 reason: reportReason,
//                 test_id: state?.testInfo?.test_id,
//             };

//             const res = await dispatch(reportedQuestionSlice(reportData)).unwrap();

//             if (res.status_code === 200 || res.success) {
//                 showSuccessToast('Question reported successfully');
//                 setShowReportModal(false);
//                 setReportReason('');
//             } else {
//                 showErrorToast(res.message || 'Failed to report question');
//             }
//         } catch (error) {
//             console.error('Report error:', error);
//             showErrorToast(error.message || 'Failed to report question');
//         } finally {
//             setReportLoading(false);
//         }
//     };

//     // Fullscreen Functions
//     const enterFullScreen = () => {
//         const elem = document.documentElement;
//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//             setIsFullScreen(true);
//         } else if (elem.webkitRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             setIsFullScreen(true);
//             elem.msRequestFullscreen();
//         }
//     };

//     const exitFullScreen = () => {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//     };

//     useEffect(() => {
//         enterFullScreen();
//     }, []);

//     // Fetch Questions
//     const getTestSeriesQuestion = async () => {
//         try {
//             setLoading(true);
//             const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id)).unwrap();
//             if (res.status_code == 200) {
//                 console.log('✅ Questions loaded:', res.data.length);
//                 setQuestionsState(res.data);
//                 setLoading(false);
//             }
//         } catch (error) {
//             setLoading(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTestSeriesQuestion();
//     }, []);

//     // Save Test Data
//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "selectedOptions", selectedOptions);
//     }, [selectedOptions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "optionSelected", optionSelected);
//     }, [optionSelected]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "markedForReview", markedForReview);
//     }, [markedForReview]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
//     }, [skippedQuestions]);

//     useEffect(() => {
//         if (!testId) return;
//         secureSaveTestData(testId, "marked_with_ans", markedWithAns);
//     }, [markedWithAns]);

//     // Handle Option Change
//     const handleOptionChange = async (questionId, optionKey) => {
//         const updated = { ...selectedOptions, [questionId]: optionKey };
//         setSelectedOptions(updated);

//         const updatedData = { ...selectedOptions, [questionId]: optionKey };
//         await secureSaveTestData(testId, 'selectedOptions', updatedData);

//         if (markedForReview.includes(questionId)) {
//             if (!markedWithAns.includes(questionId)) {
//                 const updatedMarkedWithAns = [...markedWithAns, questionId];
//                 setMarkedWithAns(updatedMarkedWithAns);
//                 await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//             }
//         }

//         if (skippedQuestions.includes(questionId)) {
//             const updatedSkipped = skippedQuestions.filter(id => id !== questionId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Option Deselect
//     const handleOptionDeselect = async (questionId) => {
//         const updatedSelectedOptions = { ...selectedOptions };
//         delete updatedSelectedOptions[questionId];
//         setSelectedOptions(updatedSelectedOptions);
//         await secureSaveTestData(testId, 'selectedOptions', updatedSelectedOptions);

//         let updatedMarkedWithAns = markedWithAns;
//         if (markedWithAns.includes(questionId)) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== questionId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         let updatedSkipped = skippedQuestions;
//         if (!skippedQuestions.includes(questionId)) {
//             updatedSkipped = [...skippedQuestions, questionId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }
//     };

//     // Handle Save And Next
//     const handleSaveAndNext = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadySelected = optionSelected.includes(currentId);
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         let updatedSelected = optionSelected;
//         let updatedSkipped = skippedQuestions;
//         let updatedMarkedWithAns = markedWithAns;
//         let updatedMarked = markedForReview;

//         if (isOptionSelected && !isAlreadySelected) {
//             updatedSelected = [...optionSelected, currentId];
//             setOptionSelected(updatedSelected);
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         if (isOptionSelected && skippedQuestions.includes(currentId)) {
//             updatedSkipped = skippedQuestions.filter(id => id !== currentId);
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         if (isOptionSelected && isAlreadyMarked && !isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);

//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         if (isAlreadyMarkedWithAns) {
//             updatedMarkedWithAns = markedWithAns.filter(id => id !== currentId);
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (isAlreadyMarked) {
//             updatedMarked = markedForReview.filter(id => id !== currentId);
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;

//         if (currentQuestion === totalQuestions - 1) {
//             setShowLastQuestionModal(true);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Mark For Review
//     const handleMarkForReview = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         const isOptionSelected = !!selectedOptions[currentId];
//         const isAlreadyMarked = markedForReview.includes(currentId);
//         const isAlreadyMarkedWithAns = markedWithAns.includes(currentId);

//         if (isOptionSelected && !isAlreadyMarkedWithAns) {
//             const updatedMarkedWithAns = [...markedWithAns, currentId];
//             setMarkedWithAns(updatedMarkedWithAns);
//             await secureSaveTestData(testId, 'marked_with_ans', updatedMarkedWithAns);
//         }

//         if (!isOptionSelected && !isAlreadyMarked) {
//             const updatedMarked = [...markedForReview, currentId];
//             setMarkedForReview(updatedMarked);
//             await secureSaveTestData(testId, 'markedForReview', updatedMarked);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Handle Next Question
//     const handleNextQuestion = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         await updateSpentTime(currentId);

//         if (!selectedOptions[currentId] && !skippedQuestions.includes(currentId)) {
//             const updatedSkipped = [...skippedQuestions, currentId];
//             setSkippedQuestions(updatedSkipped);
//             await secureSaveTestData(testId, 'skippedQuestions', updatedSkipped);
//         }

//         const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
//         if (currentQuestion === totalQuestions - 1) {
//             setCurrentQuestion(0);
//         } else {
//             setCurrentQuestion(prev => prev + 1);
//         }
//     };

//     // Update Spent Time
//     useEffect(() => {
//         setQuestionStartTime(Date.now());
//     }, [currentQuestion]);

//     const updateSpentTime = async (questionId) => {
//         const now = Date.now();
//         const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

//         let existing = await secureGetTestData(testId, 'spentTime');
//         existing = existing || [];

//         const updated = (() => {
//             const found = existing.find(item => item.questionId === questionId);
//             if (found) {
//                 return existing.map(item =>
//                     item.questionId === questionId
//                         ? { ...item, time: item.time + timeSpentOnQuestion }
//                         : item
//                 );
//             } else {
//                 return [...existing, { questionId, time: timeSpentOnQuestion }];
//             }
//         })();

//         await secureSaveTestData(testId, 'spentTime', updated);
//     };

//     // Timer
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setElapsedSeconds(prev => prev + 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [currentQuestion]);

//     useEffect(() => {
//         setElapsedSeconds(0);
//     }, [currentQuestion]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     // Get current question
//     const current = isSectionalTest
//         ? currentSectionData?.questions[currentQuestion]
//         : questionsState[currentQuestion];

//     if (!current) return (
//         <div className="p-4 text-red-500 w-full h-full flex items-center justify-center">
//             <div className="fading-spinner">
//                 {[...Array(12)].map((_, i) => (
//                     <div key={i} className={`bar bar${i + 1}`}></div>
//                 ))}
//             </div>
//         </div>
//     );

//     const options = language === 'en'
//         ? {
//             a: current.option_english_a,
//             b: current.option_english_b,
//             c: current.option_english_c,
//             d: current.option_english_d,
//         }
//         : {
//             a: current.option_hindi_a,
//             b: current.option_hindi_b,
//             c: current.option_hindi_c,
//             d: current.option_hindi_d,
//         };

//     // Pause/Back Functions
//     const handlePauseClick = () => {
//         setShowPauseModal(true);
//     };

//     const handleConfirmPause = async () => {
//         setShowPauseModal(false);
//         const currentTestId = state?.testInfo?.test_id;

//         try {
//             console.log('💾 Saving all test state before pause...');

//             await Promise.all([
//                 secureSaveTestData(testId, "selectedOptions", selectedOptions),
//                 secureSaveTestData(testId, "optionSelected", optionSelected),
//                 secureSaveTestData(testId, "markedForReview", markedForReview),
//                 secureSaveTestData(testId, "skippedQuestions", skippedQuestions),
//                 secureSaveTestData(testId, "marked_with_ans", markedWithAns),
//                 secureSaveTestData(testId, "currentQuestion", currentQuestion),
//                 secureSaveTestData(testId, "currentSection", currentSection),
//                 secureSaveTestData(testId, "sectionCompleted", sectionCompleted),
//             ]);

//             const existingStatus = await secureGetTestData('pause_status', 'pause_status_array') || [];
//             const updatedStatus = existingStatus.filter(item => item.test_id !== currentTestId);

//             updatedStatus.push({
//                 test_id: currentTestId,
//                 isPaused: true,
//                 pausedAt: new Date().toISOString()
//             });

//             await secureSaveTestData('pause_status', 'pause_status_array', updatedStatus);

//             console.log('✅ Test paused successfully');
//             exitFullScreen();

//             nav('/testpakages', {
//                 replace: true,
//                 state: {
//                     testId: state?.testId,
//                     isResuming: true
//                 }
//             });
//         } catch (error) {
//             console.error("❌ Failed to pause test:", error);
//             showErrorToast('Failed to pause test. Please try again.');
//         }
//     };

//     const handleCancelPause = () => {
//         setShowPauseModal(false);
//         window.history.pushState(null, '', window.location.pathname);
//     };

//     const questionText = language === 'en' ? current.question_english : current.question_hindi;

//     // Submit Test
//     const handleSubmit = async () => {
//         const currentQuestionData = isSectionalTest
//             ? currentSectionData?.questions[currentQuestion]
//             : questionsState[currentQuestion];
//         const currentId = currentQuestionData?.id;

//         if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
//             const updatedSelected = [...optionSelected, currentId];
//             await secureSaveTestData(testId, 'optionSelected', updatedSelected);
//         }

//         const spentTime = await secureGetTestData(testId, 'spentTime') || [];
//         const optionSelected2 = await secureGetTestData(testId, 'optionSelected') || [];
//         const selectedOptions2 = await secureGetTestData(testId, 'selectedOptions') || {};
//         const skippedQuestions2 = await secureGetTestData(testId, 'skippedQuestions') || [];
//         const markedForReview2 = await secureGetTestData(testId, 'markedForReview') || [];

//         const totalAttendedQuestions = optionSelected2.length;
//         const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

//         let correct = 0;
//         let in_correct = 0;

//         const allAttendedQuestions = optionSelected2.map((questionId) => {
//             const question = questionsState.find(q => q.id === questionId);
//             const selectedAns = selectedOptions2[questionId];
//             const rightAns = question?.hindi_ans;

//             if (selectedAns && rightAns && selectedAns.toLowerCase() === rightAns.toLowerCase()) {
//                 correct++;
//             } else {
//                 in_correct++;
//             }

//             return {
//                 question_id: questionId,
//                 user_selected_ans: selectedAns,
//                 right_ans: rightAns,
//                 subject_id: question?.subject_id || null,
//                 subject_name: question?.subject_name || null
//             };
//         });

//         const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
//         const totalMarks = state?.testDetail?.reduce((sum, section) => sum + parseFloat(section.marks || 0), 0) || 0;
//         const markPer_ques = totalMarks / questionsState.length;
//         const marksScored = (correct * markPer_ques) - (in_correct * negativeMark);
//         const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

//         const submissionData = {
//             test_id: testId,
//             total_attend_question: totalAttendedQuestions,
//             total_not_answer_question: totalNotAnsweredQuestions,
//             correct,
//             in_correct,
//             marks: marksScored,
//             time: totalTimeSpent,
//             negative_mark: negativeMark,
//             all_attend_question: allAttendedQuestions,
//             spent_time: spentTime,
//             skip_question: skippedQuestions2,
//             attend_question: optionSelected2,
//             mark_for_review: markedForReview2
//         };

//         try {
//             const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();

//             if (res.status_code == 200) {
//                 const attendId = res.data?.id || res.data?.attend_id;

//                 if (attendId) {
//                     await secureSaveTestData(testId, 'attend_id', attendId);
//                 }

//                 await clearAllTestData(testId);

//                 nav('/analysis', {
//                     replace: true,
//                     state: {
//                         ...state,
//                         attend_id: attendId,
//                         testInfo: {
//                             ...state?.testInfo,
//                             attend_id: attendId,
//                             test_id: testId
//                         },
//                         testData: {
//                             my_detail: {
//                                 test_id: testId,
//                                 attend_id: attendId
//                             }
//                         },
//                         userData: userInfo
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("❌ Error in Submitting Test:", error);
//             showErrorToast('Failed to submit test. Please try again.');
//         }
//     };

//     const isCurrentBookmarked = bookmarkedQuestions.includes(current?.id);

//     return (
//         <div className="flex flex-col p-4 text-sm font-sans overflow-hidden w-full">
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
//                 <div className="text-lg font-bold">{state?.testInfo?.title || 'SSC ONLINE MOCK TEST'}</div>

//                 <div className="w-full lg:w-auto m-auto bg-gray-800 text-white rounded-sm px-4 py-2">
//                     <div className="flex items-center gap-2 text-base font-semibold">
//                         <span>Total Test Time:</span>
//                         <span className="text-yellow-400">{state?.testInfo?.time} minutes</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap justify-between lg:justify-end items-center gap-3 w-full lg:w-auto">
//                     <button onClick={handlePauseClick} className="bg-yellow-400 text-gray-800 px-3 py-2 rounded text-xs font-bold">Pause</button>
//                     {isFullScreen ? (
//                         <button
//                             onClick={() => { setIsFullScreen(false); exitFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Exit Full Screen
//                         </button>
//                     ) : (
//                         <button
//                             onClick={() => { setIsFullScreen(true); enterFullScreen(); }}
//                             className="px-4 py-2 bg-gray-600 rounded-md text-white text-xs"
//                         >
//                             Full Screen
//                         </button>
//                     )}
//                     <div className="text-sm">Name: <span className="font-semibold">{userInfo?.name || 'guest'}</span></div>
//                 </div>
//             </div>

//             {/* Top Controls */}
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-y py-4 mb-3 gap-3">
//                 <div className="text-red-600 font-semibold text-center flex flex-wrap gap-3 w-full lg:w-auto">
//                     <button
//                         onMouseEnter={() => setIsModalOpen(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         SYMBOLS
//                     </button>
//                     <button
//                         onMouseEnter={() => setOpenModal(true)}
//                         className="text-orange-600 font-bold px-4 py-2 rounded text-base hover:underline"
//                     >
//                         INSTRUCTIONS
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2 items-start lg:items-center justify-between">
//                     <div className="flex flex-wrap gap-2">
//                         {selectedOptions[current.id] && (
//                             <button
//                                 onClick={() => handleOptionDeselect(current.id)}
//                                 className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors"
//                             >
//                                 Clear Option
//                             </button>
//                         )}
//                         <button
//                             onClick={handleMarkForReview}
//                             className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                         >
//                             Mark for Review
//                         </button>
//                         {selectedOptions[current.id] ? (
//                             <button
//                                 onClick={handleSaveAndNext}
//                                 className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors"
//                             >
//                                 Save & Next
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleNextQuestion}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         )}

//                         {/* ✅ Submit Section Button - ONLY FOR MAINS EXAMS */}
//                         {isSectionalTest && 
//                          isMainsExam && 
//                          !sectionCompleted.includes(currentSection) && (
//                             <button
//                                 onClick={handleSectionSubmit}
//                                 className="text-white text-sm font-bold bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition-colors"
//                             >
//                                 Submit Section {currentSection + 1}
//                             </button>
//                         )}

//                         <button
//                             onClick={() => setConfirmSubmit(true)}
//                             className="text-white text-sm font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
//                         >
//                             Submit Test
//                         </button>
//                     </div>

//                     {/* Timer */}
//                     <div className="text-right w-full lg:w-auto">
//                         {isSectionalTest && isMainsExam ? (
//                             <TestTimer
//                                 key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${testId}_section_${currentSection}_timer`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={testStarted}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Body */}
//             <div className="flex flex-col lg:flex-row gap-4 w-full">
//                 {/* Question Navigation Grid */}
//                 <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
//                     <h3 className="font-bold text-gray-800 mb-3 text-sm">
//                         {isSectionalTest ? (
//                             <>
//                                 <div className="text-base">{currentSectionData?.subject_name || `Section ${currentSection + 1}`}</div>
//                                 <div className="text-xs text-gray-600 mt-1">
//                                     Questions {currentSectionData?.startQuestionNumber} - {currentSectionData?.endQuestionNumber}
//                                     <span className="ml-2 text-blue-600 font-semibold">
//                                         ({currentSectionData?.totalQuestions} total)
//                                     </span>
//                                 </div>
//                             </>
//                         ) : (
//                             'All Questions (1-100)'
//                         )}
//                     </h3>

//                     {/* Status Legend */}
//                     <div className="mb-4 space-y-2 text-xs">
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-green-500 rounded"></div>
//                             <span>Attempted ({optionSelected.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-yellow-500 rounded"></div>
//                             <span>Marked with Answer ({markedWithAns.length})</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-6 h-6 bg-red-500 rounded"></div>
//                             <span>Marked without Answer ({markedForReview.length})</span>
//                         </div>
//                     </div>

//                     {/* Question Numbers Grid */}
//                     <div className="grid grid-cols-5 gap-2">
//                         {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
//                             const isAttempted = optionSelected.includes(q.id);
//                             const isMarkedWithAns = markedWithAns.includes(q.id);
//                             const isMarked = markedForReview.includes(q.id);
//                             const isCurrent = index === currentQuestion;

//                             let bgColor = 'bg-gray-200';
//                             if (isAttempted) bgColor = 'bg-green-500 text-white';
//                             if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
//                             if (isMarked) bgColor = 'bg-red-500 text-white';

//                             return (
//                                 <button
//                                     key={q.id}
//                                     onClick={() => setCurrentQuestion(index)}
//                                     className={`w-10 h-10 rounded font-semibold text-sm transition-all hover:scale-110 ${bgColor} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
//                                         }`}
//                                 >
//                                     {index + 1}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Question Display Area */}
//                 <div className="flex-1 relative border px-4 py-3 rounded-lg bg-white shadow-sm" id="testBg">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4 pb-3 border-b">
//                         <div className="flex items-center gap-4">
//                             <div className="text-base font-bold text-gray-900">
//                                 {isSectionalTest ? (
//                                     <>
//                                         Question {currentQuestion + 1} of {currentSectionData?.totalQuestions}
//                                         <span className="ml-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
//                                             Section {currentSection + 1}: {currentSectionData?.subject_name}
//                                         </span>
//                                         <span className="ml-2 text-xs text-gray-500">
//                                             (Global: Q{(currentSectionData?.startQuestionNumber || 0) + currentQuestion})
//                                         </span>
//                                     </>
//                                 ) : (
//                                     <>Question {currentQuestion + 1}/{questionsState.length}</>
//                                 )}
//                             </div>
//                             <div className="text-sm text-gray-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
//                                 Time: {formatTime(elapsedSeconds)}
//                             </div>
//                         </div>

//                         {/* Bookmark & Report Icons */}
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={language}
//                                 onChange={(e) => setLanguage(e.target.value)}
//                                 className="border border-gray-300 text-sm px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 <option value="en">English</option>
//                                 <option value="hi">Hindi</option>
//                             </select>

//                             <button
//                                 onClick={handleToggleBookmark}
//                                 disabled={bookmarkLoading}
//                                 className={`p-2.5 rounded-lg transition-all shadow-md ${isCurrentBookmarked
//                                     ? 'bg-yellow-500 text-white hover:bg-yellow-600 ring-2 ring-yellow-300'
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
//                             >
//                                 {bookmarkLoading ? (
//                                     <Loader2 size={20} className="animate-spin" />
//                                 ) : isCurrentBookmarked ? (
//                                     <BookmarkCheck size={20} />
//                                 ) : (
//                                     <Bookmark size={20} />
//                                 )}
//                             </button>

//                             <button
//                                 onClick={() => setShowReportModal(true)}
//                                 className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all shadow-md"
//                                 title="Report Question"
//                             >
//                                 <Flag size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Question Text */}
//                     <div className="mb-6">
//                         <MathRenderer text={questionText} />
//                     </div>

//                     {/* Options */}
//                     <div className="flex flex-col gap-3">
//                         {Object.entries(options).map(([key, value]) => (
//                             <label
//                                 key={key}
//                                 className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${selectedOptions[current.id] === key
//                                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                                     : 'border-gray-200'
//                                     }`}
//                             >
//                                 <input
//                                     type="radio"
//                                     name={`question_${current.id}`}
//                                     value={key}
//                                     checked={selectedOptions[current.id] === key}
//                                     onChange={() => handleOptionChange(current.id, key)}
//                                     className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <div className="flex-1 option-content text-sm">
//                                     <MathRenderer text={value} />
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Modals */}
//             {showLastQuestionModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">
//                             Last Question Reached
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             You've completed all questions in this {isSectionalTest ? 'section' : 'test'}. Would you like to:
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setCurrentQuestion(0);
//                                 }}
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
//                             >
//                                 Go to First Question
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLastQuestionModal(false);
//                                     setConfirmSubmit(true);
//                                 }}
//                                 className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
//                             >
//                                 Submit Test
//                             </button>
//                             <button
//                                 onClick={() => setShowLastQuestionModal(false)}
//                                 className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Stay on Current Question
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showSectionSubmitConfirm && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Section {currentSection + 1}?</h3>
//                         <p className="text-gray-600 mb-6">
//                             This will mark Section {currentSection + 1} as complete.
//                             {currentSection < groupedQuestions.length - 1
//                                 ? ' You will move to the next section.'
//                                 : ' You can still submit the entire test later.'}
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowSectionSubmitConfirm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmSectionSubmit}
//                                 className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showReportModal && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                                 <Flag className="text-red-600" size={24} />
//                                 Report Question
//                             </h3>
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X size={22} className="text-gray-600" />
//                             </button>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4">
//                             Help us improve! Please describe the issue with this question:
//                         </p>

//                         <textarea
//                             value={reportReason}
//                             onChange={(e) => setReportReason(e.target.value)}
//                             placeholder="E.g., Wrong answer, unclear question, typo..."
//                             className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
//                             rows={5}
//                         />

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowReportModal(false);
//                                     setReportReason('');
//                                 }}
//                                 className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleReportQuestion}
//                                 disabled={reportLoading || !reportReason.trim()}
//                                 className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {reportLoading ? (
//                                     <>
//                                         <Loader2 size={18} className="animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     'Submit Report'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <PauseTestModal
//                 isOpen={showPauseModal}
//                 onConfirm={handleConfirmPause}
//                 onCancel={handleCancelPause}
//             />
//             <ConfirmTestSubmitModal
//                 show={confirmSubmit}
//                 onClose={() => setConfirmSubmit(false)}
//                 onConfirm={handleSubmit}
//             />
//             <ExamInstructionsModal
//                 isOpen={openModal}
//                 onClose={() => setOpenModal(false)}
//                 onAgree={() => { setOpenModal(false); nav("/symbols", { state }); }}
//                 testInfo={state?.testInfo || {}}
//                 testData={state?.testDetail || []}
//             />
//             <SymbolModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />
//         </div>
//     );
// };

// export default Screen5;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    attendQuestionSubmitSlice,
    getSingleCategoryPackageTestseriesQuestionSlice,
    saveCollectionSlice,
    removeUserCollectionSlice,
    getUserCollectionDetailSlice
} from '../../redux/HomeSlice';
import TestTimer from '../../components/TestTimer';
import PauseTestModal from '../../components/PauseTestModal';
import ConfirmTestSubmitModal from '../../components/ConfirmTestSubmitModal';
import ExamInstructionsModal from '../../components/ExamInstructionsModal';
import SymbolModal from '../../components/SymbolModal';
import MathRenderer from '../../utils/MathRenderer';
import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil';
import {
    secureSaveTestData,
    secureGetTestData,
    clearAllTestData,
} from '../../helpers/testStorage';
import { getUserDataDecrypted } from '../../helpers/userStorage';
import { secureGet } from '../../helpers/storeValues';
import 'katex/dist/katex.min.css';
import { reportedQuestionSlice } from '../../redux/authSlice';
import { useParams } from 'react-router-dom';

const Screen5 = () => {
    // const stateVal = JSON.parse(localStorage.getItem("stateVal"))
    // const [state, setState] = useState(stateVal)
    // const { state } = useLocation();

    const location = useLocation();
    const persistedState = JSON.parse(localStorage.getItem("stateVal") || "null");

    // Prefer fresh navigation state, fallback to persisted
    const [state, setState] = useState(location.state || persistedState);

    useEffect(() => {
        if (location.state) {
            setState(location.state);
            localStorage.setItem("stateVal", JSON.stringify(location.state));
        }
    }, [location.state]);

    // console.log("screen 5", state);

    const nav = useNavigate();
    const dispatch = useDispatch();
    // console.log('screen 5', state);

    const testId = state?.testInfo?.testid ?? state?.testInfo?.test_id ?? null;

    // ✅ Capture reattempt intent ONCE on mount.
    // This value stays true for the life of this component session,
    // even after we clear it from history below.
    const [isReattemptSession] = useState(state?.isReattempt || false);

    const isReattempt = isReattemptSession; // Use stable value for logic

    // ✅ FIX: Clear isReattempt from history so refreshes don't reset the timer
    // We check state.isReattempt (the transient one) to decide if we need to clean up
    useEffect(() => {
        if (!state?.isReattempt || !testId) return;

        const resetReattempt = async () => {
            // 🔥 CLEAR EVERYTHING FIRST
            await clearAllTestData(testId);

            // 🔥 FORCE FRESH START
            await secureSaveTestData(testId, "currentSection", 0);
            await secureSaveTestData(testId, "currentQuestion", 0);

            setCurrentSection(0);
            setCurrentQuestion(0);
            setSectionCompleted([]);
            setSelectedOptions({});
            setOptionSelected([]);
            setMarkedForReview([]);
            setSkippedQuestions([]);
            setMarkedWithAns([]);

            // ✅ MARK RESET AS DONE
            setReattemptResetDone(true);
            setHasRestored(true);

            // 🔥 REMOVE isReattempt FROM HISTORY
            const cleanState = { ...state };
            delete cleanState.isReattempt;

            nav(location.pathname, {
                replace: true,
                state: cleanState
            });
        };

        resetReattempt();
    }, [state?.isReattempt, testId]);





    // console.log("isReattempt in Screen5:", isReattempt, "testId:", testId);

    const isResuming = state?.isResuming || false;
    // console.log('Test Id through screen 4??????????', testId);
    // Check if test has sections
    const isSectionalTest = useMemo(() => {
        // ✅ USER RULE: If test_series_type is 'mains', it IS sectional.
        if (state?.testInfo?.test_series_type === 'mains') return true;

        const hasMultipleSections = state?.testDetail &&
            Array.isArray(state.testDetail) &&
            state.testDetail.length > 1;
        return hasMultipleSections;
    }, [state?.testDetail, state?.testInfo]);

    // const testSeriesId = state?.testInfo?.test_id || null;
    // console.log('testSeriesId', testSeriesId);
    // const testSeriesID = localStorage.setItem('testSeriesID', testSeriesId);
    const isMainsExam = state?.testInfo?.test_series_type === 'mains';

    // Basic States
    const [userInfo, setUserInfo] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsState, setQuestionsState] = useState([]);
    const [loading, setLoading] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectionTimerKeys,] = useState({});
    // Sectional Test States
    const [currentSection, setCurrentSection] = useState(0);
    const [showSectionSubmitConfirm, setShowSectionSubmitConfirm] = useState(false);
    const [sectionCompleted, setSectionCompleted] = useState([]);
    const [testStarted, setTestStarted] = useState(false);
    const [showLastQuestionModal, setShowLastQuestionModal] = useState(false);

    // Question States
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionSelected, setOptionSelected] = useState([]);
    const [markedForReview, setMarkedForReview] = useState([]);
    const [skippedQuestions, setSkippedQuestions] = useState([]);
    const [markedWithAns, setMarkedWithAns] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);


    const totalTestTime = parseInt(state?.testInfo?.time) * 60 || 3600;

    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [questionTimeSpent, setQuestionTimeSpent] = useState({});
    const [currentQuestionTime, setCurrentQuestionTime] = useState(0);

    const [reattemptResetDone, setReattemptResetDone] = useState(false);
    const [hasRestored, setHasRestored] = useState(false);


    // Add this useEffect to track per-question time
    useEffect(() => {
        const interval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
            setCurrentQuestionTime(timeSpent);
        }, 1000);

        return () => clearInterval(interval);
    }, [questionStartTime]);

    // Add this useEffect to reset timer when question changes
    useEffect(() => {
        // Save time for previous question
        if (currentQuestion > 0 || Object.keys(selectedOptions).length > 0) {
            const currentQuestionData = isSectionalTest
                ? currentSectionData?.questions[currentQuestion]
                : questionsState[currentQuestion];

            if (currentQuestionData) {
                const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
                setQuestionTimeSpent(prev => ({
                    ...prev,
                    [currentQuestionData.id]: (prev[currentQuestionData.id] || 0) + timeSpent
                }));
            }
        }

        // Reset for new question
        setQuestionStartTime(Date.now());
        setCurrentQuestionTime(0);
    }, [currentQuestion, currentSection]);

    // Group questions by section
    const groupedQuestions = useMemo(() => {
        if (!isSectionalTest || !state?.testDetail || questionsState.length === 0) {
            return [];
        }

        const grouped = [];
        let startIndex = 0;

        state.testDetail.forEach((section, sectionIndex) => {
            const sectionQuestionCount = parseInt(section.no_of_question) || 0;
            const sectionTime = parseInt(section.sectional_time) || 0;
            const sectionQuestions = questionsState.slice(startIndex, startIndex + sectionQuestionCount);

            grouped.push({
                subject_name: section.subject_name || `Section ${sectionIndex + 1}`,
                sectionTime: sectionTime,
                marks: parseFloat(section.marks) || 0,
                negative_mark: section.negative_mark || "0.50",
                totalQuestions: sectionQuestionCount,
                questions: sectionQuestions,
                startQuestionNumber: startIndex + 1,
                endQuestionNumber: startIndex + sectionQuestionCount
            });

            startIndex += sectionQuestionCount;
        });

        return grouped;
    }, [questionsState, isSectionalTest, state?.testDetail]);

    const getCurrentSectionData = () => {
        if (!isSectionalTest || groupedQuestions.length === 0) return null;
        return groupedQuestions[currentSection];
    };

    const currentSectionData = getCurrentSectionData();

    // Prevent browser back button
    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            setShowPauseModal(true);
        };
        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', handleBackButton);
        return () => window.removeEventListener('popstate', handleBackButton);
    }, []);



    // Initialize test - only once, only for fresh attempt
    // useEffect(() => {
    //     const initializeTest = async () => {
    //         if (!testId || isInitialized) return;

    //         const [existingOptions, savedSection, savedQuestion] = await Promise.all([
    //             secureGetTestData(testId, "selectedOptions"),
    //             secureGetTestData(testId, "currentSection"),
    //             secureGetTestData(testId, "currentQuestion")
    //         ]);

    //         // Fresh attempt: no saved answers AND no saved section AND no saved question
    //         // This prevents resetting if we just navigated sections/questions without answering
    //         const hasNoSavedData =
    //             (!existingOptions || Object.keys(existingOptions).length === 0) &&
    //             (savedSection === null || savedSection === undefined) &&
    //             (savedQuestion === null || savedQuestion === undefined);

    //         if (hasNoSavedData && sectionCompleted.length === 0) {
    //             // console.log("🆕 Initializing new test...");
    //             setCurrentQuestion(0);
    //             setCurrentSection(0);
    //             await secureSaveTestData(testId, "currentQuestion", 0);
    //             await secureSaveTestData(testId, "currentSection", 0);
    //         } else {
    //             // console.log("♻️ Resuming test - skipping init reset");
    //         }

    //         setIsInitialized(true);
    //     };

    //     if (questionsState.length > 0) {
    //         initializeTest();
    //     }
    // }, [testId, questionsState.length, isInitialized]);
    useEffect(() => {
        // ❌ Do NOT reset section/question here
        // ✅ Initialization is handled by:
        //    - restoreData()  → page refresh
        //    - resetReattempt() → reattempt

        if (!testId || isInitialized) return;

        setIsInitialized(true);
    }, [testId, isInitialized]);
    //     // Handle Test Time Up
    const handleTimeUp = async () => {
        // console.log('⏰ Test time up!');
        showSuccessToast('Time up! Submitting test...');
        await handleSubmit();
    };
    // Restore Test Data



    //     // Restore Test Data
    useEffect(() => {
        const restoreData = async () => {
            if (!testId || questionsState.length === 0) return;
            if (isReattempt && !reattemptResetDone) return;

            try {
                const [
                    storedCurrentQuestion,
                    storedCurrentSection,
                    storedOptions,
                    storedAttempted,
                    storedMarked,
                    storedSkipped,
                    storedMarkedWithAns,
                    storedSectionCompleted
                ] = await Promise.all([
                    secureGetTestData(testId, "currentQuestion"),
                    secureGetTestData(testId, "currentSection"),
                    secureGetTestData(testId, "selectedOptions"),
                    secureGetTestData(testId, "optionSelected"),
                    secureGetTestData(testId, "markedForReview"),
                    secureGetTestData(testId, "skippedQuestions"),
                    secureGetTestData(testId, "markedwithans"),
                    secureGetTestData(testId, "sectionCompleted"),
                ]);

                if (storedCurrentSection !== null) setCurrentSection(storedCurrentSection);
                if (storedCurrentQuestion !== null) setCurrentQuestion(storedCurrentQuestion);

                if (storedOptions) setSelectedOptions(storedOptions);
                if (storedAttempted) setOptionSelected(storedAttempted);
                if (storedMarked) setMarkedForReview(storedMarked);
                if (storedSkipped) setSkippedQuestions(storedSkipped);
                if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
                if (!isReattempt && storedSectionCompleted) {
                    setSectionCompleted(storedSectionCompleted);
                }

            } catch (e) {
                console.error("Restore failed", e);
            } finally {
                // ✅ mark restore COMPLETE
                setHasRestored(true);
            }
        };

        restoreData();
    }, [testId, questionsState.length]);





    // useEffect(() => {
    //     if (!testId) return;
    //     secureSaveTestData(testId, "currentQuestion", currentQuestion);
    // }, [testId, currentQuestion]);
    useEffect(() => {
        if (!testId || !hasRestored) return;
        secureSaveTestData(testId, "currentQuestion", currentQuestion);
    }, [testId, currentQuestion, hasRestored]);

    // ✅ Persist currentSection
    useEffect(() => {
        if (!testId || !hasRestored) return;
        secureSaveTestData(testId, "currentSection", currentSection);
    }, [testId, currentSection, hasRestored]);

    // Save selected options (answers)
    useEffect(() => {
        if (!testId) return;
        if (!selectedOptions || Object.keys(selectedOptions).length === 0) return;
        secureSaveTestData(testId, "selectedOptions", selectedOptions);
    }, [testId, selectedOptions]);

    // Save attempted questions
    useEffect(() => {
        if (!testId) return;
        if (!optionSelected || optionSelected.length === 0) return;
        secureSaveTestData(testId, "optionSelected", optionSelected);
    }, [testId, optionSelected]);

    // Save marked for review
    useEffect(() => {
        if (!testId) return;
        if (!markedForReview || markedForReview.length === 0) return;
        secureSaveTestData(testId, "markedForReview", markedForReview);
    }, [testId, markedForReview]);

    // Save skipped questions
    useEffect(() => {
        if (!testId) return;
        if (!skippedQuestions || skippedQuestions.length === 0) return;
        secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
    }, [testId, skippedQuestions]);

    // Save marked with answer
    useEffect(() => {
        if (!testId) return;
        if (!markedWithAns || markedWithAns.length === 0) return;
        secureSaveTestData(testId, "markedwithans", markedWithAns);
    }, [testId, markedWithAns]);

    // Load User Data
    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        const lang = await secureGet("language");
        setLanguage(lang || 'en');
        setUserInfo(user);
    };

    useEffect(() => { loadUserData(); }, []);




    // Fetch Questions
    const getTestSeriesQuestion = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getSingleCategoryPackageTestseriesQuestionSlice(state?.testInfo?.test_id || state?.testinfo?.testid)).unwrap();
            // console.log('response on screen 5 question data', res)
            if (res.status_code == 200) setQuestionsState(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getTestSeriesQuestion(); }, []);

    // Handle Option Change
    const handleOptionChange = async (questionId, optionKey) => {
        const updated = { ...selectedOptions, [questionId]: optionKey };
        setSelectedOptions(updated);
        // console.log("Updated selectedOptions:", updated);
        if (markedForReview.includes(questionId)) {
            setMarkedWithAns([...markedWithAns, questionId]);
            setMarkedForReview(markedForReview.filter(id => id !== questionId));
        }

        if (skippedQuestions.includes(questionId)) {
            setSkippedQuestions(skippedQuestions.filter(id => id !== questionId));
        }
    };

    // Handle Clear Option
    const handleClearOption = () => {
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;

        const updatedSelectedOptions = { ...selectedOptions };
        delete updatedSelectedOptions[currentId];
        setSelectedOptions(updatedSelectedOptions);
        setOptionSelected(optionSelected.filter(id => id !== currentId));
        setMarkedWithAns(markedWithAns.filter(id => id !== currentId));
    };

    // Handle Save And Next
    const handleSaveAndNext = () => {
        const totalQuestions = isSectionalTest
            ? currentSectionData?.totalQuestions
            : questionsState.length;

        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];

        const currentId = currentQuestionData?.id;

        // ✅ Only if some option is selected for this question,
        // and it's not already in attempted, then mark as attempted.
        if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
            setOptionSelected([...optionSelected, currentId]);
        }

        if (currentQuestion === totalQuestions - 1) {
            setShowLastQuestionModal(true);
        } else {
            setCurrentQuestion(prev => prev + 1);
        }
    };


    // Handle Mark For Review
    const handleMarkForReview = () => {
        const currentQuestionData = isSectionalTest
            ? currentSectionData?.questions[currentQuestion]
            : questionsState[currentQuestion];
        const currentId = currentQuestionData?.id;
        const isOptionSelected = !!selectedOptions[currentId];

        if (isOptionSelected) {
            if (!markedWithAns.includes(currentId)) {
                setMarkedWithAns([...markedWithAns, currentId]);
            }
        } else {
            if (!markedForReview.includes(currentId)) {
                setMarkedForReview([...markedForReview, currentId]);
            }
        }

        const totalQuestions = isSectionalTest ? currentSectionData?.totalQuestions : questionsState.length;
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setCurrentQuestion(0);
        }
    };

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const remainingTime = totalTestTime - elapsedSeconds;
    const remainingMinutes = Math.floor(remainingTime / 60);

    // Fullscreen
    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            setIsFullScreen(true);
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    useEffect(() => { enterFullScreen(); }, []);

    // Pause
    const handlePauseClick = () => { setShowPauseModal(true); };

    const cardTestId = state?.currentTestCardId;
    const packageTestId = state?.packageDetail?.id;



    const handleConfirmPause = async () => {
        setShowPauseModal(false);
        await exitFullScreen();
        // console.log("PAUSE saving testid =", testId);

        try {
            if (testId != null) {
                await secureSaveTestData(testId, "selectedOptions", selectedOptions);
                await secureSaveTestData(testId, "optionSelected", optionSelected);
                await secureSaveTestData(testId, "markedForReview", markedForReview);
                await secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
                await secureSaveTestData(testId, "markedwithans", markedWithAns);
                await secureSaveTestData(testId, "currentSection", currentSection);
                await secureSaveTestData(testId, "currentQuestion", currentQuestion);
            }

            let pauseStatusArray =
                (await secureGetTestData("pausestatus", "pausestatusarray")) || [];

            // console.log("Existing Pause Array:", pauseStatusArray);
            const updatedPauseArray = [
                ...pauseStatusArray.filter((item) => item.testid !== testId),
                { testid: testId, isPaused: true },
            ];
            // console.log("UPDATED pause array:", updatedPauseArray);

            await secureSaveTestData(
                "pausestatus",
                "pausestatusarray",
                updatedPauseArray
            );

            nav("/testpakages", { replace: true, state: { testId: packageTestId } });
        } catch (e) {
            console.error("Error during pause", e);
            nav("/testpakages", { replace: true, state: { testId: packageTestId } });
        }
    };
    const handleCancelPause = () => {
        setShowPauseModal(false);
        window.history.pushState(null, '', window.location.pathname);
    };

    //     // Handle Section Time Up
    const handleSectionTimeUp = async () => {
        // console.log('⏰ Section time up!');

        const updatedCompleted = [...sectionCompleted, currentSection];
        setSectionCompleted(updatedCompleted);
        await secureSaveTestData(testId, 'sectionCompleted', updatedCompleted);

        const timerStorageKey = `${testId}_section_${currentSection}_timer`;
        try {
            const storage = window.localStorage || window.sessionStorage;
            storage.removeItem(timerStorageKey);
        } catch (error) {
            console.error('Error clearing timer:', error);
        }

        if (currentSection < groupedQuestions.length - 1) {
            setCurrentSection(prev => prev + 1);
            setCurrentQuestion(0);
            await secureSaveTestData(testId, 'currentQuestion', 0);
            showSuccessToast(`Moving to Section ${currentSection + 2}`);
        } else {
            showSuccessToast('All sections completed! Submitting test...');
            await handleSubmit();
        }
    };




    const handleSubmit = async () => {
        setConfirmSubmit(false);
        setLoading(true);

        try {
            // ✅ Save time for current question before submit
            const currentQuestionData = isSectionalTest
                ? currentSectionData?.questions[currentQuestion]
                : questionsState[currentQuestion];

            const finalTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
            const finalQuestionTimeSpent = {
                ...questionTimeSpent,
                [currentQuestionData.id]: (questionTimeSpent[currentQuestionData.id] || 0) + finalTimeSpent
            };

            // ✅ Use REAL tracked time instead of random
            const spentTime = questionsState.map((question) => ({
                questionId: question.id,
                time: finalQuestionTimeSpent[question.id] || 0 // Real time or 0
            }));



            // ✅ Calculate scores
            const totalAttendedQuestions = optionSelected.length;
            const totalNotAnsweredQuestions = questionsState.length - totalAttendedQuestions;

            let correct = 0;
            let in_correct = 0;

            const allAttendedQuestions = optionSelected.map((questionId) => {
                const question = questionsState.find(q => q.id === questionId);
                const selectedAns = selectedOptions[questionId];
                const rightAns = language === 'en' ? question?.english_ans : question?.hindi_ans;

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

            // ✅ Calculate marks
            const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
            const totalMarks = parseFloat(state?.total_marks || 100);
            const markPerques = totalMarks / questionsState.length;
            const marksScored = (correct * markPerques) - (in_correct * negativeMark);
            // const negativeMark = parseFloat(state?.testInfo?.negative_mark ?? 0);
            // const totalMarks = parseFloat(state?.total_marks ?? 100);
            // const markPerques = totalMarks / questionsState.length;
            // const marksScored = correct * markPerques - in_correct * negativeMark;


            // ✅ Total time spent
            const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

            // ✅ NEW: Calculate section-wise/subject-wise analysis
            const subjectWiseAnalysis = [];



            if (isSectionalTest && state?.testDetail && groupedQuestions.length > 0) {
                groupedQuestions.forEach((section, index) => {
                    const detailMeta = state.testDetail[index]; // uses your details array order

                    const sectionQuestions = section.questions;
                    const sectionAttempted = sectionQuestions.filter(q =>
                        optionSelected.includes(q.id)
                    );

                    let sectionCorrect = 0;
                    let sectionIncorrect = 0;
                    let sectionTimeSpent = 0;

                    sectionQuestions.forEach(q => {
                        if (optionSelected.includes(q.id)) {
                            const selectedAns = selectedOptions[q.id];
                            const rightAns = language === 'en' ? q.english_ans : q.hindi_ans;

                            if (selectedAns?.toLowerCase() === rightAns?.toLowerCase()) {
                                sectionCorrect++;
                            } else {
                                sectionIncorrect++;
                            }
                        }

                        const timeData = spentTime.find(t => t.questionId === q.id);
                        if (timeData) sectionTimeSpent += timeData.time || 0;
                    });

                    // per-question marks for this section
                    const marksPerQ = (detailMeta?.marks || 0) / (detailMeta?.no_of_question || 1);
                    const sectionMarks = sectionCorrect * marksPerQ;

                    const minPassing =
                        detailMeta?.is_qualified_section == 1
                            ? parseFloat(detailMeta.min_passing_marks || 0)
                            : null;

                    const isQualifyingSection = detailMeta?.is_qualified_section == 1;
                    const isPassed =
                        isQualifyingSection && sectionMarks >= minPassing;

                    subjectWiseAnalysis.push({
                        subject_name: section.subject_name,
                        total_assign_question: section.totalQuestions,
                        total_question_attempted: sectionAttempted.length,
                        correct_count: sectionCorrect,
                        incorrect_count: sectionIncorrect,
                        spent_time: `${Math.floor(sectionTimeSpent / 60)}:${(
                            sectionTimeSpent % 60
                        )
                            .toString()
                            .padStart(2, '0')}`,
                        // NEW FIELDS
                        is_qualified_section: isQualifyingSection,
                        min_passing_marks: minPassing,
                        obtained_marks: Number(sectionMarks.toFixed(2)),
                        is_passed: isPassed,
                    });
                });
            } else {
                // non-sectional remains same; mark as non-qualifying
                subjectWiseAnalysis.push({
                    subject_name: 'General',
                    total_assign_question: questionsState.length,
                    total_question_attempted: totalAttendedQuestions,
                    correct_count: correct,
                    incorrect_count: in_correct,
                    spent_time: `${Math.floor(totalTimeSpent / 60)}:${(
                        totalTimeSpent % 60
                    )
                        .toString()
                        .padStart(2, '0')}`,
                    is_qualified_section: false,
                    min_passing_marks: null,
                    obtained_marks: Number(marksScored.toFixed(2)),
                    is_passed: null,
                });
            }
            // console.log('calc => correct, incorrect, markPerques, negativeMark, marksScored',
            //     correct, in_correct, markPerques, negativeMark, marksScored);

            // console.log('📚 Subject-wise Analysis:', subjectWiseAnalysis);

            // ✅ Prepare submission payload
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
                skip_question: skippedQuestions,
                attend_question: optionSelected,
                mark_for_review: markedForReview,
            };



            // ✅ Submit to API
            const res = await dispatch(attendQuestionSubmitSlice(submissionData)).unwrap();
            // console.log('✅ API Response:', res);

            if (res.status_code === 200) {
                const attendId = res.data?.attempt?.id;

                // ✅ Clear PAUSE STATUS for this test
                let pauseStatusArray = await secureGetTestData("pausestatus", "pausestatusarray") || [];
                pauseStatusArray = pauseStatusArray.filter(item => item.testid !== testId);
                await secureSaveTestData("pausestatus", "pausestatusarray", pauseStatusArray);
                // console.log('🆔 Attend ID:', attendId);

                await clearAllTestData(testId);

                if (isFullScreen) {
                    await exitFullScreen();
                }

                // ✅ Navigate to analysis with subject-wise data
                nav('/analysis', {
                    replace: true,
                    state: {
                        testInfo: {
                            ...state.testInfo,
                            attend_id: attendId,
                        },
                        testId: testId,
                        attend_id: attendId,
                        testResults: submissionData,
                        allQuestions: questionsState,
                        testDetail: state.testDetail,
                        leaderboard: res.data?.leaderboard || [],
                        my_rank: res.data?.my_rank,
                        total_join_user: res.data?.total_join_user,
                        percentile: res.data?.percentile,
                        total_marks: state?.total_marks,
                        negative_mark: state?.negative_mark,
                        total_questions: state?.total_questions,
                        // ✅ IMPORTANT: Pass calculated subject-wise data
                        subjectWiseAnalysis: subjectWiseAnalysis,
                        isSectionalTest: isSectionalTest,
                    }
                });
            } else {
                console.error('❌ API Error:', res);
                showErrorToast(res.message || 'Failed to submit test');
                setLoading(false);
            }
        } catch (error) {
            console.error("❌ Submit Error:", error);
            showErrorToast('Failed to submit test. Please try again.');
            setLoading(false);
        }
    };



    const current = isSectionalTest
        ? currentSectionData?.questions[currentQuestion]
        : questionsState[currentQuestion];

    if (loading || !current) {
        return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>;
    }

    const questionText = language === 'en' ? current.question_english : current.question_hindi;
    const options = language === 'en'
        ? { a: current.option_english_a, b: current.option_english_b, c: current.option_english_c, d: current.option_english_d }
        : { a: current.option_hindi_a, b: current.option_hindi_b, c: current.option_hindi_c, d: current.option_hindi_d };

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ TOP HEADER - EXACT FONT SIZES */}
            <div className="bg-white border-b border-gray-400 px-6 py-2.5">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-900">
                        {state?.testInfo?.title || 'SSC CGL Tier-I Exam (Held on 17 July 2023, Shift I)'}
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold">
                            Time Left: {state?.testInfo?.time || '120'} Minutes
                        </div>
                        {/* <TestTimer
                            key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
                            timeClr="text-blue-800"
                            textleft="SECTION"
                            textBg="text-red-600"
                            timeTextSize="text-2xl"
                            textRight="Minutes"
                            showSeconds={true}
                            testId={`${testId}_section_${currentSection}_timer`}
                            timeInMinutes={currentSectionData?.sectionTime || 0}
                            // onTimeUp={handleSectionTimeUp}
                            isFreshStart={testStarted}
                        /> */}
                        <button
                            onClick={handlePauseClick}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2 rounded-md text-sm font-bold"
                        >
                            Puase
                        </button>
                        <button
                            onClick={() => { isFullScreen ? exitFullScreen() : enterFullScreen(); }}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold"
                        >
                            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                        </button>
                        <div className="text-sm text-gray-900">
                            Name : <span className="font-semibold">{userInfo?.name || 'Prachi Choudhary'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ NAVIGATION BAR - EXACT FONT SIZES */}
            <div className="bg-white border-b border-gray-400 px-6 py-3">
                <div className="flex justify-between items-center">
                    {/* Left - Links */}
                    <div className="flex gap-12">
                        <button
                            onMouseEnter={() => setIsModalOpen(true)}
                            className="text-orange-600 font-bold text-base hover:underline uppercase"
                        >
                            SYMBOLS
                        </button>
                        <button
                            onMouseEnter={() => setOpenModal(true)}
                            className="text-orange-600 font-bold text-base hover:underline uppercase"
                        >
                            INSTRUCTIONS
                        </button>
                    </div>

                    {/* Center - Action Buttons */}
                    <div className="flex gap-3">
                        {selectedOptions[current?.id] && (
                            <button
                                onClick={handleClearOption}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                            >
                                Clear Option
                            </button>
                        )}
                        <button
                            onClick={handleMarkForReview}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold"
                        >
                            Mark for Review
                        </button>
                        <button
                            onClick={handleSaveAndNext}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold"
                        >
                            {selectedOptions[current?.id] ? 'Save & Next' : 'Next'}
                        </button>

                        {isMainsExam && (
                            <button
                                type="button"
                                onClick={() => setShowSectionSubmitConfirm(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold">
                                Submit Section
                            </button>)}

                        <button
                            onClick={() => setConfirmSubmit(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Timer */}
                    <div className="text-right w-full lg:w-auto">
                        {/* {isSectionalTest && isMainsExam ? (
                            <TestTimer
                                key={`${testId}_section_${currentSection}_${isReattempt ? "reattempt" : "normal"}`}
                                timeClr="text-blue-800"
                                textLeft="SECTION"
                                textBg="text-red-600"
                                timeTextSize="text-2xl"
                                textRight="Minutes"
                                showSeconds={true}
                                testId={testId}
                                storageKey={`${testId}_section_${currentSection}_timer`}
                                timeInMinutes={currentSectionData?.sectionTime || 0}
                                onTimeUp={handleSectionTimeUp}
                                isFreshStart={isReattempt}
                            />
                        ) : (
                            <TestTimer
                                key={`test_${state?.testInfo?.testid}_${isReattempt ? "reattempt" : "normal"}`}
                                timeClr="text-blue-800"
                                textLeft="TIME LEFT"
                                textBg="text-red-600"
                                timeTextSize="text-2xl"
                                textRight=""
                                showSeconds={true}
                                testId={state?.testInfo?.testid}
                                storageKey={`test_${state?.testInfo?.testid}_timer`}
                                timeInMinutes={parseInt(state?.testInfo?.time || 0)}
                                onTimeUp={handleTimeUp}
                                isFreshStart={isReattempt}
                            />
                        )} */}
                        {isSectionalTest && isMainsExam ? (
                            <TestTimer
                                key={`${testId}_section_${currentSection}_${isReattemptSession ? "reattempt" : "normal"}`}
                                timeClr="text-blue-800"
                                textLeft="SECTION"
                                textBg="text-red-600"
                                timeTextSize="text-2xl"
                                textRight="Minutes"
                                showSeconds={true}
                                testId={`${testId}_section_${currentSection}_timer`}
                                timeInMinutes={currentSectionData?.sectionTime || 0}
                                onTimeUp={handleSectionTimeUp}
                                isFreshStart={isReattemptSession}
                            />
                        ) : (
                            <TestTimer
                                key={`test_${state?.testInfo?.testid}_${isReattemptSession ? "reattempt" : "normal"}`}
                                timeClr="text-blue-800"
                                textLeft="TIME LEFT"
                                textBg="text-red-600"
                                timeTextSize="text-2xl"
                                textRight=""
                                showSeconds={true}
                                testId={`test_${state?.testInfo?.testid}_timer`}
                                timeInMinutes={parseInt(state?.testInfo?.time || 0)}
                                onTimeUp={handleTimeUp}
                                isFreshStart={isReattemptSession}
                            />
                        )}
                    </div>
                    {/* Right - Time Display */}
                    { /*<div className="text-right">
                    //     <div className="font-bold">
                    //         <span className="text-red-600 text-xl">LAST </span>
                    //         <span className="text-red-600 text-3xl">{remainingMinutes}</span>
                    //         <span className="text-red-600 text-xl"> Minutes</span>
                    //     </div>
                    // </div> */}
                </div>
            </div>

            {/* ✅ MAIN CONTENT - EXACT FONT SIZES */}
            <div className="flex" style={{ height: 'calc(100vh - 122px)' }}>
                {/* LEFT SIDEBAR */}
                <div className="w-62 bg-white border-r border-gray-400 overflow-y-auto">
                    {/* Section Title */}
                    <div className="bg-gray-100 px-3 py-1 border-b border-gray-300">
                        <h3 className="font-semibold text-gray-900 text-base">
                            {isSectionalTest
                                ? `${currentSectionData?.subject_name.substring(0, 23)}...`
                                : 'General Intelligence an...'}
                        </h3>
                    </div>

                    {/* ✅ SECTION TABS - EXACT SIZING */}
                    {isSectionalTest && (
                        <div className="grid grid-cols-2 gap-2.5 p-4 border-b border-gray-300">
                            {groupedQuestions.map((section, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (isMainsExam) return;

                                        // 🚫 Do not allow opening already submitted sections
                                        if (sectionCompleted.includes(idx)) return;

                                        setCurrentSection(idx);
                                        setCurrentQuestion(0);
                                    }}
                                    className={`px-3 py-2 rounded-md font-bold text-sm ${currentSection === idx
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    PART-{String.fromCharCode(65 + idx)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section Description */}
                    <div className="px-4 py-2.5 border-b border-gray-300">
                        <p className="text-sm text-gray-900 font-semibold">
                            PART-A - {isSectionalTest ? currentSectionData?.subject_name : 'General Intelligence and Reasoning'}
                        </p>
                    </div>

                    {/* Question Grid */}
                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {(isSectionalTest ? currentSectionData?.questions : questionsState).map((q, index) => {
                                const isAttempted = optionSelected.includes(q.id);
                                const isMarkedWithAns = markedWithAns.includes(q.id);
                                const isMarked = markedForReview.includes(q.id);
                                const isCurrent = index === currentQuestion;

                                let bgColor = 'bg-blue-600 text-white';
                                if (isAttempted && !isMarkedWithAns) bgColor = 'bg-green-600 text-white';
                                if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
                                if (isMarked) bgColor = 'bg-red-600 text-white';

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestion(index)}
                                        className={`h-10 w-10 rounded-md font-bold text-sm ${bgColor} ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend - EXACT FONT SIZE */}
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-green-600 rounded flex-shrink-0"></div>
                                <span className="text-gray-900">Attempted <span className="font-medium">({optionSelected.length})</span></span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-yellow-500 rounded flex-shrink-0"></div>
                                <span className="text-gray-900">Marked with Answer <span className="font-medium">({markedWithAns.length})</span></span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-red-600 rounded flex-shrink-0"></div>
                                <span className="text-gray-900">Marked without Answer <span className="font-medium">({markedForReview.length})</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - QUESTION DISPLAY */}
                <div className="flex-1 bg-white overflow-y-auto p-6">
                    <div className="border border-gray-400 rounded-lg p-6">
                        {/* Question Header - EXACT FONT SIZE */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                            <div className="text-lg font-bold text-gray-900">
                                Question : {currentQuestion + 1}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">
                                    Time: {formatTime(currentQuestionTime)} {/* ✅ Shows current question time */}
                                </span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="border border-gray-400 px-3 py-1.5 rounded text-sm font-medium"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </div>
                        </div>

                        {/* Question Text - EXACT FONT SIZE */}
                        <div className="mb-6 text-base leading-relaxed text-gray-900">
                            <MathRenderer text={questionText} />
                        </div>

                        {/* Options - EXACT FONT SIZE */}
                        <div className="space-y-3.5">
                            {Object.entries(options).map(([key, value]) => (
                                <label
                                    key={key}
                                    className="flex items-start gap-3 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`question_${current.id}`}
                                        value={key}
                                        checked={selectedOptions[current.id] === key}
                                        onChange={() => handleOptionChange(current.id, key)}
                                        className="mt-1 w-4 h-4"
                                    />
                                    <div className="flex-1 text-base text-gray-900">
                                        <MathRenderer text={value} />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showLastQuestionModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Last Question</h3>
                        <p className="text-gray-600 mb-6">You've reached the last question.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { setShowLastQuestionModal(false); setCurrentQuestion(0); }}
                                className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
                            >
                                Go to First
                            </button>
                            <button
                                onClick={() => { setShowLastQuestionModal(false); setConfirmSubmit(true); }}
                                className="bg-green-600 text-white py-3 rounded-lg font-semibold"
                            >
                                Submit Test
                            </button>


                        </div>



                    </div>
                </div>
            )}
            {/* Timer */}
            <div className="text-right w-full lg:w-auto">
                {/* //                         {isSectionalTest && isMainsExam ? (
//                             <TestTimer
//                                 key={sectionTimerKeys[currentSection] || `section_${testId}_${currentSection}`}
//                                 timeClr="text-blue-800"
//                                 textleft="SECTION"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight="Minutes"
//                                 showSeconds={true}
//                                 testId={`${testId}_section_${currentSection}_timer`}
//                                 timeInMinutes={currentSectionData?.sectionTime || 0}
//                                 onTimeUp={handleSectionTimeUp}
//                                 isFreshStart={testStarted}
//                             />
//                         ) : (
//                             <TestTimer
//                                 key={`test_${state?.testInfo?.test_id}`}
//                                 timeClr="text-blue-800"
//                                 textleft="TIME LEFT"
//                                 textBg="text-red-600"
//                                 timeTextSize="text-2xl"
//                                 textRight=""
//                                 showSeconds={true}
//                                 testId={state?.testInfo?.test_id}
//                                 timeInMinutes={parseInt(state?.testInfo?.time) || 0}
//                                 onTimeUp={handleTimeUp}
//                                 isFreshStart={!selectedOptions || Object.keys(selectedOptions).length === 0}
//                             />
//                         )} */}
//                     </div>

            <PauseTestModal isOpen={showPauseModal} onConfirm={handleConfirmPause} onCancel={handleCancelPause} />
            <ConfirmTestSubmitModal
                show={confirmSubmit}
                onClose={() => setConfirmSubmit(false)}
                onConfirm={handleSubmit}
                message="Are you sure you want to Submit your Test?"
            />
            <ConfirmTestSubmitModal
                show={showSectionSubmitConfirm}
                onClose={() => setShowSectionSubmitConfirm(false)}
                onConfirm={async () => {
                    setShowSectionSubmitConfirm(false);
                    await handleSectionTimeUp(); // this already moves to next section or submits test
                }}
                message="Are you sure you want to Submit your Section?"
            />
            <ExamInstructionsModal isOpen={openModal} onClose={() => setOpenModal(false)} testInfo={state?.testInfo || {}} testData={state?.testDetail || []} />
            <SymbolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Screen5;


