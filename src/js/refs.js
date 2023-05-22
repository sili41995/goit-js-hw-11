export { getRefs };

function getRefs() {
  return {
    searchForm: document.querySelector('#search-form'),
    galleryList: document.querySelector('.gallery-list'),
    loadMoreBtn: document.querySelector('.load-more'),
  };
}
