let cards = [];
let current = null;
let wrong = [];

fetch("slowa.txt")
  .then(res => res.text())
  .then(text => {
    cards = text.split("\n")
      .map(line => line.trim())
      .filter(line => line && line.includes("="))
      .map(line => {
        const [en, pl] = line.split("=");
        return { en: en.trim(), pl: pl.trim() };
      });
    nextQuestion();
  });

function normalizeAnswer(answer, pattern) {
  // usuń opcjonalne części <...> z wzorca
  const regex = new RegExp(pattern.replace(/<[^>]+>/g, "(.*)").trim(), "i");
  return regex.test(answer.trim());
}

function checkAnswer() {
  const user = document.getElementById("answer").value;
  const feedback = document.getElementById("feedback");

  if (normalizeAnswer(user, current.en)) {
    feedback.textContent = "✅ Dobrze!";
    feedback.className = "correct";
  } else {
    feedback.textContent = `❌ Źle! Poprawnie: ${current.en}`;
    feedback.className = "incorrect";
    wrong.push(current);
  }
}

function nextQuestion() {
  if (wrong.length > 0) {
    current = wrong.pop(); // powtarzaj błędne
  } else {
    current = cards[Math.floor(Math.random() * cards.length)];
  }
  document.getElementById("question").textContent = current.pl;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}
