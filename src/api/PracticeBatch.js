import { getUserToken } from "../utils/auth";
import api from "./axiosConfig";

const PracticeBatch = {
    getPracticeBatchData: async () => {
        try {
            const token = await getUserToken();
            console.log('Token from getUserToken:', token);
            const res = await api.get("/practice-batch");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ✅ CORRECTED: Simple API call only, no React logic
    purchasePracticeBatch: async (purchaseData) => {
        try {
            const token = await getUserToken();
            console.log('Token from getUserToken:', token); // Debug log

            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            console.log('Purchase data being sent:', purchaseData); // Debug log

            const response = await api.post(`/purchase-practice-batch2`, purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // ✅ FIXED: Changed from multipart/form-data
                },
            });

            console.log('Purchase API response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Purchase API Error:', error); // Debug log

            // Better error handling
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                throw new Error('Your session has expired. Please login again.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response?.data?.message || 'Invalid request data.');
            } else if (error.response?.status === 403) {
                throw new Error('You do not have permission to purchase this batch.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Purchase failed. Please try again.');
            }
        }
    },

    // paymentPracticeBatchVerify: async (paymentData) => {
    //     try {
    //         const token = localStorage.getItem('token');

    //         const response = await api.get(`/practice-batch-payment-success2`, {
    //             params: {
    //                 order_id: paymentData.razorpay_order_id,  // ✅ Rename to order_id
    //                 razorpay_payment_id: paymentData.razorpay_payment_id,
    //                 razorpay_signature: paymentData.razorpay_signature,
    //                 platform: 'web'
    //             },
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw error.response?.data || error.message;
    //     }
    // },

    // In your PracticeBatch Provider
    paymentPracticeBatchVerify: async (paymentData) => {
        try {
            const token = localStorage.getItem('token');

            console.log('📤 Sending verification data:', paymentData);

            // ✅ Pass ALL parameters as query string
            const response = await api.get(`/practice-batch-payment-success2`, {
                params: {
                    order_id: paymentData.order_id,  // YOUR internal order ID
                    razorpay_order_id: paymentData.razorpay_order_id,  // ✅ RAZORPAY Order ID
                    razorpay_payment_id: paymentData.razorpay_payment_id,  // ✅ Payment ID
                    razorpay_signature: paymentData.razorpay_signature,  // ✅ Signature
                    platform: 'web'
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('✅ Verification response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Verification error:', error);
            throw error.response?.data || error.message;
        }
    },




    getBatchVideos: async (slug) => {
        try {
            const token = await getUserToken();
            console.log('Token from getUserToken:', token);
            const res = await api.get(`/practice-batch-video/${slug}`);
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default PracticeBatch;
