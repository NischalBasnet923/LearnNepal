import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../../api/axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { useNavigate } from 'react-router-dom';

const Request = () => {
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { isAdmin } = useContext(AppContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState({});
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    expertise: '',
    status: '', // "verified", "pending", "declined" or ""
  });

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiClient.get('/getRequest', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setRequestData(data.requests);
        setFilteredData(data.requests); // Initialize filtered data with all requests
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!requestData.length) return;

    let filtered = [...requestData];

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((request) => {
        const createdAt = new Date(request.createdAt);
        return createdAt >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((request) => {
        const createdAt = new Date(request.createdAt);
        return createdAt <= toDate;
      });
    }

    if (filters.expertise.trim()) {
      const expertiseSearch = filters.expertise.toLowerCase().trim();
      filtered = filtered.filter((request) =>
        request.expertise.toLowerCase().includes(expertiseSearch)
      );
    }

    if (filters.status === 'verified') {
      filtered = filtered.filter((request) => request.isVerified);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter(
        (request) => !request.isVerified && !request.message
      );
    } else if (filters.status === 'declined') {
      filtered = filtered.filter((request) => request.message);
    }

    setFilteredData(filtered);
  }, [filters, requestData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      expertise: '',
      status: '',
    });
  };

  const handleImageError = (id) => {
    setImageError((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const getCertificateFileName = (url) => {
    if (!url) return 'No certificate';

    try {
      const urlParts = new URL(url);
      const pathSegments = urlParts.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      // If URL parsing fails, just return the last part of the path
      return url.split('/').pop();
    }
  };

  const getCertificateUrl = (url) => {
    if (!url) return null;
    return url; // Return the URL as is, since it's already a complete URL
  };

  const handlePreviewClick = (request) => {
    setPreviewImage({
      url: getCertificateUrl(request.certificate),
      filename: getCertificateFileName(request.certificate),
      id: request.id,
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
  };

  const getRequestStatus = (request) => {
    if (request.isVerified) return 'verified';
    if (request.message) return 'declined';
    return 'pending';
  };

  const navigateToDetailPage = (request) => {
    navigate(`/admin/teacher-request/${request.id}`, {
      state: { requestData: request },
    });
  };

  const showDeclineReason = (request) => {
    if (!request.message) return null;

    return (
      <div
        className="flex items-center text-red-600 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/teacher-request/${request.id}`, {
            state: {
              requestData: request,
              showReason: true,
            },
          });
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs">View reason</span>
      </div>
    );
  };

  return requestData ? (
    <>
      <div className="py-10 px-5">
        <h1 className="text-2xl font-semibold">Teacher Requests</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="border border-gray-200 rounded-md p-4 flex items-center bg-white shadow-sm">
            <span className="text-gray-700 font-medium mr-2">From:</span>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="border-0 focus:ring-0"
            />
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex items-center bg-white shadow-sm">
            <span className="text-gray-700 font-medium mr-2">To:</span>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="border-0 focus:ring-0"
            />
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex items-center bg-white shadow-sm">
            <input
              type="text"
              placeholder="Filter by expertise"
              name="expertise"
              value={filters.expertise}
              onChange={handleFilterChange}
              className="border-0 focus:ring-0 w-40"
            />
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex items-center bg-white shadow-sm">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border-0 focus:ring-0 bg-transparent">
              <option value="">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Reset
          </button>

          <div className="ml-auto flex items-center text-gray-600">
            <span className="font-medium mr-2">Results:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
              {filteredData.length} of {requestData.length}
            </span>
          </div>
        </div>

        <div className="hidden sm:block border rounded-t-xl border-gray-200 mt-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-5 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Education
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Expertise
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Certificate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((request, index) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigateToDetailPage(request)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.fullname}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.education}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.expertise}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.certificate ? (
                      <div className="flex items-center">
                        <div
                          className="h-12 w-16 bg-gray-100 rounded cursor-pointer border border-gray-300 flex items-center justify-center overflow-hidden mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick(request);
                          }}
                          title="Click to preview certificate">
                          {imageError[request.id] ? (
                            <div className="text-gray-500 text-xs text-center p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              View
                            </div>
                          ) : (
                            <img
                              src={getCertificateUrl(request.certificate)}
                              alt="Certificate thumbnail"
                              className="h-full w-full object-cover"
                              onError={() => handleImageError(request.id)}
                            />
                          )}
                        </div>
                        <span
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick(request);
                          }}>
                          {getCertificateFileName(request.certificate)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No certificate
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.isVerified
                            ? 'bg-green-100 text-green-800'
                            : request.message
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {request.isVerified
                          ? 'Verified'
                          : request.message
                          ? 'Declined'
                          : 'Pending'}
                      </span>
                      {request.message && showDeclineReason(request)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        navigateToDetailPage(request);
                      }}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-2 rounded-md flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500">
                    No teacher requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          <div className="text-center text-gray-500 py-4">
            Please view on larger screen for complete table
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}>
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">
                Certificate Preview: {previewImage.filename}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
              {imageError[previewImage.id] ? (
                <div className="text-center p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-lg text-gray-700 mb-2">
                    Image could not be loaded
                  </p>
                  <p className="text-sm text-gray-500">
                    The certificate image file may be missing or inaccessible.
                  </p>
                  <a
                    href={previewImage.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Download Certificate File
                  </a>
                </div>
              ) : (
                <img
                  src={previewImage.url}
                  alt={`Certificate - ${previewImage.filename}`}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={() => handleImageError(previewImage.id)}
                />
              )}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default Request;
