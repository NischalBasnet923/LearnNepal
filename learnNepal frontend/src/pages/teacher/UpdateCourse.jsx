import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';
import upload from '../../assets/image/file_upload_icon.svg';
import dropdown from '../../assets/image/dropdown_icon.svg';
import cross from '../../assets/image/cross_icon.svg';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [courseDescriptionText, setCourseDescriptionText] = useState(''); // New state for course description
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [chapters, setChapters] = useState([]);
  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Separate useEffect to handle the API data fetch
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/api/course/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.courseData) {
          const course = data.courseData;

          // Set basic course info
          setCourseTitle(course.courseTitle || '');
          setCoursePrice(course.coursePrice || 0);
          setDiscount(course.discount || 0);
          setCurrentImage(course.courseThumbnail || '');
          setCourseDescriptionText(
            course.courseDescription?.replace(/<[^>]*>/g, '') || ''
          );
          // Format chapters data
          if (
            course.chapters &&
            Array.isArray(course.chapters) &&
            course.chapters.length > 0
          ) {
            const formattedChapters = course.chapters.map((chapter) => {
              return {
                chapterId: chapter.id,
                chapterTitle: chapter.chapterTitle || '',
                chapterOrder: chapter.chapterOrder || 0,
                collapsed: false,
                chapterContent:
                  chapter.lectures && Array.isArray(chapter.lectures)
                    ? chapter.lectures.map((lecture) => ({
                        lectureId: lecture.id,
                        lectureTitle: lecture.title || '',
                        lectureDuration: lecture.duration || 0,
                        lectureUrl: lecture.contentUrl || '',
                        isPreviewFree: lecture.isPreview || false,
                        lectureOrder: lecture.lectureOrder || 0,
                      }))
                    : [],
              };
            });

            console.log('Formatted Chapters:', formattedChapters);
            setChapters(formattedChapters);
          } else {
            console.log('No chapters found or empty chapters array');
            setChapters([]);
          }
        } else {
          console.log('API response issue:', data);
          toast.error('Course not found or invalid response format!');
          navigate('/dashboard/my-courses');
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
        toast.error('Error loading course data: ' + error.message);
        navigate('/dashboard/my-courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/getCategory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCategories(data.category);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handlers for chapters and lectures
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      setShowChapterPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const confirmAddChapter = () => {
    if (newChapterTitle.trim() === '') {
      toast.error('Chapter title cannot be empty');
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
    setNewChapterTitle('');
    setShowChapterPopup(false);
  };

  // Handle adding and removing lectures inside chapters
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedLectures = [...chapter.chapterContent];
            updatedLectures.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedLectures };
          }
          return chapter;
        })
      );
    }
  };

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
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image && !currentImage) {
      toast.error('Thumbnail not selected');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    const formattedChapters = chapters.map(
      ({ chapterId, chapterTitle, chapterOrder, chapterContent }) => ({
        chapterId,
        chapterTitle,
        chapterOrder,
        chapterContent: chapterContent.map(
          ({
            lectureId,
            lectureTitle,
            lectureDuration,
            lectureUrl,
            isPreviewFree,
            lectureOrder,
          }) => ({
            lectureId,
            lectureTitle,
            lectureDuration,
            lectureUrl: lectureUrl instanceof File ? '' : lectureUrl,
            isPreviewFree,
            lectureOrder,
          })
        ),
      })
    );

    const payload = {
      courseTitle,
      courseDescription: courseDescriptionText, // assuming Quill was removed
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: formattedChapters,
      categories: selectedCategories,
      isPublished: true,
    };

    const formData = new FormData();
    formData.append('courseData', JSON.stringify(payload));
    if (image) formData.append('image', image);

    console.log(formData);

    chapters.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (lecture.lectureUrl instanceof File) {
          formData.append('videos', lecture.lectureUrl);
        }
      });
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/updateCourse/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Course updated successfully');
        setTimeout(() => {
          navigate('/teacher/my-courses');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('An error occurred while updating the course.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Course Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Course Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label
                  htmlFor="courseTitle"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  id="courseTitle"
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Enter course title"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <select
                  id="category"
                  value={selectedCategories[0] || ''}
                  onChange={(e) => setSelectedCategories([e.target.value])}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.categoryTitle} value={cat.categoryTitle}>
                      {cat.categoryTitle}
                    </option>
                  ))}
                </select>
              </div>

              <label
                htmlFor="courseDescription"
                className="block text-sm font-medium text-gray-700 mb-1">
                Course Description
              </label>
              <textarea
                id="courseDescription"
                value={courseDescriptionText}
                onChange={(e) => setCourseDescriptionText(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px]"
                placeholder="Enter course description"
                required></textarea>
              <div>
                <label
                  htmlFor="coursePrice"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Course Price ($)
                </label>
                <input
                  id="coursePrice"
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  max={100}
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="courseThumbnail"
                    className="flex items-center justify-center h-32 w-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Thumbnail"
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : currentImage ? (
                      <img
                        src={currentImage}
                        alt="Thumbnail"
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="space-y-1 text-center">
                        <img
                          src={upload}
                          alt="Upload"
                          className="mx-auto h-10 w-10"
                        />
                        <p className="text-xs text-gray-500">Upload Image</p>
                      </div>
                    )}
                    <input
                      id="courseThumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="sr-only"
                    />
                  </label>
                  {(image || currentImage) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setCurrentImage('');
                      }}
                      className="text-sm text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Course Content
            </h2>

            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <div
                  key={chapter.chapterId}
                  className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleChapter('toggle', chapter.chapterId)
                        }
                        className="mr-2 focus:outline-none">
                        <img
                          src={dropdown}
                          width={14}
                          alt="Toggle"
                          className={`transition-transform duration-200 ${
                            chapter.collapsed ? '-rotate-90' : ''
                          }`}
                        />
                      </button>
                      <span className="font-medium text-gray-800">
                        Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {chapter.chapterContent.length} lecture
                        {chapter.chapterContent.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleChapter('remove', chapter.chapterId)
                        }
                        className="text-gray-400 hover:text-red-500 focus:outline-none">
                        <img src={cross} width={14} alt="Remove" />
                      </button>
                    </div>
                  </div>

                  {!chapter.collapsed && (
                    <div className="p-4 bg-white">
                      <div className="space-y-2 mb-4">
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                          <div
                            key={lecture.lectureId}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium text-gray-700">
                                {lectureIndex + 1}. {lecture.lectureTitle}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="mr-3">
                                  {lecture.lectureDuration} min
                                </span>
                                {lecture.isPreviewFree && (
                                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-3">
                                    Free Preview
                                  </span>
                                )}
                                {lecture.lectureUrl && (
                                  <span className="text-indigo-600">
                                    {lecture.lectureUrl instanceof File
                                      ? lecture.lectureUrl.name
                                      : 'Video URL'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleLecture(
                                  'remove',
                                  chapter.chapterId,
                                  lectureIndex
                                )
                              }
                              className="text-gray-400 hover:text-red-500 focus:outline-none">
                              <img src={cross} width={12} alt="Remove" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLecture('add', chapter.chapterId)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        + Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleChapter('add')}
                className="w-full flex justify-center items-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 focus:outline-none">
                + Add Chapter
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Update Course
            </button>
          </div>
        </form>
      </div>

      {/* Chapter Modal */}
      {showChapterPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setShowChapterPopup(false);
              setNewChapterTitle('');
            }}></div>
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Chapter
            </h3>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Enter chapter title"
              className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowChapterPopup(false);
                  setNewChapterTitle('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAddChapter}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lecture Modal */}
      {showPopUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowPopUp(false)}></div>
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Lecture
              </h3>
              <button
                type="button"
                onClick={() => setShowPopUp(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <img src={cross} width={16} alt="Close" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="lectureTitle"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Title
                </label>
                <input
                  id="lectureTitle"
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  placeholder="Enter lecture title"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="lectureDuration"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  id="lectureDuration"
                  type="number"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                  placeholder="Enter duration in minutes"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="lectureVideo"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Video
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <img
                      src={upload}
                      className="mx-auto h-12 w-12"
                      alt="Upload"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="lectureVideo"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="lectureVideo"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={(e) =>
                            setLectureDetails({
                              ...lectureDetails,
                              lectureUrl: e.target.files[0],
                            })
                          }
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or other video formats
                    </p>
                    {lectureDetails.lectureUrl instanceof File && (
                      <p className="text-sm text-indigo-600 truncate max-w-xs mx-auto mt-2">
                        {lectureDetails.lectureUrl.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="isPreviewFree"
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPreviewFree"
                  className="ml-2 block text-sm text-gray-700">
                  Make this lecture available as a free preview
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={addLecture}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCourse;
