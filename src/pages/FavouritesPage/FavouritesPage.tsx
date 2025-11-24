import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { useGetPeopleQuery } from '../../store/api';
import { CharacterCard } from '../../components/CharacterCard/CharacterCard';
import { CharacterModal } from '../../components/CharacterModal/CharacterModal';
import { Person } from '../../types/api.types';
import './FavouritesPage.scss';

export const FavouritesPage = () => {
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const navigate = useNavigate();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number>(0);

  // Fetch all pages to get all favourites
  const { data: page1 } = useGetPeopleQuery(1);
  const { data: page2 } = useGetPeopleQuery(2);
  const { data: page3 } = useGetPeopleQuery(3);
  const { data: page4 } = useGetPeopleQuery(4);
  const { data: page5 } = useGetPeopleQuery(5);
  const { data: page6 } = useGetPeopleQuery(6);
  const { data: page7 } = useGetPeopleQuery(7);
  const { data: page8 } = useGetPeopleQuery(8);
  const { data: page9 } = useGetPeopleQuery(9);

  const allPeople = [
    ...(page1?.results || []),
    ...(page2?.results || []),
    ...(page3?.results || []),
    ...(page4?.results || []),
    ...(page5?.results || []),
    ...(page6?.results || []),
    ...(page7?.results || []),
    ...(page8?.results || []),
    ...(page9?.results || []),
  ];

  const favouritePeople = allPeople.filter((person) => {
    const personId = person.url.split('/').filter(Boolean).pop();
    return favouriteIds.includes(personId || '');
  });

  const handleCardClick = (person: Person) => {
    const personId = person.url.split('/').filter(Boolean).pop();
    const index = allPeople.findIndex((p) => {
      const id = p.url.split('/').filter(Boolean).pop();
      return id === personId;
    });
    setSelectedPerson(person);
    setSelectedImageId(index + 1);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="favourites-page">
      <div className="favourites-page-container">
        <h2 className="favourites-page-title">My Favourite Characters</h2>

        {favouritePeople.length === 0 ? (
          <div className="favourites-page-empty">
            <p>You haven't added any favourites yet.</p>
            <button
              onClick={() => navigate('/')}
              className="favourites-page-browse-button"
            >
              Browse Characters
            </button>
          </div>
        ) : (
          <div className="favourites-page-grid">
            {favouritePeople.map((person) => {
              const personId = person.url.split('/').filter(Boolean).pop();
              const index = allPeople.findIndex((p) => {
                const id = p.url.split('/').filter(Boolean).pop();
                return id === personId;
              });
              return (
                <CharacterCard
                  key={person.url}
                  person={person}
                  onClick={() => handleCardClick(person)}
                  imageId={index + 1}
                />
              );
            })}
          </div>
        )}
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
