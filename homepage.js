function scrollCards(distance) {
  const container = document.querySelector('.additional-cards');
  if (container) {
      container.scrollBy({
          left: distance,
          behavior: 'smooth',
      });
  }
}