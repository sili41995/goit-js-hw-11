import axios from 'axios';
export { ImagesApiService };

const URL = 'https://pixabay.com/api/';
const API_KEY = '35942187-b77c4f748861cf3ef2baf285c';
const filters = 'image_type=photo&orientation=horizontal&safesearch=true';
class ImagesApiService {
  constructor() {
    this.searchQuarry = '';
    this.perPage = 40;
    this.page = 1;
  }

  async fetchImages() {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuarry}&${filters}&per_page=${this.perPage}&page=${this.page}`
    );
    const { data } = await response;

    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetSearchQuarry() {
    this.searchQuarry = '';
  }

  get quarry() {
    return this.searchQuarry;
  }

  set quarry(newSearchQuarry) {
    this.searchQuarry = newSearchQuarry;
  }

  get numberPerPage() {
    return this.perPage;
  }
}
