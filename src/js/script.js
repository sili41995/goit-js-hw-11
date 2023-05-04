import { fetchImages } from './images-service';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('#search-form'),
};

refs.searchForm.addEventListener('submit', onSearchForm);

console.log(refs.searchForm);
function onSearchForm(e) {
  e.preventDefault();

  fetchImages(axios);
}
