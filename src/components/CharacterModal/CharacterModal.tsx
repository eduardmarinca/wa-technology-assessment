import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Person } from '../../types/api.types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addFavourite, removeFavourite } from '../../store/favouritesSlice';
import './CharacterModal.scss';

interface CharacterModalProps {
  person: Person;
  imageId: number;
  onClose: () => void;
}

export const CharacterModal = ({ person, imageId, onClose }: CharacterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const personId = person.url.split('/').filter(Boolean).pop() || '';
  const isFavourite = favouriteIds.includes(personId);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    // Focus the modal
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFavouriteClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?next=${location.pathname}`);
      return;
    }

    if (isFavourite) {
      dispatch(removeFavourite(personId));
    } else {
      dispatch(addFavourite(personId));
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" ref={modalRef} tabIndex={-1}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className="modal-content">
          <div className="modal-image-wrapper">
            <img
              src={`https://picsum.photos/seed/${imageId}/400/500`}
              alt={person.name}
              className="modal-image"
            />
          </div>
          
          <div className="modal-details">
            <h2 id="modal-title" className="modal-title">{person.name}</h2>
            
            <div className="modal-info">
              <div className="modal-info-item">
                <span className="modal-label">Height:</span>
                <span className="modal-value">
                  {person.height !== 'unknown' 
                    ? `${(parseInt(person.height) / 100).toFixed(2)} meters`
                    : 'Unknown'}
                </span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-label">Mass:</span>
                <span className="modal-value">
                  {person.mass !== 'unknown' ? `${person.mass} kg` : 'Unknown'}
                </span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-label">Birth Year:</span>
                <span className="modal-value">{person.birth_year}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-label">Films:</span>
                <span className="modal-value">{person.films.length}</span>
              </div>
              
              <div className="modal-info-item">
                <span className="modal-label">Date Added:</span>
                <span className="modal-value">{formatDate(person.created)}</span>
              </div>
            </div>

            <button
              className={`modal-favourite ${isFavourite ? 'modal-favourite--active' : ''}`}
              onClick={handleFavouriteClick}
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              {isFavourite ? '★ Remove from Favourites' : '☆ Add to Favourites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
