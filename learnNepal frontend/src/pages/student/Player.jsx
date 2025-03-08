import React from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import humanizeDuration from "humanize-duration";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tickIcon from "../../assets/image/blue_tick_icon.svg";
import play from "../../assets/image/play_icon.svg";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [coursesData, setCoursesData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCoursesData(course);
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-revers md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left side */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {coursesData &&
              coursesData.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2 px-2">
                      <p
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      >
                        {} ▾{" "}
                      </p>
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.lectures.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-44 pr-444 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.lectures.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={false ? tickIcon : play}
                            alt="icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.title} </p>
                            <div className="flex gap-2">
                              {lecture.contentUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.duration * 60 * 1000,
                                  {
                                    units: ["h", "m"],
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={0}/>
          </div>
        </div>

        {/* right side */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.contentUrl.split("/").pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex items-center justify-between mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.title}
                </p>
                <button className="text-blue-600">
                  {false ? "Completed" : "Mark as Completed"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={coursesData ? coursesData.courseThumbnail : "ab"}
              alt=""
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
