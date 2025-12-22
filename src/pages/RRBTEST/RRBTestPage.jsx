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
  const location = useLocation();
  const persistedState = JSON.parse(localStorage.getItem("rrbStateVal") || "null");
  const [state, setState] = useState(location.state || persistedState || {});

  useEffect(() => {
    if (location.state) {
      setState(location.state);
      localStorage.setItem("rrbStateVal", JSON.stringify(location.state));
    }
  }, [location.state]);

  const testInfo = state?.testInfo || {};
  const testDetail = state?.testDetail || [];
  const testId = state?.testInfo?.test_id || state?.testInfo?.testid;

  const testResults = state?.testResults || {};
  const correct = testResults?.correct || 0;
  const inCorrect = testResults?.in_correct || 0;
  const totalAttempted = testResults?.total_attend_question || 0;
  const marksScored = testResults?.marks || 0;
  const totalTime = testResults?.time || 0;
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const isInitialLoad = React.useRef(true);


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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [optionSelected, setOptionSelected] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [markedWithAns, setMarkedWithAns] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [currentLanguage, setCurrentLanguage] = useState('hindi');
  const [questionElapsedTime, setQuestionElapsedTime] = useState(0);
  const packageTestId = state?.packageDetail?.id;
  const oneQuestionMarks = (state?.total_marks && state?.total_questions)
    ? (state.total_marks / state.total_questions)
    : 1;
  // console.log("oneQuestionMarks", oneQuestionMarks)

  // ✅ Track per-question time with persistence
  useEffect(() => {
    if (!timeInitialized || loading) return;

    const interval = setInterval(() => {
      setCurrentQuestionTime(prev => {
        const next = prev + 1;
        if (testId) {
          secureSaveTestData(testId, "currentQuestionTime", next);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeInitialized, loading, testId]);

  // ✅ Persist Active Question Index
  useEffect(() => {
    if (testId && activeQuestionIndex !== undefined) {
      secureSaveTestData(testId, "activeQuestionIndex", activeQuestionIndex);
    }
  }, [testId, activeQuestionIndex]);

  // Initialize time
  useEffect(() => {
    const initializeTime = async () => {
      if (!testId) {
        setTimeLeft((testInfo.time || 90) * 60);
        setTimeInitialized(true);
        return;
      }

      try {
        // ✅ 1. Check if there's a stored time for this test (Persists across refresh)
        const storedTime = await secureGetTestData(testId, "remainingTime");

        // ✅ 2. Check if this is a resume from pause (passed via state)
        const isResumingFromState = state?.pausedTimeLeft && state.pausedTimeLeft > 0;

        if (storedTime !== null && storedTime > 0) {
          console.log('🔄 Restoring timer from storage:', storedTime);
          setTimeLeft(storedTime);
        } else if (isResumingFromState) {
          console.log('🔄 Resuming test with time from state:', state.pausedTimeLeft);
          setTimeLeft(state.pausedTimeLeft);
        } else {
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

      const [storedOptions, storedAttempted, storedMarked, storedSkipped, storedMarkedWithAns, storedIndex, storedQTime] = await Promise.all([
        secureGetTestData(testId, "selectedOptions"),
        secureGetTestData(testId, "optionSelected"),
        secureGetTestData(testId, "markedForReview"),
        secureGetTestData(testId, "skippedQuestions"),
        secureGetTestData(testId, "markedwithans"),
        secureGetTestData(testId, "activeQuestionIndex"),
        secureGetTestData(testId, "currentQuestionTime"),
      ]);

      if (storedOptions) setSelectedOptions(storedOptions);
      if (storedAttempted) setOptionSelected(storedAttempted);
      if (storedMarked) setMarkedForReview(storedMarked);
      if (storedSkipped) setSkippedQuestions(storedSkipped);
      if (storedMarkedWithAns) setMarkedWithAns(storedMarkedWithAns);
      if (storedIndex !== null) setActiveQuestionIndex(parseInt(storedIndex));
      if (storedQTime !== null) setCurrentQuestionTime(parseInt(storedQTime));
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
    secureSaveTestData(testId, "markedwithans", markedWithAns);
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
        // ✅ Save EVERY SECOND for high precision
        if (testId) {
          secureSaveTestData(testId, "remainingTime", newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, timeInitialized, testId]);

  // ✅ Extra reliability: Save time before page unload (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (testId && timeLeft > 0) {
        // We use synchronous storage here if possible, but our secure storage is async
        // Since we are already saving every second, this is a fallback
        secureSaveTestData(testId, "remainingTime", timeLeft);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [testId, timeLeft]);

  const formatTime = (seconds) => {
    if (seconds === null) return "00 : 00 : 00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  // ✅ New helper for question timer (MM:SS)
  const formatQuestionTime = (seconds) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    // ✅ Skip reset on initial restoration
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setCurrentQuestionTime(0);
    if (testId) {
      secureSaveTestData(testId, "currentQuestionTime", 0);
    }
    setQuestionStartTime(Date.now());
  }, [activeQuestionIndex, testId]);

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

    // ✅ Safety: Ensure attempted question is recorded if option exists
    if (selectedOptions[currentId] && !optionSelected.includes(currentId)) {
      setOptionSelected([...optionSelected, currentId]);
    }

    if (activeQuestionIndex === questions.length - 1) {
      setShowLastQuestionModal(true);
    } else {
      setActiveQuestionIndex(prev => prev + 1);
    }
  };



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
    if (isFullScreen) await exitFullScreen();

    try {
      if (testId) {
        // ✅ Save all relevant state
        await secureSaveTestData(testId, "remainingTime", timeLeft);
        await secureSaveTestData(testId, "selectedOptions", selectedOptions);
        await secureSaveTestData(testId, "optionSelected", optionSelected);
        await secureSaveTestData(testId, "markedForReview", markedForReview);
        await secureSaveTestData(testId, "skippedQuestions", skippedQuestions);
        await secureSaveTestData(testId, "markedwithans", markedWithAns);
        await secureSaveTestData(testId, "activeQuestionIndex", activeQuestionIndex);
        await secureSaveTestData(testId, "currentQuestionTime", currentQuestionTime);

        // ✅ Update global pause status array (matches Screen5.jsx)
        let pauseStatusArray = (await secureGetTestData("pausestatus", "pausestatusarray")) || [];
        const updatedPauseArray = [
          ...pauseStatusArray.filter((item) => item.testid !== testId),
          { testid: testId, isPaused: true },
        ];
        await secureSaveTestData("pausestatus", "pausestatusarray", updatedPauseArray);
      }

      navigate('/testpakages', { replace: true, state: { testId: packageTestId } });
    } catch (error) {
      console.error("Error during pause:", error);
      navigate('/testpakages', { replace: true, state: { testId: packageTestId } });
    }
  };


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

        // ✅ Clear PAUSE STATUS for this test (matches Screen5.jsx)
        let pauseStatusArray = (await secureGetTestData("pausestatus", "pausestatusarray")) || [];
        pauseStatusArray = pauseStatusArray.filter(item => item.testid !== testId);
        await secureSaveTestData("pausestatus", "pausestatusarray", pauseStatusArray);

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



  const getStatusColor = (questionId) => {
    // Priority 1: Marked WITH Answer (Purple) - highest priority
    if (markedWithAns.includes(questionId) || markedForReview.includes(questionId)) {
      return 'bg-purple-600 text-white border-purple-600';
    }
    // Priority 2: Answered ONLY (Green)
    if (optionSelected.includes(questionId)) {
      return 'bg-green-500 text-white border-green-500';
    }

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
      {/* ✅ TOP HEADER - Responsive Stacking */}
      <header className="flex flex-col sm:flex-row border-b border-gray-400 items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-sm gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
              <img src="/logo.jpeg" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <span className="text-lg sm:text-xl text-black font-bold">Revision24</span>
              <span className="text-xs sm:text-base font-normal text-black sm:ml-4 line-clamp-1">{testInfo.title || 'RRB Group D Full Test 1'}</span>
            </div>
          </div>
          {/* Mobile Palette Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-400 bg-opacity-40 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">Time Left</span>
            <span className="font-mono font-bold text-sm sm:text-base">{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => isFullScreen ? exitFullScreen() : enterFullScreen()}
            className="hidden sm:block border border-[#21BAD4] hover:bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 text-[#21BAD4] rounded-md text-xs sm:text-sm font-semibold transition-colors"
          >
            {isFullScreen ? 'Exit Full Screen' : 'Switch Full Screen'}
          </button>
          <button
            onClick={handlePauseClick}
            className="border border-[#21BAD4] hover:bg-blue-50 text-[#21BAD4] px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold transition-colors"
          >
            Pause
          </button>
        </div>
      </header>

      {/* ✅ SECTION TABS */}
      <div className="bg-white border-b border-gray-300 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-600">SECTIONS</span>
          <button className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#21BAD4] text-white rounded text-xs sm:text-sm font-semibold">
            CBT
          </button>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT - QUESTION AREA */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white relative flex flex-col">
          {currentQuestion && (
            <div className="bg-white rounded-lg border border-gray-300 p-4 sm:p-6 shadow-sm flex-1 mb-20 md:mb-24">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm sm:text-base font-bold text-gray-900">Question No. {currentQuestion.questionNumber}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 text-[10px] sm:text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Marks</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{oneQuestionMarks}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">{state?.testInfo?.negative_mark}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Time</span>
                      <span className="font-mono text-gray-900">{formatQuestionTime(currentQuestionTime)}</span>
                    </div>
                  </div>
                  <select
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    className="border border-gray-300 px-2 sm:px-3 py-1 rounded text-[10px] sm:text-sm"
                  >
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                  </select>

                  <button className="p-1 sm:p-2 hover:bg-gray-100 rounded transition-colors hidden sm:block">
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
              <div className="space-y-3 ">
                {(currentLanguage === 'hindi' ? currentQuestion.optionsHindi : currentQuestion.optionsEnglish).map((option, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 px-2 rounded cursor-pointer group hover:bg-gray-300"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedOptions[currentQuestion.id] === option}
                      onChange={() => handleOptionSelect(option)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1 text-base text-gray-800 " >
                      <MathRenderer text={option} />
                    </div>
                  </label>
                ))}
              </div>

            </div>
          )}


          {/* ✅ FOOTER - REFINED Prominent Buttons */}
          <footer className="border-t border-gray-300 fixed lg:absolute left-0 right-0 sm:right-auto sm:left-auto lg:w-full bottom-0 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white shadow-lg-top z-10 sm:w-[calc(100%-320px)] lg:w-full">
            {/* Left Side - Two Buttons */}
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleMarkForReview}
                className="flex-1 sm:flex-none bg-[#A9D1F4] hover:bg-[#8fc4ee] text-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 sm:px-8 rounded-lg text-xs sm:text-sm transition-all active:scale-95 border border-gray-300"
              >
                Clear Response
              </button>
            </div>

            {/* Right Side - Prominent Save & Next Button */}
            <button
              onClick={handleSaveAndNext}
              className="w-full sm:w-auto bg-[#21BAD4] hover:bg-[#1da5bf] text-white font-bold py-3 px-12 sm:px-20 rounded-lg text-sm sm:text-base transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 sm:mr-2"
            >
              Save & Next
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </footer>


        </main>

        {/* RIGHT SIDEBAR - Collapsible on Mobile */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-[#D9ECF8] border-l border-gray-300 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 lg:hidden -translate-x-full"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="relative h-full flex flex-col bg-[#D9ECF8]">
            {/* User Info */}
            <div className="p-4 bg-white border-b border-gray-300 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={userInfo?.profile || "https://i.pravatar.cc/40"}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#21BAD4]"
                />
                <p className="font-semibold text-sm sm:text-base text-gray-900">{userInfo?.name || 'prachi'}</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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

            </div>

            {/* Action Buttons */}
            <div className="space-y-2 absolute bottom-0 bg-[#A9D6F1] w-full p-4">
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
