import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Screen3 = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    // console.log("screen3 state===>", state);

    const subjects = state?.testDetail || [];
    const totalQuestions = subjects.reduce((sum, s) => sum + parseInt(s.no_of_question || 0), 0);
    const totalMarks = subjects.reduce((sum, s) => sum + parseInt(s.marks || 0), 0);
    const negativeMark = subjects[0]?.negative_mark || state?.testInfo?.negative_mark || '0';
    const duration = state?.testInfo?.time || 60;

    return (
        <div className="px-6 py-4">
            <div className='flex justify-between items-center gap-5 my-3'>
                <h1 className="text-xl font-semibold">{state?.testInfo?.title}</h1>
                <div className='flex items-center justify-center gap-3'>
                    <p className="text-2xl font-bold text-blue-800">
                        {state?.userData?.systemNumber || 'R2400000'}
                    </p>
                </div>
            </div>

            <div className="text-sm w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {state?.userData?.candidateName || 'N/A'}
            </div>

            <div className="text-[15px] text-gray-800">
                <h2 className="font-bold mb-3">Instructions, Terms & Conditions</h2>

                <div className="overflow-x-auto my-4">
                    <table className="w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-3 py-2">Section</th>
                                <th className="border border-gray-300 px-3 py-2">Subject</th>
                                <th className="border border-gray-300 px-3 py-2">Number of Questions</th>
                                <th className="border border-gray-300 px-3 py-2">Maximum Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index} className={index % 2 !== 0 ? 'bg-gray-50' : ''}>
                                    <td className="border px-3 py-2">PART-{index + 1}</td>
                                    <td className="border px-3 py-2">{subject.subject_name}</td>
                                    <td className="border px-3 py-2">{subject.no_of_question}</td>
                                    <td className="border px-3 py-2">{subject.marks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ol className="list-decimal pl-5 space-y-4">
                    <li>
                        <p className="font-bold mb-2">Exam Overview / परीक्षा का संक्षिप्त विवरण</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Duration: <span className="font-bold text-blue-700">{duration} minutes</span> / समयावधि: <span className="font-bold text-blue-700">{duration} मिनट</span></li>
                            <li>Total Questions: <span className="font-bold text-blue-700">{totalQuestions}</span> / कुल प्रश्न: <span className="font-bold text-blue-700">{totalQuestions}</span></li>
                            <li>Negative Marking: {negativeMark} marks deducted for each wrong answer. / ऋणात्मक अंकन: प्रत्येक गलत उत्तर पर <span className="font-bold">{negativeMark}</span> अंक काटे जाएंगे।</li>
                            <li>Number of Sections displayed at any time: <span className="font-bold text-blue-700">{subjects.length}</span> / किसी भी समय पर प्रदर्शित अनुभागों की संख्या: <span className="font-bold text-blue-700">{subjects.length}</span></li>
                        </ul>
                    </li>

                    <li>
                        <p className="font-bold mb-2">Timing & Submission / समय और उत्तर जमा करना</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The timer displayed at the top-right corner is controlled by the server. Remaining time will be shown there.<br />ऊपरी दाएँ कोने में दिखाई देने वाला टाइमर सर्वर द्वारा नियंत्रित होता है। शेष समय वहीं प्रदर्शित होगा।</li>
                            <li>Once the time is over, the exam will automatically be submitted. You do not need to submit it manually.<br />समय समाप्त होने पर परीक्षा स्वतः जमा हो जाएगी। मैन्युअल रूप से सबमिट करने की आवश्यकता नहीं है।</li>
                        </ul>
                    </li>

                    <li>
                        <p className="font-bold mb-2">Language / भाषा</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Apart from English, questions and options for all other subjects will be displayed in both English and Hindi languages<br />अंग्रेजी के अलावा, अन्य सभी विषयों के प्रश्न और विकल्प अंग्रेजी और हिंदी दोनों भाषाओं में प्रदर्शित किए जाएंगे</li>
                            <li>If you choose English, questions will still appear only in English.<br />यदि आपने English चुना, तो प्रश्न केवल अंग्रेज़ी में ही दिखाई देंगे।</li>
                            <li>If you choose Hindi, questions will appear in both Hindi and English.<br />यदि आपने Hindi चुना, तो प्रश्न हिंदी और अंग्रेज़ी दोनों में प्रदर्शित होंगे।</li>
                            <li>You can change your language preference during the exam for sections where it is allowed.<br />जहाँ अनुमति हो, वहाँ परीक्षा के दौरान भाषा वरीयता बदली जा सकती है।</li>
                        </ul>
                    </li>

                    <li>
                        <p className="font-bold mb-2">Navigation / नेविगेशन</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All sections remain accessible throughout the exam. You can switch between sections or questions freely.<br />सभी अनुभाग परीक्षा के दौरान खुले रहते हैं। आप किसी भी अनुभाग या प्रश्न पर जा सकते हैं।</li>
                            <li>Use the "Previous" or "Save & Next" buttons to move between questions. Use "Mark for Review" to revisit questions.<br />"Previous" या "Save & Next" का उपयोग करें। किसी प्रश्न को बाद में देखने के लिए "Mark for Review" चुनें।</li>
                            <li>After the last question of a section, clicking "Save & Next" will take you to the next section.<br />अंतिम प्रश्न के बाद "Save & Next" पर क्लिक करने से अगला अनुभाग खुलेगा।</li>
                        </ul>
                    </li>

                    <li>
                        <p className="font-bold mb-2">Answering / उत्तर देना</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Each question contains four options; only one is correct.<br />हर प्रश्न के चार विकल्प होते हैं, केवल एक सही होता है।</li>
                            <li>The answer is saved only when you click "Save & Next".<br />"Save & Next" पर क्लिक करने के बाद ही उत्तर सुरक्षित होता है।</li>
                            <li>To modify a saved answer, revisit the question, make changes, and save it again.<br />उत्तर बदलने के लिए प्रश्न पर जाएँ और पुनः सुरक्षित करें।</li>
                        </ul>
                    </li>

                    <li>
                        <p className="font-bold mb-2">Additional Notes / अतिरिक्त निर्देश</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>The system saves each response automatically and submits it when time ends.<br />प्रत्येक उत्तर स्वतः सहेजा जाता है और समय समाप्त होने पर सबमिट हो जाता है।</li>
                            <li>If you have doubts, you can report the question.<br />यदि कोई संदेह हो तो प्रश्न की रिपोर्ट कर सकते हैं।</li>
                            <li>In case of technical issues, contact support.<br />तकनीकी समस्याओं के लिए सहायता टीम से संपर्क करें।</li>
                        </ul>
                    </li>
                </ol>

                <p className="text-center font-semibold text-green-700 mt-6">Good Luck! / शुभकामनाएँ!</p>
            </div>

            <div className="flex justify-center my-6">
                <button
                    className="bg-blue-700 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-800"
                    onClick={() => nav("/symbols", { state })}
                >
                    Agree
                </button>
            </div>
        </div>
    );
};

export default Screen3;
