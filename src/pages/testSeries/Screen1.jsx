import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserDataDecrypted } from '../../helpers/userStorage';

const Screen1 = () => {
  const { state } = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const nav = useNavigate();
  // console.log('Screen 1 state all data Response', state)
  const getUserInfo = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const systemNumber = `R24${userInfo?.mobile?.slice(0, 5) || '00000'}`;
  const examName = state?.testInfo?.title || 'Mock Test';

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 py-6 md:py-8 text-center">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">{examName}</h1>

      <div className="text-sm md:text-base bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
        Candidate Name: {userInfo?.name || 'N/A'}
      </div>

      <div className="mt-6 md:mt-8">
        <p className="text-base sm:text-lg md:text-xl font-semibold">SYSTEM NO</p>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mt-2">{systemNumber}</p>

        <div className="mt-6 py-6 rounded bg-gray-50 shadow-md px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 mb-6">

            {/* Left Info Table */}
            <div className="w-full lg:w-1/2">
              <table className="w-full text-left text-gray-700 text-sm sm:text-base">
                <tbody>
                  <tr>
                    <td className="p-2 sm:p-3 font-semibold">System Number</td>
                    <td className="p-2 sm:p-3 text-blue-800 font-bold">{systemNumber}</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-3 font-semibold">Candidate Name</td>
                    <td className="p-2 sm:p-3 text-blue-800 font-bold">{userInfo?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-3 font-semibold">Exam</td>
                    <td className="p-2 sm:p-3 text-blue-800 font-bold">{examName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Photo Boxes */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center border rounded shadow p-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <div className="w-full sm:w-52 h-40 sm:h-44 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xs sm:text-sm text-center">
                  Registration Photo
                </div>
                <div className="w-full sm:w-52 h-40 sm:h-44 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xs sm:text-sm text-center">
                  Captured Photo
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 text-sm sm:text-base"
              onClick={() =>
                nav("/test-login", {
                  state: {
                    userInfo,
                    testInfo: state?.testInfo,
                    testId: state?.testId,
                    testDetail: state?.testDetail,
                    packageDetail: state?.packageDetail,
                    isReattempt: state?.isReattempt || false,
                    createNewAttempt: state?.createNewAttempt || false,
                    total_marks: state?.total_marks,
                    total_questions: state?.total_questions,
                  },
                })
              }
            >
              Click Here to Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen1;
