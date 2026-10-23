class BasketService {
  listeners = [];
  snapshot = [];
  constructor() {
    this.cache = null;
  }
  init() {
    if (this.cache === null) {
      const cards = this.readFromLS();
      this.cache = new Map(cards.map((card) => [card.id, card]));
      this.snapshot = cards;
    }
  }
  isAdded(id) {
    return this.cache.has(id);
  }

  addToBasket(card) {
    const cards = this.readFromLS();
    this.cache.set(card.id, card);
    cards.push(card);
    this.writeToLS(cards);
    this.snapshot = cards;
  }

  removeFromBasket(id) {
    if (this.cache.has(id)) {
      this.cache.delete(id);
      const cards = this.readFromLS();
      const filteredCards = cards.filter((elem) => id !== elem.id);
      this.writeToLS(filteredCards);
      this.snapshot = filteredCards;
      this.emitChange();
    }
  }

  getData() {
    return this.snapshot;
  }

  readFromLS() {
    return JSON.parse(localStorage.getItem('basket')) || [];
  }

  writeToLS(cards) {
    localStorage.setItem('basket', JSON.stringify(cards));
  }

  subscribe(listener) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emitChange() {
    for (let listener of this.listeners) {
      listener();
    }
  }
}

const basketService = new BasketService();
basketService.init();
export default basketService;
