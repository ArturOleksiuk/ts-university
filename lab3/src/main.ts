interface Category {
  id: number;
  name: string;
  shortname: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  shortname: string;
  description: string;
  price: number;
}

interface CategoryData {
  categoryName: string;
  items: Product[];
}

const contentElement = document.getElementById("content");
const catalogToggle = document.getElementById("catalog-toggle");
const dataBasePath = "../data";
let categoriesLoaded = false;
let isCatalogOpen = false;

if (!(contentElement instanceof HTMLDivElement)) {
  throw new Error("Element #content not found");
}
const content = contentElement;

if (!(catalogToggle instanceof HTMLButtonElement)) {
  throw new Error("Element #catalog-toggle not found");
}

catalogToggle.addEventListener("click", () => {
  void toggleCatalog();
});

async function loadCategories(): Promise<void> {
  const res = await fetch(`${dataBasePath}/categories.json`);
  if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`);

  const cats = await res.json() as Category[];

  const sidebarEl = document.getElementById("sidebar-cats");
  if (!(sidebarEl instanceof HTMLDivElement)) {
    throw new Error("Element #sidebar-cats not found");
  }

  let sidebarHTML = "";
  cats.forEach((cat: Category) => {
    sidebarHTML += `
      <a href="#" class="cat-item" data-shortname="${cat.shortname}">
        ${cat.name}
      </a>`;
  });
  sidebarEl.innerHTML = sidebarHTML;

  const items = sidebarEl.querySelectorAll<HTMLAnchorElement>(".cat-item");
  items.forEach((item) => {
    item.addEventListener("click", (e: Event) => {
      e.preventDefault();
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const shortname = item.dataset.shortname as string;
      void loadCategory(shortname);
    });
  });

  categoriesLoaded = true;
  openCatalog();

  const specialsLink = document.getElementById("specials-link");
  if (!(specialsLink instanceof HTMLAnchorElement)) {
    throw new Error("Element #specials-link not found");
  }
  specialsLink.addEventListener("click", (e: Event) => {
    e.preventDefault();
    void loadSpecials();
  });
}

async function toggleCatalog(): Promise<void> {
  if (!categoriesLoaded) {
    await loadCategories();
    return;
  }

  if (isCatalogOpen) {
    closeCatalog();
  } else {
    openCatalog();
  }
}

function openCatalog(): void {
  const sidebarEl = document.getElementById("sidebar-cats");
  const arrowEl = document.getElementById("catalog-arrow");

  if (sidebarEl instanceof HTMLDivElement) {
    sidebarEl.classList.remove("is-collapsed");
  }

  if (arrowEl instanceof HTMLSpanElement) {
    arrowEl.textContent = "−";
  }

  isCatalogOpen = true;
}

function closeCatalog(): void {
  const sidebarEl = document.getElementById("sidebar-cats");
  const arrowEl = document.getElementById("catalog-arrow");

  if (sidebarEl instanceof HTMLDivElement) {
    sidebarEl.classList.add("is-collapsed");
  }

  if (arrowEl instanceof HTMLSpanElement) {
    arrowEl.textContent = "+";
  }

  isCatalogOpen = false;
}

async function loadCategory(shortname: string): Promise<void> {
  const res = await fetch(`${dataBasePath}/${shortname}.json`);
  if (!res.ok) throw new Error(`Failed to load category ${shortname}: ${res.status}`);

  const data = await res.json() as CategoryData;

  let html = `
    <div class="page-badge">${data.categoryName}</div>
    <h1 class="page-title">${data.categoryName}</h1>
    <p class="page-sub">${data.items.length} товари</p>
    <div class="row g-3">`;

  data.items.forEach((item: Product) => {
    html += `
      <div class="col-6 col-md-3">
        <div class="product-card h-100">
          <img src="https://placehold.co/200x200" alt="${item.name}">
          <div class="p-3">
            <div class="product-name">${item.name}</div>
            <div class="product-desc">${item.description}</div>
            <div class="product-price">${item.price} грн</div>
          </div>
        </div>
      </div>`;
  });

  html += "</div>";
  content.innerHTML = html;
}

async function loadSpecials(): Promise<void> {
  const res = await fetch(`${dataBasePath}/categories.json`);
  if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`);

  const cats = await res.json() as Category[];
  const random: Category = cats[Math.floor(Math.random() * cats.length)];

  const items = document.querySelectorAll<HTMLAnchorElement>(".cat-item");
  items.forEach(i => i.classList.remove("active"));
  const activeItem = document.querySelector<HTMLAnchorElement>(
    `.cat-item[data-shortname="${random.shortname}"]`
  );
  if (activeItem) activeItem.classList.add("active");

  await loadCategory(random.shortname);
}
