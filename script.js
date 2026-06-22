const properties = [
  {
    id: '1',
    title: '742 Maple Street',
    price: '$389,000',
    beds: '3',
    baths: '2',
    imageAlt: 'Modern two-story home exterior',
    image: 'https://images.unsplash.com/photo-1560185127-6f4d63c6a65e?auto=format&fit=crop&w=400&q=80',
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
    const dislikeButton = row.querySelector('.dislike-button');
    if (likedIds.includes(id)) {
      likeButton.textContent = 'Liked';
      likeButton.disabled = true;
      dislikeButton.disabled = false;
    } else {
      likeButton.textContent = 'Like';
      likeButton.disabled = false;
      dislikeButton.disabled = false;
    }
  });
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
    propertyCard.innerHTML = `
      <h3>${property.title}</h3>
      <p><strong>Price:</strong> ${property.price}</p>
      <p><strong>Bedrooms:</strong> ${property.beds} &bull; <strong>Bathrooms:</strong> ${property.baths}</p>
      <img src="${property.image}" alt="${property.imageAlt}">
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
    const row = button.closest('tr');
    if (!row) return;
    const id = row.dataset.id;
    let likedIds = getLikedProperties();

    if (button.classList.contains('like-button')) {
      if (!likedIds.includes(id)) {
        likedIds.push(id);
        saveLikedProperties(likedIds);
      }
    }

    if (button.classList.contains('dislike-button')) {
      likedIds = likedIds.filter((existingId) => existingId !== id);
      saveLikedProperties(likedIds);
    }

    updateButtonStates();
  });
}

function initPage() {
  updateButtonStates();
  attachTableListeners();
  renderLikedProperties();
}

document.addEventListener('DOMContentLoaded', initPage);
