import React from 'react'

const Videos = () => {
  const VideosList = [
    'videos/1.mp4',
    'videos/2.mp4',
    'videos/3.mp4',
    'videos/4.mp4',
    'videos/5.mp4',
  ]
  return (
    <div className="mt-28 px-4 md:px-6 lg:px-8 xl:px-10">
      <h2 className="headingColor">فيديوهات من اعمالنا</h2>
      <span className="headingBorderColor"></span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {VideosList.map((video) => {
          return (
            <div className="w-full h-full" key={video}>
              <video src={video} controls className="w-full h-full"></video>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Videos
