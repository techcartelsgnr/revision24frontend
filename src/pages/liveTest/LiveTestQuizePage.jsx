import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLiveQuizSlice } from "../../redux/LiveQuizeSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import LiveQuizCard from "./LiveQuizCard";
import Loading from "../../components/globle/Loading";

const LiveTestQuizePage = () => {
  const dispatch = useDispatch();
  const [quizData, setQuizData] = useState({});
  const [quizTypeKeys, setQuizTypeKeys] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [categoryKeys, setCategoryKeys] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewMode, setViewMode] = useState("not_attended"); // ✅ toggle state

  const getLiveQuiz = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getLiveQuizSlice()).unwrap();

      // console.log("res", res)
      if (res?.status_code === 200) {
        const notAttended = res.data?.not_attended_quizzes || {};
        const attended = res.data?.attended_quizzes || {};

        const data =
          viewMode === "not_attended" ? notAttended : attended;

        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          const typeKeys = Object.keys(data);
          const defaultType = typeKeys[0];
          const catKeys = Object.keys(data[defaultType]);
          const defaultCat = catKeys[0];

          setQuizTypeKeys(typeKeys);
          setSelectedType(defaultType);
          setCategoryKeys(catKeys);
          setSelectedCategory(defaultCat);
          setQuizData(data);
        } else {
          setQuizTypeKeys([]);
          setCategoryKeys([]);
          setQuizData({});
        }
      }
    } catch (error) {
      console.error("❌ ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLiveQuiz();
  }, [viewMode]); // ✅ fetch again when toggle changes

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Test Quizzes</h2>

      {/* Toggle Button */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("not_attended")}
          className={`px-4 py-2 rounded-lg font-medium ${
            viewMode === "not_attended"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Unattempted
        </button>
        <button
          onClick={() => setViewMode("attended")}
          className={`px-4 py-2 rounded-lg font-medium ${
            viewMode === "attended"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Attempted
        </button>
      </div>

      {/* Filter for Categories */}
      {categoryKeys.length > 0 && (
        <div className="mb-4">
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            className="!overflow-visible"
          >
            {categoryKeys.map((cat) => (
              <SwiperSlide key={cat} style={{ width: "auto" }}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded ${
                    selectedCategory === cat
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Show Quizzes */}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData[selectedType] &&
          quizData[selectedType][selectedCategory]?.length > 0 ? (
            quizData[selectedType][selectedCategory].map((quiz, index) => (
              <LiveQuizCard key={quiz.id} data={quiz} index={index} />
            ))
          ) : (
            <p>No quizzes available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveTestQuizePage;