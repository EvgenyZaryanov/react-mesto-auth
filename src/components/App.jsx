import '../index.css';
import React from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
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
import * as auth from '../utils/auth.js';
//-------------------------------------------12-------------------------------------------------//
import ProtectedRouteElement from './ProtectedRoute.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import InfoTooltip from './InfoTooltip.jsx';

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
  //---12 спринт---//
  const navigate = useNavigate();
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [isSucceeded, setIsSucceeded] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getCards()
        .then(cards => {
          setCards(cards);
        })
        .catch(err => console.log(`Ой!...: ${err}`));
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then(data => {
          setCurrentUser(data);
        })
        .catch(err => console.log(`Ой!...: ${err}`));
    }
  }, [loggedIn]);

  React.useEffect(() => {
    const currentEmail = localStorage.getItem('userName');
    currentEmail ? setUserEmail(currentEmail) : setUserEmail('');
  }, []);

  const handleTokenCheck = jwt => {
    auth.checkToken(jwt).then(res => {
      if (res) {
        setLoggedIn(true);
        navigate('/', { replace: true });
      }
    });
  };

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      handleTokenCheck(jwt);
    }
  }, []);

  const handleRegistration = (email, password) => {
    auth
      .register(email, password)
      .then(res => {
        if (!res || res.statusCode === 400) {
          setIsSucceeded(false);
          setInfoTooltipOpen(true);
        } else {
          setIsSucceeded(true);
          setInfoTooltipOpen(true);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        setIsSucceeded(false);
        setInfoTooltipOpen(true);
        console.log(`Ошибка регистрации: ${err}`);
      });
  };

  const handleLogIn = (email, password) => {
    auth
      .login(email, password)
      .then(res => {
        if (res.statusCode === 401) throw new Error('Ошибка авторизации');
        if (res) {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('userName', email);
          localStorage.setItem('userPassword', password);
          setLoggedIn(true);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        console.log(`Ошибка авторизации: ${err}`);
        setInfoTooltipOpen(true);
        setIsSucceeded(false);
      });
  };

  const handleLogOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserEmail('');
    navigate('/sign-in', { replace: true });
  };

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
    setInfoTooltipOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header handleLogOut={handleLogOut} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleConfirmDeleteClick}
              />
            }
          />
          <Route path="/sign-up" element={<Register onRegister={handleRegistration} />} />
          <Route path="/sign-in" element={<Login handleLogIn={handleLogIn} />} />
          <Route path="*" element={!loggedIn ? <Navigate to="/sign-in" /> : <Navigate to="/" />} />
        </Routes>
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
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSucceeded={isSucceeded}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
