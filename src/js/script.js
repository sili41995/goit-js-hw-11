import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ImagesApiService } from './images-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery-list'),
  loadMoreBtn: document.querySelector('.load-more'),
  coordinatesToCards: document.querySelector('.gallery-list'),
};

let cardIndex = 0;

const lightboxOptions = {
  captionsData: 'alt',
  captionDelay: 250,
};

const lightbox = new SimpleLightbox('.gallery-list a', lightboxOptions);

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadMoreImagesCards();
    }
  },
  {
    rootMargin: '100px',
  }
);

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
window.addEventListener('scroll', onWindowScroll);

async function onSearchForm(e) {
  e.preventDefault();

  hideLoadMoreBtn();

  resetCardIndex();

  clearMarkup();

  imagesApiService.resetPage();

  try {
    imagesApiService.resetSearchQuarry();
    imagesApiService.quarry = createSearchQuarry();

    if (imagesApiService.quarry === '') {
      return;
    }
    const imagesArray = await imagesApiService.fetchImages();
    const { totalHits, hits } = imagesArray;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderMarkup(imagesArray);
    Notify.info(`Hooray! We found ${totalHits} images.`);
    lightbox.refresh();
    scrollToNextImagesCards();
    showLoadMoreBtn();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  try {
    const imagesArray = await imagesApiService.fetchImages();
    addImagesCardsToMarkup(imagesArray);
    lightbox.refresh();
    scrollToNextImagesCards();
    if (refs.galleryList.children.length === imagesArray.totalHits) {
      hideLoadMoreBtn();
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function createImagesMarkup({ hits }) {
  return hits
    .map((image) => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<li class="gallery-item">
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
`;
    })
    .join('');
}

function renderMarkup(imagesArray) {
  refs.galleryList.innerHTML = createImagesMarkup(imagesArray);
}

function clearMarkup() {
  refs.galleryList.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.style.display = 'none';
}

function createSearchQuarry() {
  return refs.searchForm.elements.searchQuery.value.trim().replaceAll(' ', '+');
}

function addImagesCardsToMarkup(imagesArray) {
  refs.galleryList.insertAdjacentHTML(
    'beforeend',
    createImagesMarkup(imagesArray)
  );
}

function scrollToNextImagesCards() {
  const { y: distanceToCards } =
    refs.coordinatesToCards.children[cardIndex].getBoundingClientRect();

  window.scrollBy({
    top: distanceToCards,
    behavior: 'smooth',
  });

  cardIndex += imagesApiService.numberPerPage;
}

function resetCardIndex() {
  cardIndex = 0;
}

function onWindowScroll() {
  const { y: distanceToLastCards } =
    refs.coordinatesToCards.children[
      refs.coordinatesToCards.children.length - 1
    ].getBoundingClientRect();
  if (distanceToLastCards <= 100) {
    loadMoreImagesCards();
  }
}

async function loadMoreImagesCards() {
  try {
    window.removeEventListener('scroll', onWindowScroll);
    const imagesArray = await imagesApiService.fetchImages();
    if (refs.galleryList.children.length === imagesArray.totalHits) {
      hideLoadMoreBtn();
      lightbox.refresh();
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    addImagesCardsToMarkup(imagesArray);

    const lastImageCard = refs.galleryList.lastElementChild;
    if (lastImageCard) {
      infiniteObserver.observe(lastImageCard);
    }
  } catch (error) {
    console.log(error);
  }
}
