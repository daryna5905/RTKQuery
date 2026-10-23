import basketService from '@/storage/BasketStorage';
import { useSyncExternalStore } from 'react';
import CardItem from '../CardItem/CardItem';
import styles from './BasketList.module.css';

function BasketList() {
  const products = useSyncExternalStore(
    basketService.subscribe.bind(basketService),
    basketService.getData.bind(basketService),
  );
  return (
    <div className={styles.cardList}>
      {[...products.values()].map((card) => (
        <CardItem
          key={card.id}
          id={card.id}
          brand={card.brand}
          title={card.title}
          description={card.description}
          price={card.price}
        >
          <CardItem.ButtonForBasket
            deleteFromBasket={(id) => basketService.removeFromBasket(id)}
          />
        </CardItem>
      ))}
    </div>
  );
}

export default BasketList;
