class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _sendData(path, headers) {
    return fetch(`${this._url}${path}`, headers).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Произошла ошибка: ${res.status}`);
    });
  }

  getUserInfo() {
    return this._sendData('users/me', {
      method: 'GET',
      headers: this._headers
    });
  }

  getCards() {
    return this._sendData('cards', {
      method: 'GET',
      headers: this._headers
    });
  }

  getStartData() {
    return Promise.all([this.getUserInfo(), this.getCards()]);
  }

  changeUserInfo(data) {
    return this._sendData('users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    });
  }

  addCard(newCard) {
    return this._sendData('cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: newCard.name,
        link: newCard.link
      })
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._sendData(`cards/likes/${cardId}`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers
    });
  }

  deleteCard(card) {
    return this._sendData(`cards/${card}`, {
      method: 'DELETE',
      headers: this._headers
    });
  }

  changeAvatar(avatar) {
    return this._sendData('users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar.avatar
      })
    });
  }
}

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-72/',
  headers: {
    authorization: '2386186e-8350-4225-ade5-72f6caee8811',
    'Content-Type': 'application/json'
  }
});

export default api;
