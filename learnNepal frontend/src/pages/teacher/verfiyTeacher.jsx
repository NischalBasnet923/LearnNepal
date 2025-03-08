import apiClient from "../../api/axios";
import { useState, useEffect } from "react";
import letter from "../../assets/image/undraw_letter_ombg.png";
export default function VerifyTeacher() {
  const [hasRequest, setHasRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullname: "",
    education: "",
    expertise: "",
    experience: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiClient.get("/teacher-request", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHasRequest(res.data.hasRequest);
      } catch (err) {
        console.error("Error checking teacher request:", err);
      } finally {
        setLoading(false);
      }
    };
    checkRequestStatus();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificate(file);
      setCertificatePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("education", formData.education);
      data.append("expertise", formData.expertise);
      data.append("experience", formData.experience);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }
      if (certificate) {
        data.append("certificate", certificate);
      }

      const token = localStorage.getItem("token");
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      await apiClient.post("/verify-teacher", data, config);

      setFormData({
        fullname: "",
        education: "",
        expertise: "",
        experience: "",
      });
      setProfileImage(null);
      setCertificate(null);
      setProfileImagePreview(null);
      setCertificatePreview(null);
      setHasRequest(true);
    } catch (err) {
      console.error("Error submitting teacher request:", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (hasRequest) {
    return (
      <div className="w-[40%] m-auto mt-10 text-center">
        <img src={letter} alt="" className="w-56 h-56 mx-auto mb-4"/>
        <h2 className="text-2xl font-medium mb-4 text-gray-800">
          You have already submitted a teacher request.
        </h2>
        <p className="text-gray-600 mb-6">
          Our team will review it shortly. Thank you!
        </p>
        <button
          onClick={() => {
            // Toggle back so form is shown again
            setHasRequest(false);
          }}
          className="bg-blue-500 text-white py-2 px-6 rounded font-medium"
        >
          Resend
        </button>
      </div>
    );
  }

  return (
    <div className="w-[40%] m-auto">
      <h1 className="text-3xl font-medium text-center mb-8 text-gray-800">
        Teacher Verification
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-8">
          <div className="relative">
            {profileImagePreview && (
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="absolute w-24 h-24 object-cover rounded-full"
              />
            )}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {!profileImagePreview && (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={handleProfileUpload}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label htmlFor="fullname" className="block text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="education" className="block text-sm mb-1">
              Education
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="expertise" className="block text-sm mb-1">
              Expertise
            </label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="experience" className="block text-sm mb-1">
            Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm mb-1">Certificate</label>
          <div className="border border-dashed border-gray-300 rounded p-8">
            {certificatePreview && (
              <div className="mb-4">
                <img
                  src={certificatePreview}
                  alt="Certificate Preview"
                  className="mx-auto"
                />
              </div>
            )}
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 13h6m-3-3v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <label className="text-sm text-gray-500 cursor-pointer">
                Upload your teaching certificate
                <input
                  type="file"
                  className="hidden"
                  onChange={handleCertificateUpload}
                  accept="image/*"
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded font-medium"
          >
            Submit Verification
          </button>
        </div>
      </form>
    </div>
  );
}
