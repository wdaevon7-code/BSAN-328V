const properties = [
  {
    id: '1',
    title: '742 Maple Street',
    price: '$389,000',
    beds: '3',
    baths: '2',
    imageAlt: 'Modern two-story home exterior',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: '185 Oak Avenue',
    price: '$312,500',
    beds: '2',
    baths: '1',
    imageAlt: 'Cozy bungalow with front porch',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: '920 Pine Lane',
    price: '$450,000',
    beds: '4',
    baths: '3',
    imageAlt: 'Townhouse with balcony overlooking street',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
  },
];

function getLikedProperties() {
  const saved = localStorage.getItem('likedProperties');
  return saved ? JSON.parse(saved) : [];
}

function saveLikedProperties(list) {
  localStorage.setItem('likedProperties', JSON.stringify(list));
}

function updateButtonStates() {
  const likedIds = getLikedProperties();
  document.querySelectorAll('tr[data-id]').forEach((row) => {
    const id = row.dataset.id;
    const likeButton = row.querySelector('.like-button');
    if (!likeButton) return;

    if (likedIds.includes(id)) {
      likeButton.textContent = 'Liked';
      likeButton.disabled = true;
    } else {
      likeButton.textContent = 'Like';
      likeButton.disabled = false;
    }
  });
}

function removeLikedProperty(id) {
  const likedIds = getLikedProperties().filter((existingId) => existingId !== id);
  saveLikedProperties(likedIds);
  renderLikedProperties();
  updateButtonStates();
}

function renderLikedProperties() {
  const likedSection = document.getElementById('liked-properties');
  if (!likedSection) return;

  const likedIds = getLikedProperties();
  likedSection.innerHTML = '';

  if (likedIds.length === 0) {
    likedSection.innerHTML = '<p class="empty-message">You haven\'t liked any properties yet. Visit the browse page to save homes you love.</p>';
    return;
  }

  likedIds.forEach((id) => {
    const property = properties.find((item) => item.id === id);
    if (!property) return;
    const propertyCard = document.createElement('article');
    propertyCard.className = 'liked-property';
    propertyCard.dataset.id = property.id;
    propertyCard.innerHTML = `
      <h3>${property.title}</h3>
      <p><strong>Price:</strong> ${property.price}</p>
      <p><strong>Bedrooms:</strong> ${property.beds} &bull; <strong>Bathrooms:</strong> ${property.baths}</p>
      <img src="${property.image}" alt="${property.imageAlt}">
      <button class="remove-button" type="button">Remove</button>
    `;
    likedSection.appendChild(propertyCard);
  });
}

function attachTableListeners() {
  const table = document.getElementById('property-list');
  if (!table) return;

  table.addEventListener('click', (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement)) return;
    if (!button.classList.contains('like-button')) return;

    const row = button.closest('tr');
    if (!row) return;

    const id = row.dataset.id;
    const likedIds = getLikedProperties();

    if (!likedIds.includes(id)) {
      likedIds.push(id);
      saveLikedProperties(likedIds);
      updateButtonStates();
    }
  });
}

function attachLikedListeners() {
  const likedSection = document.getElementById('liked-properties');
  if (!likedSection) return;

  likedSection.addEventListener('click', (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement)) return;
    if (!button.classList.contains('remove-button')) return;

    const propertyCard = button.closest('.liked-property');
    if (!propertyCard) return;

    removeLikedProperty(propertyCard.dataset.id);
  });
}

function attachMenuToggle() {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!menuButton || !nav) return;

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

function attachContactFormListeners() {
  const moveInRadios = document.querySelectorAll('input[name="move-in"]');
  const otherMoveInContainer = document.getElementById('other-move-in-container');
  const moveInDateField = document.getElementById('move-in-date');

  if (!moveInRadios.length || !otherMoveInContainer || !moveInDateField) return;

  const toggleMoveInDateField = () => {
    const selectedOption = document.querySelector('input[name="move-in"]:checked');
    const shouldShow = selectedOption && selectedOption.value === 'other';

    otherMoveInContainer.hidden = !shouldShow;

    if (!shouldShow) {
      moveInDateField.value = '';
    }
  };

  moveInRadios.forEach((radio) => {
    radio.addEventListener('change', toggleMoveInDateField);
  });

  toggleMoveInDateField();
}

function initPage() {
  attachTableListeners();
  attachLikedListeners();
  attachMenuToggle();
  attachContactFormListeners();
  updateButtonStates();
  renderLikedProperties();
}

document.addEventListener('DOMContentLoaded', initPage);
