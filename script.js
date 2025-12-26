const container = document.getElementById("counter-container");

let people = JSON.parse(localStorage.getItem("people")) || [];

// 初期データ
if (people.length === 0) {
  for (let i = 0; i < 5; i++) {
    people.push({
      name: `人${i + 1}`,
      icon: "👤",
      counters: [{ name: "カウンターA", count: 0 }]
    });
  }
}

function save() {
  localStorage.setItem("people", JSON.stringify(people));
}

/* ===== 正の字 SVG ===== */
function createSho(count) {
  const wrap = document.createElement("div");
  wrap.className = "sho";

  const full = Math.floor(count / 5);
  const rest = count % 5;

  for (let i = 0; i < full; i++) {
    wrap.appendChild(createShoSVG(5));
  }
  if (rest > 0) {
    wrap.appendChild(createShoSVG(rest));
  }
  return wrap;
}

function createShoSVG(strokes) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add("sho-svg");

const lines = [
    [20, 20, 80, 20], // 1画目：上の横棒
    [50, 20, 50, 50], // 2画目：中央の縦棒
    [50, 50, 80, 50], // 3画目：右側の短い横棒
    [25, 50, 25, 85], // 4画目：左側の縦棒
    [10, 85, 90, 85]  // 5画目：下の長い横棒
  ];

  for (let i = 0; i < strokes; i++) {
    const [x1, y1, x2, y2] = lines[i];
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
  }

  return svg;
}

let editingIndex = null;

/* ===== 描画 ===== */
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

/* ===== 編集モーダル ===== */
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
