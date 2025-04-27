import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TagSelector = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  // Replace with your actual API endpoint
  const API_URL = 'https://api.example.com/tags';

  // Function to fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);

        // Simulating API fetch for demonstration
        // In a real app, replace this with actual fetch call
        // const response = await fetch(API_URL);
        // if (!response.ok) throw new Error('Failed to fetch tags');
        // const data = await response.json();

        // Simulated data for demonstration
        const simulatedData = [
          { id: 1, name: 'Programming', count: 120 },
          { id: 2, name: 'Design', count: 95 },
          { id: 3, name: 'Marketing', count: 88 },
          { id: 4, name: 'Business', count: 76 },
          { id: 5, name: 'AI', count: 70 },
          { id: 6, name: 'DevOps', count: 65 },
          { id: 7, name: 'Cybersecurity', count: 60 },
          { id: 8, name: 'Data Science', count: 55 },
          { id: 9, name: 'Finance', count: 50 },
          { id: 10, name: 'Leadership', count: 48 },
          { id: 11, name: 'Cloud Computing', count: 45 },
          { id: 12, name: 'Machine Learning', count: 42 },
          { id: 13, name: 'UI/UX', count: 40 },
          { id: 14, name: 'Photography', count: 38 },
          { id: 15, name: 'Mobile Development', count: 35 },
          { id: 16, name: 'Game Development', count: 32 },
          { id: 17, name: 'Entrepreneurship', count: 30 },
          { id: 18, name: 'English', count: 28 },
          { id: 19, name: 'Sales', count: 25 },
          { id: 20, name: 'Blockchain', count: 22 },
        ];

        setTags(simulatedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Filter tags based on search term
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      // If tag is already selected, remove it
      if (prevSelectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
        return prevSelectedTags.filter(
          (selectedTag) => selectedTag.id !== tag.id
        );
      }
      // Otherwise add it to selection
      return [...prevSelectedTags, tag];
    });
  };

  // Check if a tag is selected
  const isTagSelected = (tagId) => {
    return selectedTags.some((tag) => tag.id === tagId);
  };

  // Submit preferences to the API
  const handleSubmit = async () => {
    // Check if minimum tags are selected
    if (selectedTags.length < 3) {
      setSubmitError('Please select at least 3 tags');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      // Prepare request payload
      const payload = {
        categories: selectedTags.map((tag) => tag.name),
        email,
      };

      // Make API call
      const response = await fetch('http://localhost:3000/api/addPrefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.statusText}`);
      }

      // Handle success
      setSubmitSuccess(true);
      // Redirect to home after a short delay
      setTimeout(() => {
        window.location.href = '/auth/signin';
      }, 1500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Determine tag size based on count
  const getTagSize = (count) => {
    if (count > 100) return 'text-2xl font-bold';
    if (count > 80) return 'text-xl font-bold';
    if (count > 60) return 'text-lg font-semibold';
    if (count > 40) return 'text-base font-semibold';
    if (count > 20) return 'text-sm font-medium';
    return 'text-xs';
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading tags: {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Select Your Interests
      </h1>

      {/* Selected tags display */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">
          Selected Tags ({selectedTags.length}/3 minimum):
        </h2>
        <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {selectedTags.length === 0 ? (
            <p className="text-gray-400 italic">No tags selected yet</p>
          ) : (
            selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                {tag.name}
                <button
                  onClick={() => handleTagSelect(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tags..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tags cloud */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Available Tags</h2>

        {filteredTags.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tags found matching your search
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagSelect(tag)}
                className={`${getTagSize(tag.count)} px-3 py-1 
                ${
                  isTagSelected(tag.id)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-800'
                } 
                rounded-full border border-blue-200 transition-all duration-200 ease-in-out`}>
                {tag.name}
                <span
                  className={`ml-1 text-xs ${
                    isTagSelected(tag.id) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  ({tag.count})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message if any */}
      {submitError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {submitError}
        </div>
      )}

      {/* Success message */}
      {submitSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
          Preferences saved successfully! Redirecting to home...
        </div>
      )}

      {/* Finish button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={selectedTags.length < 3 || submitLoading}
          className={`px-6 py-3 ${
            selectedTags.length < 3
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } 
            text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center`}>
          {submitLoading ? (
            <>
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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Preferences</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-gray-600 text-sm">
        <p>Please select at least 3 tags that interest you.</p>
        <p className="mt-2">
          These preferences will be used to personalize your experience.
        </p>
      </div>
    </div>
  );
};

export default TagSelector;
