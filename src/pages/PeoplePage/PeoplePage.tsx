import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPeopleQuery } from '../../store/api';
import { CharacterCard } from '../../components/CharacterCard/CharacterCard';
import { CharacterModal } from '../../components/CharacterModal/CharacterModal';
import { Person } from '../../types/api.types';
import './PeoplePage.scss';

export const PeoplePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useGetPeopleQuery(currentPage);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number>(0);

  useEffect(() => {
    if (id && data) {
      const person = data.results.find((p) => {
        const personId = p.url.split('/').filter(Boolean).pop();
        return personId === id;
      });
      if (person) {
        const index = data.results.indexOf(person);
        setSelectedPerson(person);
        setSelectedImageId((currentPage - 1) * 10 + index + 1);
      }
    } else {
      setSelectedPerson(null);
    }
  }, [id, data, currentPage]);

  const handleCardClick = (person: Person) => {
    const personId = person.url.split('/').filter(Boolean).pop();
    navigate(`/people/${personId}`);
  };

  const handleCloseModal = () => {
    navigate('/');
  };

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="people-page">
        <div className="people-page-loader" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading Star Wars characters...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="people-page">
        <div className="people-page-error" role="alert">
          <h2>Error Loading Characters</h2>
          <p>
            {(error as { data?: { message?: string } }).data?.message ||
              'Failed to fetch characters. The API server might be down. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="people-page-retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="people-page">
      <div className="people-page-container">
        <h2 className="people-page-title">Star Wars Characters</h2>

        <div className="people-page-grid">
          {data?.results.map((person, index) => {
            const imageId = (currentPage - 1) * 10 + index + 1;
            return (
              <CharacterCard
                key={person.url}
                person={person}
                onClick={() => handleCardClick(person)}
                imageId={imageId}
              />
            );
          })}
        </div>

        <div className="people-page-pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="people-page-pagination-button"
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <span className="people-page-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!data?.next}
            className="people-page-pagination-button"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </div>

      {selectedPerson && (
        <CharacterModal
          person={selectedPerson}
          imageId={selectedImageId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
