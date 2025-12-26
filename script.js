const container = document.getElementById("counter-container");

let people = JSON.parse(localStorage.getItem("people")) || [];

// 初期データ
if (people.length === 0) {
  for (let i = 0; i < 5; i++) {
    people.push({
      name: `人${i + 1}`,
      icon: "👤",
      counters: [
        { name: "カウンターA", count: 0 }
      ]
    });
  }
}

function save() {
  localStorage.setItem("people", JSON.stringify(people));
}

/* 正の字描画 */
function createSho(count) {
  const wrap = document.createElement("div");
  wrap.className = "sho";

  const full = Math.floor(count / 5);
  const rest = count % 5;

  for (let i = 0; i < full; i++) wrap.appendChild(makeGroup(5));
  if (rest > 0) wrap.appendChild(makeGroup(rest));

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

/* 描画 */
function render() {
  container.innerHTML = "";

  people.forEach((p, pIndex) => {
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
      openEditModal(pIndex);
    };

    card.appendChild(editBtn);
    card.appendChild(name);

    p.counters.forEach(counter => {
      const row = document.createElement("div");
      row.className = "counter-row";

      const title = document.createElement("div");
      title.className = "counter-title";
      title.textContent = counter.name;

      const box = document.createElement("div");
      box.className = "counter-box";
      box.appendChild(createSho(counter.count));

      let timer;
      box.onclick = () => {
        counter.count++;
        save();
        render();
      };
      box.ontouchstart = () => {
        timer = setTimeout(() => {
          if (confirm("リセットしますか？")) {
            counter.count = 0;
            save();
            render();
          }
        }, 700);
      };
      box.ontouchend = () => clearTimeout(timer);

      row.appendChild(title);
      row.appendChild(box);
      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

/* 編集モーダル */
function openEditModal(index) {
  editingIndex = index;
  const p = people[index];

  document.getElementById("edit-name").value = p.name;
  document.getElementById("edit-icon").value = p.icon;

  const area = document.getElementById("counter-edit-area");
  area.innerHTML = "";

  p.counters.forEach(c => {
    const input = document.createElement("input");
    input.value = c.name;
    input.oninput = e => (c.name = e.target.value);
    area.appendChild(input);
  });

  document.getElementById("edit-modal").classList.remove("hidden");
}

document.getElementById("add-counter").onclick = () => {
  const p = people[editingIndex];
  if (p.counters.length >= 2) {
    alert("カウンターは最大2つまでです");
    return;
  }
  p.counters.push({ name: "新カウンター", count: 0 });
  openEditModal(editingIndex);
};

document.getElementById("save-edit").onclick = () => {
  const p = people[editingIndex];
  p.name = document.getElementById("edit-name").value || p.name;
  p.icon = document.getElementById("edit-icon").value || p.icon;
  save();
  render();
  closeModal();
};

document.getElementById("cancel-edit").onclick = closeModal;

function closeModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

render();
