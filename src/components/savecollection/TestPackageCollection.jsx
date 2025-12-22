// import React, { useEffect, useState } from 'react'
// import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../../redux/HomeSlice';
// import { useDispatch } from 'react-redux';
// import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil';
// import { MdOutlineGTranslate } from 'react-icons/md';
// import { toggleBookmark } from '../../helpers/Add_RemoveBookmark';
// import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Loading from '../globle/Loading';
// import GlobleAlert from '../globle/GlobleAlert';
// import NotFoundData from '../globle/NotFoundData';

// const TestPackageCollection = () => {
//     const dispatch = useDispatch()
//     const nav = useNavigate()
//     const [packageData, setPackageData] = useState([])
//     const [bookmarkedIds, setBookmarkedIds] = useState([]);
//     const [loading, setLoading] = useState(false)
//     const [btnLoadingId, setBtnLoadingId] = useState(null); // ✅ Track button loading for each card
//     const [showDeleteAlert, setShowDeleteAlert] = useState(false)
//     const [markedData, setMarkedData] = useState(null)

//     const fetchBookMarkTestSeries = async () => {
//         try {
//             setLoading(true)
//             const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
//             // console.log("res",res)
//             if (res.status_code == 200) {
//                 console.log('res.data.', res)
//                 setPackageData(res.data.package_id.data || []);
//                 const ids = (res.data.package_id?.data || []).map(item => item.id);
//                 setBookmarkedIds(ids);
//             } else {
//                 // showErrorToast(res.message)
//             }
//         } catch (error) {
//             // console.error("Bookmark fetch error", error);
//         } finally {
//             setLoading(false)
//             setShowDeleteAlert(false)
//         }
//     };

//     useEffect(() => {
//         fetchBookMarkTestSeries();
//     }, []);

//     const handleToggleBookmark = async (item) => {
//         setBtnLoadingId(markedData.id); // ✅ show spinner for that card
//         try {
//             await toggleBookmark({
//                 type: "package_id",
//                 id: markedData.id,
//                 bookmarkedIds,
//                 setBookmarkedIds,
//                 dispatch,
//                 saveCollectionSlice,
//                 removeUserCollectionSlice,
//                 cb: fetchBookMarkTestSeries
//             });

//             // ✅ Optimistic removal from UI
//             if (bookmarkedIds.includes(markedData.id)) {
//                 setPackageData(prev => prev.filter(pkg => pkg.id !== markedData.id));
//             }

//         } catch (error) {
//             showErrorToast("Something went wrong!");
//         } finally {
//             setBtnLoadingId(null);
//         }
//     };

//     if (loading) return <Loading />;

//     // Group packageData by category_id
//     const groupedData = packageData.reduce((acc, item) => {
//         const key = item.test_category_title
//         if (!acc[key]) {
//             acc[key] = []
//         }
//         acc[key].push(item)
//         return acc
//     }, {})
//     // console.log('first', first)

//     return (
//         <>
//             {Object.keys(groupedData).length > 0 ? (
//                 Object.entries(groupedData)
//                     .sort(([a], [b]) => a - b) // Sort groups by category_id ascending
//                     .map(([categoryId, items]) => (
//                         <div key={categoryId} className="mb-8">
//                             <h2 className="text-lg font-bold mb-4 px-4">{categoryId}</h2>
//                             <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                                 {items
//                                     .sort((a, b) => a.sequence - b.sequence) // Sort items within group by sequence
//                                     .map((item) => (
//                                         <div
//                                             key={item.id}
//                                             className="bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer flex flex-col overflow-hidden"
//                                         >
//                                             {/* Header */}
//                                             <div className="bg-gradient-to-r from-white to-blue-100 px-4 py-3 relative flex justify-center">
//                                                 <img
//                                                     src={item.logo || "/logo.jpeg"}
//                                                     alt="Logo"
//                                                     className="w-16 h-16 object-contain"
//                                                 />
//                                                 <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
//                                                     ⚡
//                                                 </span>
//                                             </div>

//                                             {/* Body */}
//                                             <div className="p-4 flex flex-col flex-grow">
//                                                 <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
//                                                     {item.title || "Mock Test Series"}
//                                                 </h3>

//                                                 <p className="text-sm text-gray-600 mb-1">
//                                                     {item.total_tests || 0} Total Tests
//                                                 </p>

//                                                 <p className="text-xs text-blue-600 flex items-center gap-2">
//                                                     <MdOutlineGTranslate className="text-xl" />
//                                                     {item.language || "English, Hindi"}
//                                                 </p>

//                                                 <ul className="text-sm text-gray-700 space-y-1 mb-4 mt-2">
//                                                     {item.live_tests && <li>• {item.live_tests} 🔴 AI-Generated Live Tests</li>}
//                                                     {item.ai_tests && <li>• {item.ai_tests} AI Tests</li>}
//                                                     {item.previous_papers && <li>• {item.previous_papers} SSC PYQs</li>}
//                                                     {item.more_tests && (
//                                                         <li className="text-green-600 font-medium">
//                                                             +{item.more_tests} more tests
//                                                         </li>
//                                                     )}
//                                                 </ul>

//                                                 {/* Buttons */}
//                                                 <div className="flex gap-2 items-center justify-center mt-auto">
//                                                     <button
//                                                         onClick={() => nav("/testpakages", { state: { item, testId: item.id } })}
//                                                         className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 text-sm rounded-md font-semibold"
//                                                     >
//                                                         View Test Series
//                                                     </button>

//                                                     <button
//                                                         onClick={() => {
//                                                             setMarkedData(item)
//                                                             setShowDeleteAlert(true)
//                                                         }}
//                                                         className="w-10 h-10 border bg-cyan-500 border-white text-white rounded-md flex items-center justify-center"
//                                                     >
//                                                         {btnLoadingId === item.id ? (
//                                                             <Loader2 className="animate-spin" />
//                                                         ) : bookmarkedIds.includes(item.id) ? (
//                                                             <BookmarkCheck />
//                                                         ) : (
//                                                             <Bookmark className="text-xs" />
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             {showDeleteAlert && markedData?.id === item.id && (
//                                                 <GlobleAlert
//                                                     type="confirm"
//                                                     message="Are you sure you want to remove this?"
//                                                     onConfirm={handleToggleBookmark}
//                                                     onCancel={() => setShowDeleteAlert(false)}
//                                                 />
//                                             )}
//                                         </div>
//                                     ))}
//                             </div>
//                         </div>
//                     ))
//             ) : (
//                 <div className='w-full h-screen flex items-center justify-center'>
//                     <NotFoundData message='Add Test Series & Start Practicing' />
//                 </div>
//             )}
//         </>
//     )
// }

// export default TestPackageCollection;

import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../../redux/HomeSlice';
import { useDispatch } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil';
import { MdOutlineGTranslate } from 'react-icons/md';
import { toggleBookmark } from '../../helpers/Add_RemoveBookmark';
import { Bookmark, BookmarkCheck, Loader2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import Loading from '../globle/Loading';
import GlobleAlert from '../globle/GlobleAlert';
import NotFoundData from '../globle/NotFoundData';
import { motion } from 'framer-motion';

const TestPackageCollection = () => {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const [packageData, setPackageData] = useState([])
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [loading, setLoading] = useState(false)
    const [btnLoadingId, setBtnLoadingId] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [markedData, setMarkedData] = useState(null)
    const [showEmptyModal, setShowEmptyModal] = useState(false)

    const fetchBookMarkTestSeries = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            if (res.status_code == 200) {
                const data = res.data?.package_id?.data || [];
                setPackageData(data);
                const ids = data.map(item => item.id);
                setBookmarkedIds(ids);

                if (data.length === 0) {
                    setShowEmptyModal(true);
                } else {
                    setShowEmptyModal(false);
                }
            } else {
                // If not 200, but we want to show the modal if it's actually empty
                setShowEmptyModal(true);
            }
        } catch (error) {
            console.error("Fetch error", error);
            setShowEmptyModal(true); // Show modal on error as a fallback for empty state
        } finally {
            setLoading(false)
            setShowDeleteAlert(false)
        }
    };

    useEffect(() => {
        fetchBookMarkTestSeries();
    }, []);

    const handleToggleBookmark = async (item) => {
        setBtnLoadingId(markedData.id);
        try {
            await toggleBookmark({
                type: "package_id",
                id: markedData.id,
                bookmarkedIds,
                setBookmarkedIds,
                dispatch,
                saveCollectionSlice,
                removeUserCollectionSlice,
                cb: fetchBookMarkTestSeries
            });

            if (bookmarkedIds.includes(markedData.id)) {
                setPackageData(prev => prev.filter(pkg => pkg.id !== markedData.id));
            }
        } catch (error) {
            showErrorToast("Something went wrong!");
        } finally {
            setBtnLoadingId(null);
        }
    };

    if (loading) return <Loading />;

    // Group by category
    const groupedData = packageData.reduce((acc, item) => {
        const key = item.test_category_title
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([categoryId, items], catIndex) => (
                        <div key={categoryId} className="mb-12 px-4 sm:px-6 lg:px-8">
                            {/* Category Title */}
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-bold text-gray-900 mb-6"
                            >
                                {categoryId}
                            </motion.h2>

                            {/* Cards Grid */}
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {items
                                    .sort((a, b) => a.sequence - b.sequence)
                                    .map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                                        >
                                            {/* Header with Logo and Badges */}
                                            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                                                {/* Background Pattern */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50"></div>

                                                <div className="relative flex items-center justify-between">
                                                    {/* Logo & Badge Section */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <img
                                                                src={item.logo || "/logo.jpeg"}
                                                                alt="Logo"
                                                                className="w-14 h-14 object-contain rounded-lg bg-white p-2 shadow-md"
                                                            />
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                                                <FaBolt className="text-white text-xs" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md mb-1">
                                                                PREMIUM
                                                            </div>
                                                            <div className="text-xs text-gray-600 font-medium">
                                                                {item.total_tests || 0} Tests Available
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bookmark Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setMarkedData(item)
                                                            setShowDeleteAlert(true)
                                                        }}
                                                        className={`p-2 rounded-lg transition-all ${bookmarkedIds.includes(item.id)
                                                                ? 'bg-yellow-500 text-white shadow-lg'
                                                                : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white'
                                                            }`}
                                                    >
                                                        {btnLoadingId === item.id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : bookmarkedIds.includes(item.id) ? (
                                                            <BookmarkCheck size={18} />
                                                        ) : (
                                                            <Bookmark size={18} />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 space-y-3">
                                                {/* Title */}
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                                                    {item.title || "Mock Test Series"}
                                                </h3>

                                                {/* Language */}
                                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                                    <MdOutlineGTranslate size={18} />
                                                    <span className="text-sm font-medium">
                                                        {item.language || "English, Hindi"}
                                                    </span>
                                                </div>

                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-gray-100">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {item.total_tests || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">Tests</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">4.8</div>
                                                        <div className="text-xs text-gray-500 mt-1">Rating</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-purple-600">50K+</div>
                                                        <div className="text-xs text-gray-500 mt-1">Students</div>
                                                    </div>
                                                </div>

                                                {/* Start Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => nav("/testpakages", { state: { item, testId: item.id } })}
                                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                                                >
                                                    <Trophy size={18} />
                                                    <span>Start Test Series</span>
                                                </motion.button>
                                            </div>

                                            {/* Delete Alert */}
                                            {showDeleteAlert && markedData?.id === item.id && (
                                                <GlobleAlert
                                                    type="confirm"
                                                    message="Are you sure you want to remove this?"
                                                    onConfirm={handleToggleBookmark}
                                                    onCancel={() => setShowDeleteAlert(false)}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    ))
            ) : (
                // Only show this when loading is false and packageData is actually empty
                !loading && (
                    <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center p-8">
                        {/* This is a fallback in case the modal doesn't show for some reason, though it should */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-100/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-200"
                        >
                            <Bookmark size={48} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-medium">No saved packages found</p>
                        </motion.div>
                    </div>
                )
            )}

            {/* Empty State Modal */}
            {showEmptyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <circle cx="10" cy="10" r="2" fill="white" />
                                    <circle cx="90" cy="90" r="2" fill="white" />
                                    <circle cx="90" cy="10" r="2" fill="white" />
                                    <circle cx="10" cy="90" r="2" fill="white" />
                                </svg>
                            </div>
                            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <Bookmark className="text-white w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Saved Packages</h3>
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Saved a package in the Home screen and then see your package on this screen
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => nav("/")}
                                className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-3"
                            >
                                <FaBolt className="text-yellow-400" />
                                <span>Go to Home Screen</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TestPackageCollection;
