import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const jobs = () => {
    navigate('/jobs');
  };
  const Home = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      setIsLoading(true);

      try {
        // Retrieve bookmarked jobs from local storage
        const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
        setBookmarkedJobs(bookmarkedJobs);
      } catch (error) {
        console.error('Error fetching bookmarked jobs:', error);
        setError('Error fetching bookmarked jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedJobs();
  }, []);

  const handleRemoveBookmark = (jobId) => {
    const updatedJobs = bookmarkedJobs.filter((job) => job.id !== jobId);
    setBookmarkedJobs(updatedJobs);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedJobs)); // Update local storage
  };

  if (isLoading) {
    return <p>Loading bookmarks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bookmarks-container">
      <button className="button button1" onClick={jobs}>Jobs</button>
      <button className="button button1" onClick={Home}>Back To Home</button>

      {/* Conditionally render the heading if there are bookmarked jobs */}
      {bookmarkedJobs.length > 0 && <h1 className="bookmark-heading">Welcome To Bookmark</h1>}

      {bookmarkedJobs.length > 0 ? (
        bookmarkedJobs.map((job) => (
          <div key={job.id} className="bookmark-card">
            <Link className="link" to={`/job/${job.id}`}>
              <h1 className="job-title">{job?.title || 'Job title not available'}</h1>
              <p className="details"><strong className="details">Location:</strong> {job?.primary_details?.Place || 'N/A'}</p>
              <p className="details"><strong className="details">Salary:</strong> {job?.primary_details?.Salary || 'N/A'}</p>
              <p className="details"><strong className="details">Job_Type:</strong> {job?.primary_details?.Job_Type || 'N/A'}</p>
              <p className="details"><strong className="details">Experience:</strong> {job?.primary_details?.Experience || 'N/A'}</p>
              <p className="details"><strong className="details">Fees_Charged:</strong> {job?.primary_details?.Fees_Charged || 'N/A'}</p>
              <p className="details"><strong className="details">Qualification:</strong> {job?.primary_details?.Qualification || 'N/A'}</p>
              <p className="details"><strong className="details">Phone:</strong> {job?.whatsapp_no || 'N/A'}</p>
              <p className="details"><strong className="details">Company:</strong> {job?.company_name || 'N/A'}</p>
            </Link>
            {/* Remove button */}
            <button className="button button2" onClick={() => handleRemoveBookmark(job.id)}>Remove</button>
          </div>
        ))
      ) : (
        <p className='no-data'>No bookmarks here.</p> /* Show this message when there are no bookmarked jobs */
      )}
    </div>
  );
};

export default Bookmarks;
