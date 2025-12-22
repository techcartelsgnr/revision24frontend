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
        const testSeriesType = state?.testInfo?.test_series_type || state?.testinfo?.test_series_type || state?.test_series_info?.test_series_type;
        if (testSeriesType === 'mains') return true;

        const hasMultipleSections = state?.testDetail &&
            Array.isArray(state.testDetail) &&
            state.testDetail.length > 1;
        return hasMultipleSections;
    }, [state?.testDetail, state?.testInfo, state?.testinfo, state?.test_series_info]);

    // const testSeriesId = state?.testInfo?.test_id || null;
    // console.log('testSeriesId', testSeriesId);
    // const testSeriesID = localStorage.setItem('testSeriesID', testSeriesId);
    const isMainsExam = (
        state?.testInfo?.test_series_type === 'mains' ||
        state?.testinfo?.test_series_type === 'mains' ||
        state?.test_series_info?.test_series_type === 'mains'
    );

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // ✅ NEW: Logic for splitting Mains sections into Modules (Math, Reasoning, etc.)
    const getMainsModules = () => {
        if (!isMainsExam || !currentSectionData) return [];

        const qList = currentSectionData.questions;
        const modules = [];

        if (currentSection === 0) {
            // Section I: Math (30) + Reasoning (30)
            modules.push({
                name: "Mathematical Abilities",
                questions: qList.slice(0, 30),
                startIdx: 0
            });
            modules.push({
                name: "Reasoning and General Intelligence",
                questions: qList.slice(30, 60),
                startIdx: 30
            });
        } else if (currentSection === 1) {
            // Section II: English (45) + General Awareness (25)
            modules.push({
                name: "English Language & Comprehensions",
                questions: qList.slice(0, 45),
                startIdx: 0
            });
            modules.push({
                name: "General Awareness",
                questions: qList.slice(45, 70),
                startIdx: 45
            });
        } else {
            // Other sections (like Computer) - No split
            modules.push({
                name: currentSectionData.subject_name,
                questions: qList,
                startIdx: 0
            });
        }
        return modules;
    };

    const mainsModules = getMainsModules();

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
            // ✅ Calculate marks
            const negativeMark = parseFloat(state?.testInfo?.negative_mark || 0);
            const totalMarks = parseFloat(state?.total_marks || 100);
            const markPerques = totalMarks / (questionsState.length || 1);

            // Default global calculation
            let marksScored = (correct * markPerques) - (in_correct * negativeMark);

            // ✅ Total time spent
            const totalTimeSpent = spentTime.reduce((acc, item) => acc + (item.time || 0), 0);

            // ✅ NEW: Calculate section-wise/subject-wise analysis
            const subjectWiseAnalysis = [];

            if (isSectionalTest && state?.testDetail && groupedQuestions.length > 0) {
                // For sectional tests, recalculate marksScored based on section logic
                marksScored = 0;

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

                    // ✅ Calculate NET score for this section (including negative marking)
                    const sectionNetMarks = (sectionCorrect * marksPerQ) - (sectionIncorrect * negativeMark);

                    const minPassing =
                        detailMeta?.is_qualified_section == 1
                            ? parseFloat(detailMeta.min_passing_marks || 0)
                            : null;

                    const isQualifyingSection = detailMeta?.is_qualified_section == 1;

                    // Check passing based on NET marks
                    const isPassed =
                        isQualifyingSection && sectionNetMarks >= minPassing;

                    // ✅ Add to TOTAL marks only if NOT a qualifying section
                    if (!isQualifyingSection) {
                        marksScored += sectionNetMarks;
                    }

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
                        obtained_marks: Number(sectionNetMarks.toFixed(2)),
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
            //  console.log('calc => correct, incorrect, markPerques, negativeMark, marksScored',
            //     correct, in_correct, markPerques, negativeMark, marksScored);

            console.log('📚 Subject-wise Analysis:', subjectWiseAnalysis);

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

            console.log('✅ Submission Data:', submissionData);

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
            {/* ✅ TOP HEADER - RESPONSIVE STACKING */}
            <div className="bg-white border-b border-gray-400 px-4 sm:px-6 py-3 sm:py-2.5">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                            {state?.testInfo?.title || 'SSC CGL Tier-I Exam (Held on 17 July 2023, Shift I)'}
                        </h1>
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

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="bg-gray-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold">
                            Time Left: {state?.testInfo?.time || '120'} Min
                        </div>
                        <button
                            onClick={handlePauseClick}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold transition-colors"
                        >
                            Pause
                        </button>
                        <button
                            onClick={() => { isFullScreen ? exitFullScreen() : enterFullScreen(); }}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                        >
                            {isFullScreen ? 'Exit Full' : 'Full Screen'}
                        </button>
                        <div className="text-xs sm:text-sm text-gray-900 hidden sm:block">
                            Name : <span className="font-semibold">{userInfo?.name || 'Prachi Choudhary'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ NAVIGATION BAR - RESPONSIVE ACTION BUTTONS */}
            <div className="bg-white border-b border-gray-400 px-4 sm:px-6 py-3">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    {/* Left - Links */}
                    <div className="flex justify-center sm:justify-start gap-6 sm:gap-12 w-full lg:w-auto">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-orange-600 font-bold text-sm sm:text-base hover:underline uppercase whitespace-nowrap"
                        >
                            SYMBOLS
                        </button>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="text-orange-600 font-bold text-sm sm:text-base hover:underline uppercase whitespace-nowrap"
                        >
                            INSTRUCTIONS
                        </button>
                    </div>

                    {/* Center - Action Buttons */}
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full lg:w-auto">
                        {selectedOptions[current?.id] && (
                            <button
                                onClick={handleClearOption}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                            >
                                Clear Option
                            </button>
                        )}
                        <button
                            onClick={handleMarkForReview}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                        >
                            Mark for Review
                        </button>
                        <button
                            onClick={handleSaveAndNext}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                        >
                            {selectedOptions[current?.id] ? 'Save & Next' : 'Next'}
                        </button>

                        {isMainsExam && (
                            <button
                                type="button"
                                onClick={() => setShowSectionSubmitConfirm(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors">
                                Submit Section
                            </button>)}

                        <button
                            onClick={() => setConfirmSubmit(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Timer */}
                    <div className="text-center sm:text-right w-full lg:w-32">
                        {isSectionalTest && isMainsExam ? (
                            <TestTimer
                                key={`${testId}_section_${currentSection}_${isReattemptSession ? "reattempt" : "normal"}`}
                                timeClr="text-blue-800"
                                textLeft="SECTION"
                                textBg="text-red-600"
                                timeTextSize="text-lg sm:text-xl lg:text-2xl"
                                textRight="Min"
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
                                textLeft="TIME"
                                textBg="text-red-600"
                                timeTextSize="text-lg sm:text-xl lg:text-2xl"
                                textRight=""
                                showSeconds={true}
                                testId={`test_${state?.testInfo?.testid}_timer`}
                                timeInMinutes={parseInt(state?.testInfo?.time || 0)}
                                onTimeUp={handleTimeUp}
                                isFreshStart={isReattemptSession}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ MAIN CONTENT - RESPONSIVE LAYOUT */}
            <div className="flex flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 122px)' }}>
                {/* BACKDROP - Mobile Only */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* LEFT SIDEBAR - COLLAPSIBLE ON MOBILE */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-62 bg-white border-r border-gray-400 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    {/* Section Title */}
                    <div className="bg-gray-100 px-3 py-1 border-b border-gray-300">
                        <h3 className="font-semibold text-gray-900 text-base">
                            {isMainsExam
                                ? `Section ${["I", "II", "III", "IV"][currentSection] || currentSection + 1}`
                                : (isSectionalTest
                                    ? `${currentSectionData?.subject_name.substring(0, 23)}...`
                                    : 'General Intelligence an...')}
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
                                        setIsSidebarOpen(false); // Close on selection
                                    }}
                                    className={`px-3 py-2 rounded-md font-bold text-sm transition-colors ${currentSection === idx
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-700 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    PART-{String.fromCharCode(65 + idx)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section Description */}
                    {!isMainsExam && (
                        <div className="px-4 py-2.5 border-b border-gray-300">
                            <p className="text-sm text-gray-900 font-semibold">
                                {isSectionalTest ? currentSectionData?.subject_name : 'General Intelligence and Reasoning'}
                            </p>
                        </div>
                    )}

                    {/* Question Grid */}
                    <div className="p-4">
                        {isMainsExam ? (
                            <div className="space-y-6">
                                {mainsModules.map((module, mIdx) => (
                                    <div key={mIdx}>
                                        <h4 className="text-sm font-bold text-gray-800 mb-3 ml-1 border-l-4 border-blue-600 pl-2">
                                            {module.name}
                                        </h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {module.questions.map((q, index) => {
                                                const absoluteIdx = module.startIdx + index;
                                                const isAttempted = optionSelected.includes(q.id);
                                                const isMarkedWithAns = markedWithAns.includes(q.id);
                                                const isMarked = markedForReview.includes(q.id);
                                                const isCurrent = absoluteIdx === currentQuestion;

                                                let bgColor = 'bg-blue-600 text-white';
                                                if (isAttempted && !isMarkedWithAns) bgColor = 'bg-green-600 text-white';
                                                if (isMarkedWithAns) bgColor = 'bg-yellow-500 text-white';
                                                if (isMarked) bgColor = 'bg-red-600 text-white';

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() => {
                                                            setCurrentQuestion(absoluteIdx);
                                                            setIsSidebarOpen(false);
                                                        }}
                                                        className={`h-10 w-10 rounded-md font-bold text-sm ${bgColor} ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                                                            } transition-all active:scale-90`}
                                                    >
                                                        {mIdx === 0 ? absoluteIdx + 1 : absoluteIdx + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 mb-6" >
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
                                            onClick={() => {
                                                setCurrentQuestion(index);
                                                setIsSidebarOpen(false); // Close on selection
                                            }}
                                            className={`h-10 w-10 rounded-md font-bold text-sm ${bgColor} ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                                                } transition-all active:scale-90`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Legend - EXACT FONT SIZE */}
                        <div className="space-y-3 mt-4 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">Attempted <span className="text-gray-900">({optionSelected.length})</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-sm flex-shrink-0"></div>
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">Marked w/ Ans <span className="text-gray-900">({markedWithAns.length})</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">Marked <span className="text-gray-900">({markedForReview.length})</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-xs sm:text-sm text-gray-700 font-medium">Not Visited <span className="text-gray-900">({(isSectionalTest ? currentSectionData?.questions : questionsState).length - optionSelected.length - markedForReview.length - markedWithAns.length})</span></span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT SIDE - QUESTION DISPLAY */}
                <main className="flex-1 bg-white overflow-y-auto p-3 sm:p-6" >
                    <div className="border border-gray-400 rounded-lg py-4 px-4 sm:py-6 sm:px-6 shadow-sm" id="testBg" style={{ height: 'fit-content' }}>
                        {/* Question Header - EXACT FONT SIZE */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 border-b border-gray-300" >
                            <div className="text-base sm:text-lg font-bold text-gray-900">
                                Question : {currentQuestion + 1}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-xs sm:text-sm text-gray-700 font-mono">
                                    Time: {formatTime(currentQuestionTime)}
                                </span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="border border-gray-400 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="en">EN</option>
                                    <option value="hi">HI</option>
                                </select>
                            </div>
                        </div>

                        {/* Question Text - EXACT FONT SIZE */}
                        <div className="mb-6 text-sm sm:text-base leading-relaxed text-gray-900 overflow-x-auto">
                            <MathRenderer text={questionText} />
                        </div>

                        {/* Options - Table Like Structure */}
                        <div className="border border-gray-300 rounded sm:rounded-lg overflow-hidden">
                            {Object.entries(options).map(([key, value]) => (
                                <div
                                    key={key}
                                    className={`flex items-stretch border-b border-gray-300 last:border-b-0 transition-colors ${selectedOptions[current.id] === key ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                >
                                    {/* Radio Column */}
                                    <div
                                        className="w-12 sm:w-16 flex items-center justify-center border-r border-gray-300 bg-white flex-shrink-0 cursor-pointer"
                                        onClick={() => handleOptionChange(current.id, key)}
                                    >
                                        <input
                                            type="radio"
                                            name={`question_${current.id}`}
                                            value={key}
                                            checked={selectedOptions[current.id] === key}
                                            onChange={() => handleOptionChange(current.id, key)}
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                        />
                                    </div>
                                    {/* Option Text Column */}
                                    <div
                                        className="flex-1 p-3 sm:p-4 text-sm sm:text-base text-gray-900 flex items-center cursor-pointer"
                                        onClick={() => handleOptionChange(current.id, key)}
                                    >
                                        <MathRenderer text={value} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {
                showLastQuestionModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95%] sm:max-w-md p-6">
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">End of Section</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">You have reached the last question of this section.</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => { setShowLastQuestionModal(false); setCurrentQuestion(0); }}
                                    className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
                                >
                                    Go to First
                                </button>

                                {isSectionalTest && (
                                    <button
                                        onClick={() => { setShowLastQuestionModal(false); setShowSectionSubmitConfirm(true); }}
                                        className="bg-yellow-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
                                    >
                                        Submit Section
                                    </button>
                                )}

                                <button
                                    onClick={() => { setShowLastQuestionModal(false); setConfirmSubmit(true); }}
                                    className="bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
                                >
                                    Submit Test
                                </button>


                            </div>



                        </div>
                    </div>
                )
            }
            {/* Timer */}
            <div className="text-right w-full lg:w-auto">

            </div>

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


