import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const TeacherRequestDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        if (location.state && location.state.requestData) {
          setRequest(location.state.requestData);
          setLoading(false);

          if (location.state.showReason && location.state.requestData.message) {
            setDeclineReason(location.state.requestData.message);
            setShowDeclineModal(true);
          }
          return;
        }

        const token = localStorage.getItem('token');
        const { data } = await apiClient.get(`/getRequest/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setRequest(data.request);
        } else {
          toast.error(data.message || 'Failed to load request data');
          navigate('/teacher-requests');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred');
        navigate('/teacher-requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [id, location.state, navigate]);

  const getCertificateFileName = (url) => {
    if (!url) return 'No certificate';
    try {
      const urlParts = new URL(url);
      const pathSegments = urlParts.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      return url.split('/').pop();
    }
  };

  const handleVerify = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const payload = {
        requestId: request.id,
      };
      const { data } = await apiClient.put('/approveTeacher', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('Teacher verified successfully');
        setRequest({
          ...request,
          isVerified: true,
          message: null,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to verify teacher');
    } finally {
      setProcessing(false);
    }
  };

  const openDeclineModal = () => {
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const closeDeclineModal = () => {
    setShowDeclineModal(false);
    setDeclineReason('');
  };

  const handleReject = async () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const payload = {
        requestId: request.id,
        message: declineReason.trim(),
      };

      const { data } = await apiClient.put('/declineTeacher', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('Teacher request rejected');
        setRequest({
          ...request,
          isVerified: false,
          message: declineReason.trim(),
        });
        closeDeclineModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject teacher');
    } finally {
      setProcessing(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading />;
  }

  if (!request) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">Request Not Found</h2>
        <p className="mt-4">
          The teacher request you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <button
          onClick={goBack}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg">
          Back to Requests
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (request.isVerified) {
      return (
        <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
          Verified
        </div>
      );
    } else if (request.message) {
      return (
        <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
          Declined
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
          Pending
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex-grow">
            Teacher Application
          </h1>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Personal Info & Certificate */}
          <div className="md:col-span-1">
            {/* Personal info card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Applicant</h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center justify-center mb-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                    {request.fullname
                      ? request.fullname.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                </div>

                <div className="text-center mb-5">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {request.fullname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {request.email || 'No email provided'}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">
                        {request.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Application Date</p>
                      <p className="text-sm font-medium">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Certificate
                </h2>
              </div>
              <div className="p-6">
                {request.certificate ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-lg border border-gray-300 p-2 w-full h-48 flex items-center justify-center overflow-hidden mb-4">
                      {imageError ? (
                        <div className="text-center text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto mb-2"
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
                          <p>Image could not be loaded</p>
                        </div>
                      ) : (
                        <img
                          src={request.certificate}
                          alt="Teacher certificate"
                          className="max-w-full max-h-full object-contain"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      {getCertificateFileName(request.certificate)}
                    </p>
                    <a
                      href={request.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download Certificate
                    </a>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-800">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">No Certificate Provided</p>
                        <p className="text-sm mt-1">
                          This application was submitted without a certificate
                          document.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Qualifications & Status */}
          <div className="md:col-span-2">
            {/* Qualifications card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Professional Qualifications
                </h2>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900">
                        Education
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {request.education || 'Not specified'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900">
                        Expertise
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {request.expertise || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">
                      Experience
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {request.experience || 'No experience information provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status & Actions card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  Application Status
                </h2>
              </div>
              <div className="px-6 py-5">
                {/* Status timeline */}
                <div className="relative pb-6">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="relative flex items-start mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white flex-shrink-0 z-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md font-medium text-gray-900">
                        Application Submitted
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {request.isVerified && (
                    <div className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white flex-shrink-0 z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900">
                          Application Approved
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.message && (
                    <div className="relative flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white flex-shrink-0 z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                      </div>
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900">
                          Application Declined
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Show decline reason if request is declined */}
                {request.message && (
                  <div className="mt-2 mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      Reason for Declining
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p>{request.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* For verified requests, show verification info */}
                {request.isVerified && (
                  <div className="mt-2 mb-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600 mr-2 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-green-800">
                            Teacher Verified Successfully
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            This teacher has been verified and can now access
                            the teaching platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions for pending requests */}
                {!request.isVerified && !request.message && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Take Action
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleVerify}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center flex-1"
                        disabled={processing}>
                        {processing ? (
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        Approve Teacher
                      </button>
                      <button
                        onClick={openDeclineModal}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md flex items-center justify-center flex-1"
                        disabled={processing}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Decline Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeDeclineModal}>
          <div
            className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                {!request.message
                  ? 'Decline Teacher Application'
                  : 'Decline Reason'}
              </h3>
              <button
                onClick={closeDeclineModal}
                className="text-white hover:text-gray-200 transition-colors">
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
            <div className="p-6">
              {!request.message ? (
                <>
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
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
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">
                        Please provide a reason for declining this application.
                        This message will be sent to the applicant.
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="declineReason"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Declining
                    </label>
                    <textarea
                      id="declineReason"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter reason for declining this application..."
                      value={declineReason}
                      onChange={(e) =>
                        setDeclineReason(e.target.value)
                      }></textarea>
                    {declineReason.trim() === '' && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Please provide a reason before declining
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700">
                        This application was declined with the following reason:
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-gray-700">{declineReason}</p>
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                onClick={closeDeclineModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all">
                {!request.message ? 'Cancel' : 'Close'}
              </button>
              {!request.message && (
                <button
                  onClick={handleReject}
                  className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg transition-all shadow-md ${
                    declineReason.trim() === ''
                      ? 'opacity-70 cursor-not-allowed hover:from-red-500 hover:to-red-600'
                      : 'hover:from-red-600 hover:to-red-700'
                  }`}
                  disabled={declineReason.trim() === '' || processing}>
                  {processing ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Decline Application'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRequestDetail;
