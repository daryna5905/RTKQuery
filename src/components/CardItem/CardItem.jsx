import { useDeleteCardMutation } from '@/api/postsApi';
import styles from './CardItem.module.css';
import { useNavigate } from 'react-router';
import { createContext, useContext, useMemo, useState } from 'react';
import basketService from '@/storage/BasketStorage';

const CardItemContext = createContext();

function useCardItemContext() {
  const context = useContext(CardItemContext);
  if (!context) {
    throw new Error('useCardItemContext must beused within a PostCard');
  }
  return context;
}

function CardItem({ title, description, price, brand, id, children }) {
  return (
    <CardItemContext.Provider value={{ id }}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p> Description:</p>
        <p>{description}</p>
        <p className={styles.price}>Price: {price}</p>
        <p className={styles.brand}> Brand: {brand}</p>
        {children}
      </div>
    </CardItemContext.Provider>
  );
}
export default CardItem;

CardItem.ButtonsForList = function CardItemButtonForList({
  addToBasket,
  onDelete,
  onEdit,
  isDeleting,
  isDeleteError,
}) {
  const { id } = useCardItemContext();
  const [isAdded, setIsAdded] = useState(() => basketService.isAdded(id));
  return (
    <>
      <button
        type='button'
        className={styles.addToBasketButton}
        onClick={() => {
          addToBasket(id);
          setIsAdded(true);
        }}
        disabled={isAdded}
      >
        {isAdded ? 'Додано' : 'Додати в кошик'}
      </button>
      <button className={styles.updateButton} onClick={() => onEdit(id)}>
        Редагувати
      </button>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Видалення...' : isDeleteError ? 'Помилка' : 'Видалити'}
      </button>
    </>
  );
};

CardItem.ButtonForBasket = function CardItemButtonForBasket({
  deleteFromBasket,
}) {
  const { id } = useCardItemContext();
  return (
    <button
      className={styles.removeFromBasketButton}
      onClick={() => deleteFromBasket(id)}
    >
      Видалити з кошика
    </button>
  );
};
