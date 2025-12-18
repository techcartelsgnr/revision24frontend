// import React, { useEffect, useState } from "react";
// import { getUserDataDecrypted } from "../../helpers/userStorage";
// import { useNavigate } from "react-router-dom";

// const SettingPage = () => {
//   const nav = useNavigate();
//   const [userInfo, setUserInfo] = useState({
//     name: "Loading...",
//     email: "Loading...",
//     phone: "Loading...",
//     avatar: "https://via.placeholder.com/80",
//     city: "",
//     state: "",
//     walletBalance: "0",
//     referralCode: "",
//     subscriptionStatus: false,
//   });

//   const [loading, setLoading] = useState(true);

//   const settingsItems = [
//     {
//       icon: "👤",
//       title: "User Profile",
//       description: "Manage your personal information",
//       bgColor: "bg-blue-50",
//       iconColor: "text-blue-600",
//       onClick: () => nav("/user-dashboard"),
//     },
//     {
//       icon: "📱",
//       title: "Share",
//       description: "Tell your friends about this app",
//       bgColor: "bg-green-50",
//       iconColor: "text-green-600",
//       onClick: () => {
//         const shareText = `Check out this amazing app! Use my referral code: ${userInfo.referralCode}`;
//         if (navigator.share) {
//           navigator.share({
//             title: "Join me on this awesome app!",
//             text: shareText,
//             url: window.location.origin,
//           });
//         } else {
//           navigator.clipboard.writeText(
//             `${window.location.origin} - Referral Code: ${userInfo.referralCode}`
//           );
//           alert("App link and referral code copied to clipboard!");
//         }
//       },
//     },
//     {
//       icon: "💬",
//       title: "Support",
//       description: "Get help and contact support",
//       bgColor: "bg-pink-50",
//       iconColor: "text-pink-600",
//       onClick: () => nav("/help-support"),
//     },
//     {
//       icon: "🔒",
//       title: "Privacy Policy",
//       description: "Read our privacy policy",
//       bgColor: "bg-purple-50",
//       iconColor: "text-purple-600",
//       onClick: () => nav("/privacy-policy"),
//     },
//     {
//       icon: "📋",
//       title: "Terms & Conditions",
//       description: "View our terms and conditions",
//       bgColor: "bg-orange-50",
//       iconColor: "text-orange-600",
//       onClick: () => nav("/terms-of-service"),
//     },
//     {
//       icon: "💰",
//       title: "Refund Policy",
//       description: "View our terms and conditions",
//       bgColor: "bg-orange-50",
//       iconColor: "text-orange-600",
//       onClick: () => nav("/refund-policy"),
//     },
//     {
//       icon: "💰",
//       title: "Log Out",
//       description: "View our terms and conditions",
//       bgColor: "bg-orange-50",
//       iconColor: "text-orange-600",
//       onClick: () => nav("/refund-policy"),
//     },

//   ];

//   const loadUserData = async () => {
//     try {
//       const user = await getUserDataDecrypted();
//       // console.log("user data in setting page", user);

//       if (user) {
//         setUserInfo({
//           name: user.name || "User",
//           email: user.email || "No email",
//           phone: user.mobile || "No phone",
//           avatar: user.profile || "https://via.placeholder.com/80",
//           city: user.city || "",
//           state: user.state || "",
//           walletBalance: user.wallet_balance || "0",
//           referralCode: user.my_referral_code || "",
//           subscriptionStatus: user.subscription_status || false,
//         });
//       }
//     } catch (error) {
//       console.error("Error loading user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           <div className="text-gray-600 text-lg">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-8 sm:px-6 sm:py-12">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
//             Settings
//           </h1>
//           <p className="text-indigo-100 text-sm sm:text-base">
//             Manage your account and preferences
//           </p>
//         </div>
//       </div>

//       {/* User Profile Section */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
//           <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//             {/* Avatar */}
//             <div className="relative flex-shrink-0">
//               <img
//                 src={userInfo.avatar}
//                 alt="Profile"
//                 className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/112/6366f1/ffffff?text=User";
//                 }}
//               />
//               {/* <div className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center ring-4 ring-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
//                                 <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                                 </svg>
//                             </div> */}
//             </div>

//             {/* User Info */}
//             <div className="flex-1 text-center sm:text-left">
//               <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                 {userInfo.name}
//               </h3>
//               <p className="text-gray-600 text-lg mb-1">{userInfo.email}</p>
//               <p className="text-gray-500 mb-2">{userInfo.phone}</p>
//               {userInfo.city && userInfo.state && (
//                 <p className="text-gray-500 mb-3">
//                   {userInfo.city}, {userInfo.state}
//                 </p>
//               )}

//               {/* Status Badges */}
//               <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
//                 <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
//                   <span>💰</span>
//                   <span>₹{userInfo.walletBalance} Wallet</span>
//                 </div>
//                 {/* {userInfo.referralCode && (
//                   <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
//                     <span>🎯</span>
//                     <span>Code: {userInfo.referralCode}</span>
//                   </div>
//                 )} */}
//                 {userInfo.subscriptionStatus && (
//                   <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
//                     <span>⭐</span>
//                     <span>Premium Member</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Settings Menu */}
//       <div className="max-w-4xl mx-auto">
//         {settingsItems.map((item, index) => (
//           <div
//             key={index}
//             onClick={item.onClick}
//             className="group bg-white border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
//           >
//             <div className="px-4 py-6 sm:px-6 sm:py-8">
//               <div className="flex items-center space-x-4 sm:space-x-6">
//                 {/* Icon */}
//                 <div
//                   className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${item.bgColor} ${item.iconColor} group-hover:scale-105 transition-transform duration-200 shadow-sm`}
//                 >
//                   <span className="text-2xl sm:text-3xl">{item.icon}</span>
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <h4 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
//                     {item.title}
//                   </h4>
//                   <p className="text-sm sm:text-base text-gray-500">
//                     {item.description}
//                   </p>
//                 </div>

//                 {/* Arrow */}
//                 <div className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200">
//                   <svg
//                     className="h-6 w-6 sm:h-7 sm:w-7"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="relative bg-white border-t border-gray-200 mt-8 overflow-hidden">
//         {/* Bubbles */}
//         <div className="pointer-events-none absolute inset-0 z-0">
//           <div className="absolute left-10 bottom-0 w-6 h-6 bg-indigo-200 rounded-full opacity-40 animate-bounce-slow"></div>
//           <div className="absolute left-1/2 bottom-5 w-8 h-8 bg-blue-300 rounded-full opacity-30 animate-bounce-med"></div>
//           <div className="absolute right-16 bottom-2 w-5 h-5 bg-green-200 rounded-full opacity-50 animate-bounce-fast"></div>
//         </div>

//         <div className="relative z-10 max-w-4xl mx-auto px-4 py-2 sm:px-6 text-center">
//           <div className="flex flex-col items-center space-y-2">
//             {/* Logo + Brand Name */}
//             <div className="flex items-center gap-2">
//               <img
//                 src="/inline_logo.png"
//                 alt="Revision24 Logo"
//                 className="w-40 h-10 object-contain"
//               />
//             </div>
//             {/* Version with green dot */}
//             <div className="flex items-center justify-center gap-2">
//               <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               <span className="text-sm text-gray-500">Version 2.4.1</span>
//             </div>
//             {/* Copyright and Love */}
//             <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
//               ©️ 2025 : Made with{" "}
//               <span className="text-red-500 animate-bounce text-base">♥️</span>
//               in India
//             </p>
//           </div>
//         </div>
//         {/* Custom Bubble Animation Styles */}
//         <style>
//           {`
//       .animate-bounce-slow { animation: bubbleMove 7s infinite linear;}
//       .animate-bounce-med  { animation: bubbleMove 4.5s infinite linear;}
//       .animate-bounce-fast { animation: bubbleMove 3s infinite linear;}
//       @keyframes bubbleMove {
//         0% { transform: translateY(0) scale(1); opacity: .5;}
//         40% { opacity: .8;}
//         100% { transform: translateY(-70px) scale(.75); opacity: 0;}
//       }
//     `}
//         </style>
//       </div>
//     </div>
//   );
// };

// export default SettingPage;


import React, { useEffect, useState } from "react";
import { getUserDataDecrypted, clearUserData } from "../../helpers/userStorage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSlice } from "../../redux/authSlice";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";

const SettingPage = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    avatar: "https://via.placeholder.com/80",
    city: "",
    state: "",
    walletBalance: "0",
    referralCode: "",
    subscriptionStatus: false,
  });

  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const res = await dispatch(logoutSlice()).unwrap();
      await clearUserData();
      nav('/login');
      showSuccessToast(res.message);
    } catch (error) {
      await clearUserData();
      nav('/login');
      showErrorToast(error.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  const settingsItems = [
    {
      icon: "👤",
      title: "User Profile",
      description: "Manage your personal information",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      onClick: () => nav("/user-dashboard"),
    },
    {
      icon: "📱",
      title: "Share",
      description: "Tell your friends about this app",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      onClick: () => {
        const shareText = `Check out this amazing app! Use my referral code: ${userInfo.referralCode}`;
        if (navigator.share) {
          navigator.share({
            title: "Join me on this awesome app!",
            text: shareText,
            url: window.location.origin,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin} - Referral Code: ${userInfo.referralCode}`
          );
          alert("App link and referral code copied to clipboard!");
        }
      },
    },
    {
      icon: "💬",
      title: "Support",
      description: "Get help and contact support",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      onClick: () => nav("/help-support"),
    },
    {
      icon: "🔒",
      title: "Privacy Policy",
      description: "Read our privacy policy",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      onClick: () => nav("/privacy-policy"),
    },
    {
      icon: "📋",
      title: "Terms & Conditions",
      description: "View our terms and conditions",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      onClick: () => nav("/terms-of-service"),
    },
    {
      icon: "💰",
      title: "Refund Policy",
      description: "Learn about our refund process",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      onClick: () => nav("/refund-policy"),
    },
    {
      icon: "🚪",
      title: "Log Out",
      description: logoutLoading ? "Logging out..." : "Sign out of your account",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      onClick: handleLogout,
    },
  ];

  const loadUserData = async () => {
    try {
      const user = await getUserDataDecrypted();

      if (user) {
        setUserInfo({
          name: user.name || "User",
          email: user.email || "No email",
          phone: user.mobile || "No phone",
          avatar: user.profile || "https://via.placeholder.com/80",
          city: user.city || "",
          state: user.state || "",
          walletBalance: user.wallet_balance || "0",
          referralCode: user.my_referral_code || "",
          subscriptionStatus: user.subscription_status || false,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={userInfo.avatar}
                alt="Profile"
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/112/6366f1/ffffff?text=User";
                }}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {userInfo.name}
              </h3>
              <p className="text-gray-600 text-lg mb-1">{userInfo.email}</p>
              <p className="text-gray-500 mb-2">{userInfo.phone}</p>
              {userInfo.city && userInfo.state && (
                <p className="text-gray-500 mb-3">
                  {userInfo.city}, {userInfo.state}
                </p>
              )}

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                  <span>💰</span>
                  <span>₹{userInfo.walletBalance} Wallet</span>
                </div>
                {userInfo.subscriptionStatus && (
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                    <span>⭐</span>
                    <span>Premium Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="max-w-4xl mx-auto">
        {settingsItems.map((item, index) => (
          <div
            key={index}
            onClick={logoutLoading && item.title === "Log Out" ? null : item.onClick}
            className={`group bg-white border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${logoutLoading && item.title === "Log Out" ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
          >
            <div className="px-4 py-6 sm:px-6 sm:py-8">
              <div className="flex items-center space-x-4 sm:space-x-6">
                {/* Icon */}
                <div
                  className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl ${item.bgColor} ${item.iconColor} group-hover:scale-105 transition-transform duration-200 shadow-sm`}
                >
                  {logoutLoading && item.title === "Log Out" ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  ) : (
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-500">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative bg-white border-t border-gray-200 mt-8 overflow-hidden">
        {/* Bubbles */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-10 bottom-0 w-6 h-6 bg-indigo-200 rounded-full opacity-40 animate-bounce-slow"></div>
          <div className="absolute left-1/2 bottom-5 w-8 h-8 bg-blue-300 rounded-full opacity-30 animate-bounce-med"></div>
          <div className="absolute right-16 bottom-2 w-5 h-5 bg-green-200 rounded-full opacity-50 animate-bounce-fast"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-2 sm:px-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-2">
              <img
                src="/inline_logo.png"
                alt="Revision24 Logo"
                className="w-40 h-10 object-contain"
              />
            </div>
            {/* Version with green dot */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-500">Version 2.4.1</span>
            </div>
            {/* Copyright and Love */}
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              ©️ 2025 : Made with{" "}
              <span className="text-red-500 animate-bounce text-base">♥️</span>
              in India
            </p>
          </div>
        </div>
        {/* Custom Bubble Animation Styles */}
        <style>
          {`
      .animate-bounce-slow { animation: bubbleMove 7s infinite linear;}
      .animate-bounce-med  { animation: bubbleMove 4.5s infinite linear;}
      .animate-bounce-fast { animation: bubbleMove 3s infinite linear;}
      @keyframes bubbleMove {
        0% { transform: translateY(0) scale(1); opacity: .5;}
        40% { opacity: .8;}
        100% { transform: translateY(-70px) scale(.75); opacity: 0;}
      }
    `}
        </style>
      </div>
    </div>
  );
};

export default SettingPage;
