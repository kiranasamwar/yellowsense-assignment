import React, { Component, Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import './Jobs.css';

// Lazy load TinderCard
const TinderCard = lazy(() => import('react-tinder-card'));

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      isLoading: false,
      error: null,
      redirectToJob: null,
      redirectToBookmarks: false,
      swipeAction: null, // State to show swipe action (bookmark/dismiss)
    };
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    this.setState({ isLoading: true });

    try {
      const response = await fetch('https://testapi.getlokalapp.com/common/jobs');
      const data = await response.json();
      console.log('Fetched jobs data:', data); // Debugging: Log the API response

      if (Array.isArray(data.results) && data.results.length > 0) {
        this.setState({ jobs: data.results });
      } else {
        throw new Error('No jobs found or jobs data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.setState({ error: 'Error fetching jobs' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleJobClick = (id) => {
    this.setState({ redirectToJob: id });
  };

  handleSwipe = (direction, job) => {
    if (direction === 'right') {
      this.setState({ swipeAction: 'bookmark' }, () => {
        setTimeout(() => {
          this.setState({ swipeAction: null });
        }, 1000);
      });

      this.handleBookmarkClick(job); // Bookmark the job on right swipe
    } else if (direction === 'left') {
      this.setState({ swipeAction: 'dismiss' }, () => {
        setTimeout(() => {
          this.setState({ swipeAction: null });
        }, 1000);
      });

      this.handleRemoveJob(job); // Remove the job on left swipe
    }
  };

  handleRemoveJob = (job) => {
    this.setState((prevState) => ({
      jobs: prevState.jobs.filter((j) => j.id !== job.id),
    }));
  };

  handleBookmarkClick = (job) => {
    const bookmarkedJobs =
      JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    const isBookmarked = bookmarkedJobs.some((b) => b.id === job.id);

    if (isBookmarked) {
      return;
    }

    bookmarkedJobs.push(job);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
  };

  render() {
    const {
      jobs,
      isLoading,
      error,
      redirectToJob,
      redirectToBookmarks,
      swipeAction,
    } = this.state;

    if (redirectToJob) {
      return <Navigate to={`/job/${redirectToJob}`} />;
    }

    if (redirectToBookmarks) {
      return <Navigate to="/bookmarks" />;
    }

    return (
      <div className="jobs-container">
        <button
          className="bookmark-button btn3"
          onClick={() => this.setState({ redirectToBookmarks: true })}
        >
          Bookmarks Page
        </button>
        <center>
          <h1 className="main-heading-jobs">JOBS PAGE</h1>
        </center>
        {jobs.length > 0 ? (
          <div className="tinder-cards" id="swiper">
            <Suspense fallback={<div>Loading Tinder Cards...</div>}>
              {jobs.map((job) => (
                <TinderCard
                  key={job.id}
                  onSwipe={(direction) => this.handleSwipe(direction, job)}
                  onCardLeftScreen={() => this.handleRemoveJob(job)} // Ensure job is removed from state after swiping off screen
                >
                  <div className="job-card">
                    {job.title && <h2 className="job-title">{job.title}</h2>}
                    {job.primary_details?.Place && (
                      <p className="details">
                        <strong>Location:</strong> {job.primary_details.Place}
                      </p>
                    )}
                    {job.primary_details?.Salary && (
                      <p className="details">
                        <strong>Salary:</strong> {job.primary_details.Salary}
                      </p>
                    )}
                    {job.whatsapp_no && (
                      <p className="details">
                        <strong>Phone:</strong> {job.whatsapp_no}
                      </p>
                    )}
                    {job.company_name && (
                      <p className="details">
                        <strong>Company:</strong> {job.company_name}
                      </p>
                    )}
                  </div>
                </TinderCard>
              ))}
            </Suspense>

            {/* Show swipe action feedback (bookmark or dismiss) */}
            <div className="bookmark-dismiss-action-container">
              {swipeAction === 'bookmark' && (
                <div className="swipe-indicator bookmark-indicator">
                  Bookmarked!
                </div>
              )}
              {swipeAction === 'dismiss' && (
                <div className="swipe-indicator dismiss-indicator">
                  Dismissed!
                </div>
              )}
            </div>
          </div>
        ) : (
          !isLoading && <p className="no-jobs-available-loading-line">No jobs available</p>
        )}
        {isLoading && (
          <p className="no-jobs-available-loading-line">Loading jobs...</p>
        )}
        {error && (
          <p className="no-jobs-available-loading-line">{error}</p>
        )}
      </div>
    );
  }
}

export default Jobs;
