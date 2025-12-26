const MAX_PEOPLE = 20;
const container = document.getElementById("counter-container");

let people = JSON.parse(localStorage.getItem("people")) || [];

if (people.length === 0) {
  for (let i = 0; i < 5; i++) {
    people.push({ name: `人${i + 1}`, count: 0 });
  }
}

function save() {
  localStorage.setItem("people", JSON.stringify(people));
}

function createSho(count) {
  const wrap = document.createElement("div");
  wrap.className = "sho";

  const full = Math.floor(count / 5);
  const rest = count % 5;

  for (let i = 0; i < full; i++) {
    wrap.appendChild(makeGroup(5));
  }
  if (rest > 0) {
    wrap.appendChild(makeGroup(rest));
  }
  return wrap;
}

function makeGroup(num) {
  const g = document.createElement("div");
  g.className = "sho-group";

  if (num >= 1) g.appendChild(span("v1"));
  if (num >= 2) g.appendChild(span("v2"));
  if (num >= 3) g.appendChild(span("v3"));
  if (num >= 4) g.appendChild(span("v4"));
  if (num === 5) g.appendChild(span("d"));

  return g;
}

function span(cls) {
  const s = document.createElement("span");
  s.className = cls;
  return s;
}

function render() {
  container.innerHTML = "";

  people.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = p.name;

    const sho = createSho(p.count);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "タップ +1 / 長押し リセット";

    let pressTimer;

    card.addEventListener("click", () => {
      p.count++;
      save();
      render();
    });

    card.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        if (confirm("リセットしますか？")) {
          p.count = 0;
          save();
          render();
        }
      }, 700);
    });

    card.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });

    card.appendChild(name);
    card.appendChild(sho);
    card.appendChild(hint);

    container.appendChild(card);
  });
}

render();
