// OLD CODE
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/authPage/LoginPage';
import RegisterPage from './pages/authPage/RegisterPage';
import RegisterOtpVerifyPage from './pages/authPage/RegisterOtpVerifyPage';
import UserDetailsPage from './pages/authPage/UserDetailsPage';
import RegisterSetPasswordPage from './pages/authPage/RegisterSetPaswordPage';

import WalletPage from './pages/WalletPage';
import TestPagesPage from './pages/testSeries/TestPagesPage';
import Screen1 from './pages/testSeries/Screen1';
import Screen2 from './pages/testSeries/Screen2';
import Screen3 from './pages/testSeries/Screen3';
import Screen4 from './pages/testSeries/Screen4';
import Screen5 from './pages/testSeries/Screen5';
import Screen6 from './pages/testSeries/Screen6';
import Screen7 from './pages/testSeries/Screen7';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';

import AboutUsPage from './pages/AboutUsPage';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import TestSeriesPage from './pages/testSeries/TestSeriesPage';
import PaymentSuccess from './pages/PaymentSuccess';
import UserDashboard from './pages/UserDashboard';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ForgotPasswordPage from './pages/authPage/forgotpage/ForgotPasswordPage';
import ForgotPasswordOtpPage from './pages/authPage/forgotpage/ForgotPasswordOtpPage';
import SetNewPasswordPage from './pages/authPage/forgotpage/SetNewPasswordPage';
import PrivacyPolicy from './pages/PrivacyPolicyPage';
import RefundPolicy from './pages/RefundPolicyPage';
import Clarity from '@microsoft/clarity';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import CashfreeCheckoutPage from './pages/CashfreeCheckoutPage';
import AppPaymentResponse from './pages/AppPaymentResponse';
import SubscriptionCheckout from './pages/app_pages/SubscriptionCheckout';
import SubscriptionRespose from './pages/app_pages/SubscriptionRespose';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import { useEffect } from 'react';
import MyTransactionPage from './pages/MyTransactionPage';
import MySavedCollectionPage from './pages/MySavedCollectionPage';
import HelpAndSupportPage from './pages/HelpAndSupportPage';
import LiveTestQuizePage from './pages/liveTest/LiveTestQuizePage';
import LiveClassesPage from './pages/liveVideo/LiveClassesPage';
import TopicsWiseTestPage from './pages/freeTests/TopicsWiseTestPage';
import PreviousYearTestSeries from './pages/pyp_test/PreviousYearTestSeries';
import SideBarLayout from './components/globle/SideBarLayout';
import PreviouseYearInstructionPage from './pages/pyp_test/PreviouseYearInstructionPage';
import PreviouseYearSymbolPage from './pages/pyp_test/PreviouseYearSymbolPage';
import PreviouseYearExamPage from './pages/pyp_test/PreviouseYearExamPage';
import PreviouseYearResultPage from './pages/pyp_test/PreviouseYearResultPage';
import PreviouseYearExamSolutionsPage from './pages/pyp_test/PreviouseYearExamSolutionsPage';
import LiveQuizeInstructionsPage from './pages/liveTest/LiveQuizeInstructionsPage';
import LiveQuizAttendPage from './pages/liveTest/LiveQuizAttendPage';
import CurrentAffairesPage from './pages/currentAffair&Notes/CurrentAffairesPage';
import CurrentAffairesdetailsPage from './pages/currentAffair&Notes/CurrentAffairesdetailsPage';
import LiveQuizAnalysisPage from './pages/liveTest/LiveQuizAnalysisPage';
import LiveQuizSokutionPage from './pages/liveTest/LiveQuizSokutionPage';
import AccountDeletePage from './pages/AccountDeletePage';
import NotesPdfPage from './pages/currentAffair&Notes/NotesPdfPage';
import TopicTestInstructions from './pages/freeTests/topictest/TopicTestInstructions';
import TopicTestAttendQuiz from './pages/freeTests/topictest/TopicTestAttendQuiz';
import TopicTestResult from './pages/freeTests/topictest/TopicTestResult';
import Allmaganizes from './pages/maganizes/Allmaganizes';
import PdfViewerEditor from './pages/pdfView/PdfViewers';
import Allfreequizs from './pages/freeQuiz/Allfreequizs';
import SettingPage from './pages/setting/SettingPage';
import AttemptedTestPage from './pages/attempted/AttemptedTestPage';
import FreequizesInstructions from './pages/freeQuiz/FreequizesInstructions';
import FreequizeAttend from './pages/freeQuiz/FreequizeAttend';
import GkCapage from './pages/freeTests/gk&currentAffers/GkCapage';
import GkCaTestInstructions from './pages/freeTests/gk&currentAffers/GkCaTestInstructions';
import GkCAtestPage from './pages/freeTests/gk&currentAffers/Gk&CAtestPage';
import RRBTestPage from './pages/RRBTEST/RRBTestPage';
import RRBInstructionPage2 from './pages/RRBTEST/RRBInstructionPage2';
import RRBInstructionPage from './pages/RRBTEST/RRBInstructionPage';
import Doubts from './pages/doubts/Doubts';
import PracticeBatch from './pages/practiceBatch/PracticeBatch';
import BatchVideos from './pages/practiceBatch/BatchVideos';
import PurchasedBatch from './pages/practiceBatch/PurchasedBatch';
import SubscriptionPaymentSummery from './pages/SubscriptionPaymentSummery';
import PracticeBatchPaymentSummery from './pages/practiceBatch/PracticeBatchPaymentSummery';
import StudyMaterial from './pages/studyMaterial/StudyMaterial';

function App() {
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   const handleKeyDown = (e) => {
  //     const key = e.key.toUpperCase();

  //     // Disable Right Click
  //     if (e.type === 'contextmenu') {
  //       e.preventDefault();
  //     }

  //     // Disable F12
  //     if (key === 'F12') {
  //       e.preventDefault();
  //     }

  //     // Disable Ctrl/Cmd + Shift + [I, J, C]
  //     if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(key)) {
  //       e.preventDefault();
  //     }

  //     // Disable Ctrl/Cmd + U (view source)
  //     if ((e.ctrlKey || e.metaKey) && key === 'U') {
  //       e.preventDefault();
  //     }

  //     // ✅ Mac-specific: Shift + Command + C (again handled above, but extra sure)
  //     if (e.metaKey && e.shiftKey && key === 'C') {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);


  useEffect(() => {
    Clarity.init('sjskd9cztm'); // Replace with your real Clarity ID
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ALWAYS ACCESSIBLE ROUTE */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/subscription" element={<SideBarLayout><SubscriptionPage /></SideBarLayout>} />
        <Route path="/subscription-payment-summary" element={<SideBarLayout><SubscriptionPaymentSummery /></SideBarLayout>} />
        <Route path="/user-account-delete" element={<AccountDeletePage />} />
        {/* <Route path="/test-series" element={<TestSeriesPage />} /> */}
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/cashfree-payment" element={<CashfreeCheckoutPage />} />
        <Route path="/app-payment-response" element={<AppPaymentResponse />} />
        <Route path="/app-subscription-checkout" element={<SubscriptionCheckout />} />
        <Route path="/app-subscription-response" element={<SubscriptionRespose />} />


        {/* PUBLIC ONLY ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<RegisterOtpVerifyPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/user-set-password" element={<RegisterSetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password-verify-otp" element={<ForgotPasswordOtpPage />} />
          <Route path="/reset-password" element={<SetNewPasswordPage />} />

        </Route>

        {/* PROTECTED ROUTES */}
        {/* <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/testpakages" element={<TestPagesPage />} />
          <Route path="/system-info" element={<Screen1 />} />
          <Route path="/test-login" element={<Screen2 />} />
          <Route path="/instructions" element={<Screen3 />} />
          <Route path="/symbols" element={<Screen4 />} />
          <Route path="/analysis" element={<Screen6 />} />
          <Route path="/test-solutions" element={<Screen7 />} />
        </Route> */}

        <Route path="/payment-response" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<SideBarLayout> <UserDashboard /></SideBarLayout>} />
        <Route path="/wallet" element={<SideBarLayout><WalletPage /></SideBarLayout>} />
        <Route path="/testpakages" element={<SideBarLayout><TestPagesPage /></SideBarLayout>} />
        <Route path="/system-info" element={<ProtectedRoute><Screen1 /></ProtectedRoute>} />
        <Route path="/test-login" element={<ProtectedRoute><Screen2 /></ProtectedRoute>} />
        <Route path="/instructions" element={<ProtectedRoute><Screen3 /></ProtectedRoute>} />
        <Route path="/symbols" element={<ProtectedRoute><Screen4 /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Screen6 /></ProtectedRoute>} />
        <Route path="/scc-mock-test" element={<ProtectedRoute><Screen5 /></ProtectedRoute>} />
        <Route path="/test-solutions" element={<ProtectedRoute><Screen7 /></ProtectedRoute>} />
        <Route path="/my-transaction" element={<SideBarLayout><MyTransactionPage /></SideBarLayout>} />
        <Route path="/saved-items" element={<SideBarLayout><MySavedCollectionPage /></SideBarLayout>} />
        <Route path="/help-support" element={<SideBarLayout><HelpAndSupportPage /></SideBarLayout>} />

        <Route path="/live-classes" element={<SideBarLayout><LiveClassesPage /></SideBarLayout>} />
        <Route path="/test-series" element={<SideBarLayout><TestSeriesPage /></SideBarLayout>} />
        <Route path="/setting" element={<SideBarLayout><SettingPage /></SideBarLayout>} />

        {/* PREVIOUS YEAR ROUTES */}
        <Route path="/previous-papers" element={<SideBarLayout><PreviousYearTestSeries /></SideBarLayout>} />
        <Route path="/previous-instruction" element={<ProtectedRoute><PreviouseYearInstructionPage /></ProtectedRoute>} />
        <Route path="/previous-symbol" element={<ProtectedRoute><PreviouseYearSymbolPage /></ProtectedRoute>} />
        <Route path="/previous-test" element={<ProtectedRoute><PreviouseYearExamPage /></ProtectedRoute>} />
        <Route path="/previous-analysis" element={<ProtectedRoute><PreviouseYearResultPage /></ProtectedRoute>} />
        <Route path="/previouse-year-exam-solutions" element={<ProtectedRoute><PreviouseYearExamSolutionsPage /></ProtectedRoute>} />

        {/* LIVE QUIZ TEST PRACTICE */}
        <Route path="/live-quiz-test" element={<SideBarLayout><LiveTestQuizePage /></SideBarLayout>} />
        <Route path="/live-quiz-instruction" element={<ProtectedRoute><LiveQuizeInstructionsPage /></ProtectedRoute>} />
        <Route path="/live-quiz-attends" element={<ProtectedRoute><LiveQuizAttendPage /></ProtectedRoute>} />
        <Route path="/live-quiz-analysis" element={<ProtectedRoute><LiveQuizAnalysisPage /></ProtectedRoute>} />
        <Route path="/live-quiz-solution" element={<ProtectedRoute><LiveQuizSokutionPage /></ProtectedRoute>} />

        {/* /Online TEST ROUTES */}
        <Route path="/online-exam" element={<ProtectedRoute><RRBTestPage /></ProtectedRoute>} />
        <Route path="/online-exam-specific-instruction" element={<ProtectedRoute><RRBInstructionPage2 /></ProtectedRoute>} />
        <Route path="/online-exam-general-instruction" element={<ProtectedRoute><RRBInstructionPage /></ProtectedRoute>} />

        {/* FREE TEST ROUTES */}
        <Route path="/current-affairs" element={<SideBarLayout><CurrentAffairesPage /></SideBarLayout>} />
        <Route path="/current-affairs-details" element={<SideBarLayout><CurrentAffairesdetailsPage /></SideBarLayout>} />
        <Route path="/pdf-notes" element={<SideBarLayout><NotesPdfPage /></SideBarLayout>} />
        <Route path="/pdf-viewer" element={<SideBarLayout><PdfViewerEditor /></SideBarLayout>} />
         
        {/* Study Material */}
        <Route path="/study-material" element={<SideBarLayout><StudyMaterial /></SideBarLayout>} />
        
        {/* Topic test */}
        <Route path="/practice" element={<SideBarLayout><TopicsWiseTestPage /></SideBarLayout>} />
        <Route path="/practice-test-instruction" element={<SideBarLayout><TopicTestInstructions /></SideBarLayout>} />
        <Route path="/practice-test-attend-quiz" element={<ProtectedRoute><TopicTestAttendQuiz /></ProtectedRoute>} />
        <Route path="/practice-test-result" element={<SideBarLayout><TopicTestResult /></SideBarLayout>} />
        <Route path="/attempted-test" element={<SideBarLayout><AttemptedTestPage /></SideBarLayout>} />

        {/* Free quizes */}
        <Route path="/free-quizes" element={<SideBarLayout><Allfreequizs /></SideBarLayout>} />
        <Route path="/free-quizes-instruction" element={<SideBarLayout><FreequizesInstructions /></SideBarLayout>} />
        <Route path="/free-quizes-attend" element={<ProtectedRoute><FreequizeAttend /></ProtectedRoute>} />

        {/* GK & CA */}
        <Route path="/gk&ca-page" element={<SideBarLayout><GkCapage /></SideBarLayout>} />
        <Route path="/gk-ca-test-instruction" element={<SideBarLayout><GkCaTestInstructions /></SideBarLayout>} />
        <Route path="/gk-test-attend" element={<ProtectedRoute><GkCAtestPage /></ProtectedRoute>} />

        {/* Doubts */}
        <Route path="/doubts" element={<SideBarLayout><Doubts /></SideBarLayout>} />

        {/* Maganizes routes */}
        <Route path="/all-magazies" element={<SideBarLayout><Allmaganizes /></SideBarLayout>} />

        {/* Practice Batch routes */}
        <Route path="/all-batches" element={<SideBarLayout><PracticeBatch /></SideBarLayout>} />
        <Route path="/practice-batch-payment-summery" element={<SideBarLayout><PracticeBatchPaymentSummery /></SideBarLayout>} />
        <Route path="/batch-videos/:slug" element={<SideBarLayout><BatchVideos /></SideBarLayout>} />
        <Route path="/purchased-batch" element={<SideBarLayout><PurchasedBatch /></SideBarLayout>} />


        {/* ❗️ Catch-all route outside PublicRoute */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}

export default App;




// NEW CODE

// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// import LoginPage from './pages/authPage/LoginPage';
// import RegisterPage from './pages/authPage/RegisterPage';
// import RegisterOtpVerifyPage from './pages/authPage/RegisterOtpVerifyPage';
// import UserDetailsPage from './pages/authPage/UserDetailsPage';
// import RegisterSetPasswordPage from './pages/authPage/RegisterSetPaswordPage';

// import WalletPage from './pages/WalletPage';
// import TestPagesPage from './pages/testSeries/TestPagesPage';
// import Screen1 from './pages/testSeries/Screen1';
// import Screen2 from './pages/testSeries/Screen2';
// import Screen3 from './pages/testSeries/Screen3';
// import Screen4 from './pages/testSeries/Screen4';
// import Screen5 from './pages/testSeries/Screen5';
// import Screen6 from './pages/testSeries/Screen6';
// import Screen7 from './pages/testSeries/Screen7';

// import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './utils/PublicRoute';

// import AboutUsPage from './pages/AboutUsPage';
// import HomePage from './pages/HomePage';
// import SubscriptionPage from './pages/SubscriptionPage';
// import TestSeriesPage from './pages/testSeries/TestSeriesPage';
// import PaymentSuccess from './pages/PaymentSuccess';
// import UserDashboard from './pages/UserDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* ALWAYS ACCESSIBLE ROUTE */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<AboutUsPage />} />
//         <Route path="/subscription" element={<SubscriptionPage />} />
//         <Route path="/test-series" element={<TestSeriesPage />} />

//         {/* PUBLIC ONLY ROUTES */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/verify-otp" element={<RegisterOtpVerifyPage />} />
//           <Route path="/user-details" element={<UserDetailsPage />} />
//           <Route path="/user-set-password" element={<RegisterSetPasswordPage />} />
//         </Route>

//         {/* PROTECTED ROUTES */}
//         <Route path="/payment-response" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
//         <Route path="/user-dashboard" element={<ProtectedRoute> <UserDashboard /></ProtectedRoute>} />
//         <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
//         <Route path="/testpakages" element={<ProtectedRoute><TestPagesPage /></ProtectedRoute>} />
//         <Route path="/system-info" element={<ProtectedRoute><Screen1 /></ProtectedRoute>} />
//         <Route path="/test-login" element={<ProtectedRoute><Screen2 /></ProtectedRoute>} />
//         <Route path="/instructions" element={<ProtectedRoute><Screen3 /></ProtectedRoute>} />
//         <Route path="/symbols" element={<ProtectedRoute><Screen4 /></ProtectedRoute>} />
// <Route path="/scc-mock-test" element={<ProtectedRoute><Screen5 /></ProtectedRoute>} />
//         <Route path="/analysis" element={<ProtectedRoute><Screen6 /></ProtectedRoute>} />
//         <Route path="/test-solutions" element={<ProtectedRoute><Screen7 /></ProtectedRoute>} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;









