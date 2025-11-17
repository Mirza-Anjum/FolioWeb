/* ---------- Data (demo) ---------- */
const demoProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    rating: 4.5,
  },
  {
    id: 2,
    title: "Running Shoes",
    category: "Fashion",
    price: 59.99,
    rating: 4.0,
  },
  { id: 3, title: "Coffee Mug", category: "Home", price: 12.5, rating: 4.8 },
  {
    id: 4,
    title: "Smartwatch",
    category: "Electronics",
    price: 129.99,
    rating: 4.2,
  },
  {
    id: 5,
    title: "Sunglasses",
    category: "Fashion",
    price: 24.99,
    rating: 3.9,
  },
  { id: 6, title: "Desk Lamp", category: "Home", price: 39.5, rating: 4.6 },
];

/* ---------- Templates for each section ---------- */
const templates = {
  portfolio: `
        <div class="portfolio">
          <div class="hero">
            <div class="profile row">
              <div class="avatar">MA</div>
              <div>
                <div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0">Mirza Anjum</h2><span class="small-muted">— Web Developer</span></div>
                <p class="muted">Final year BE (ISE) • Interested in Web Development, cybersecurity & ethical hacking • Projects: Portfolio, To-Do App, Product Listing</p>
                <div class="skills">
                  <div class="skill">HTML</div><div class="skill">CSS</div><div class="skill">JavaScript</div><div class="skill">localStorage</div>
                </div>
              </div>
            </div>
            <div style="margin-top:12px" class="card">
              <h3 style="margin:0 0 8px 0">About</h3>
              <p class="muted">This portfolio template is a multi-section, responsive layout to showcase your skills and projects. Use it as your personal website by replacing content and links.</p>
            </div>
            <div class="card">
              <h3 style="margin:0 0 8px 0">Projects</h3>
              <div class="project-grid">
                <div class="card"><strong>Personal Portfolio</strong><div class="small-muted">Multi-section responsive site</div></div>
                <div class="card"><strong>To-Do / Notes</strong><div class="small-muted">localStorage persistence</div></div>
                <div class="card"><strong>Product Listing</strong><div class="small-muted">Filtering & sorting</div></div>
              </div>
            </div>
          </div>
        </div>
      `,

  todo: `
        <div>
          <h2 style="margin-top:0">To‑Do / Notes (LocalStorage)</h2>
          <div class="todo-controls">
            <input id="todo-input" class="todo-input" placeholder="Add a task or note..." />
            <button id="add-todo" class="btn">Add</button>
            <select id="filter-todo" class="select">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
            </select>
          </div>
          <ul id="todo-list" class="todo-list"></ul>
          <div style="margin-top:12px" class="row">
            <button id="clear-done" class="btn">Clear Done</button>
            <div style="flex:1" class="small-muted" id="todo-count">0 tasks</div>
          </div>
        </div>
      `,

  products: `
        <div>
          <h2 style="margin-top:0">Product Listing (Filter & Sort)</h2>
          <div class="filters">
            <select id="category-filter" class="select">
              <option value="all">All Categories</option>
            </select>
            <select id="sort-by" class="select">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating-desc">Rating ↓</option>
              <option value="rating-asc">Rating ↑</option>
            </select>
            <input id="search-term" class="input" placeholder="Search products..." />
          </div>
          <div id="product-list" class="product-list"></div>
        </div>
      `,
};

/* ---------- App logic ---------- */
const mainArea = document.getElementById("main-area");
const tabs = document.querySelectorAll(".tab");

function show(section) {
  mainArea.innerHTML = templates[section] || "<div>Not found</div>";
  if (section === "todo") initTodo();
  if (section === "products") initProducts();
}

tabs.forEach((t) =>
  t.addEventListener("click", () => {
    show(t.dataset.target);
  })
);

// Default view
show("portfolio");

/* ---------- To-Do Implementation ---------- */
function initTodo() {
  const KEY = "fp_todos_v1";
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-todo");
  const listEl = document.getElementById("todo-list");
  const filter = document.getElementById("filter-todo");
  const clearDone = document.getElementById("clear-done");
  const countEl = document.getElementById("todo-count");

  let todos = JSON.parse(localStorage.getItem(KEY) || "[]");

  function save() {
    localStorage.setItem(KEY, JSON.stringify(todos));
    render();
  }
  function addTask(text) {
    if (!text || !text.trim()) return;
    todos.unshift({ id: Date.now(), text: text.trim(), done: false });
    save();
  }
  function toggle(id) {
    todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    save();
  }
  function remove(id) {
    todos = todos.filter((t) => t.id !== id);
    save();
  }
  function clearCompleted() {
    todos = todos.filter((t) => !t.done);
    save();
  }

  addBtn.addEventListener("click", () => {
    addTask(input.value);
    input.value = "";
  });
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(input.value);
      input.value = "";
    }
  });
  filter.addEventListener("change", render);
  clearDone.addEventListener("click", clearCompleted);

  function render() {
    const mode = filter.value;
    const filtered = todos.filter((t) =>
      mode === "all" ? true : mode === "active" ? !t.done : t.done
    );
    listEl.innerHTML = "";
    filtered.forEach((t) => {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.innerHTML = `<div class=\"todo-left\"><input type=checkbox ${
        t.done ? "checked" : ""
      } data-id=\"${t.id}\" /> <div><div style=\"font-weight:600\">${escapeHtml(
        t.text
      )}</div><div class=\"small-muted\">ID: ${
        t.id
      }</div></div></div><div><button data-del=\"${
        t.id
      }\" class=\"btn\">Delete</button></div>`;
      listEl.appendChild(li);
    });
    // wire up events
    listEl
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) =>
        cb.addEventListener("change", (e) =>
          toggle(Number(e.target.dataset.id))
        )
      );
    listEl
      .querySelectorAll("button[data-del]")
      .forEach((b) =>
        b.addEventListener("click", (e) => remove(Number(e.target.dataset.del)))
      );
    countEl.textContent = `${todos.length} tasks — ${
      todos.filter((t) => t.done).length
    } done`;
  }
  render();
}

/* ---------- Products Implementation ---------- */
function initProducts() {
  const catEl = document.getElementById("category-filter");
  const sortEl = document.getElementById("sort-by");
  const searchEl = document.getElementById("search-term");
  const productsEl = document.getElementById("product-list");

  const products = demoProducts.slice();
  const cats = ["All", ...new Set(products.map((p) => p.category))];
  catEl.innerHTML =
    '<option value="all">All Categories</option>' +
    cats
      .slice(1)
      .map((c) => `<option value=\"${c}\">${c}</option>`)
      .join("");

  function render() {
    const cat = catEl.value;
    const sort = sortEl.value;
    const q = (searchEl.value || "").toLowerCase().trim();

    let list = products.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q))
    );

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating-desc")
      list.sort((a, b) => (b.rating - b.rating ? b.rating - a.rating : 0));
    if (sort === "rating-asc") list.sort((a, b) => a.rating - b.rating);

    productsEl.innerHTML = list
      .map(
        (p) => `
          <div class=\"product\">
            <div class=\"pimg\">${escapeHtml(
              p.title
                .split(" ")
                .map((s) => s[0])
                .join("")
            )}</div>
            <h3 style=\"margin:8px 0 4px 0\">${escapeHtml(p.title)}</h3>
            <div class=\"small-muted\">${escapeHtml(p.category)}</div>
            <div style=\"display:flex;justify-content:space-between;align-items:center;margin-top:8px\">
              <div class=\"price\">$${p.price.toFixed(2)}</div>
              <div class=\"small-muted\">⭐ ${p.rating}</div>
            </div>
          </div>
        `
      )
      .join("");
  }

  catEl.addEventListener("change", render);
  sortEl.addEventListener("change", render);
  searchEl.addEventListener("input", debounce(render, 200));

  render();
}

/* ---------- Helpers ---------- */
function escapeHtml(unsafe) {
  return String(unsafe).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m];
  });
}
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

// keyboard nav: 1-3 keys
window.addEventListener("keydown", (e) => {
  if (e.key === "1") show("portfolio");
  if (e.key === "2") show("todo");
  if (e.key === "3") show("products");
});
