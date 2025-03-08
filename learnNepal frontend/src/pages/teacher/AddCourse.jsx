import { useState, useEffect, useRef } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import upload from "../../assets/image/file_upload_icon.svg";
import dropdown from "../../assets/image/dropdown_icon.svg";
import cross from "../../assets/image/cross_icon.svg";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  // Updated lectureDetails keys to match payload keys
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // Handle adding, toggling, and removing chapters
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      // Show the popup to enter the chapter name
      setShowChapterPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  // Function to confirm adding a chapter from the popup
  const confirmAddChapter = () => {
    if (newChapterTitle.trim() === "") {
      toast.error("Chapter title cannot be empty");
      return;
    }
    const newChapter = {
      chapterId: uniqid(),
      chapterTitle: newChapterTitle,
      chapterContent: [],
      collapsed: false,
      chapterOrder:
        chapters.length > 0
          ? chapters[chapters.length - 1].chapterOrder + 1
          : 1,
    };
    setChapters([...chapters, newChapter]);
    setNewChapterTitle("");
    setShowChapterPopup(false);
  };

  // Handle adding and removing lectures inside chapters
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            // Remove lecture at the given index from chapterContent
            const updatedLectures = [...chapter.chapterContent];
            updatedLectures.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedLectures };
          }
          return chapter;
        })
      );
    }
  };

  // Add a lecture to the current chapter
  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            lectureId: uniqid(),
            lectureTitle: lectureDetails.lectureTitle,
            lectureDuration: Number(lectureDetails.lectureDuration),
            lectureUrl: lectureDetails.lectureUrl,
            isPreviewFree: lectureDetails.isPreviewFree,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent[chapter.chapterContent.length - 1]
                    .lectureOrder + 1
                : 1,
          };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );
    setShowPopUp(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Thumbnail not selected");
      return;
    }
  
    // Format course data
    const formattedChapters = chapters.map(({ chapterId, chapterTitle, chapterOrder, chapterContent }) => ({
      chapterId,
      chapterTitle,
      chapterOrder,
      chapterContent: chapterContent.map(({ lectureId, lectureTitle, lectureDuration, lectureUrl, isPreviewFree, lectureOrder }) => ({
        lectureId,
        lectureTitle,
        lectureDuration,
        lectureUrl: lectureUrl instanceof File ? "" : lectureUrl, // Empty if it's a file
        isPreviewFree,
        lectureOrder,
      })),
    }));
  
    const payload = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: formattedChapters,
    };
  
    const formData = new FormData();
    formData.append("courseData", JSON.stringify(payload)); 
    formData.append("image", image); // ✅ Ensure field name matches multer.fields([{ name: "image", maxCount: 1 }])
  
    // 🔹 Add Video Files
    chapters.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (lecture.lectureUrl instanceof File) {
          formData.append("videos", lecture.lectureUrl); // ✅ Ensure field name matches multer.fields([{ name: "videos", maxCount: 50 }])
        }
      });
    });
  
    // ✅ Log FormData to Debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const token = localStorage.getItem("token");
      const { data } = await apiClient.post("/add-course", formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" // ✅ Ensure correct Content-Type
        },
      });
  
      if (data.success) {
        toast.success(data.message);
        quillRef.current.root.innerHTML = "";
        setCourseTitle("");
        setChapters([]);
        setImage(null);
        setDiscount(0);
        setCoursePrice(0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      toast.error("An error occurred while adding the course.");
    }
  };
  
  
  
  

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full text-gray-500"
      >
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
              required
            />
          </div>
          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label
              htmlFor="courseThumbnail"
              className="flex items-center gap-3"
            >
              <img
                src={upload}
                alt=""
                className="p-3 bg-blue-500 rounded cursor-pointer"
              />
              <input
                type="file"
                id="courseThumbnail"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              {image && (
                <img
                  className="max-h-10"
                  src={URL.createObjectURL(image)}
                  alt="Thumbnail Preview"
                />
              )}
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(Number(e.target.value))}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Chapters Section */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.chapterId}
              className="bg-white border rounded-lg mb-4"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    src={dropdown}
                    width={14}
                    alt="Toggle Chapter"
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">
                  {chapter.chapterContent.length} lecture(s)
                </span>
                <img
                  src={cross}
                  alt="Remove Chapter"
                  className="cursor-pointer"
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                />
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lecture.lectureId}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} -{" "}
                        {lecture.lectureDuration} mins -{" "}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          Link
                        </a>{" "}
                        - {lecture.isPreviewFree ? "Preview" : "Paid"}
                      </span>
                      <img
                        src={cross}
                        className="cursor-pointer"
                        alt="Remove Lecture"
                        onClick={() =>
                          handleLecture(
                            "remove",
                            chapter.chapterId,
                            lectureIndex
                          )
                        }
                      />
                    </div>
                  ))}
                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter("add")}
          >
            + Add Chapter
          </div>

          {/* Popup Modal for entering Chapter Name */}
          {showChapterPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-xs">
                <h2 className="text-lg font-semibold mb-4">
                  Enter Chapter Name
                </h2>
                <input
                  type="text"
                  placeholder="Chapter Name"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowChapterPopup(false);
                      setNewChapterTitle("");
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAddChapter}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lecture Pop-up */}
          {showPopUp && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-2">
  <p>Upload Lecture Video</p>
  <input
    type="file"
    accept="video/*"
    className="mt-1 block w-full border rounded py-1 px-2"
    onChange={(e) =>
      setLectureDetails({
        ...lectureDetails,
        lectureUrl: e.target.files[0], // Store the video file
      })
    }
  />
</div>


                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <p>Is Preview Free?</p>
                </div>

                <button
                  onClick={addLecture}
                  type="button"
                  className="w-full bg-blue-400 text-white px-4 py-2 rounded"
                >
                  Add Lecture
                </button>

                <img
                  onClick={() => setShowPopUp(false)}
                  src={cross}
                  alt="Close"
                  className="absolute top-4 right-4 w-4 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
