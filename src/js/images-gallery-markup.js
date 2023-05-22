import { getRefs } from './refs';
export { createImagesGalleryMarkup, clearGalleryMarkup, appendImagesMarkup };

const refs = getRefs();

/**
 *adds markup for new image cards
 *
 * @param {object} imagesArray - array of objects
 */
function appendImagesMarkup(imagesArray) {
  const imagesGalleryMarkup = createImagesGalleryMarkup(imagesArray);
  refs.galleryList.insertAdjacentHTML('beforeend', imagesGalleryMarkup);
}

/**
 *clears the markup of image cards
 */
function clearGalleryMarkup() {
  refs.galleryList.innerHTML = '';
}

/**
 *create markup for new image cards
 *
 * @param {object} imagesArray - array of objects
 * @returns {string} - markup for new image cards
 */
function createImagesGalleryMarkup(imagesArray) {
  return imagesArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="gallery-item">
  <div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes<br /><span>${likes}</span></b>
      </p>
      <p class="info-item">
        <b>Views<br /><span>${views}</span></b>
      </p>
      <p class="info-item">
        <b>Comments<br /><span>${comments}</span></b>
      </p>
      <p class="info-item">
        <b>Downloads<br /><span>${downloads}</span></b>
      </p>
    </div>
  </div>
</li>
`
    )
    .join('');
}
