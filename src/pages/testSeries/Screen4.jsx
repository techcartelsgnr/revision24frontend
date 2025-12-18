import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Checkbox from '../../components/Checkbox';
import { secureSet } from '../../helpers/storeValues';

const Screen4 = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    // console.log("Screen No. 4 state", state);
    const [isChecked, setIsChecked] = useState(false);
    const [lang, setLang] = useState('Choose a language')
    
    const selectedLang = async (e) => {
        setLang(e.target.value)
        try {
            await secureSet('language', e.target.value)

        } catch (error) {
            console.log("Error in store language", error)
        }

    }

    return (
        <div className="px-4 sm:px-6 md:px-12 py-4 md:py-6">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4'>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {state?.testInfo?.title || 'Test Title'}
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800">
                    {state?.userData?.systemNumber || 'R2400000'}
                </p>
            </div>

            <div className="text-sm sm:text-base w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-semibold rounded">
                Candidate Name : {state?.userData?.candidateName || 'N/A'}
            </div>

            <h2 className="text-base sm:text-lg md:text-xl font-bold text-blue-700 mb-6 leading-snug">
                The different symbols used in the next pages are shown below. Please go through them and understand their meaning before you start the test.
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-400 text-xs sm:text-sm text-left">
                    <thead className="bg-gray-200 text-gray-800">
                        <tr>
                            <th className="border border-gray-400 px-3 sm:px-4 py-2 w-1/4">Symbol</th>
                            <th className="border border-gray-400 px-3 sm:px-4 py-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-3 sm:px-4 py-2">⚪</td>
                            <td className="border px-3 sm:px-4 py-2">Option Not chosen</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2">
                                <div className='w-5 h-5 bg-blue-600 rounded-full'></div>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Option chosen as correct (Clicking again removes the selection).
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-3 sm:px-4 py-2 text-blue-700 font-bold">
                                <div className='w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded-sm'>
                                    12
                                </div>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Question number shown in blue color indicates you have not yet attempted the question.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2 text-green-700 font-bold">
                                <div className='w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded-sm'>
                                    12
                                </div>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Question number shown in green color indicates you have answered the question.
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-3 sm:px-4 py-2 text-red-600 font-bold">
                                <div className='flex flex-col items-center justify-center w-6'>
                                    <div className='w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded-sm'>
                                        <p>14</p>
                                    </div>
                                    <p className="text-xs">▲</p>
                                </div>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                You have not yet answered the question but marked it for review later.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2 text-yellow-600 font-bold">
                                <div className='flex flex-col items-center justify-center w-6'>
                                    <div className='w-6 h-6 bg-yellow-600 text-white flex items-center justify-center rounded-sm'>
                                        <p>15</p>
                                    </div>
                                    <p className="text-xs">▲</p>
                                </div>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                You have answered the question but marked it for review later.
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-3 sm:px-4 py-2">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm">Save & Next</button>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Clicking on this will take you to the next question.
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-3 sm:px-4 py-2">
                                <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm">Mark for Review</button>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Mark the question for review later. If you answer and mark for review, it will still be treated as answered.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2">
                                <button className="bg-gray-300 text-black px-3 sm:px-4 py-1 rounded text-xs sm:text-sm">Clear Options</button>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Clicking on this will take you to the previous question.
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border px-3 sm:px-4 py-2">
                                <button className="bg-gray-300 hover:bg-gray-400 text-black px-3 sm:px-4 py-1 rounded text-xs sm:text-sm">Unmark Review</button>
                            </td>
                            <td className="border px-3 sm:px-4 py-2">
                                Unmark the question that was previously marked for review.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div className='py-3 flex flex-col gap-3'>

                <select onChange={selectedLang} className='border p-1 rounded-md bg-slate-200 border-slate-300 '>
                    <option value="Choose a language">Choose a language</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>

                <Checkbox
                    id="example"
                    // links={[
                    //     {
                    //         link: '/terms-of-service',
                    //         link_name: 'Terms & Conditions'
                    //     },
                    //     {
                    //         link: '/privacy-policy',
                    //         link_name: 'Privacy Policy'
                    //     },

                    // ]}
                    label={`I have carefully read and fully understood all the instructions. I agree to follow them honestly and will not use any unfair means during this examination. I understand that attempting to gain an advantage for myself or others through dishonest practices will result in immediate disqualification.The decision of Revision24.com will be final in these matters and cannot be appealed.`}
                    checked={isChecked}
                    onChange={setIsChecked}
                />
            </div>


            {/* Navigation Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <button
                    onClick={() => nav(-1)}
                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 sm:px-6 py-2 rounded text-sm sm:text-base"
                >
                    &lt;&lt; Back
                </button>
                <button
                    onClick={() => nav('/scc-mock-test', { state })}
                    // onClick={() => alert('hello')}
                    disabled={lang === 'Choose a language' || !isChecked}
                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white disabled:bg-gray-300 font-semibold px-4 sm:px-6 py-2 rounded text-sm sm:text-base"
                >
                    Start Test &gt;&gt;
                </button>
            </div>
        </div>
    );
};

export default Screen4;
