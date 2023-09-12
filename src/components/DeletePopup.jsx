import React from 'react';
import PopupWithForm from './PopupWithForm';

function DeletePopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.onDeleteCard(props.isOpen);
    props.onClose();
  }

  return (
    <PopupWithForm
      name="deleteCard "
      title="Вы уверены?"
      submit="Да"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}

export default DeletePopup;

// function ConfirmDeletePopup({ isOpen, onClose, onDeleteCard }) {
//   const [isLoading, setIsLoading] = React.useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     setIsLoading(true);
//     onDeleteCard();
//   }

//   return (
//     <PopupWithForm
//       // className="popup__form popup__form-delete-card"
//       name="deleteCard"
//       title="Вы уверены?"
//       isOpen={isOpen}
//       onClose={onClose}
//       onSubmit={handleSubmit}
//       buttonText={isLoading ? 'Удаление...' : 'Да'}
//     />
//   );
// }

// export default ConfirmDeletePopup;
