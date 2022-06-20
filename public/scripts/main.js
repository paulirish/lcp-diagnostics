const grid = document.getElementById('photo-grid');
const gridNeedsRendering = !grid.innerHTML.match(/\S/);

function getSrcSet(name, ext) {
  return `/images/large/${name}.${ext} 1600w, /images/med/${name}.${ext} 800w`;
}

async function renderPhotoViewer(photos) {
  grid.innerHTML = `
    <img src="/images/large/${photos[0].slug}.jpg" alt="London">
    <div class="photo-grid-thumbnails">${
      photos.map(({slug, alt}) => {
        return `<img class="photo-grid-thumbnail"
          src="/images/thumbs/${slug}.jpg"
          alt="${alt}">
        </img>`;
      }).join('')
    }</div>
  `.replace(/\s+/g, ' ');

  // Wait until all images have loaded and finished decoding.
  await Promise.all([...grid.querySelectorAll('img')].map((i) => {
    return new Promise((res) => i.onload = () => i.decode().then(res));
  }));

  requestAnimationFrame(() => grid.classList.add('active'));
}

async function hydratePhotoViewer() {
  document.addEventListener('click', () => {
    // TODO: swap images...
  })
}

async function main() {
  if (gridNeedsRendering) {
    const response = await fetch('/api/photos.json');
    const photos = await response.json();

    await renderPhotoViewer(photos);
  }

  await hydratePhotoViewer();
}

main();