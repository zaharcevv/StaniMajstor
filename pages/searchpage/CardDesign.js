
const filter = document.getElementById("grad");
const cards = document.querySelectorAll(".card");
filter.addEventListener("change", () => {
  const izbranGrad = filter.value;
  cards.forEach((card) => {
    const cardGrad = card.getAttribute("data-grad");
    if (izbranGrad === "site" || cardGrad === izbranGrad) {
      card.style.display = "block"; 
    } else {
      card.style.display = "none";
    }
  });
});
