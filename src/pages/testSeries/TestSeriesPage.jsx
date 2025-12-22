import React, { useEffect, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'

import { FreeMode } from 'swiper/modules'
import TestPackageCollection from '../../components/savecollection/TestPackageCollection'

const TestSeriesPage = () => {
  const [selectedItems, setSelectedItems] = useState('Save Packages')
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const SaveCollectionsItem = [
    "Save Packages",
    // "Save Videos",
    // "Save Articles",
    // "Save Notes",
    // "Save Tests",
  ]

  // useEffect(() => {
  //   setSelectedItems(SaveCollectionsItem[0])
  // }, [])

  return (
    <div>


      <div className="p-4 border-b">
        {/* ✅ Horizontal Scroll with Swiper */}
        {/* <Swiper
          slidesPerView={1}
          spaceBetween={10}
          freeMode={true}
          breakpoints={{
            0: { slidesPerView: 1 },      // ✅ mobile & tablet
            1024: { slidesPerView: 5 }    // ✅ desktop
          }}
          modules={[FreeMode]}
        >
          {SaveCollectionsItem.map((item, index) => (
            <SwiperSlide className='py-3 px-3 ' onClick={() => setSelectedItems(item)} key={index}>
              <div className={`text-center rounded-xl py-2 px-2 shadow cursor-pointer ${selectedItems == item ? 'bg-blue-600 text-white' : 'bg-gray-100'} transition`}>
                <p className="text-xs sm:text-sm md:text-base lg:text-md font-normal">
                  {item}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}

        {/* नीचे आप अपनी collection component call कर सकते हैं */}
      </div>

      {
        selectedItems === "Save Packages" ? (

          <TestPackageCollection />
        ) : ('')
      }

    </div>
  )

};

export default TestSeriesPage;
