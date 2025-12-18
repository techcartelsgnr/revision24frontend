// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getAllGkSlice } from "../../../redux/HomeSlice";
// import { useNavigate } from "react-router-dom";

// const GkCapage = () => {
//   const dispatch = useDispatch();
//   const [freeQuizData, setFreeQuizData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const nav = useNavigate();
//   const [openPdf, setOpenPdf] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState("");

//   const handleFetchFreeQuiz = async () => {
//     try {
//       setLoading(true);
//       const res = await dispatch(getAllGkSlice()).unwrap();
//       // console.log('res', res.data)
//       setFreeQuizData(res.data.data || []);
//     } catch (error) {
//       console.log("Error fetching topic wise test:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleFetchFreeQuiz();
//   }, []);

//   const openPdfModal = (url) => {
//     setPdfUrl(url);
//     setOpenPdf(true);
//   };

//   const closePdfModal = () => {
//     setPdfUrl("");
//     setOpenPdf(false);
//   };

//   return (
//     // main wrapper: animate-bg class for gradient animation
//     <div className="min-h-screen w-full p-4 animate-bg-gradient">
// <style>{`
//   .animate-bg-gradient {
//     background: linear-gradient(120deg, #f7faf7, #fefefc, #e3f0fd, #fefefc, #f8faf8);
//     background-size: 400% 400%;
//     animation: movebg 20s ease-in-out infinite;
//   }
//   @keyframes movebg {
//     0% {background-position: 0% 50%;}
//     50% {background-position: 100% 50%;}
//     100% {background-position: 0% 50%;}
//   }
//   .card-glow-overlay {
//     position: absolute;
//     inset: 0;
//     border-radius: 0.75rem;
//     pointer-events: none;
//     background: linear-gradient(115deg, #eef7ed 0%, #fffdf9 40%, #d7e5fc 80%, #fefefc 100%);
//     opacity: 0.2;
//     animation: cardGlow 15s linear infinite;
//   }
//   @keyframes cardGlow {
//     0% { opacity: 0.12; }
//     50% { opacity: 0.25; }
//     100% { opacity: 0.12; }
//   }
// `}</style>




//       <div className="flex center justify-center">
//         <h2 className="text-2xl font-bold mb-4">
//           GK & Current Affairs Practice Test
//         </h2>
//       </div>

//       {loading && (
//         <p className="text-center text-lg">Loading...</p>
//       )}

//       {!loading && freeQuizData.length === 0 && (
//         <p className="text-center text-gray-500">No GK tests found.</p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {freeQuizData.map((test) => (
//           <div
//             key={test.test_id}
//             className="relative shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all h-40 flex flex-col border border-black/30"
//             style={{
//               backgroundImage: `url('/bg.webp')`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           >
//             {/* Gradient Animate Overlay on Card */}
//             <div className="card-glow-overlay"></div>
//             {/* Card content */}
//             <div className="relative p-4 flex flex-col flex-grow bg-white/70 backdrop-blur-sm h-full">
//               <h3 className="text-sm font-semibold mb-2 line-clamp-2">
//                 {test.title}
//               </h3>
//               <p className="text-gray-700 text-sm">
//                 Questions: {test.no_of_question} | Marks: {test.marks} | Time: {test.time} mins
//               </p>
//               <div className="mt-auto">
//                 {!test.attend ? (
//                   <button
//                     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
//                     onClick={() =>
//                       nav("/gk-ca-test-instruction", { state: { testInfo: test } })
//                     }
//                   >
//                     Start Test
//                   </button>
//                 ) : (
//                   <span className="inline-block text-green-600 font-semibold">
//                     Already Attended
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PDF Modal */}
//       {openPdf && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-4/5 rounded-lg relative">
//             <button
//               onClick={closePdfModal}
//               className="absolute top-3 right-3 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
//             >
//               Close
//             </button>
//             <iframe
//               src={pdfUrl}
//               className="w-full h-full rounded-lg"
//               title="PDF Viewer"
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GkCapage;

// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { getAllGkSlice } from "../../../redux/HomeSlice";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaBookOpen,
//   FaClock,
//   FaStar,
//   FaCheckCircle,
//   FaChevronLeft,
//   FaChevronRight,
//   FaQuestionCircle,
//   FaTrophy,
//   FaCalendarAlt
// } from "react-icons/fa";
// import { HiSparkles, HiLightningBolt } from "react-icons/hi";

// const GkCapage = () => {
//   const dispatch = useDispatch();
//   const [freeQuizData, setFreeQuizData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     last_page: 1,
//     total: 0,
//     per_page: 12,
//     from: 0,
//     to: 0
//   });
//   const nav = useNavigate();
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const testSectionRef = useRef(null);

//   const handleFetchFreeQuiz = async (page = 1) => {
//     try {
//       setLoading(true);

//       const res = await dispatch(getAllGkSlice({ page })).unwrap();

//       console.log('API Response for page', page, ':', res);

//       setFreeQuizData(res.data.data || []);

//       setPagination({
//         current_page: res.data.current_page,
//         last_page: res.data.last_page,
//         total: res.data.total,
//         per_page: res.data.per_page,
//         from: res.data.from,
//         to: res.data.to
//       });

//       setCurrentPage(res.data.current_page);
//     } catch (error) {
//       console.log("Error fetching GK tests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleFetchFreeQuiz(1);
//   }, []);

//   // ✅ FIXED: Removed typo 'n' from line 51
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= pagination.last_page && page !== currentPage) {
//       handleFetchFreeQuiz(page);

//       if (testSectionRef.current) {
//         testSectionRef.current.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start'
//         });
//       }
//     }
//   };

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
//     const totalPages = pagination.last_page;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//       let end = Math.min(totalPages, start + maxVisible - 1);

//       if (end - start < maxVisible - 1) {
//         start = Math.max(1, end - maxVisible + 1);
//       }

//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8 sm:mb-12"
//         >
//           <motion.div
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4 shadow-2xl"
//           >
//             <HiSparkles className="text-2xl animate-pulse" />
//             <span className="text-sm font-bold">FREE PRACTICE TESTS</span>
//             <HiSparkles className="text-2xl animate-pulse" />
//           </motion.div>

//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
//             GK & Current Affairs
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
//               Practice Tests
//             </span>
//           </h1>

//           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//             Master your knowledge with our comprehensive test series
//           </p>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-8"
//           >
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
//               <FaBookOpen className="text-blue-600" />
//               <span className="text-sm font-semibold text-gray-700">
//                 {pagination.total} Tests
//               </span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
//               <FaTrophy className="text-yellow-500" />
//               <span className="text-sm font-semibold text-gray-700">
//                 Free Access
//               </span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
//               <HiLightningBolt className="text-orange-500" />
//               <span className="text-sm font-semibold text-gray-700">
//                 Instant Results
//               </span>
//             </div>
//           </motion.div>
//         </motion.div>

//         <div ref={testSectionRef}>
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="relative">
//                 <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//                 <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
//               </div>
//               <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">Loading amazing tests...</p>
//             </div>
//           )}

//           {!loading && freeQuizData.length === 0 && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center py-20 bg-white rounded-2xl shadow-xl"
//             >
//               <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <FaBookOpen className="text-4xl text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tests Available</h3>
//               <p className="text-gray-500 text-lg">Check back soon for new practice tests!</p>
//             </motion.div>
//           )}

//           {!loading && freeQuizData.length > 0 && (
//             <>
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentPage}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
//                 >
//                   {freeQuizData.map((test, index) => {
//                     const isCompleted = test.attend && test.attend_status === 'done';
//                     const isHovered = hoveredCard === test.test_id;

//                     return (
//                       <motion.div
//                         key={test.test_id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         onMouseEnter={() => setHoveredCard(test.test_id)}
//                         onMouseLeave={() => setHoveredCard(null)}
//                         className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
//                       >
//                         <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

//                         <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${isHovered ? 'scale-100 rotate-12' : 'scale-0 rotate-0'}`}>
//                           <HiSparkles className="text-white text-sm" />
//                         </div>

//                         <div className="relative p-5">
//                           <div className="flex items-center justify-between mb-3">
//                             <div className="flex flex-wrap gap-2">
//                               <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
//                                 FREE
//                               </span>
//                               {isCompleted && (
//                                 <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
//                                   <FaCheckCircle size={10} />
//                                   COMPLETED
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
//                             {test.title}
//                           </h3>

//                           <div className="space-y-2 mb-4">
//                             <div className="flex items-center justify-between text-xs text-gray-600">
//                               <div className="flex items-center gap-1.5">
//                                 <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
//                                   <FaQuestionCircle className="text-white" size={12} />
//                                 </div>
//                                 <span className="font-semibold">{test.no_of_question} Qs</span>
//                               </div>
//                               <div className="flex items-center gap-1.5">
//                                 <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
//                                   <FaStar className="text-white" size={12} />
//                                 </div>
//                                 <span className="font-semibold">{test.marks} Marks</span>
//                               </div>
//                               <div className="flex items-center gap-1.5">
//                                 <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
//                                   <FaClock className="text-white" size={12} />
//                                 </div>
//                                 <span className="font-semibold">{test.time || 5}m</span>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5">
//                               <FaCalendarAlt className="text-gray-400" size={10} />
//                               <span>{test.start_date_time}</span>
//                             </div>
//                           </div>

//                           {!test.attend ? (
//                             <motion.button
//                               whileHover={{ scale: 1.03, y: -2 }}
//                               whileTap={{ scale: 0.97 }}
//                               onClick={() => nav("/gk-ca-test-instruction", { state: { testInfo: test } })}
//                               className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
//                             >
//                               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
//                               <HiLightningBolt className="text-lg relative z-10" />
//                               <span className="relative z-10">Start Test</span>
//                             </motion.button>
//                           ) : (
//                             <motion.button
//                               whileHover={{ scale: 1.03, y: -2 }}
//                               whileTap={{ scale: 0.97 }}
//                               onClick={() => nav("/gk-ca-test-instruction", { state: { testInfo: test } })}
//                               className="w-full py-3 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                             >
//                               <FaTrophy className="text-lg" />
//                               <span>View Results</span>
//                             </motion.button>
//                           )}
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </motion.div>
//               </AnimatePresence>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="mt-8 mb-4"
//               >
//                 <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6">
//                   <div className="text-center mb-4">
//                     <p className="text-sm sm:text-base text-gray-700 font-medium">
//                       Showing <span className="font-bold text-gray-900">{pagination.from}</span> to{' '}
//                       <span className="font-bold text-gray-900">{pagination.to}</span> of{' '}
//                       <span className="font-bold text-gray-900">{pagination.total}</span> tests
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap items-center justify-center gap-2">
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${currentPage === 1
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
//                         }`}
//                     >
//                       <FaChevronLeft size={14} />
//                       <span className="hidden sm:inline">Previous</span>
//                       <span className="sm:hidden">Prev</span>
//                     </button>

//                     <div className="flex flex-wrap items-center justify-center gap-2">
//                       {getPageNumbers().map((page) => (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold transition-all duration-300 ${page === currentPage
//                             ? 'bg-blue-600 text-white shadow-lg scale-110'
//                             : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
//                             }`}
//                         >
//                           {page}
//                         </button>
//                       ))}
//                     </div>

//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === pagination.last_page}
//                       className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${currentPage === pagination.last_page
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
//                         }`}
//                     >
//                       <span className="hidden sm:inline">Next</span>
//                       <FaChevronRight size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -50px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(50px, 50px) scale(1.05); }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }

//         .animation-delay-150 {
//           animation-delay: 0.15s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GkCapage;



import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { getAllGkSlice } from "../../../redux/HomeSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaQuestionCircle,
  FaTrophy,
  FaCalendarAlt
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

const GkCapage = () => {
  const dispatch = useDispatch();
  const [freeQuizData, setFreeQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12,
    from: 0,
    to: 0
  });
  const nav = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const testSectionRef = useRef(null);

  // ✅ Format date nicely
  const formatTestDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      if (isToday) return "Today";
      if (isTomorrow) return "Tomorrow";

      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // ✅ Check if test is available
  const isTestAvailable = (startDateTime) => {
    if (!startDateTime) return true;

    try {
      const testStartTime = new Date(startDateTime);
      const currentTime = new Date();

      return currentTime >= testStartTime;
    } catch (error) {
      console.error("Date comparison error:", error);
      return true;
    }
  };

  // ✅ Get time until available
  const getTimeUntilAvailable = (startDateTime) => {
    if (!startDateTime) return null;

    try {
      const testStartTime = new Date(startDateTime);
      const currentTime = new Date();

      if (currentTime >= testStartTime) return null;

      const diffMs = testStartTime - currentTime;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays}d`;
      if (diffHours > 0) return `${diffHours}h`;
      if (diffMinutes > 0) return `${diffMinutes}m`;
      return "Soon";
    } catch (error) {
      console.error("Time calculation error:", error);
      return null;
    }
  };

  const handleFetchFreeQuiz = async (page = 1) => {
    try {
      setLoading(true);

      const res = await dispatch(getAllGkSlice({ page })).unwrap();

      console.log('API Response for page', page, ':', res);

      setFreeQuizData(res.data.data || []);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
        per_page: res.data.per_page,
        from: res.data.from,
        to: res.data.to
      });

      setCurrentPage(res.data.current_page);
    } catch (error) {
      console.log("Error fetching GK tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchFreeQuiz(1);
  }, []);

  // ✅ Real-time countdown update (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page && page !== currentPage) {
      handleFetchFreeQuiz(page);

      if (testSectionRef.current) {
        testSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const totalPages = pagination.last_page;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const extractDateOnly = (dateTimeString) => {
    if (!dateTimeString) return "N/A";

    // Format: "00:00 am, 02 Sep 2025" → "02 Sep 2025"
    const datePart = dateTimeString.split(',')[1]?.trim();
    return datePart || dateTimeString;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4 shadow-2xl"
          >
            <HiSparkles className="text-2xl animate-pulse" />
            <span className="text-sm font-bold">FREE PRACTICE TESTS</span>
            <HiSparkles className="text-2xl animate-pulse" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            GK & Current Affairs
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              Practice Tests
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Master your knowledge with our comprehensive test series
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <FaBookOpen className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                {pagination.total} Tests
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <FaTrophy className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                Free Access
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <HiLightningBolt className="text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">
                Instant Results
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Tests Section */}
        <div ref={testSectionRef}>
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">Loading amazing tests...</p>
            </div>
          )}

          {!loading && freeQuizData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-xl"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBookOpen className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tests Available</h3>
              <p className="text-gray-500 text-lg">Check back soon for new practice tests!</p>
            </motion.div>
          )}

          {!loading && freeQuizData.length > 0 && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
                >
                  {freeQuizData.map((test, index) => {
                    const isCompleted = test.attend && test.attend_status === 'done';
                    const isHovered = hoveredCard === test.test_id;
                    const available = isTestAvailable(test.start_date_time);
                    const timeUntilAvailable = getTimeUntilAvailable(test.start_date_time);

                    return (
                      <motion.div
                        key={test.test_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHoveredCard(test.test_id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${isHovered ? 'scale-100 rotate-12' : 'scale-0 rotate-0'}`}>
                          <HiSparkles className="text-white text-sm" />
                        </div>

                        <div className="relative p-5">
                          {/* Badges */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                                FREE
                              </span>
                              {isCompleted && (
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                                  <FaCheckCircle size={10} />
                                  COMPLETED
                                </span>
                              )}
                              {!available && (
                                <span className="px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold rounded-full shadow-md">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
                            {test.title}
                          </h3>

                          {/* Test Info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <FaQuestionCircle className="text-white" size={12} />
                                </div>
                                <span className="font-semibold">{test.no_of_question} Qs</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <FaStar className="text-white" size={12} />
                                </div>
                                <span className="font-semibold">{test.marks} Marks</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <FaClock className="text-white" size={12} />
                                </div>
                                <span className="font-semibold">{test.time || 5}m</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5">
                              <FaCalendarAlt className="text-gray-400" size={10} />
                              <span>{extractDateOnly(test.start_date_time)}</span>
                            </div>
                          </div>

                          {/* Button - Three States */}
                          {!available ? (
                            // State 1: Test Not Yet Available
                            <motion.button
                              disabled
                              className="w-full py-3 px-4 bg-gray-300 text-gray-500 font-bold text-sm rounded-xl shadow-md cursor-not-allowed flex flex-col items-center justify-center gap-1 transition-all duration-300"
                            >
                              <FaCalendarAlt className="text-lg" />
                              <span className="text-xs">Available on {formatTestDate(test.start_date_time)}</span>
                              {timeUntilAvailable && (
                                <span className="text-xs font-normal opacity-70">in {timeUntilAvailable}</span>
                              )}
                            </motion.button>
                          ) : !test.attend ? (
                            // State 2: Test Available & Not Yet Attempted
                            <motion.button
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => nav("/gk-ca-test-instruction", { state: { testInfo: test } })}
                              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              <HiLightningBolt className="text-lg relative z-10" />
                              <span className="relative z-10">Start Test</span>
                            </motion.button>
                          ) : (
                            // State 3: Test Already Attempted
                            <motion.button
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => nav("/gk-ca-test-instruction", { state: { testInfo: test } })}
                              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <FaTrophy className="text-lg" />
                              <span>View Results</span>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 mb-4"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      Showing <span className="font-bold text-gray-900">{pagination.from}</span> to{' '}
                      <span className="font-bold text-gray-900">{pagination.to}</span> of{' '}
                      <span className="font-bold text-gray-900">{pagination.total}</span> tests
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${currentPage === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                      <FaChevronLeft size={14} />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold transition-all duration-300 ${page === currentPage
                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${currentPage === pagination.last_page
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
};

export default GkCapage;
