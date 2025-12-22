
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getattemptedData } from '../../redux/attemptedDataSlice';
import { fetchUserTestSeriesRankSlice, getSingleCategoryPackageTestseriesDetailSlice, getSingleCategoryPackageTestseriesSlice } from '../../redux/HomeSlice';
import { clearAllEncryptedTestData } from '../../helpers/testStorage';
import { getUserDataDecrypted } from '../../helpers/userStorage';

const AttemptedTestPage = () => {
  const [activeTab, setActiveTab] = useState('Test');
  const [test, setTest] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  const fetchAttemptedData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getattemptedData()).unwrap();
      console.log('✅ Attempted Data:', res);

      if (res.length >= 2) {
        console.log('🔍 First Test:', { id: res[0].id, test_id: res[0].test_id, title: res[0].test_title });
        console.log('🔍 Second Test:', { id: res[1].id, test_id: res[1].test_id, title: res[1].test_title });
      }

      setTest(res);
    } catch (error) {
      console.error('❌ Error fetching attempted data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttemptedData();
  }, []);

  const parseDate = (dateString) => {
    if (!dateString) return null;

    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      const isoString = `${year}-${month}-${day}T${timePart}:00`;
      return new Date(isoString);
    } catch (error) {
      console.error('Date parsing error:', error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAttemptedDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Attempted on Invalid Date';

    return `Attempted on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`;
  };

  const calculateTotalQuestions = (testData) => {
    return (testData.total_attend_question || 0) + (testData.total_not_answer_question || 0);
  };

  const getRank = (testData) => {
    return `${testData.my_rank}/${testData.total_users} Rank`;
  };

  const fetchAnalysisData = async (testId, attendId) => {
    try {
      console.log('📊 Fetching Analysis Data:', {
        test_id: testId,
        attend_id: attendId
      });

      const res = await dispatch(fetchUserTestSeriesRankSlice({
        test_id: testId,
        attend_id: attendId
      })).unwrap();

      console.log('📊 Analysis Response:', res);

      if (res.status_code === 200) {
        return res.data;
      } else {
        throw new Error('Failed to fetch analysis data');
      }
    } catch (error) {
      console.error('❌ Error fetching analysis data:', error);
      throw error;
    }
  };

  const handleAnalysisClick = async (testData) => {
    console.log('🎯 Analysis Click:', {
      test_id: testData.test_id,
      attend_id: testData.id,
      test_title: testData.test_title
    });

    if (!testData.test_id || !testData.id) {
      console.error('❌ Missing IDs:', testData);
      alert('Error: Test ID or Attend ID is missing');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [`analysis-${testData.id}`]: true }));

    try {
      const analysisData = await fetchAnalysisData(testData.test_id, testData.id);

      console.log('✅ Navigating to analysis with:', {
        attend_id: testData.id,
        test_id: testData.test_id
      });

      navigate('/analysis', {
        state: {
          attend_id: testData.id,
          testInfo: {
            test_id: testData.test_id,
            id: testData.id,
            attend_id: testData.id
          },
          preloadedData: analysisData,
          isDataPreloaded: true
        }
      });
    } catch (error) {
      console.error('❌ Failed to load analysis data:', error);
      alert('Failed to load analysis data. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`analysis-${testData.id}`]: false }));
    }
  };

  const handleSolutionClick = (testData) => {
    if (!testData.test_id || !testData.id) {
      alert('Error: Test ID or Attend ID is missing');
      return;
    }

    console.log('🔍 Solution Click:', {
      test_id: testData.test_id,
      attend_id: testData.id
    });

    navigate('/test-solutions', {
      state: {
        attend_id: testData.id,
        testData: {
          my_detail: {
            test_id: testData.test_id,
            attend_id: testData.id
          },
          test_detail: {
            title: testData.test_title || 'Untitled Test'
          }
        }
      }
    });
  };


  const handleReattemptClick = async (testData) => {
    const packageId = testData.package_id || testData.package?.id;

    if (!testData.test_id || !packageId) {
      console.error('❌ Missing data:', {
        test_id: testData.test_id,
        package_id: packageId,
        full_data: testData
      });
      alert('Error: Test ID or Package ID is missing');
      return;
    }

    console.log('🔄 Reattempt Click:', {
      test_id: testData.test_id,
      package_id: packageId,
      previous_attend_id: testData.id  // Just for logging
    });

    setLoadingStates(prev => ({ ...prev, [`reattempt-${testData.id}`]: true }));

    try {
      const testDetailsRes = await dispatch(
        getSingleCategoryPackageTestseriesDetailSlice(testData.test_id)
      ).unwrap();

      const PackageDataRes = await dispatch(
        getSingleCategoryPackageTestseriesSlice({
          testId: packageId,
        })
      ).unwrap();

      const userData = await getUserDataDecrypted("user");

      console.log('✅ Test Details:', testDetailsRes);
      console.log('✅ Package Data:', PackageDataRes);

      // const examCategory = testDetailsRes.data?.test_series_info?.category_name ||
      //   testData.category_name ||
      //   'General';

      const examCategory = await dispatch(getSingleCategoryPackageTestseriesSlice({ testId: packageId })).unwrap();
      const examCategoryTitle = examCategory?.data?.package_detail?.category_name;
      console.log('examCategory', examCategory)
      // ✅ FIXED: DON'T pass attend_id for reattempts
      const navigationState = {
        testInfo: testDetailsRes.data.test_series_info,
        testId: packageId,
        testDetail: testDetailsRes.data.details,
        userInfo: userData,
        isReattempt: true,
        createNewAttempt: true,
        packageDetail: PackageDataRes,
        actualTestId: testData.test_id,
        previousAttemptId: testData.id, // ✅ Keep this for reference only
        attend_id: testData.id + 1
      };

      if (examCategoryTitle === 'SSC') {
        navigate('/system-info', { state: navigationState });
      } else {
        navigate('/online-exam-general-instruction', {
          state: {
            ...navigationState,
            packageDetail: PackageDataRes?.data,
          }
        });
      }
    } catch (error) {
      console.error('❌ Reattempt Error:', error);
      alert('Failed to start reattempt. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`reattempt-${testData.id}`]: false }));
    }
  };




  const groupTestsByDate = (tests) => {
    const sortedTests = [...tests].sort((a, b) => {
      const dateA = parseDate(a.attended_at);
      const dateB = parseDate(b.attended_at);
      return dateB - dateA;
    });

    const grouped = {};
    const dateOrder = [];

    sortedTests.forEach(testData => {
      const dateKey = formatDate(testData.attended_at);

      if (dateKey === 'Invalid Date') {
        console.warn('⚠️ Skipping test with invalid date:', testData);
        return;
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
        dateOrder.push(dateKey);
      }
      grouped[dateKey].push(testData);
    });

    return { grouped, dateOrder };
  };

  const { grouped: groupedTests, dateOrder } = test.length > 0 ? groupTestsByDate(test) : { grouped: {}, dateOrder: [] };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Your Attempted Tests & Quizzes
          </h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('Test')}
              className={`px-3 sm:px-4 py-2 font-medium text-sm ${activeTab === 'Test'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Test
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Focus+ Banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-white relative overflow-hidden">
              <div className="absolute top-1 left-2 sm:left-4">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-medium">
                  NEW
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2 flex-wrap gap-2">
                    <span className="text-lg sm:text-xl font-bold">Revision24</span>
                    <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-medium">
                      Focus+
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    All-in-One Pass for All Your Tests
                  </h2>

                  <div className="text-xs sm:text-sm">
                    <p className="mb-2 font-medium">Which Includes</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                        All Test Series
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                        Prev. Year Papers
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                        Practice
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                        Pro Live Tests
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 sm:mr-2"></span>
                        Unlimited Reattempts
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base">
                  Get Focus+
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading tests...</span>
              </div>
            )}

            {/* Test Cards */}
            {!loading && (
              <div className="space-y-4 sm:space-y-6">
                {dateOrder.map((date) => (
                  <div key={date}>
                    {date !== 'Invalid Date' && (
                      <>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          {date}
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          {groupedTests[date]
                            .sort((a, b) => {
                              const dateA = parseDate(a.attended_at);
                              const dateB = parseDate(b.attended_at);
                              return dateB - dateA;
                            })
                            .map((testData) => (
                              <div key={`${testData.id}-${testData.attended_at}`} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                                <div className="flex flex-col gap-4">
                                  <div className="flex-1">
                                    {testData.test_title.includes('Full Test') && (
                                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mb-2 sm:mb-3">
                                        PRO
                                      </span>
                                    )}

                                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3 break-words">
                                      {testData.test_title}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-2">
                                      <span className="flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        {getRank(testData)}
                                      </span>
                                      <span className="flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {testData.marks}/{calculateTotalQuestions(testData)} Marks
                                      </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                      {formatAttemptedDate(testData.attended_at)}
                                    </p>

                                    <div className="text-xs text-gray-500 space-y-1">
                                      <div className="flex flex-wrap gap-x-2">
                                        <span>Correct: {testData.correct}</span>
                                        <span>|</span>
                                        <span>Incorrect: {testData.in_correct}</span>
                                        <span>|</span>
                                        <span>Unattempted: {testData.total_not_answer_question}</span>
                                      </div>
                                      {/* <div>Status: {testData.status}</div> */}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                      className="px-3 sm:px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
                                      onClick={() => handleSolutionClick(testData)}
                                    >
                                      Solution
                                    </button>
                                    <button
                                      className="px-3 sm:px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => handleAnalysisClick(testData)}
                                      disabled={loadingStates[`analysis-${testData.id}`]}
                                    >
                                      {loadingStates[`analysis-${testData.id}`] ? (
                                        <span className="flex items-center justify-center">
                                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                          Loading...
                                        </span>
                                      ) : (
                                        'Analysis'
                                      )}
                                    </button>
                                    <button
                                      className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => handleReattemptClick(testData)}
                                      disabled={loadingStates[`reattempt-${testData.id}`]}
                                    >
                                      {loadingStates[`reattempt-${testData.id}`] ? (
                                        <>
                                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                          Starting...
                                        </>
                                      ) : (
                                        <>
                                          Reattempt
                                          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* No tests message */}
                {!loading && test.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No attempted tests found</h3>
                    <p className="text-sm sm:text-base text-gray-500">Start taking tests to see your progress here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            {/* Live Indicators */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              {/* <div className="flex items-center text-red-500 mb-3">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-medium">
                  <Link to="/live-quiz-test">LIVE</Link>
                </span>
              </div> */}

              <div className="text-xs space-y-2">


                <div className="flex items-center text-red-500">
                   <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span>
                    <Link to="/live-quiz-test" >LIVE</Link></span>
                </div>
                <div className="flex items-center text-blue-500">
                  <span className="mr-2">📊</span>
                  <span>
                    <Link to="/free-quizes" >QUIZZES</Link></span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="mr-2">📝</span>
                  <span>
                    <Link to="/gk&ca-page"> GK & CURRENT AFFAIRS</Link></span>
                </div>
                <div className="flex items-center text-blue-400">
                  <span className="mr-2">📚</span>
                  <span>
                    <Link to="/live-classes">CLASSES</Link></span>
                </div>
              </div>
            </div>

            {/* Test Statistics Summary */}
            {!loading && test.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Stats</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tests:</span>
                    <span className="font-medium">{test.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Tests:</span>
                    <span className="font-medium">{test.filter(t => t.test_title.includes('Full Test')).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chapter Tests:</span>
                    <span className="font-medium">{test.filter(t => t.test_title.includes('Chapter Test')).length}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="font-medium">
                      {test.length > 0 ? Math.round(test.reduce((acc, t) => acc + t.marks, 0) / test.length) : 0}
                    </span>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptedTestPage;
