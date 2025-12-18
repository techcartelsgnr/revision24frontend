// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { purchasePracticeBatchSlice } from "../../redux/practiceBatchDataSlice";
// import { allCouponData, couponApplyData } from "../../redux/couponDataSlice";
// import { motion } from "framer-motion";
// import { ArrowLeft, Tag, X, CheckCircle, Loader2 } from "lucide-react";

// const PracticeBatchPaymentSummery = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // ✅ Get batch data from navigation state
//     const { 
//         batch, 
//         batchId, 
//         batchTitle, 
//         batchAmount, 
//         batchDuration,
//         batchImage,
//         batchDescription 
//     } = location.state || {};

//     const [couponCode, setCouponCode] = useState("");
//     const [appliedCoupon, setAppliedCoupon] = useState(null);
//     const [couponError, setCouponError] = useState("");
//     const [isApplying, setIsApplying] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     const [availableCoupons, setAvailableCoupons] = useState([]);
//     const [couponsLoading, setCouponsLoading] = useState(true);

//     // ✅ Calculate pricing with GST
//     const basePrice = batchAmount || 0;
//     const gstRate = 0.18;
//     const gstAmount = basePrice * gstRate;
//     const totalWithGST = basePrice + gstAmount;

//     // Load Cashfree SDK
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
//         script.async = true;
//         document.head.appendChild(script);

//         return () => {
//             if (document.head.contains(script)) {
//                 document.head.removeChild(script);
//             }
//         };
//     }, []);



//     // Fetch coupons from API
//     useEffect(() => {
//         const fetchCoupons = async () => {
//             try {
//                 setCouponsLoading(true);
//                 const response = await dispatch(allCouponData()).unwrap();

//                 if (response.status === 200 && response.data) {
//                     const formattedCoupons = response.data.map(coupon => {
//                         const isPercentage = coupon.discount_percent !== null && coupon.discount_percent !== undefined;
//                         const isFlat = coupon.flat_amount !== null && coupon.flat_amount !== undefined;

//                         return {
//                             id: coupon.id,
//                             code: coupon.code,
//                             discount: isPercentage
//                                 ? parseFloat(coupon.discount_percent)
//                                 : parseFloat(coupon.flat_amount),
//                             type: coupon.coupon_type,
//                             description: isPercentage
//                                 ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
//                                 : isFlat
//                                     ? `Flat ₹${coupon.flat_amount} off`
//                                     : 'Discount available',
//                             min_amount: parseFloat(coupon.min_transaction_amount) || 0,
//                             max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
//                             expiry_date: coupon.end_date,
//                             is_active: coupon.status === 'active',
//                         };
//                     });

//                     const activeCoupons = formattedCoupons.filter(c => c.is_active);
//                     setAvailableCoupons(activeCoupons);
//                 }
//             } catch (error) {
//                 console.error("Error fetching coupons:", error);
//                 setAvailableCoupons([]);
//             } finally {
//                 setCouponsLoading(false);
//             }
//         };

//         fetchCoupons();
//     }, [dispatch]);

//     // Redirect if no batch data
//     useEffect(() => {
//         if (!batch || !batchAmount) {
//             navigate("/practice-batch");
//         }
//     }, [batch, batchAmount, navigate]);

//     // ✅ Calculate final price with coupon and GST
//     const calculateFinalPrice = () => {
//         if (!appliedCoupon) return totalWithGST;

//         let discountAmount = 0;

//         if (appliedCoupon.type === 'percentage') {
//             discountAmount = (basePrice * appliedCoupon.discount) / 100;
//             if (appliedCoupon.max_discount && discountAmount > appliedCoupon.max_discount) {
//                 discountAmount = appliedCoupon.max_discount;
//             }
//         } else {
//             discountAmount = appliedCoupon.discount;
//         }

//         const priceAfterDiscount = basePrice - discountAmount;
//         const gstOnDiscountedPrice = priceAfterDiscount * gstRate;
//         const finalAmount = priceAfterDiscount + gstOnDiscountedPrice;

//         return {
//             discountAmount,
//             priceAfterDiscount,
//             gstOnDiscountedPrice,
//             finalAmount
//         };
//     };

//     const pricing = calculateFinalPrice();
//     const finalPrice = appliedCoupon ? pricing.finalAmount : totalWithGST;
//     const savedAmount = appliedCoupon ? totalWithGST - finalPrice : 0;

//     // Apply coupon
//     const handleApplyCoupon = async () => {
//         if (!couponCode.trim()) {
//             setCouponError("Please enter a coupon code");
//             return;
//         }

//         setIsApplying(true);
//         setCouponError("");

//         try {
//             const formData = new FormData();
//             formData.append('coupon_code', couponCode.toUpperCase());
//             formData.append('cart_amount', basePrice.toString());

//             const response = await dispatch(couponApplyData(formData)).unwrap();

//             if (response.status === true || response.status === 200) {
//                 const apiCouponData = {
//                     id: response.data.id || null,
//                     code: response.data.coupon_code,
//                     discount: parseFloat(response.data.discount_amount),
//                     type: response.data.coupon_type,
//                     description: `${response.data.coupon_type === 'percentage' ? response.data.discount_amount + '%' : '₹' + response.data.discount_amount} off`,
//                 };

//                 setAppliedCoupon(apiCouponData);
//                 setCouponCode("");
//                 setCouponError("");
//             } else {
//                 setCouponError(response.message || "Invalid coupon code");
//             }
//         } catch (error) {
//             console.error("Apply coupon error:", error);
//             setCouponError(error.message || "Failed to apply coupon. Please try again.");
//         } finally {
//             setIsApplying(false);
//         }
//     };

//     // Remove coupon
//     const handleRemoveCoupon = () => {
//         setAppliedCoupon(null);
//         setCouponError("");
//     };

//     // ✅ Process payment with Cashfree
//     // const handleProceedToPayment = async () => {
//     //     if (!batch || !batchId) return;

//     //     setIsProcessing(true);

//     //     const paymentData = {
//     //         amount: finalPrice,
//     //         practice_batch_id: parseInt(batchId),
//     //         coupon_code: appliedCoupon?.code || null,
//     //     };

//     //     console.log('Payment Data:', paymentData);

//     //     try {
//     //         const res = await dispatch(purchasePracticeBatchSlice(paymentData)).unwrap();
//     //         console.log('Payment Response:', res);

//     //         if (res.status_code === 200 && window.Cashfree) {
//     //             const cashfree = window.Cashfree({ mode: "production" });
//     //             cashfree.checkout({
//     //                 paymentSessionId: res.payment_session_id,
//     //                 redirectTarget: "_self",
//     //                 returnUrl: `${window.location.origin}/cashfree-payment`,
//     //             });
//     //         } else {
//     //             throw new Error(res.message || 'Payment initialization failed');
//     //         }
//     //     } catch (error) {
//     //         console.error("Payment error:", error);
//     //         alert(error.message || "Payment failed. Please try again.");
//     //     } finally {
//     //         setIsProcessing(false);
//     //     }
//     // };

//     // ✅ Enhanced Process Payment with Debugging
// const handleProceedToPayment = async () => {
//     if (!batch || !batchId) {
//         console.error('❌ Missing batch data:', { batch, batchId });
//         alert('Batch information is missing. Please try again.');
//         return;
//     }

//     setIsProcessing(true);

//     const paymentData = {
//         amount: parseFloat(finalPrice.toFixed(2)),
//         practice_batch_id: parseInt(batchId),
//         coupon_code: appliedCoupon?.code || null,
//     };

//     console.log('💰 Payment Data:', paymentData);
//     console.log('🔍 Cashfree SDK Available:', !!window.Cashfree);

//     try {
//         const res = await dispatch(purchasePracticeBatchSlice(paymentData)).unwrap();
//         console.log('✅ API Response:', res);
//         console.log('📋 Response Structure:', {
//             status_code: res.status_code,
//             payment_session_id: res.payment_session_id,
//             order_id: res.order_id,
//             has_data: !!res.data
//         });

//         // ✅ Check for payment_session_id in multiple locations
//         const sessionId = res.payment_session_id || res.data?.payment_session_id;

//         if (!sessionId) {
//             console.error('❌ No payment session ID found in response');
//             throw new Error('Payment session ID not received from server');
//         }

//         console.log('🔑 Payment Session ID:', sessionId);

//         if (!window.Cashfree) {
//             console.error('❌ Cashfree SDK not loaded');
//             throw new Error('Cashfree payment gateway not available. Please refresh and try again.');
//         }

//         console.log('🚀 Initializing Cashfree...');

//         const cashfree = window.Cashfree({ mode: "production" });

//         console.log('📱 Opening Cashfree checkout...');

//         const checkoutOptions = {
//             paymentSessionId: sessionId,
//             redirectTarget: "_self",
//             returnUrl: `${window.location.origin}/cashfree-payment`,
//         };

//         console.log('⚙️ Cashfree Options:', checkoutOptions);

//         cashfree.checkout(checkoutOptions);

//     } catch (error) {
//         console.error("❌ Payment Error:", error);
//         console.error("Error Details:", {
//             message: error.message,
//             response: error.response,
//             data: error.data
//         });

//         alert(error.message || "Payment failed. Please try again.");
//     } finally {
//         setIsProcessing(false);
//     }
// };


//     if (!batch || !batchAmount) {
//         return null;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center mb-6">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                         <ArrowLeft className="w-6 h-6 text-gray-600" />
//                     </button>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">
//                         Payment Summary
//                     </h1>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Main Content */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Batch Details */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="bg-white rounded-lg shadow-lg p-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                 Selected Batch
//                             </h2>
//                             <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                 {batchImage && (
//                                     <img 
//                                         src={batchImage} 
//                                         alt={batchTitle}
//                                         className="w-24 h-24 object-cover rounded-lg"
//                                         onError={(e) => {
//                                             e.target.src = 'https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=Batch';
//                                         }}
//                                     />
//                                 )}
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-lg text-gray-800">
//                                         {batchTitle}
//                                     </p>
//                                     <p className="text-sm text-gray-600 mt-1">
//                                         Duration: {batchDuration} {parseInt(batchDuration) === 1 ? 'Month' : 'Months'}
//                                     </p>
//                                     {batchDescription && (
//                                         <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                                             {batchDescription}
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-xl font-bold text-green-600">
//                                         ₹{basePrice.toFixed(2)}
//                                     </p>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Coupon Section */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.1 }}
//                             className="bg-white rounded-lg shadow-lg p-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//                                 <Tag className="w-5 h-5 mr-2 text-green-600" />
//                                 Apply Coupon
//                             </h2>

//                             {/* Coupon Input */}
//                             <div className="flex gap-2 mb-4">
//                                 <input
//                                     type="text"
//                                     value={couponCode}
//                                     onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                                     placeholder="Enter coupon code"
//                                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     disabled={appliedCoupon}
//                                 />
//                                 {!appliedCoupon && (
//                                     <button
//                                         onClick={handleApplyCoupon}
//                                         disabled={isApplying || !couponCode.trim()}
//                                         className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                                             isApplying || !couponCode.trim()
//                                                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                                                 : "bg-blue-600 text-white hover:bg-blue-700"
//                                         }`}
//                                     >
//                                         {isApplying ? "Applying..." : "Apply"}
//                                     </button>
//                                 )}
//                             </div>

//                             {couponError && (
//                                 <p className="text-red-600 text-sm mb-4">{couponError}</p>
//                             )}

//                             {/* Applied Coupon */}
//                             {appliedCoupon && (
//                                 <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
//                                     <div className="flex items-center">
//                                         <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//                                         <div>
//                                             <p className="font-semibold text-green-800">
//                                                 {appliedCoupon.code} Applied!
//                                             </p>
//                                             <p className="text-sm text-green-600">
//                                                 {appliedCoupon.description}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <button
//                                         onClick={handleRemoveCoupon}
//                                         className="p-1 hover:bg-green-100 rounded-lg transition-colors"
//                                     >
//                                         <X className="w-5 h-5 text-green-600" />
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Available Coupons */}
//                             <div>
//                                 <p className="text-sm font-semibold text-gray-700 mb-3">
//                                     Available Coupons:
//                                 </p>

//                                 {couponsLoading ? (
//                                     <div className="flex items-center justify-center py-8">
//                                         <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
//                                         <span className="ml-2 text-gray-600">Loading coupons...</span>
//                                     </div>
//                                 ) : availableCoupons.length > 0 ? (
//                                     <div className="space-y-2 max-h-96 overflow-y-auto">
//                                         {availableCoupons.map((coupon) => (
//                                             <div
//                                                 key={coupon.id}
//                                                 className={`p-3 border rounded-lg cursor-pointer transition-all ${
//                                                     appliedCoupon?.code === coupon.code
//                                                         ? "border-green-500 bg-green-50"
//                                                         : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
//                                                 }`}
//                                                 onClick={() => {
//                                                     if (!appliedCoupon) {
//                                                         setCouponCode(coupon.code);
//                                                     }
//                                                 }}
//                                             >
//                                                 <div className="flex justify-between items-center">
//                                                     <div className="flex-1">
//                                                         <p className="font-semibold text-gray-800">
//                                                             {coupon.code}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             {coupon.description}
//                                                         </p>
//                                                         {coupon.min_amount > 0 && (
//                                                             <p className="text-xs text-gray-500 mt-1">
//                                                                 Min order: ₹{coupon.min_amount}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                     {appliedCoupon?.code !== coupon.code && (
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setCouponCode(coupon.code);
//                                                                 setTimeout(() => handleApplyCoupon(), 100);
//                                                             }}
//                                                             className="text-blue-600 text-sm font-semibold hover:underline ml-2"
//                                                         >
//                                                             Apply
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-500 text-sm text-center py-4">
//                                         No coupons available at the moment
//                                     </p>
//                                 )}
//                             </div>
//                         </motion.div>
//                     </div>

//                     {/* Price Summary Sidebar */}
//                     <div className="lg:col-span-1">
//                         <motion.div
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.2 }}
//                             className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                 Price Summary
//                             </h2>

//                             <div className="space-y-3 mb-4">
//                                 <div className="flex justify-between text-gray-700">
//                                     <span>Batch Price:</span>
//                                     <span>₹{basePrice.toFixed(2)}</span>
//                                 </div>

//                                 {appliedCoupon && (
//                                     <div className="flex justify-between text-red-600">
//                                         <span>Coupon Discount:</span>
//                                         <span>- ₹{pricing.discountAmount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 {appliedCoupon && (
//                                     <div className="flex justify-between text-gray-700 font-medium">
//                                         <span>Price After Discount:</span>
//                                         <span>₹{pricing.priceAfterDiscount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-between text-gray-700">
//                                     <span>GST (18%):</span>
//                                     <span>
//                                         ₹{appliedCoupon
//                                             ? pricing.gstOnDiscountedPrice.toFixed(2)
//                                             : gstAmount.toFixed(2)
//                                         }
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="border-t pt-4 mb-6">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-lg font-semibold text-gray-800">
//                                         Final Amount:
//                                     </span>
//                                     <span className="text-2xl font-bold text-green-600">
//                                         ₹{finalPrice.toFixed(2)}
//                                     </span>
//                                 </div>
//                                 {appliedCoupon && (
//                                     <p className="text-sm text-green-600 mt-2">
//                                         You saved ₹{savedAmount.toFixed(2)}!
//                                     </p>
//                                 )}
//                             </div>

//                             <button
//                                 onClick={handleProceedToPayment}
//                                 disabled={isProcessing}
//                                 className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
//                                     isProcessing
//                                         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                                         : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
//                                 }`}
//                             >
//                                 {isProcessing ? (
//                                     <div className="flex items-center justify-center">
//                                         <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                                         Processing...
//                                     </div>
//                                 ) : (
//                                     "Proceed to Payment"
//                                 )}
//                             </button>

//                             <p className="text-xs text-gray-500 text-center mt-4">
//                                 Secure payment powered by Cashfree
//                             </p>
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PracticeBatchPaymentSummery;


// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { purchasePracticeBatchSlice } from "../../redux/practiceBatchDataSlice";
// import { allCouponData, couponApplyData } from "../../redux/couponDataSlice";
// import { motion } from "framer-motion";
// import { ArrowLeft, Tag, X, CheckCircle, Loader2 } from "lucide-react";

// const PracticeBatchPaymentSummery = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // ✅ Get batch data from navigation state
//     const { 
//         batch, 
//         batchId, 
//         batchTitle, 
//         batchAmount, 
//         batchDuration,
//         batchImage,
//         batchDescription 
//     } = location.state || {};

//     const [couponCode, setCouponCode] = useState("");
//     const [appliedCoupon, setAppliedCoupon] = useState(null);
//     const [couponError, setCouponError] = useState("");
//     const [isApplying, setIsApplying] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [availableCoupons, setAvailableCoupons] = useState([]);
//     const [couponsLoading, setCouponsLoading] = useState(true);

//     // ✅ Calculate pricing WITHOUT GST (for payment)
//     const basePrice = batchAmount || 0;
//     const gstRate = 0.18;

//     // ✅ For display only
//     const gstAmount = basePrice * gstRate;
//     const totalWithGST = basePrice + gstAmount;

//     // ✅ Load Cashfree SDK
//     useEffect(() => {
//         console.log('🔄 Loading Cashfree SDK...');

//         const script = document.createElement('script');
//         script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
//         script.async = true;

//         script.onload = () => {
//             console.log('✅ Cashfree SDK loaded successfully');
//             console.log('🔍 Cashfree object available:', !!window.Cashfree);
//         };

//         script.onerror = () => {
//             console.error('❌ Failed to load Cashfree SDK');
//         };

//         document.head.appendChild(script);

//         return () => {
//             if (document.head.contains(script)) {
//                 document.head.removeChild(script);
//             }
//         };
//     }, []);

//     // ✅ Fetch coupons from API
//     useEffect(() => {
//         const fetchCoupons = async () => {
//             try {
//                 setCouponsLoading(true);
//                 const response = await dispatch(allCouponData()).unwrap();

//                 if (response.status === 200 && response.data) {
//                     const formattedCoupons = response.data.map(coupon => {
//                         const isPercentage = coupon.discount_percent !== null && coupon.discount_percent !== undefined;
//                         const isFlat = coupon.flat_amount !== null && coupon.flat_amount !== undefined;

//                         return {
//                             id: coupon.id,
//                             code: coupon.code,
//                             discount: isPercentage
//                                 ? parseFloat(coupon.discount_percent)
//                                 : parseFloat(coupon.flat_amount),
//                             type: coupon.coupon_type,
//                             description: isPercentage
//                                 ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
//                                 : isFlat
//                                     ? `Flat ₹${coupon.flat_amount} off`
//                                     : 'Discount available',
//                             min_amount: parseFloat(coupon.min_transaction_amount) || 0,
//                             max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
//                             expiry_date: coupon.end_date,
//                             is_active: coupon.status === 'active',
//                         };
//                     });

//                     const activeCoupons = formattedCoupons.filter(c => c.is_active);
//                     setAvailableCoupons(activeCoupons);
//                 }
//             } catch (error) {
//                 console.error("Error fetching coupons:", error);
//                 setAvailableCoupons([]);
//             } finally {
//                 setCouponsLoading(false);
//             }
//         };

//         fetchCoupons();
//     }, [dispatch]);

//     // ✅ Redirect if no batch data
//     useEffect(() => {
//         if (!batch || !batchAmount) {
//             console.warn('⚠️ Missing batch data, redirecting...');
//             navigate("/practice-batch");
//         }
//     }, [batch, batchAmount, navigate]);

//     // ✅ Calculate amounts for display AND payment
//     const calculatePricing = () => {
//         if (!appliedCoupon) {
//             return {
//                 // For display
//                 displayGstAmount: gstAmount,
//                 displayTotalWithGST: totalWithGST,
//                 // For payment (WITHOUT GST)
//                 paymentAmount: basePrice,
//                 discountAmount: 0,
//                 priceAfterDiscount: basePrice,
//                 gstOnDiscountedPrice: gstAmount,
//             };
//         }

//         let discountAmount = 0;

//         if (appliedCoupon.type === 'percentage') {
//             discountAmount = (basePrice * appliedCoupon.discount) / 100;
//             if (appliedCoupon.max_discount && discountAmount > appliedCoupon.max_discount) {
//                 discountAmount = appliedCoupon.max_discount;
//             }
//         } else {
//             discountAmount = appliedCoupon.discount;
//         }

//         const priceAfterDiscount = basePrice - discountAmount;
//         const gstOnDiscountedPrice = priceAfterDiscount * gstRate;
//         const displayFinalAmount = priceAfterDiscount + gstOnDiscountedPrice;

//         return {
//             // For display
//             discountAmount,
//             priceAfterDiscount,
//             gstOnDiscountedPrice,
//             displayFinalAmount,
//             // ✅ For payment (WITHOUT GST) - Just base price after discount
//             paymentAmount: priceAfterDiscount,
//         };
//     };

//     const pricing = calculatePricing();

//     // ✅ Amount to send to Cashfree (WITHOUT GST)
//     const amountToPay = pricing.paymentAmount;

//     // ✅ Amount to show to user (WITH GST)
//     const displayFinalAmount = appliedCoupon ? pricing.displayFinalAmount : totalWithGST;
//     const savedAmount = appliedCoupon ? totalWithGST - displayFinalAmount : 0;

//     // ✅ Apply coupon
//     const handleApplyCoupon = async () => {
//         if (!couponCode.trim()) {
//             setCouponError("Please enter a coupon code");
//             return;
//         }

//         setIsApplying(true);
//         setCouponError("");

//         try {
//             const formData = new FormData();
//             formData.append('coupon_code', couponCode.toUpperCase());
//             formData.append('cart_amount', basePrice.toString());

//             const response = await dispatch(couponApplyData(formData)).unwrap();

//             if (response.status === true || response.status === 200) {
//                 const apiCouponData = {
//                     id: response.data.id || null,
//                     code: response.data.coupon_code,
//                     discount: parseFloat(response.data.discount_amount),
//                     type: response.data.coupon_type,
//                     description: `${response.data.coupon_type === 'percentage' ? response.data.discount_amount + '%' : '₹' + response.data.discount_amount} off`,
//                 };

//                 setAppliedCoupon(apiCouponData);
//                 setCouponCode("");
//                 setCouponError("");
//             } else {
//                 setCouponError(response.message || "Invalid coupon code");
//             }
//         } catch (error) {
//             console.error("Apply coupon error:", error);
//             setCouponError(error.message || "Failed to apply coupon. Please try again.");
//         } finally {
//             setIsApplying(false);
//         }
//     };

//     // ✅ Remove coupon
//     const handleRemoveCoupon = () => {
//         setAppliedCoupon(null);
//         setCouponError("");
//     };

//     // ✅ Process payment - Send amount WITHOUT GST
//     const handleProceedToPayment = async () => {
//         if (!batch || !batchId) {
//             console.error('❌ Missing batch data:', { batch, batchId });
//             alert('Batch information is missing. Please try again.');
//             return;
//         }

//         setIsProcessing(true);

//         // ✅ Send amount WITHOUT GST to Cashfree
//         const paymentData = {
//             amount: parseFloat(amountToPay.toFixed(2)), // WITHOUT GST
//             practice_batch_id: parseInt(batchId),
//             coupon_code: appliedCoupon?.code || null,
//         };

//         console.log('💰 Payment Data (WITHOUT GST):', paymentData);
//         console.log('📊 Display Amount (WITH GST):', displayFinalAmount.toFixed(2));
//         console.log('🔍 Cashfree SDK Available:', !!window.Cashfree);

//         try {
//             const res = await dispatch(purchasePracticeBatchSlice(paymentData)).unwrap();
//             console.log('✅ API Response:', res);
//             console.log('📋 Response Structure:', {
//                 status_code: res.status_code,
//                 payment_session_id: res.payment_session_id,
//                 order_id: res.order_id,
//                 message: res.message
//             });

//             // ✅ Check multiple possible locations for session ID
//             const sessionId = res.payment_session_id || 
//                              res.data?.payment_session_id || 
//                              res.paymentSessionId;

//             if (!sessionId) {
//                 console.error('❌ No payment session ID found in response:', res);
//                 throw new Error('Payment session ID not received from server');
//             }

//             console.log('🔑 Payment Session ID:', sessionId);

//             if (!window.Cashfree) {
//                 console.error('❌ Cashfree SDK not loaded');
//                 throw new Error('Cashfree payment gateway not available. Please refresh and try again.');
//             }

//             console.log('🚀 Initializing Cashfree...');

//             const cashfree = window.Cashfree({ mode: "production" });

//             console.log('📱 Opening Cashfree checkout...');

//             const checkoutOptions = {
//                 paymentSessionId: sessionId,
//                 redirectTarget: "_self",
//             };

//             console.log('⚙️ Cashfree Options:', checkoutOptions);

//             cashfree.checkout(checkoutOptions);

//         } catch (error) {
//             console.error("❌ Payment Error:", error);
//             console.error("Error Details:", {
//                 message: error.message,
//                 response: error.response,
//                 data: error.data
//             });

//             alert(error.message || "Payment failed. Please try again.");
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (!batch || !batchAmount) {
//         return null;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex items-center mb-6">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                         <ArrowLeft className="w-6 h-6 text-gray-600" />
//                     </button>
//                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">
//                         Payment Summary
//                     </h1>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Main Content */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Batch Details */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="bg-white rounded-lg shadow-lg p-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                 Selected Batch
//                             </h2>
//                             <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                 {batchImage && (
//                                     <img 
//                                         src={batchImage} 
//                                         alt={batchTitle}
//                                         className="w-24 h-24 object-contain rounded-lg"
//                                         onError={(e) => {
//                                             e.target.src = 'https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=Batch';
//                                         }}
//                                     />
//                                 )}
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-lg text-gray-800">
//                                         {batchTitle}
//                                     </p>
//                                     <p className="text-sm text-gray-600 mt-1">
//                                         Duration: {batchDuration} {parseInt(batchDuration) === 1 ? 'Month' : 'Months'}
//                                     </p>
//                                     {batchDescription && (
//                                         <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                                             {batchDescription}
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-xl font-bold text-green-600">
//                                         ₹{basePrice.toFixed(2)}
//                                     </p>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Coupon Section */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.1 }}
//                             className="bg-white rounded-lg shadow-lg p-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//                                 <Tag className="w-5 h-5 mr-2 text-green-600" />
//                                 Apply Coupon
//                             </h2>

//                             {/* Coupon Input */}
//                             <div className="flex gap-2 mb-4">
//                                 <input
//                                     type="text"
//                                     value={couponCode}
//                                     onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                                     placeholder="Enter coupon code"
//                                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     disabled={appliedCoupon}
//                                 />
//                                 {!appliedCoupon && (
//                                     <button
//                                         onClick={handleApplyCoupon}
//                                         disabled={isApplying || !couponCode.trim()}
//                                         className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                                             isApplying || !couponCode.trim()
//                                                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                                                 : "bg-blue-600 text-white hover:bg-blue-700"
//                                         }`}
//                                     >
//                                         {isApplying ? "Applying..." : "Apply"}
//                                     </button>
//                                 )}
//                             </div>

//                             {couponError && (
//                                 <p className="text-red-600 text-sm mb-4">{couponError}</p>
//                             )}

//                             {/* Applied Coupon */}
//                             {appliedCoupon && (
//                                 <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
//                                     <div className="flex items-center">
//                                         <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//                                         <div>
//                                             <p className="font-semibold text-green-800">
//                                                 {appliedCoupon.code} Applied!
//                                             </p>
//                                             <p className="text-sm text-green-600">
//                                                 {appliedCoupon.description}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <button
//                                         onClick={handleRemoveCoupon}
//                                         className="p-1 hover:bg-green-100 rounded-lg transition-colors"
//                                     >
//                                         <X className="w-5 h-5 text-green-600" />
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Available Coupons */}
//                             <div>
//                                 <p className="text-sm font-semibold text-gray-700 mb-3">
//                                     Available Coupons:
//                                 </p>

//                                 {couponsLoading ? (
//                                     <div className="flex items-center justify-center py-8">
//                                         <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
//                                         <span className="ml-2 text-gray-600">Loading coupons...</span>
//                                     </div>
//                                 ) : availableCoupons.length > 0 ? (
//                                     <div className="space-y-2 max-h-96 overflow-y-auto">
//                                         {availableCoupons.map((coupon) => (
//                                             <div
//                                                 key={coupon.id}
//                                                 className={`p-3 border rounded-lg cursor-pointer transition-all ${
//                                                     appliedCoupon?.code === coupon.code
//                                                         ? "border-green-500 bg-green-50"
//                                                         : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
//                                                 }`}
//                                                 onClick={() => {
//                                                     if (!appliedCoupon) {
//                                                         setCouponCode(coupon.code);
//                                                     }
//                                                 }}
//                                             >
//                                                 <div className="flex justify-between items-center">
//                                                     <div className="flex-1">
//                                                         <p className="font-semibold text-gray-800">
//                                                             {coupon.code}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             {coupon.description}
//                                                         </p>
//                                                         {coupon.min_amount > 0 && (
//                                                             <p className="text-xs text-gray-500 mt-1">
//                                                                 Min order: ₹{coupon.min_amount}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                     {appliedCoupon?.code !== coupon.code && (
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setCouponCode(coupon.code);
//                                                                 setTimeout(() => handleApplyCoupon(), 100);
//                                                             }}
//                                                             className="text-blue-600 text-sm font-semibold hover:underline ml-2"
//                                                         >
//                                                             Apply
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-500 text-sm text-center py-4">
//                                         No coupons available at the moment
//                                     </p>
//                                 )}
//                             </div>
//                         </motion.div>
//                     </div>

//                     {/* Price Summary Sidebar */}
//                     <div className="lg:col-span-1">
//                         <motion.div
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.2 }}
//                             className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
//                         >
//                             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                                 Price Summary
//                             </h2>

//                             <div className="space-y-3 mb-4">
//                                 <div className="flex justify-between text-gray-700">
//                                     <span>Batch Price:</span>
//                                     <span>₹{basePrice.toFixed(2)}</span>
//                                 </div>

//                                 {appliedCoupon && (
//                                     <div className="flex justify-between text-red-600">
//                                         <span>Coupon Discount:</span>
//                                         <span>- ₹{pricing.discountAmount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 {appliedCoupon && (
//                                     <div className="flex justify-between text-gray-700 font-medium">
//                                         <span>Price After Discount:</span>
//                                         <span>₹{pricing.priceAfterDiscount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-between text-gray-700">
//                                     <span>GST (18%):</span>
//                                     <span>
//                                         ₹{appliedCoupon
//                                             ? pricing.gstOnDiscountedPrice.toFixed(2)
//                                             : gstAmount.toFixed(2)
//                                         }
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="border-t pt-4 mb-6">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-lg font-semibold text-gray-800">
//                                         Final Amount:
//                                     </span>
//                                     <span className="text-2xl font-bold text-green-600">
//                                         ₹{displayFinalAmount.toFixed(2)}
//                                     </span>
//                                 </div>
//                                 {appliedCoupon && (
//                                     <p className="text-sm text-green-600 mt-2">
//                                         You saved ₹{savedAmount.toFixed(2)}!
//                                     </p>
//                                 )}
//                                 {/* ✅ Show payment amount info */}
//                                 <p className="text-xs text-gray-500 mt-2">
//                                     Payment amount: ₹{amountToPay.toFixed(2)} (GST will be added by gateway)
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={handleProceedToPayment}
//                                 disabled={isProcessing}
//                                 className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
//                                     isProcessing
//                                         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                                         : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
//                                 }`}
//                             >
//                                 {isProcessing ? (
//                                     <div className="flex items-center justify-center">
//                                         <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                                         Processing...
//                                     </div>
//                                 ) : (
//                                     "Proceed to Payment"
//                                 )}
//                             </button>

//                             <p className="text-xs text-gray-500 text-center mt-4">
//                                 Secure payment powered by Cashfree
//                             </p>
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PracticeBatchPaymentSummery;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { purchasePracticeBatchSlice, paymentPracticeBatchVarifySlice } from "../../redux/practiceBatchDataSlice";
import { allCouponData, couponApplyData } from "../../redux/couponDataSlice";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";


const PracticeBatchPaymentSummery = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const {
        batch,
        batchId,
        batchTitle,
        batchAmount,
        batchDuration,
        batchImage,
        batchDescription
    } = location.state || {};


    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(true);


    const basePrice = batchAmount || 0;
    const gstRate = 0.18;
    const gstAmount = basePrice * gstRate;
    const totalWithGST = basePrice + gstAmount;


    // ✅ Load Razorpay SDK
    useEffect(() => {
        console.log('🔄 Loading Razorpay SDK...');

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
            console.log('✅ Razorpay SDK loaded successfully');
        };

        script.onerror = () => {
            console.error('❌ Failed to load Razorpay SDK');
        };

        document.head.appendChild(script);


        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);


    // ✅ Fetch coupons from API
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setCouponsLoading(true);
                const response = await dispatch(allCouponData()).unwrap();


                if (response.status === 200 && response.data) {
                    const formattedCoupons = response.data.map(coupon => {
                        const isPercentage = coupon.discount_percent !== null && coupon.discount_percent !== undefined;
                        const isFlat = coupon.flat_amount !== null && coupon.flat_amount !== undefined;


                        return {
                            id: coupon.id,
                            code: coupon.code,
                            discount: isPercentage
                                ? parseFloat(coupon.discount_percent)
                                : parseFloat(coupon.flat_amount),
                            type: coupon.coupon_type,
                            description: isPercentage
                                ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
                                : isFlat
                                    ? `Flat ₹${coupon.flat_amount} off`
                                    : 'Discount available',
                            min_amount: parseFloat(coupon.min_transaction_amount) || 0,
                            max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
                            expiry_date: coupon.end_date,
                            is_active: coupon.status === 'active',
                        };
                    });


                    const activeCoupons = formattedCoupons.filter(c => c.is_active);
                    setAvailableCoupons(activeCoupons);
                }
            } catch (error) {
                console.error("Error fetching coupons:", error);
                setAvailableCoupons([]);
            } finally {
                setCouponsLoading(false);
            }
        };


        fetchCoupons();
    }, [dispatch]);


    // ✅ Redirect if no batch data
    useEffect(() => {
        if (!batch || !batchAmount) {
            console.warn('⚠️ Missing batch data, redirecting...');
            navigate("/practice-batch");
        }
    }, [batch, batchAmount, navigate]);


    // ✅ Calculate amounts for display AND payment
    const calculatePricing = () => {
        if (!appliedCoupon) {
            return {
                displayGstAmount: gstAmount,
                displayTotalWithGST: totalWithGST,
                paymentAmount: basePrice,
                discountAmount: 0,
                priceAfterDiscount: basePrice,
                gstOnDiscountedPrice: gstAmount,
            };
        }


        let discountAmount = 0;

        if (appliedCoupon.type === 'percentage') {
            discountAmount = (basePrice * appliedCoupon.discount) / 100;
            if (appliedCoupon.max_discount && discountAmount > appliedCoupon.max_discount) {
                discountAmount = appliedCoupon.max_discount;
            }
        } else {
            discountAmount = appliedCoupon.discount;
        }


        const priceAfterDiscount = basePrice - discountAmount;
        const gstOnDiscountedPrice = priceAfterDiscount * gstRate;
        const displayFinalAmount = priceAfterDiscount + gstOnDiscountedPrice;


        return {
            discountAmount,
            priceAfterDiscount,
            gstOnDiscountedPrice,
            displayFinalAmount,
            paymentAmount: priceAfterDiscount,
        };
    };


    const pricingCalc = calculatePricing();
    const amountToPay = pricingCalc.paymentAmount;
    const displayFinalAmount = appliedCoupon ? pricingCalc.displayFinalAmount : totalWithGST;
    const savedAmount = appliedCoupon ? totalWithGST - displayFinalAmount : 0;


    // ✅ Apply coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }


        setIsApplying(true);
        setCouponError("");


        try {
            const formData = new FormData();
            formData.append('coupon_code', couponCode.toUpperCase());
            formData.append('cart_amount', basePrice.toString());


            const response = await dispatch(couponApplyData(formData)).unwrap();


            if (response.status === true || response.status === 200) {
                const apiCouponData = {
                    id: response.data.id || null,
                    code: response.data.coupon_code,
                    discount: parseFloat(response.data.discount_amount),
                    type: response.data.coupon_type,
                    description: `${response.data.coupon_type === 'percentage' ? response.data.discount_amount + '%' : '₹' + response.data.discount_amount} off`,
                };


                setAppliedCoupon(apiCouponData);
                setCouponCode("");
                setCouponError("");
            } else {
                setCouponError(response.message || "Invalid coupon code");
            }
        } catch (error) {
            console.error("Apply coupon error:", error);
            setCouponError(error.message || "Failed to apply coupon. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };


    // ✅ Remove coupon
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };


    // ✅ Step 1: Process payment - Send amount WITHOUT GST
    // ✅ Step 1: Process payment - Send amount WITHOUT GST
    const handleProceedToPayment = async () => {
        if (!batch || !batchId) {
            console.error('❌ Missing batch data:', { batch, batchId });
            toast.error('Batch information is missing. Please try again.');
            return;
        }

        setIsProcessing(true);

        const paymentData = {
            amount: parseFloat(amountToPay.toFixed(2)), // WITHOUT GST
            practice_batch_id: parseInt(batchId),
            coupon_code: appliedCoupon?.code || null,
            platform: 'web',
        };

        console.log('💰 Payment Data:', paymentData);

        try {
            // Step 1: Get payment session from backend
            const res = await dispatch(purchasePracticeBatchSlice(paymentData)).unwrap();
            console.log('✅ Backend Response:', res);

            // Step 2: Validate response
            if (!res.payment_session_id) {
                toast.error('Invalid payment session.');
                setIsProcessing(false);
                return;
            }

            // ✅ Step 3: Open Razorpay (like your subscription page)
            const razorpayResponse = await openRazorpay({
                keyId: res.key_id,  // ✅ Razorpay Key
                amount: res.amount,  // ✅ Backend sends total (with GST) in INR
                orderId: res.payment_session_id,  // ✅ Razorpay Order ID
                internalOrderId: res.order_id,  // ✅ Your internal order ID
                name: batchTitle,
                description: `Practice Batch - ${batchTitle}`,
            });

            // ✅ Step 4: Verify payment with backend (PASS res HERE)
            if (razorpayResponse?.razorpay_payment_id) {
                await paymentVerify({
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
                    order_id: res.order_id, // ✅ Pass res.order_id here
                });
            }

        } catch (error) {
            console.error("❌ Error:", error);
            toast.error(error?.message || "Payment failed");
            setIsProcessing(false);
        }
    };



    // ✅ Step 2: Open Razorpay Checkout
    // ✅ Step 2: Open Razorpay Checkout
    const openRazorpay = (response) => {
        return new Promise((resolve, reject) => {
            if (!window.Razorpay) {
                reject(new Error('Razorpay SDK not loaded'));
                return;
            }

            const options = {
                key: response.keyId,  // ✅ Razorpay Key ID
                amount: response.amount * 100,  // ✅ Convert INR to paise
                currency: "INR",
                order_id: response.orderId,  // ✅ Razorpay Order ID
                name: "Revision24",
                description: response.description || "Practice Batch Payment",
                image: "https://revision24.com/logo.jpeg",
                prefill: {
                    name: response.name || "",
                    email: localStorage.getItem('user_email') || "",
                    contact: localStorage.getItem('user_phone') || "",
                },
                theme: {
                    color: "#3B82F6",
                },
                handler: function (paymentResponse) {
                    console.log("✅ Payment Success:", paymentResponse);
                    resolve(paymentResponse);  // ✅ Return payment details
                },
                modal: {
                    ondismiss: function () {
                        console.log("❌ Payment cancelled");
                        reject(new Error("Payment cancelled"));
                        setIsProcessing(false);
                    },
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                console.error("❌ Payment Failed:", response.error);
                reject(response.error);
                setIsProcessing(false);
            });

            rzp1.open();
        });
    };


    // ✅ Step 3: Verify payment with backend
    // ✅ Step 3: Verify payment with backend
    // ✅ Step 3: Verify payment with backend
    const paymentVerify = async (paymentData) => {
        try {
            console.log('🔍 Payment Data being verified:', {
                order_id: paymentData.order_id,
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature,
            });

            const response = await dispatch(
                paymentPracticeBatchVarifySlice(paymentData)
            ).unwrap();

            console.log("✅ Payment Verify Response:", response);

            if (response.status === 200 || response.status === true) {
                toast.success("Payment Successful! 🎉");

                setTimeout(() => {
                    navigate('/all-batches', { state: { paymentSuccess: true } });
                }, 1500);
            } else {
                toast.error("Payment verification failed: " + response.message);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('❌ Verification error:', error);
            toast.error("Payment verification failed!");
            setIsProcessing(false);
        }
    };



    if (!batch || !batchAmount) {
        return null;
    }


    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">
                        Payment Summary
                    </h1>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Batch Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Selected Batch
                            </h2>
                            <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                {batchImage && (
                                    <img
                                        src={batchImage}
                                        alt={batchTitle}
                                        className="w-24 h-24 object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=Batch';
                                        }}
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-lg text-gray-800">
                                        {batchTitle}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Duration: {batchDuration} {parseInt(batchDuration) === 1 ? 'Month' : 'Months'}
                                    </p>
                                    {batchDescription && (
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                            {batchDescription}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-600">
                                        ₹{basePrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>


                        {/* Coupon Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                <Tag className="w-5 h-5 mr-2 text-green-600" />
                                Apply Coupon
                            </h2>


                            {/* Coupon Input */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={appliedCoupon}
                                />
                                {!appliedCoupon && (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplying || !couponCode.trim()}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${isApplying || !couponCode.trim()
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                    >
                                        {isApplying ? "Applying..." : "Apply"}
                                    </button>
                                )}
                            </div>


                            {couponError && (
                                <p className="text-red-600 text-sm mb-4">{couponError}</p>
                            )}


                            {/* Applied Coupon */}
                            {appliedCoupon && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <div>
                                            <p className="font-semibold text-green-800">
                                                {appliedCoupon.code} Applied!
                                            </p>
                                            <p className="text-sm text-green-600">
                                                {appliedCoupon.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-green-600" />
                                    </button>
                                </div>
                            )}


                            {/* Available Coupons */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    Available Coupons:
                                </p>


                                {couponsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="ml-2 text-gray-600">Loading coupons...</span>
                                    </div>
                                ) : availableCoupons.length > 0 ? (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {availableCoupons.map((coupon) => (
                                            <div
                                                key={coupon.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${appliedCoupon?.code === coupon.code
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                                    }`}
                                                onClick={() => {
                                                    if (!appliedCoupon) {
                                                        setCouponCode(coupon.code);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">
                                                            {coupon.code}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {coupon.description}
                                                        </p>
                                                        {coupon.min_amount > 0 && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Min order: ₹{coupon.min_amount}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {appliedCoupon?.code !== coupon.code && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCouponCode(coupon.code);
                                                                setTimeout(() => handleApplyCoupon(), 100);
                                                            }}
                                                            className="text-blue-600 text-sm font-semibold hover:underline ml-2"
                                                        >
                                                            Apply
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No coupons available at the moment
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>


                    {/* Price Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Price Summary
                            </h2>


                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Batch Price:</span>
                                    <span>₹{basePrice.toFixed(2)}</span>
                                </div>


                                {appliedCoupon && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Coupon Discount:</span>
                                        <span>- ₹{pricingCalc.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}


                                {appliedCoupon && (
                                    <div className="flex justify-between text-gray-700 font-medium">
                                        <span>Price After Discount:</span>
                                        <span>₹{pricingCalc.priceAfterDiscount.toFixed(2)}</span>
                                    </div>
                                )}


                                <div className="flex justify-between text-gray-700">
                                    <span>GST (18%):</span>
                                    <span>
                                        ₹{appliedCoupon
                                            ? pricingCalc.gstOnDiscountedPrice.toFixed(2)
                                            : gstAmount.toFixed(2)
                                        }
                                    </span>
                                </div>
                            </div>


                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">
                                        Final Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{displayFinalAmount.toFixed(2)}
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <p className="text-sm text-green-600 mt-2">
                                        You saved ₹{savedAmount.toFixed(2)}!
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Total payment: ₹{displayFinalAmount.toFixed(2)} (including GST)
                                </p>
                            </div>


                            <button
                                onClick={handleProceedToPayment}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${isProcessing
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Proceed to Payment"
                                )}
                            </button>


                            <p className="text-xs text-gray-500 text-center mt-4">
                                Secure payment powered by Razorpay 🔒
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PracticeBatchPaymentSummery;
