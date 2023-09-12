import '../index.css';
import React from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import ImagePopup from '../components/ImagePopup.jsx';
import EditProfilePopup from '../components/EditProfilePopup.jsx';
import EditAvatarPopup from '../components/EditAvatarPopup.jsx';
import AddPlacePopup from '../components/AddPlacePopup.jsx';
import ConfirmDeletePopup from '../components/ConfirmDeletePopup.jsx';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api.js';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isConfirmDeletePopupOpen, setConfirmDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ link: '', name: '', isOpen: false });
  const [selectedCardDelete, setSelectedCardDelete] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    api
      .getCards()
      .then(cards => {
        setCards(cards);
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then(data => {
        setCurrentUser(data);
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard({ link: card.link, name: card.name, isOpen: true });
  }

  function handleConfirmDeleteClick(card) {
    setConfirmDeletePopupOpen(!isConfirmDeletePopupOpen);
    setSelectedCardDelete(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then(newCard => {
        const newCards = cards.map(c => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }

  function handleCardDelete() {
    setIsLoading(true);
    api
      .deleteCard(selectedCardDelete._id)
      .then(() => {
        const newCards = cards.filter(c => c._id !== selectedCardDelete._id);
        setCards(newCards);
        setIsLoading(false);
        setSelectedCardDelete({});
        closeAllPopups();
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .changeUserInfo(data)
      .then(() => {
        setIsLoading(false);
        setCurrentUser({ ...currentUser, ...data });
        closeAllPopups();
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api
      .changeAvatar(avatar)
      .then(() => {
        setIsLoading(false);
        setCurrentUser({ ...currentUser, ...avatar });
        closeAllPopups();
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .addCard(card)
      .then(newCard => {
        setIsLoading(false);
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(`Ой!...: ${err}`));
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setConfirmDeletePopupOpen(false);
    setSelectedCard({ link: '', name: '', isOpen: false });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <div className="page">
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmDeleteClick}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <ConfirmDeletePopup
            isOpen={isConfirmDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleCardDelete}
            isLoading={isLoading}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
