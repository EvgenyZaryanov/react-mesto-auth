import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt="Аватар"
            // onClick={onEditAvatar}
            aria-label="Аватар"
            // id="profile__avatar-button"
          />
          <button className="profile__avatar-button" onClick={onEditAvatar} />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            onClick={onEditProfile}
            aria-label="Открыть"
            type="button"
            className="profile__edit-button"
          ></button>
          <p className="profile__details">{currentUser.about}</p>
        </div>
        <button
          onClick={onAddPlace}
          aria-label="Открыть"
          type="button"
          className="profile__add-button"
        ></button>
      </section>
      <section className="elements" aria-label="Карточки с изображениями">
        {cards.map(card => (
          <Card
            card={card}
            key={card._id}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}
export default Main;

// const [userName, setUserName] = React.useState('');
// const [userDescription, setUserDescription] = React.useState('');
// const [userAvatar, setUserAvatar] = React.useState('');
// const [cards, setCards] = React.useState([]);

// React.useEffect(() => {
//   api
//     .getUserInfo()
//     .then(info => {
//       setUserName(info.name);
//       setUserDescription(info.about);
//       setUserAvatar(info.avatar);
//     })
//     .catch(err => {
//       console.log(err);
//     });

//   api
//     .getCards()
//     .then(item => {
//       setCards(...cards, item);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }, []);
