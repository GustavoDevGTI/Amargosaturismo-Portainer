const STORAGE_KEY = "guia_turista_cadastros_v1";

const cardsGrid = document.getElementById("cardsGrid");
const emptyState = document.getElementById("emptyState");
const statusText = document.getElementById("statusText");
const refreshBtn = document.getElementById("refreshBtn");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));

const ICONS = {
  instagram: `<svg class="card-link__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5A3.95 3.95 0 0 0 16.25 3.8Zm8.93 1.35a1.07 1.07 0 1 1 0 2.14 1.07 1.07 0 0 1 0-2.14ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z"/></svg>`,
  whatsapp: `<svg class="card-link__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.57 0 .29 5.28.29 11.79c0 2.08.54 4.11 1.56 5.91L0 24l6.48-1.7a11.78 11.78 0 0 0 5.6 1.43h.01c6.5 0 11.79-5.29 11.79-11.8a11.7 11.7 0 0 0-3.36-8.45ZM12.09 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.85 1.01 1.03-3.75-.24-.39a9.77 9.77 0 0 1-1.5-5.2c0-5.43 4.42-9.84 9.86-9.84 2.63 0 5.1 1.02 6.95 2.88a9.77 9.77 0 0 1 2.89 6.96c0 5.43-4.42 9.86-9.85 9.86Zm5.4-7.34c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.51.08-.78.37s-1.02 1-1.02 2.44 1.05 2.83 1.2 3.03c.15.2 2.07 3.16 5.02 4.43.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.77-.72 2.02-1.42.25-.69.25-1.28.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>`,
  email: `<svg class="card-link__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25Zm1.8.37v.28l7.2 5.4 7.2-5.4v-.28a.45.45 0 0 0-.45-.45H5.25a.45.45 0 0 0-.45.45Zm14.4 2.53-6.66 4.99a.9.9 0 0 1-1.08 0L4.8 8.15v10.6c0 .25.2.45.45.45h13.5c.25 0 .45-.2.45-.45V8.15Z"/></svg>`,
  phone: `<svg class="card-link__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 2.93c.3-.3.75-.4 1.14-.25l2.3.86c.52.19.83.73.74 1.28l-.39 2.36a1.35 1.35 0 0 1-.78 1.02l-1.42.68a14.57 14.57 0 0 0 6.91 6.91l.68-1.42c.18-.38.56-.66 1.02-.78l2.36-.39c.55-.09 1.09.22 1.28.74l.86 2.3c.15.39.05.84-.25 1.14l-1.26 1.26c-.77.77-1.9 1.1-2.97.87-2.66-.59-5.2-1.98-7.58-4.35-2.37-2.38-3.76-4.92-4.35-7.58-.23-1.07.1-2.2.87-2.97l1.26-1.26Z"/></svg>`
};

let activeFilter = "todos";

function readRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function fallbackImage(category) {
  return category === "gastronomia"
    ? "https://placehold.co/1200x800?text=Bar+ou+Restaurante"
    : "https://placehold.co/1200x800?text=Hotel+ou+Pousada";
}

function iconLink(href, variantClass, label, iconMarkup) {
  if (!href) return null;
  const a = document.createElement("a");
  a.className = `card-link ${variantClass} card-link--icon`;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.ariaLabel = label;
  a.title = label;
  a.innerHTML = `${iconMarkup}<span class="sr-only">${label}</span>`;
  return a;
}

function createCard(record) {
  const contacts = record.contacts || {};

  const article = document.createElement("article");
  article.className = "attraction-card";
  article.dataset.category = record.category || "";
  article.dataset.pointId = record.pointId || "";

  const image = document.createElement("img");
  image.src = record.photoSrc || fallbackImage(record.category);
  image.alt = record.name || "Estabelecimento";
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h3");
  title.textContent = record.name || "Sem nome";

  const description = document.createElement("p");
  description.textContent = record.description || "Sem descricao informada.";

  const meta = document.createElement("div");
  meta.className = "card-meta";
  (record.metaLines || []).forEach((line) => {
    const span = document.createElement("span");
    span.textContent = line;
    meta.appendChild(span);
  });

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const mapButton = document.createElement("button");
  mapButton.className = "card-button";
  mapButton.type = "button";
  mapButton.dataset.mapFocus = record.mapFocus || record.pointId || "";
  mapButton.textContent = "Ver no mapa";
  mapButton.addEventListener("click", () => {
    const id = mapButton.dataset.mapFocus || "nao informado";
    alert(`ID de mapa deste card: ${id}`);
  });

  const linksInline = document.createElement("div");
  linksInline.className = "card-actions-inline";

  const instagramLink = iconLink(contacts.instagram, "card-link--instagram", "Instagram", ICONS.instagram);
  const whatsappLink = iconLink(contacts.whatsapp, "card-link--whatsapp", "WhatsApp", ICONS.whatsapp);
  const emailHref = contacts.email ? `mailto:${contacts.email}` : "";
  const emailLink = iconLink(emailHref, "card-link--email", "E-mail", ICONS.email);
  const phoneLink = iconLink(contacts.phoneUrl, "card-link--phone", "Contato", ICONS.phone);

  [instagramLink, whatsappLink, emailLink, phoneLink].forEach((link) => {
    if (link) linksInline.appendChild(link);
  });

  actions.appendChild(mapButton);
  if (linksInline.children.length > 0) {
    actions.appendChild(linksInline);
  }

  content.appendChild(title);
  content.appendChild(description);
  if ((record.metaLines || []).length > 0) {
    content.appendChild(meta);
  }
  content.appendChild(actions);

  article.appendChild(image);
  article.appendChild(content);

  return article;
}

function setStatus(records, visibleCount) {
  if (records.length === 0) {
    statusText.textContent = "Nenhum cadastro salvo no navegador.";
    return;
  }

  const categoryText = activeFilter === "todos"
    ? "todas as categorias"
    : (activeFilter === "gastronomia" ? "bares/restaurantes" : "hoteis/pousadas");

  statusText.textContent = `Exibindo ${visibleCount} de ${records.length} cadastro(s) em ${categoryText}.`;
}

function renderCards() {
  const records = readRecords();
  const filtered = activeFilter === "todos"
    ? records
    : records.filter((item) => item.category === activeFilter);

  cardsGrid.innerHTML = "";

  filtered.forEach((record) => {
    cardsGrid.appendChild(createCard(record));
  });

  emptyState.hidden = filtered.length !== 0;
  setStatus(records, filtered.length);
}

function setActiveFilter(filterValue) {
  activeFilter = filterValue;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === filterValue);
  });
  renderCards();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter || "todos");
  });
});

refreshBtn.addEventListener("click", () => {
  renderCards();
});

clearBtn.addEventListener("click", () => {
  const ok = confirm("Deseja realmente apagar todos os estabelecimentos cadastrados neste navegador?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  renderCards();
});

renderCards();
