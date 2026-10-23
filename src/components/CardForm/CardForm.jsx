import {
  useAddCardMutation,
  useGetCardsQuery,
  useUpdateCardMutation,
} from '@/api/postsApi';
import styles from './CardForm.module.css';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const isText = (value) => /\p{L}/u.test(value);

const isPrice = (value) =>
  value !== '' && Number.isFinite(Number(value)) && Number(value) > 0;

function validateCard({ title, description, brand, price }) {
  const errors = [];

  if (!isText(title)) errors.push('Назва має містити текст');
  if (!isText(description)) errors.push('Опис має містити текст');
  if (!isText(brand)) errors.push('Бренд має містити текст');
  if (!isPrice(price)) errors.push('Ціна має бути числом більше 0');

  return errors;
}

function CardForm() {
  const [addCard, { isLoading: isAdding, isError: isAddError }] =
    useAddCardMutation();
  const [updateCard, { isLoading: isUpdating, isError: isUpdateError }] =
    useUpdateCardMutation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const brandRef = useRef();
  const { data } = useGetCardsQuery();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const price = priceRef.current.value.trim();
    const brand = brandRef.current.value.trim();
    const errors = validateCard({ title, description, price, brand });
    setValidationErrors(errors);
    if (errors.length > 0) return;
    if (isEdit) {
      try {
        await updateCard({
          id: Number(id),
          title,
          description,
          price: Number(price),
          brand,
        }).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Не вдалося зберегти картку', error);
      }
    } else {
      try {
        await addCard({
          title,
          description,
          price: Number(price),
          brand,
        }).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Не вдалося створити картку', error);
      }
    }
  };

  const cardForEdit = data?.find((card) => card.id == id);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      key={cardForEdit?.id ?? 'new'}
    >
      <label htmlFor={'title'}>Введіть назву товару</label>
      <input
        type='text'
        id={'title'}
        ref={titleRef}
        defaultValue={isEdit ? cardForEdit?.title : ''}
      />
      <label htmlFor={'description'}>Введіть опис товару</label>
      <input
        type='text'
        id={'description'}
        ref={descriptionRef}
        defaultValue={isEdit ? cardForEdit?.description : ''}
      />
      <label htmlFor={'price'}>Введіть ціну</label>
      <input
        type='text'
        id={'price'}
        ref={priceRef}
        defaultValue={isEdit ? cardForEdit?.price : ''}
      />
      <label htmlFor={'brand'}>Введіть бренд</label>
      <input
        type='text'
        id={'brand'}
        ref={brandRef}
        defaultValue={isEdit ? cardForEdit?.brand : ''}
      />
      <button type='submit' disabled={isAdding || isUpdating}>
        {isEdit ? 'Редагувати' : 'Створити'}
      </button>
      {(isAddError || isUpdateError) && (
        <p className={styles.error}>Щось пішло не так</p>
      )}
      {validationErrors.map((message) => (
        <p key={message} className={styles.error}>
          {message}
        </p>
      ))}
    </form>
  );
}

export default CardForm;
