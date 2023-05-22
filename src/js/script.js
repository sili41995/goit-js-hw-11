import { ImagesApiService } from './images-service';
import {
  clearGalleryMarkup,
  appendImagesMarkup,
} from './images-gallery-markup';
import { getRefs } from './refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imagesApiService = new ImagesApiService();
const lightbox = new SimpleLightbox('.gallery-list a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = getRefs();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();

  imagesApiService.searchQuery = e.target.elements.searchQuery.value;

  if (!imagesApiService.searchQuery) {
    return;
  }

  if (refs.loadMoreBtn.style.display === 'block') {
    hideLoadMoreBtn();
  }

  try {
    imagesApiService.resetPage();
    clearGalleryMarkup();
    const {
      data: { hits: imagesArray, totalHits: imagesArrayTotalHits },
    } = await imagesApiService.fetchImages();
    if (imagesArrayTotalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    appendImagesMarkup(imagesArray);
    showLoadMoreBtn();
    lightbox.refresh();
    scrollToImagesGallery(imagesArray.length);
    Notify.info(`Hooray! We found ${imagesArrayTotalHits} images.`);
    window.addEventListener('scroll', onWindowScroll);
  } catch (error) {
    console.log(error);
  }
}

function onWindowScroll() {
  const { y: distanceToLastImageCard } =
    refs.galleryList.lastElementChild.getBoundingClientRect();
  if (distanceToLastImageCard < 700) {
    loadImgCard();
    window.removeEventListener('scroll', onWindowScroll);
  }
}

async function onLoadMoreBtnClick() {
  const {
    data: { hits: imagesArray, totalHits: imagesArrayTotalHits },
  } = await imagesApiService.fetchImages();

  if (refs.galleryList.children.length === imagesArrayTotalHits) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMoreBtn();
    return;
  }
  appendImagesMarkup(imagesArray);
  lightbox.refresh();
  scrollToImagesGallery(imagesArray.length);
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.style.display = 'none';
}

/**
 * makes a smooth scroll to the newly added image card markup
 *
 * @param {number} imagesQuantity - object array length
 */
function scrollToImagesGallery(imagesQuantity) {
  const { y: distanceToNextImageCard } =
    refs.galleryList.children[
      refs.galleryList.children.length - imagesQuantity
    ].getBoundingClientRect();
  const { height: headerHeight } = document
    .querySelector('header')
    .getBoundingClientRect();
  window.scrollBy({
    top: distanceToNextImageCard - headerHeight,
    behavior: 'smooth',
  });
}

// =======================================Infinite=Scroll============
const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      loadImgCard();
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.5 }
);

let totalCards = null;

/**
 *makes a request to the public API of the Pixabay service and adds image card markup on scroll
 *
 */
async function loadImgCard() {
  if (totalCards === refs.galleryList.children.length) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMoreBtn();
    return;
  }
  const {
    data: { hits: imagesArray, totalHits: imagesArrayTotalHits },
  } = await imagesApiService.fetchImages();

  totalCards = imagesArrayTotalHits;
  appendImagesMarkup(imagesArray);
  lightbox.refresh();

  const lastCard = document.querySelector('.gallery-item:last-child');

  if (lastCard) {
    infiniteObserver.observe(lastCard);
  }
}
