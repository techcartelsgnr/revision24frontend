import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveTestLoginInfo } from '../../helpers/userStorage';
import AlertModal from '../../components/AlertModal';
import SuccessModal from '../../components/SuccessModal';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil';

const Screen2 = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('');
// console.log('screen 2', state)
    const [showSuccess, setShowSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(state?.userInfo || {});
    const [systemNumber, setSystemNumber] = useState(`R24${state?.userInfo?.mobile?.slice(0, 5)}`);
    const [dob, setDob] = useState('');

    function formatDateToDDMMYYYY(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}${month}${year}`;
    }

    const formattedDOB = formatDateToDDMMYYYY(userInfo?.dob);

    const handleLogin = async (e) => {
        e.preventDefault();
        const enteredDob = dob.trim();

        if (enteredDob === '') {
            setMessage("Please enter your Date of Birth in DDMMYYYY format.");
            // setShowAlert(true);
            showErrorToast("Please enter your Date of Birth in DDMMYYYY format.")
            return;
        }

        if (enteredDob !== formattedDOB) {
            setMessage("Please enter the correct Date of Birth to login.");
            // setShowAlert(true);
            showErrorToast("Please enter the correct Date of Birth to login.")
            return;
        }

        const userData = {
            candidateName: userInfo.name,
            systemNumber,
        };

        await saveTestLoginInfo(userData);
        showSuccessToast("Test Login Success")
        nav('/instructions', {
            state: {
                userData: {
                    candidateName: userInfo?.name,
                    systemNumber,
                },
                testInfo: state?.testInfo,
                testId: state?.testId,
                testDetail: state?.testDetail,
                packageDetail: state?.packageDetail,
                isReattempt: state?.isReattempt || false,
                createNewAttempt: state?.createNewAttempt || false,
                total_marks: state?.total_marks,
                total_questions: state?.total_questions,
            }
        });
        // setShowSuccess(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white px-4 py-6 md:px-8">
            <h1 className="text-base md:text-lg xl:text-xl font-semibold mb-4 text-center">
                {state?.testInfo?.title}
            </h1>

            <div className="w-full text-sm md:text-base bg-blue-400 text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {userInfo?.name || 'N/A'}
            </div>

            <p className="text-sm md:text-lg font-semibold text-center">SYSTEM NO</p>
            <p className="text-3xl md:text-5xl font-bold text-blue-800 mt-2 text-center">{systemNumber}</p>

            <div className="w-full max-w-xl mt-6">
                <p className="text-xs md:text-sm text-red-600 mb-4 font-semibold text-center">
                    Your password is your Date of Birth (e.g. DDMMYYYY. 01062001)
                </p>

                <form
                    onSubmit={handleLogin}
                    className="border border-gray-300 rounded-md shadow"
                >
                    <div className="bg-gray-200 px-4 py-2 border-b border-gray-300 text-sm md:text-base font-semibold text-gray-700">
                        Candidate Login
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                            <label className="w-full md:w-40 text-gray-700 font-medium text-sm md:text-base">
                                System Number
                            </label>
                            <input
                                type="text"
                                value={systemNumber}
                                readOnly
                                className="w-full md:flex-1 border border-gray-400 px-2 py-1 text-sm md:text-base rounded"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                            <label className="w-full md:w-40 text-gray-700 font-medium text-sm md:text-base">
                                Password
                            </label>
                            <input
                                type="text"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="DDMMYYYY"
                                className="w-full md:flex-1 border border-gray-400 px-2 py-1 text-sm md:text-base rounded"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-gray-200 text-gray-800 px-4 py-1 border border-gray-400 hover:bg-gray-300 text-sm md:text-base rounded"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                title="DOB ERROR"
                message={message}
            />

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    nav('/instructions', {
                        state: {
                            userData: {
                                candidateName: userInfo?.name,
                                systemNumber,
                            },
                            testInfo: state?.testInfo,
                            testId: state?.testId,
                            testDetail: state?.testDetail,
                            packageDetail: state,
                            isReattempt: state?.isReattempt || false,
                            createNewAttempt: state?.createNewAttempt || false,
                        }
                    });
                }}
                message={message}
            />
        </div>
    );
};

export default Screen2;
