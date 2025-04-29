// Kategorie i dane
const categories = [
  { name: "Jedzenie", emoji: "🍗" },
  { name: "Transport", emoji: "✈️" },
  { name: "Rozrywka", emoji: "🎮" },
  { name: "Rachunki", emoji: "💡" },
  { name: "Zdrowie", emoji: "💊" },
  { name: "Dom", emoji: "🏡" },
  { name: "Ubrania", emoji: "👚" },
  { name: "Inne", emoji: "🛠️" },
];

let expensesByCategory = {};

// Inicjalizowanie danych na każdy dzień
categories.forEach((cat) => {
  expensesByCategory[cat.name] = Array.from({ length: 31 }, () => []);
});

// Funkcja do sumowania wydatków do danego dnia
function getCumulative(day) {
  let sum = 0;
  for (let i = 0; i < day; i++) {
    sum += Object.values(expensesByCategory).reduce((acc, category) => {
      return acc + category[i].reduce((a, b) => a + b, 0);
    }, 0);
  }
  return sum;
}

// Renderowanie danych na stronie
function renderGrid() {
  const grid = document.getElementById("day-grid");
  grid.innerHTML = ""; // Czyszczenie siatki przed każdym renderowaniem
  const limitPerDay = 30; // Limity dzienne

  // Iterujemy po dniach miesiąca
  for (let i = 0; i < 31; i++) {
    const dayNum = i + 1;
    const limit = limitPerDay * dayNum; // Limit na dany dzień
    const total = getCumulative(dayNum); // Suma wydatków do tego dnia
    const isOver = total > limit; // Czy wydatki przekroczyły limit?

    // Tworzymy box na dany dzień
    const box = document.createElement("div");

    // Ustawiamy kolor tła zależnie od przekroczenia limitu
    box.className = `backdrop-blur-md bg-darkglass border ${
      isOver ? "border-red-500" : "border-green-500"
    } rounded-2xl p-4`;

    // Generowanie wydatków na dany dzień
    let dailyExpenses = "";
    categories.forEach((category) => {
      const expenses = expensesByCategory[category.name][i];
      dailyExpenses += `
          <div class="mb-2">
            <strong>${category.emoji} ${category.name}:</strong>
            ${
              expenses.length > 0
                ? expenses.map((x) => `${x.toFixed(2)} zł`).join(", ")
                : "0"
            }
          </div>
        `;
    });

    // Wstawiamy dane do boxa
    box.innerHTML = `
        <div class="font-semibold mb-1">📅 Dzień ${dayNum}</div>
        <div class="text-sm mb-1">Suma: <strong>${total.toFixed(
          2
        )} zł</strong></div>
        <div class="text-sm mb-2">Limit: ${limit} zł</div>
        ${dailyExpenses}
      `;

    // Dodajemy box do siatki
    grid.appendChild(box);
  }
}

// Dodawanie wydatku do wybranej kategorii
function addExpense() {
  const day = parseInt(document.getElementById("day").value);
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category-select").value;

  if (isNaN(day) || isNaN(amount) || day < 1 || day > 31 || amount <= 0) {
    alert("Podaj poprawne dane.");
    return;
  }

  // Dodajemy wydatek do wybranej kategorii
  expensesByCategory[category][day - 1].push(amount);

  // Resetowanie formularza
  document.getElementById("day").value = "";
  document.getElementById("amount").value = "";

  renderGrid(); // Przeładuj grid z nowymi wydatkami
}

// Funkcja inicjująca stronę po załadowaniu
document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category-select");

  // Generowanie opcji dla kategorii
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  // Ustawiamy domyślną kategorię na "Jedzenie"
  renderGrid();
});
