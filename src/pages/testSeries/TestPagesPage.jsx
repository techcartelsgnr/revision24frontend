import React, { useCallback, useEffect, useState } from "react";
import { FaClock, FaFilePdf, FaShareAlt, FaRegBookmark, FaSearch, FaTrophy, FaQuestionCircle, FaStar, FaGraduationCap } from "react-icons/fa";
import { MdArrowBackIos, MdAccessTime, MdPlayArrow, MdAssignment, MdTrendingUp } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { AiOutlineReload } from "react-icons/ai";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    fetchUserTestSeriesRankSlice,
    getSingleCategoryPackageTestseriesDetailSlice,
    getSingleCategoryPackageTestseriesSlice,
    // ✅ Added
} from "../../redux/HomeSlice";
import ResumeTestModal from "../../components/ResumeTestModal";
import { clearAllEncryptedTestData, clearTestEncryptedData, secureGetTestData, secureSaveTestData } from "../../helpers/testStorage";
import { clearUserData, getUserDataDecrypted } from "../../helpers/userStorage";
import SuccessModal from "../../components/SuccessModal";
import ConfirmModal from "../../components/ConfirmModal";
import AlertModal from "../../components/AlertModal";
import { formatStartDateTime, isQuizStartAvailable } from "../../helpers/checkTestStartDate";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { IoSparklesOutline } from "react-icons/io5";
import { getResetTestSliceData } from "../../redux/attemptedDataSlice";

const TestPagesPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    // console.log('Test Pages page screen', state)

    const [testData, setTestData] = useState([]);
    const [testId, setTestId] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [resumeData, setResumeData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [pageLoading, setPageLoading] = useState(false);
    const [pauseStatusArray, setPauseStatusArray] = useState([]);
    const [subscribe, setSubscribe] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [examCategoryTitle, setExamCategoryTitle] = useState('');

    // ✅ Add new states for reattempt
    const [showReattemptConfirm, setShowReattemptConfirm] = useState(false);
    const [reattemptTest, setReattemptTest] = useState(null);

    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        setSubscribe(user.subscription_status);
    };

    useEffect(() => {
        loadUserData();
    }, []);



    useEffect(() => {
        const loadPauseStatus = async () => {
            try {
                const data = await secureGetTestData('pausestatus', 'pausestatusarray');
                // console.log('📦 Loaded Pause Status Array:', data);
                setPauseStatusArray(data || []);
            } catch (error) {
                console.error('❌ Error loading pause status:', error);
                setPauseStatusArray([]);
            }
        };
        loadPauseStatus();

        // ✅ Reload when window gains focus (user comes back from test)
        const handleFocus = () => {
            console.log('🔄 Window focused - reloading pause status');
            loadPauseStatus();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // ✅ View Result handler
    // const handleViewResult = async (test) => {
    //     try {
    //         // test.id and test.attend_id must come from your test list API
    //         if (!test.id || !test.attend_id) {
    //             console.error("Missing test_id or attend_id on View Result", test);
    //             return;
    //         }

    //         // Call rank/details API ONCE here
    //         const res = await dispatch(
    //             fetchUserTestSeriesRankSlice({
    //                 test_id: test.id,
    //                 attend_id: test.attend_id,
    //             })
    //         ).unwrap();

    //         if (res.status_code === 200 && res.data) {
    //             // nav("/analysis", {
    //             //     state: {
    //             //         // tell Screen6 this is preloaded
    //             //         isDataPreloaded: true,
    //             //         preloadedData: res.data,

    //             //         actualTestId: test.id,
    //             //         testInfo: {
    //             //             test_id: test.id,
    //             //             attend_id: res.data.my_detail?.attend_id,
    //             //             title: test.title,
    //             //             time: test.time,
    //             //             total_marks: test.total_marks,
    //             //             negative_mark: test.negative_mark,
    //             //         },
    //             //     },
    //             // });
    //             nav('/analysis', {
    //                 state: {
    //                     isDataPreloaded: true,
    //                     preloadedData: res.data,

    //                     // identifiers
    //                     actualTestId: testRow.test_id,
    //                     attend_id: testRow.id,
    //                     testInfo: {
    //                         test_id: testRow.test_id,
    //                         id: testRow.id,
    //                         attend_id: testRow.id,
    //                         title: testRow.title,
    //                         time: testRow.time,
    //                         total_marks: testRow.total_marks,
    //                         negative_mark: testRow.negative_mark,
    //                     },

    //                     // 🔽 NEW: attempts data for dropdown
    //                     allAttempts: allAttemptsForThisTest,
    //                     currentAttemptId: testRow.id,
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("❌ View Result error:", error);
    //     }
    // };

    // Correct handler
const handleViewResult = async (test) => {
  try {
    // ✅ use id as test_id and attend_id as attempt id
    const testId = test.id;
    const attendId = test.attend_id;

    if (!testId || !attendId) {
      console.error('Missing test_id or attend_id on View Result', test);
      return;
    }

    const res = await dispatch(
      fetchUserTestSeriesRankSlice({
        test_id: testId,
        attend_id: attendId,
      })
    ).unwrap();

    if (res.status_code === 200 && res.data) {
      const allAttemptsForThisTest = testData.filter(
        t => t.id === testId && t.attend_id
      );

      nav('/analysis', {
        state: {
          isDataPreloaded: true,
          preloadedData: res.data,

          actualTestId: testId,
          attend_id: attendId,
          testInfo: {
            test_id: testId,
            id: attendId,
            attend_id: attendId,
            title: test.title,
            time: test.time,
            total_marks: test.marks,
            negative_mark: test.negative_mark,
          },

          allAttempts: allAttemptsForThisTest,
          currentAttemptId: attendId,
        },
      });
    }
  } catch (error) {
    console.error('View Result error:', error);
  }
};




    // console.log("Pause Status Array", pauseStatusArray);


    // const getSigleCategoryData = async (page = 1, query = '') => {

    //     if (state) {
    //         try {
    //             setPageLoading(true);
    //             const res = await dispatch(
    //                 getSingleCategoryPackageTestseriesSlice({
    //                     testId: state.testId,
    //                     page,
    //                     search: query
    //                 })
    //             ).unwrap();

    //             console.log('Single Category Test Series Data', res.data?.package_detail);
    //             setExamCategoryTitle(res?.data?.package_detail?.exam_category?.title ||
    //                 res?.data?.package_detail?.category_name ||
    //                 'General');

    //             if (res.status_code === 200) {
    //                 const rawTestData = res.data?.test_series?.data || [];

    //                 const sortedTestData = rawTestData.sort((a, b) => {
    //                     const seqA = a.sequence ? Number(a.sequence) : Infinity;
    //                     const seqB = b.sequence ? Number(b.sequence) : Infinity;
    //                     return seqA - seqB;
    //                 });

    //                 setTestData(prev => page === 1 ? sortedTestData : [...prev, ...sortedTestData]);
    //                 console.log('Sorted test data for page', page, sortedTestData);

    //                 // ✅✅✅ FIX: Correct property names
    //                 setPagination({
    //                     current_page: res.data?.test_series?.current_page || 1,
    //                     last_page: res.data?.test_series?.last_page || 1,
    //                 });

    //                 setTestId(res.data?.package_detail?.id);
    //             }
    //         } catch (error) {
    //             console.error('❌ API Error:', error);
    //             setShowAlert(true);

    //             if (error.status === 401 || error.response?.status === 401) {
    //                 setMessage('Login token has expired. Please sign in again to continue.');
    //             } else {
    //                 setMessage('Failed to load tests. Please try again.');
    //             }
    //         } finally {
    //             setPageLoading(false);
    //         }
    //     }
    // };

    const getSigleCategoryData = async (page = 1, query = "") => {
        const navTestId = state?.testId;   // value coming from navigation

        if (!navTestId) {
            console.warn("No testId in TestPagesPage state, skipping fetch");
            setTestData([]);
            return;
        }

        try {
            setPageLoading(true);

            const res = await dispatch(
                getSingleCategoryPackageTestseriesSlice({
                    testId: navTestId,          // ✅ use navTestId here
                    page,
                    search: query,
                })
            ).unwrap();

            // console.log("Single Category Test Series Data", res.data?.package_detail);

            setExamCategoryTitle(
                res?.data?.package_detail?.exam_category?.title ||
                res?.data?.package_detail?.category_name ||
                "General"
            );

            if (res.status_code === 200) {
                const rawTestData = res.data?.test_series?.data || [];

                const sortedTestData = rawTestData.sort((a, b) => {
                    const seqA = a.sequence ? Number(a.sequence) : Infinity;
                    const seqB = b.sequence ? Number(b.sequence) : Infinity;
                    return seqA - seqB;
                });

                setTestData(prev => (page === 1 ? sortedTestData : [...prev, ...sortedTestData]));
                // console.log("Sorted test data for page", page, sortedTestData);

                setPagination({
                    current_page: res.data?.test_series?.current_page || 1,
                    last_page: res.data?.test_series?.last_page || 1,
                });

                // ✅ keep same id for future navigation (pause, reattempt)
                setTestId(navTestId);
            }
        } catch (error) {
            console.error("❌ API Error:", error);
            setShowAlert(true);

            if (error.status === 401 || error.response?.status === 401) {
                setMessage("Login token has expired. Please sign in again to continue.");
            } else {
                setMessage("Failed to load tests. Please try again.");
            }
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        // Fetch test series data from backend or storage here
        setSearchTerm("");
        getSigleCategoryData(1);
    }, []);


    const fetchTestSeriesDetails = async (item) => {
        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(item.id)).unwrap();
            const userData = await getUserDataDecrypted("user");
            if (examCategoryTitle === 'SSC') {
                nav('/system-info', {
                    state: {
                        testInfo: res.data.test_series_info,
                        testId: state?.testId,
                        testDetail: res.data.details,
                        userInfo: userData,
                        packageDetail: res.data?.package_detail,
                        currentTestCardId: item.id,
                        total_marks: res.data.total_marks,
                        total_questions: res.data.total_questions,

                    }
                });
            } else {
                nav('/online-exam-general-instruction', {
                    state: {
                        testInfo: res.data.test_series_info,
                        testId: state?.testId,
                        testDetail: res.data.details,
                        userInfo: userData,
                        packageDetail: res.data?.package_detail,
                        total_marks: res.data.total_marks,
                        total_questions: res.data.total_questions,
                    }
                });
            }
        } catch (error) {
            console.log("ERROR ", error);
        }
    };

    // const handleResume = async () => {
    //     try {
    //         const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap();
    //         nav('/scc-mock-test', {
    //             state: {
    //                 testInfo: res.data.test_series_info,
    //                 testId: state?.testId,
    //                 testDetail: res.data.details,
    //                 packageDetail: res.data.package_detail,
    //             }
    //         });
    //         setShowModal(false);
    //     } catch (error) {
    //         console.log("ERROR ===>", error);
    //     }
    // };

    // const handleResume = async () => {
    //     try {
    //         // ✅ Clear pause status
    //         const updatedPauseArray = pauseStatusArray.filter(item => item.test_id !== resumeData?.id);
    //         await secureSaveTestData('pause_status', 'pause_status_array', updatedPauseArray);
    //         setPauseStatusArray(updatedPauseArray);

    //         console.log('✅ Resume Test:', resumeData.id);

    //         const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap();

    //         if (examCategoryTitle === 'SSC') {
    //             nav('/scc-mock-test', {
    //                 state: {
    //                     testInfo: res.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: res.data.details,
    //                     packageDetail: res.data.package_detail,
    //                     isResuming: true,
    //                 }
    //             });
    //         } else {
    //             nav('/online-exam', {
    //                 state: {
    //                     testInfo: res.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: res.data.details,
    //                     packageDetail: res.data.package_detail,
    //                     isResuming: true,
    //                 }
    //             });
    //         }

    //         setShowModal(false);
    //     } catch (error) {
    //         console.error("❌ Resume Error:", error);
    //         setShowAlert(true);
    //         setMessage('Failed to resume test. Please try again.');
    //     }
    // };
    // const handleResume = async () => {
    //     try {
    //         console.log('▶️ Resuming test:', resumeData.id);

    //         // ✅ DON'T clear pause status yet - do it in Screen5 after restoration
    //         // Just navigate with isPaused flag

    //         const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap();

    //         if (examCategoryTitle === 'SSC') {
    //             nav('/scc-mock-test', {  // ✅ Changed to /screen5
    //                 state: {
    //                     testInfo: res.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: res.data.details,
    //                     packageDetail: res.data.package_detail,
    //                     isResuming: true,  // ✅ Add flag
    //                 }
    //             });

    //             const stateData = {
    //                 testInfo: res.data.test_series_info,
    //                 testId: state?.testId,
    //                 testDetail: res.data.details,
    //                 packageDetail: res.data.package_detail,
    //                 isResuming: true,  // ✅ Add flag
    //             }
    //             localStorage.setItem("stateVal", JSON.stringify(stateData))


    //         } else {
    //             nav('/online-exam', {  // ✅ Changed to /screen5
    //                 state: {
    //                     testInfo: res.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: res.data.details,
    //                     packageDetail: res.data.package_detail,
    //                     isResuming: true,  // ✅ Add flag
    //                 }
    //             });
    //         }

    //         setShowModal(false);
    //     } catch (error) {
    //         console.error("❌ Resume Error:", error);
    //         setShowAlert(true);
    //         setMessage('Failed to resume test. Please try again.');
    //     }
    // };

    // const handleResume = async () => {
    //     try {
    //         console.log("▶️ Resuming test:", resumeData.id);

    //         // 1. Get fresh test details
    //         const res = await dispatch(
    //             getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)
    //         ).unwrap;

    //         const navState = {
    //             testInfo: res.data.test_series_info,
    //             testId: state?.testId,              // package id
    //             testDetail: res.data.details,
    //             packageDetail: res.data.package_detail,
    //             isResuming: true,
    //             currentTestCardId: resumeData.id,   // ✅ card id used for pauseStatus
    //         };

    //         // persist for refresh
    //         localStorage.setItem("stateVal", JSON.stringify(navState));

    //         if (examCategoryTitle === "SSC") {
    //             nav("/scc-mock-test", { state: navState });
    //         } else {
    //             nav("/online-exam", { state: navState });
    //         }

    //         setShowModal(false);
    //     } catch (error) {
    //         console.error("❌ Resume Error:", error);
    //         setShowAlert(true);
    //         setMessage("Failed to resume test. Please try again.");
    //     }
    // };

    // const handleResume = async () => {
    //   try {
    //     console.log("Resuming test, resumeData.id", resumeData?.id);

    //     const res = await dispatch(
    //       getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)
    //     ).unwrap;

    //     const navState = {
    //       testInfo: res.data.testseriesinfo,
    //       testId: state?.testId,
    //       testDetail: res.data.details,
    //       packageDetail: res.data.packagedetail,
    //       isResuming: true,
    //       currentTestCardId: resumeData.id,
    //     };

    //     localStorage.setItem("stateVal", JSON.stringify(navState));

    //     if (examCategoryTitle === "SSC") {
    //       nav("/scc-mock-test", { state: navState });
    //     } else {
    //       nav("/online-exam", { state: navState });
    //     }

    //     setShowModal(false);
    //   } catch (error) {
    //     console.error("Resume Error", error);
    //     setShowAlert(true);
    //     setMessage("Failed to resume test. Please try again.");
    //   }
    // };
    // const handleResume = async () => {
    //     if (!resumeData?.id) {
    //         console.error("No resumeData.id, cannot resume");
    //         setShowAlert(true);
    //         setMessage("Cannot resume this test. Please refresh and try again.");
    //         return;
    //     }

    //     try {
    //         console.log("Resuming test, resumeData.id =", resumeData.id);

    //         const res = await dispatch(
    //             getSingleCategoryPackageTestseriesDetailSlice(resumeData.id)
    //         ).unwrap();

    //         const navState = {
    //             testInfo: res.data.testseriesinfo,
    //             testId: state?.testId,              // package id coming from route
    //             testDetail: res.data.details,
    //             packageDetail: res.data.packagedetail,
    //             isResuming: true,
    //             currentTestCardId: resumeData.id,   // same id used for card & pause
    //         };

    //         localStorage.setItem("stateVal", JSON.stringify(navState));

    //         if (examCategoryTitle === "SSC") {
    //             nav("/scc-mock-test", { state: navState });
    //         } else {
    //             nav("/online-exam", { state: navState });
    //         }

    //         setShowModal(false);
    //     } catch (error) {
    //         console.error("Resume Error:", error);
    //         setShowAlert(true);
    //         setMessage("Failed to resume test. Please try again.");
    //     }
    // };

    //     const handleResume = async () => {
    //   if (!resumeData?.id) return;

    //   try {
    //     console.log("Resuming test, resumeData.id =", resumeData.id);

    //     const res = await dispatch(
    //       getSingleCategoryPackageTestseriesDetailSlice(resumeData.id)
    //     ).unwrap();

    //     const navState = {
    //       testInfo: res.data.testseriesinfo,    // ✅ needed in Screen5
    //       testId: state?.testId,               // package id
    //       testDetail: res.data.details,
    //       packageDetail: res.data.packagedetail,
    //       isResuming: true,
    //       currentTestCardId: resumeData.id,
    //     };

    //     localStorage.setItem("stateVal", JSON.stringify(navState));

    //     if (examCategoryTitle === "SSC") {
    //       nav("/scc-mock-test", { state: navState });
    //     } else {
    //       nav("/online-exam", { state: navState });
    //     }

    //     setShowModal(false);
    //   } catch (error) {
    //     console.error("Resume Error:", error);
    //     setShowAlert(true);
    //     setMessage("Failed to resume test. Please try again.");
    //   }
    // };

    const handleResume = async () => {
        try {
            // console.log("Resuming test, resumeData.id", resumeData?.id);

            const res = await dispatch(
                getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)
            ).unwrap();

            // Use the correct field names from API
            const navState = {
                testInfo: res.data.test_series_info,    // ✅ was testseriesinfo
                testId: state?.testId,                 // package id
                testDetail: res.data.details,
                packageDetail: res.data.package_detail, // ✅ was packagedetail
                isResuming: true,
                currentTestCardId: resumeData.id,
            };

            localStorage.setItem("stateVal", JSON.stringify(navState));

            if (examCategoryTitle === "SSC") {
                nav("/scc-mock-test", { state: navState });
            } else {
                nav("/online-exam", { state: navState });
            }

            setShowModal(false);
        } catch (error) {
            console.error("Resume Error", error);
            setShowAlert(true);
            setMessage("Failed to resume test. Please try again.");
        }
    };


    // ✅ With Confirmation but No Reset
    const handleReattemptClick = (test) => {
        setReattemptTest(test);
        setShowReattemptConfirm(true);
    };

    // ✅ WITHOUT Reset - Backend must handle multiple attempts
    // const handleReattemptConfirm = async () => {
    //     setShowReattemptConfirm(false);

    //     if (!reattemptTest) return;

    //     try {
    //         setPageLoading(true);

    //         // ✅ Pass isReattempt flag so backend creates new attempt
    //         const testDetailsRes = await dispatch(
    //             getSingleCategoryPackageTestseriesDetailSlice(reattemptTest.id)
    //         ).unwrap();
    //         const PackageDataRes = await dispatch(
    //             getSingleCategoryPackageTestseriesSlice({
    //                 testId: state.testId,
    //             })
    //         ).unwrap();
    //         const userData = await getUserDataDecrypted("user");

    //         // ✅ Navigate with reattempt flag
    //         if (examCategoryTitle === 'SSC') {
    //             nav('/system-info', {
    //                 state: {
    //                     testInfo: testDetailsRes.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: testDetailsRes.data.details,
    //                     userInfo: userData,
    //                     isReattempt: true,  // ✅ Important flag
    //                     createNewAttempt: true, // ✅ Tell backend to create new attempt
    //                     packageDetail: testDetailsRes?.data?.package_detail,
    //                 }
    //             });
    //         } else {
    //             nav('/online-exam-general-instruction', {
    //                 state: {
    //                     testInfo: testDetailsRes.data.test_series_info,
    //                     testId: state?.testId,
    //                     testDetail: testDetailsRes.data.details,
    //                     userInfo: userData,
    //                     isReattempt: true,  // ✅ Important flag
    //                     createNewAttempt: true,
    //                     packageDetail: testDetailsRes?.data?.package_detail,  // ✅ Tell backend to create new attempt
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Reattempt Error:', error);
    //         setShowAlert(true);
    //         setMessage('Failed to start reattempt. Please try again.');
    //     } finally {
    //         setPageLoading(false);
    //         setReattemptTest(null);
    //     }
    // };

    // const handleReattemptConfirm = async () => {
    //     setShowReattemptConfirm(false);
    //     if (!reattemptTest) return;

    //     try {
    //         setPageLoading(true);

    //         const currentTestId = reattemptTest.id; // backend test id

    //         // 1) Clear all encrypted/saved data for this test attempt
    //         try {
    //                await clearTestEncryptedData(currentTestId);
    //         } catch (e) {
    //             console.error("Error clearing encrypted test data", e);
    //         }

    //         // 2) Remove pause status entry for this test
    //         try {
    //             const existingPauseArray =
    //                 (await secureGetTestData("pausestatus", "pausestatusarray")) || [];

    //             const updatedPauseArray = existingPauseArray.filter(
    //                 (item) => item.testid !== currentTestId
    //             );

    //             await secureSaveTestData(
    //                 "pausestatus",
    //                 "pausestatusarray",
    //                 updatedPauseArray
    //             );
    //         } catch (e) {
    //             console.error("Error clearing pause status for reattempt", e);
    //         }

    //         // 3) Fetch fresh test details (your existing code)
    //         const testDetailsRes = await dispatch(
    //             getSingleCategoryPackageTestseriesDetailSlice(reattemptTest.id)
    //         ).unwrap();

    //         const PackageDataRes = await dispatch(
    //             getSingleCategoryPackageTestseriesSlice({ testId: state.testId })
    //         ).unwrap();

    //         const userData = await getUserDataDecrypted("user");

    //         // 4) Navigate as reattempt with createNewAttempt flag
    //         const navState = {
    //             testInfo: testDetailsRes.data.test_series_info,
    //             testId: state?.testId,
    //             testDetail: testDetailsRes.data.details,
    //             userInfo: userData,
    //             isReattempt: true,
    //             createNewAttempt: true, // backend creates new attempt
    //             packageDetail: testDetailsRes?.data?.packagedetail,
    //         };

    //         if (examCategoryTitle === "SSC") {
    //             nav("/system-info", { state: navState });
    //         } else {
    //             nav("/online-exam-general-instruction", { state: navState });
    //         }
    //     } catch (error) {
    //         console.error("Reattempt Error", error);
    //         setShowAlert(true);
    //         setMessage("Failed to start reattempt. Please try again.");
    //     } finally {
    //         setPageLoading(false);
    //         setReattemptTest(null);
    //     }
    // };

    const handleReattemptConfirm = async () => {
        setShowReattemptConfirm(false);
        if (!reattemptTest) return;

        try {
            setPageLoading(true);

            // Use a single id for local storage and for Screen5
            const currentTestId = reattemptTest.testid || reattemptTest.id;

            // 1) Clear all encrypted/saved data for this test attempt
            try {
                await clearTestEncryptedData(currentTestId);
            } catch (e) {
                console.error("Error clearing encrypted test data", e);
            }

            // 2) Remove pause status entry for this test
            try {
                const existingPauseArray =
                    (await secureGetTestData("pausestatus", "pausestatusarray")) || [];

                const updatedPauseArray = existingPauseArray.filter(
                    (item) => item.testid !== currentTestId
                );

                await secureSaveTestData(
                    "pausestatus",
                    "pausestatusarray",
                    updatedPauseArray
                );
            } catch (e) {
                console.error("Error clearing pause status for reattempt", e);
            }

            // 3) Fetch fresh test details
            const testDetailsRes = await dispatch(
                getSingleCategoryPackageTestseriesDetailSlice(reattemptTest.id)
            ).unwrap();

            const userData = await getUserDataDecrypted("user");

            // 4) Navigate as reattempt with createNewAttempt flag
            const navState = {
                testInfo: testDetailsRes.data.test_series_info, // or .testseriesinfo based on API
                testId: currentTestId,              // IMPORTANT: use currentTestId, not state.testId
                testDetail: testDetailsRes.data.details,
                userInfo: userData,
                isReattempt: true,
                total_marks: testDetailsRes.data.total_marks,
                total_questions: testDetailsRes.data.total_questions,
                createNewAttempt: true,
                packageDetail: testDetailsRes?.data?.package_detail,
            };

            if (examCategoryTitle === "SSC") {
                nav("/system-info", { state: navState });
            } else {
                nav("/online-exam-general-instruction", { state: navState });
            }
        } catch (error) {
            console.error("Reattempt Error", error);
            setShowAlert(true);
            setMessage("Failed to start reattempt. Please try again.");
        } finally {
            setPageLoading(false);
            setReattemptTest(null);
        }
    };

    const getUserInfo = async () => {
        const userData = await getUserDataDecrypted("user");
        setUserInfo(userData);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        getSigleCategoryData(1);
    }, []);

    const debouncedSearch = useCallback(
        debounce((query) => {
            onSearch(query);
        }, 200),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const onSearch = async (query) => {
        await getSigleCategoryData(1, query);
    };





    const getButtonConfig = (test) => {
        // console.log("CARD test.id:", test.id, "test.testid:", test.testid);
        // console.log("PAUSE ARRAY:", pauseStatusArray);

        const isPaused = pauseStatusArray.some(
            (item) => item.testid === test.id && item.isPaused   // ✅ match backend id
        );
        // console.log("CHECK isPaused for card", test.id, "=>", isPaused);
        if (subscribe || (!subscribe && test.purchase_type === 'free')) {
            // ✅ PRIORITY 1: Show Resume if paused (IGNORE attend_status)
            if (isPaused) {
                return {
                    text: "Resume Test",
                    className: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-200",
                    icon: <MdPlayArrow size={18} />,
                    onClick: () => {
                        // console.log('▶️ Resume clicked for test:', test.id);
                        setShowModal(true);
                        setResumeData(test);
                    }
                };
            }

            // ✅ Check if not started (for Start Now button)
            const isNotStarted = !test.attend_status || test.attend_status === '' || test.attend_status === 'not_started';

            // ✅ PRIORITY 2: Show Start Now
            if (isQuizStartAvailable(test.start_date_time) && !test.attend && isNotStarted) {
                return {
                    text: "Start Now",
                    className: "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200",
                    icon: <HiOutlineLightningBolt size={18} />,
                    onClick: () => fetchTestSeriesDetails(test)
                };
            }

            // ✅ PRIORITY 3: Show completed buttons
            else if (test.attend && test.attend_status === 'done') {
                return {
                    isCompleted: true,
                    test: test
                };
            }

            // ✅ PRIORITY 4: Not available yet
            else {
                return {
                    text: `Available ${formatStartDateTime(test.start_date_time)}`,
                    className: "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-70",
                    icon: <MdAccessTime size={18} />,
                    onClick: () => {
                        setShowAlert(true);
                        setMessage("Test not available at this time");
                    }
                };
            }
        } else {
            return {
                text: "Upgrade Now",
                className: "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200",
                icon: <FaGraduationCap size={18} />,
                onClick: () => {
                    setShowAlert(true);
                    setMessage("Upgrade to premium to access this test");
                }
            };
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => nav(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 w-fit group"
                        >
                            <MdArrowBackIos size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="font-medium text-gray-700">Back</span>
                        </motion.button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Test Series</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">Choose your test and start practicing</p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tests..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                        />
                        {searchTerm && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                    setSearchTerm('');
                                    getSigleCategoryData(1);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <div className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                                    <span className="text-xs font-bold text-gray-600">×</span>
                                </div>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {testData.map((test, index) => {
                            const isPaused = pauseStatusArray.some(item => item.testid === test.id && item.isPaused);
                            const buttonConfig = getButtonConfig({ ...test, isPaused });
                            const isHovered = hoveredCard === test.id;

                            return (
                                <motion.div
                                    key={test.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredCard(test.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
                                >
                                    <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-purple-500/0 to-pink-500/0 ${isHovered ? 'from-blue-400/20 via-purple-500/20 to-pink-500/20' : ''} rounded-2xl transition-all duration-500 blur-sm -z-10`}></div>

                                    <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${isHovered ? 'scale-100 rotate-12' : 'scale-0 rotate-0'}`}>
                                        <IoSparklesOutline className="text-white text-sm" />
                                    </div>

                                    {/* Card Header */}
                                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50"></div>
                                        <div className={`absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-xl transition-all duration-500 ${isHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-30'}`}></div>

                                        <div className="relative z-10 flex items-start justify-between mb-4">
                                            <div className="flex flex-wrap gap-2 max-w-[70%]">
                                                {test.purchase_type === 'free' && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg"
                                                    >
                                                        FREE
                                                    </motion.span>
                                                )}
                                                {isPaused && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg animate-pulse"
                                                    >
                                                        PAUSED
                                                    </motion.span>
                                                )}
                                                {test.attend_status === 'done' && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg flex items-center gap-1"
                                                    >
                                                        <IoMdCheckmarkCircle size={12} />
                                                        COMPLETED
                                                    </motion.span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                <span>Hi/En</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight overflow-hidden">
                                            {test.title}
                                        </h3>

                                        <div className="grid grid-cols-3 gap-3">
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <MdAccessTime className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.time}</div>
                                                    <div className="text-xs text-gray-500">Duration</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <FaQuestionCircle className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.no_of_question}</div>
                                                    <div className="text-xs text-gray-500">Questions</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <FaStar className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.marks}</div>
                                                    <div className="text-xs text-gray-500">Marks</div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Card Footer with Buttons */}
                                    <div className="p-6 bg-white relative overflow-hidden">
                                        {buttonConfig.isCompleted ? (
                                            <div className="flex gap-3">
                                                {/* View Results Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.03, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    // onClick={() => nav('/analysis', {
                                                    //     state: {
                                                    //         testId: buttonConfig.test.id,
                                                    //         testInfo: buttonConfig.test,
                                                    //         userData: userInfo,
                                                    //     },
                                                    // })}
                                                    onClick={() => handleViewResult(test)}
                                                    className="relative flex-1 py-4 px-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group overflow-hidden transform hover:scale-105 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                    <motion.span
                                                        className="relative z-10"
                                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <FaTrophy size={16} />
                                                    </motion.span>
                                                    <span className="relative z-10 truncate">View Results</span>
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-current/20 to-current/20"></div>
                                                </motion.button>

                                                {/* Reattempt Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.03, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleReattemptClick(buttonConfig.test)}
                                                    disabled={pageLoading}
                                                    className="relative flex-1 py-4 px-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group overflow-hidden transform hover:scale-105 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                    <motion.span
                                                        className="relative z-10"
                                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <AiOutlineReload size={16} />
                                                    </motion.span>
                                                    <span className="relative z-10 truncate">Reattempt</span>
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-current/20 to-current/20"></div>
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={buttonConfig.onClick}
                                                disabled={buttonConfig.className.includes('cursor-not-allowed')}
                                                className={`relative w-full py-4 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group overflow-hidden transform hover:scale-105 ${buttonConfig.className}`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                <motion.span
                                                    className="relative z-10"
                                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {buttonConfig.icon}
                                                </motion.span>
                                                <span className="relative z-10 truncate">{buttonConfig.text}</span>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-current/20 to-current/20"></div>
                                            </motion.button>
                                        )}
                                        {/* INSERT YOUR RESUME BUTTON HERE */}
                                        {/* {isPaused && !buttonConfig.isCompleted && (
                                            <motion.button
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="mt-2 w-full py-4 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center gap-2"
                                                onClick={() => { setShowModal(true); setResumeData(test); }}
                                            >
                                                <MdPlayArrow size={18} /> Resume Test
                                            </motion.button>
                                        )} */}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                            scale: isHovered ? 1 : 0.8,
                                            y: isHovered ? 0 : 10
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-4 left-4 flex gap-2"
                                    >
                                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                            <FaRegBookmark size={14} className="text-gray-600" />
                                        </div>
                                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                            <FaShareAlt size={14} className="text-gray-600" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {/* Load More Button */}
                {pagination.current_page < pagination.last_page && (
                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => getSigleCategoryData(pagination.current_page + 1)}
                            disabled={pageLoading}
                            className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            {pageLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="relative z-10">Loading More Tests...</span>
                                </>
                            ) : (
                                <>
                                    <MdTrendingUp size={20} className="relative z-10" />
                                    <span className="relative z-10">Load More Tests</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                )}

                {/* Empty State */}
                {testData.length === 0 && !pageLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg mx-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <MdAssignment size={48} className="text-gray-400" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Tests Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any tests matching your search criteria. Try adjusting your search terms.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSearchTerm('');
                                getSigleCategoryData(1);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Search & Reload
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            <ResumeTestModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleResume}
            />

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message={message}
            />

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    setShowConfirm(false);
                    setShowSuccess(true);
                }}
                title="Confirm Deletion"
                message="Do you really want to delete this item?"
            />

            {/* ✅ Reattempt Confirmation Modal */}
            <ConfirmModal
                isOpen={showReattemptConfirm}
                onClose={() => {
                    setShowReattemptConfirm(false);
                    setReattemptTest(null);
                }}
                onConfirm={handleReattemptConfirm}
                title="Reattempt Test"
                message="Are you sure you want to reattempt this test? This will reset your previous attempt and you can start fresh."
            />

            <AlertModal
                isOpen={showAlert}
                onClose={() => {
                    setShowAlert(false);
                    if (message.includes('expired')) {
                        nav('/login');
                    }
                }}
                message={message}
            />
        </div>
    );
};

export default TestPagesPage;
