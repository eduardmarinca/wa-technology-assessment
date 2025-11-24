import { Person } from '../../types/api.types';
import './CharacterCard.scss';

interface CharacterCardProps {
  person: Person;
  onClick: () => void;
  imageId: number;
}

export const CharacterCard = ({ person, onClick, imageId }: CharacterCardProps) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="character-card"
      onClick={onClick}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${person.name}`}
    >
      <div className="character-card-image-wrapper">
        <img
          src={`https://picsum.photos/seed/${imageId}/300/400`}
          alt={person.name}
          className="character-card-image"
          loading="lazy"
        />
      </div>
      <div className="character-card-content">
        <h3 className="character-card-name">{person.name}</h3>
      </div>
    </div>
  );
};
