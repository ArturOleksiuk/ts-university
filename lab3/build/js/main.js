"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function loadCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${dataBasePath}/categories.json`);
        if (!res.ok)
            throw new Error(`Failed to load categories: ${res.status}`);
        const cats = yield res.json();
        const sidebarEl = document.getElementById("sidebar-cats");
        if (!(sidebarEl instanceof HTMLDivElement)) {
            throw new Error("Element #sidebar-cats not found");
        }
        let sidebarHTML = "";
        cats.forEach((cat) => {
            sidebarHTML += `
      <a href="#" class="cat-item" data-shortname="${cat.shortname}">
        ${cat.name}
      </a>`;
        });
        sidebarEl.innerHTML = sidebarHTML;
        const items = sidebarEl.querySelectorAll(".cat-item");
        items.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                const shortname = item.dataset.shortname;
                void loadCategory(shortname);
            });
        });
        categoriesLoaded = true;
        openCatalog();
        const specialsLink = document.getElementById("specials-link");
        if (!(specialsLink instanceof HTMLAnchorElement)) {
            throw new Error("Element #specials-link not found");
        }
        specialsLink.addEventListener("click", (e) => {
            e.preventDefault();
            void loadSpecials();
        });
    });
}
function toggleCatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!categoriesLoaded) {
            yield loadCategories();
            return;
        }
        if (isCatalogOpen) {
            closeCatalog();
        }
        else {
            openCatalog();
        }
    });
}
function openCatalog() {
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
function closeCatalog() {
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
function loadCategory(shortname) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${dataBasePath}/${shortname}.json`);
        if (!res.ok)
            throw new Error(`Failed to load category ${shortname}: ${res.status}`);
        const data = yield res.json();
        let html = `
    <div class="page-badge">${data.categoryName}</div>
    <h1 class="page-title">${data.categoryName}</h1>
    <p class="page-sub">${data.items.length} товари</p>
    <div class="row g-3">`;
        data.items.forEach((item) => {
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
    });
}
function loadSpecials() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${dataBasePath}/categories.json`);
        if (!res.ok)
            throw new Error(`Failed to load categories: ${res.status}`);
        const cats = yield res.json();
        const random = cats[Math.floor(Math.random() * cats.length)];
        const items = document.querySelectorAll(".cat-item");
        items.forEach(i => i.classList.remove("active"));
        const activeItem = document.querySelector(`.cat-item[data-shortname="${random.shortname}"]`);
        if (activeItem)
            activeItem.classList.add("active");
        yield loadCategory(random.shortname);
    });
}
