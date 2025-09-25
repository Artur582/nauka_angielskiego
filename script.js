let cards = [];
let selectedCards = [];
let wrong = [];
let current;
let currentIndex = 0;
let mode = "start";

// Wczytaj slowa.txt
fetch("slowa.txt")
  .then(res => res.text())
  .then(text => {
    cards = text.split("\n")
      .filter(line => line.includes("="))
      .map(line => {
        let [en, pl] = line.split("=");
        return { en: en.trim(), pl: pl.trim() };
      });
  });

// Funkcja tasująca
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Start nauki
function startLearning(count) {
  selectedCards = shuffle(cards).slice(0, count);
  mode = "learn";
  currentIndex = 0;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizScreen").style.display = "block";

  showLearnCard();
}

// Pokazywanie słówek w trybie nauki
function showLearnCard() {
  if (currentIndex >= selectedCards.length) {
    // wszystko przejrzane -> start quizu
    startQuiz();
    return;
  }

  current = selectedCards[currentIndex];
  document.getElementById("question").textContent = current.en + " -> " + current.pl;
  document.getElementById("answer").style.display = "none";
  document.getElementById("feedback").textContent = "";
  document.getElementById("buttons").innerHTML = `
    <button onclick="knowIt()">Znam</button>
    <button onclick="dontKnow()">Nie znam</button>
  `;
}

function knowIt() {
  currentIndex++;
  showLearnCard();
}

function dontKnow() {
  selectedCards.push(current);
  currentIndex++;
  showLearnCard();
}

// Start quizu
function startQuiz() {
  mode = "quiz";
  wrong = [];
  document.getElementById("answer").style.display = "block";
  nextQuestion();
}

// Kolejne pytanie w quizie
function nextQuestion() {
  if (wrong.length > 0) {
    current = wrong.pop();
  } else if (selectedCards.length > 0) {
    current = selectedCards.pop();
  } else {
    document.getElementById("question").textContent = "Koniec quizu!";
    document.getElementById("answer").style.display = "none";
    document.getElementById("buttons").innerHTML = "";
    return;
  }

  document.getElementById("question").textContent = current.pl;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("buttons").innerHTML = `
    <button onclick="checkAnswer()">Sprawdź</button>
  `;
}

// Sprawdzanie odpowiedzi
function checkAnswer() {
  let user = document.getElementById("answer").value.trim();
  let correct = current.en;

  if (normalizeAnswer(user, correct)) {
    document.getElementById("feedback").textContent = "✅ Dobrze!";
  } else {
    document.getElementById("feedback").textContent = "❌ Źle. Poprawnie: " + correct;
    wrong.push(current);
  }

  document.getElementById("buttons").innerHTML = `
    <button onclick="nextQuestion()">Dalej</button>
  `;
}

// Obsługa Enter
document.getElementById("answer").addEventListener("keypress", function(e) {
  if (e.key === "Enter" && mode === "quiz") {
    checkAnswer();
  }
});

// Funkcja obsługująca <sth>, <sb> itp.
function normalizeAnswer(answer, pattern) {
  answer = answer.trim();

  // regex: <...> = opcjonalne
  let regexPattern = pattern.replace(/<[^>]+>/g, "(?:.*)?");

  let regex = new RegExp("^" + regexPattern + "$", "i");
  return regex.test(answer);
}
