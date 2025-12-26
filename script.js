const container = document.getElementById("counter-container");

let people = JSON.parse(localStorage.getItem("people")) || [];

// 初期データ
if (people.length === 0) {
  for (let i = 0; i < 5; i++) {
    people.push({
      name: `人${i + 1}`,
      icon: "👤",
      counters: [
        { name: "カウンター", count: 0 }
      ]
    });
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

let editingIndex = null;

function render() {
  container.innerHTML = "";

  people.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = `${p.icon} ${p.name}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = e => {
      e.stopPropagation();
      openEditModal(index);
    };

    const sho = createSho(p.counters[0].count);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "タップ +1 / 長押し リセット";

    let pressTimer;

    card.addEventListener("click", () => {
      p.counters[0].count++;
      save();
      render();
    });

    card.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        if (confirm("リセットしますか？")) {
          p.counters[0].count = 0;
          save();
          render();
        }
      }, 700);
    });

    card.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });

    card.appendChild(editBtn);
    card.appendChild(name);
    card.appendChild(sho);
    card.appendChild(hint);

    container.appendChild(card);
  });
}

function openEditModal(index) {
  editingIndex = index;
  document.getElementById("edit-name").value = people[index].name;
  document.getElementById("edit-icon").value = people[index].icon;
  document.getElementById("edit-modal").classList.remove("hidden");
}

document.getElementById("save-edit").onclick = () => {
  people[editingIndex].name =
    document.getElementById("edit-name").value || "名前";
  people[editingIndex].icon =
    document.getElementById("edit-icon").value || "👤";

  save();
  render();
  closeModal();
};

document.getElementById("cancel-edit").onclick = closeModal;

function closeModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

render();
