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
    console.log('state 6 screen', state)
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

            // ✅ Respect API provided marks if available (handles -1 or 0 correctly)
            let calculatedScore = parseFloat(attempt.marks);

            // Fallback to local calculation only if marks is invalid/undefined (check for NaN is safer)
            if (isNaN(calculatedScore)) {
                calculatedScore = correct * markPerQ - inCorrect * negativeMark;
            }

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

            // ----- PRIORITY 1: Direct submission (from Screen5) -----
            if (state.testResults && state.allQuestions && !state.isDataPreloaded) {
                const results = state.testResults;
                const questions = state.allQuestions;
                const testInfo = state.testInfo || {};
                const testDetail0 = state.testDetail?.[0] || {};

                let totalQuestions =
                    Number(state.total_questions) ||
                    Number(testInfo.total_no_of_question) ||
                    Number(testDetail0.total_no_of_question) ||
                    Number(testDetail0.no_of_question) ||
                    0;

                let totalMarks = parseFloat(
                    state.total_marks ||
                    testInfo.total_marks ||
                    testDetail0.total_marks ||
                    testDetail0.marks ||
                    0
                );

                // ✅ ROBUST: For sectional tests, if totals are still 0, sum up from all sections
                if (state.isSectionalTest && state.testDetail && Array.isArray(state.testDetail) && (totalMarks === 0 || totalQuestions === 0)) {
                    state.testDetail.forEach(sec => {
                        if (totalQuestions === 0) totalQuestions += Number(sec.no_of_question || sec.total_no_of_question || 0);
                        if (totalMarks === 0) totalMarks += parseFloat(sec.marks || sec.total_marks || 0);
                    });
                }

                // Fallback for questions if still 0
                if (totalQuestions === 0) totalQuestions = questions.length || 1;

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
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

                            {/* Percentile Card */}
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
                                                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">
                                    {performance?.percentile || '0%'}
                                </div>
                                <div className="text-xs font-medium text-gray-700">
                                    Percentile
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
