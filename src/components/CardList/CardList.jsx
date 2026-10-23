import {
  useDeleteCardMutation,
  useGetInfinitePostsInfiniteQuery,
} from '@/api/postsApi';
import styles from './CardList.module.css';
import CardItem from '../CardItem/CardItem';
import basketService from '@/storage/BasketStorage';
import { useNavigate } from 'react-router';

function CardList() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfinitePostsInfiniteQuery();

  const [deleteCard, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCardMutation();
  const navigate = useNavigate();
  const onEdit = (id) => {
    navigate(`/product/${id}`);
  };
  if (isLoading) return <div className={styles.loader}></div>;
  if (isError) return <div className={styles.error}>Error</div>;
  if (!data?.pages[0]?.products.length) return <div>Список порожній</div>;

  return (
    <>
      <div className={styles.cardList}>
        {data.pages.map((page) =>
          page.products.map((card) => (
            <CardItem
              key={card.id}
              title={card.title}
              description={card.description}
              price={card.price}
              brand={card.brand}
              id={card.id}
            >
              <CardItem.ButtonsForList
                addToBasket={() => basketService.addToBasket(card)}
                isAdded={() => basketService.isAdded(card.id)}
                isDeleteError={isDeleteError}
                isDeleting={isDeleting}
                onDelete={deleteCard}
                onEdit={onEdit}
              />
            </CardItem>
          )),
        )}
      </div>
      {hasNextPage && (
        <button
          className={styles.loadMore}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Завантаження...' : 'Завантажити ще'}
        </button>
      )}
    </>
  );
}

export default CardList;
