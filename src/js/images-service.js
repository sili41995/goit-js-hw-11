import axios from 'axios';
export { ImagesApiService };
class ImagesApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  /**
   *makes a request to the public API of the Pixabay service
   *
   * @returns {object} - the result of a request to the public API of the Pixabay service
   */
  async fetchImages() {
    const URL = 'https://pixabay.com/api/';
    const API_KEY = '35942187-b77c4f748861cf3ef2baf285c';

    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: this.page,
    });

    const response = await axios.get(`${URL}?${searchParams}`);
    this.incrementPage();
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get searchQuery() {
    return this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
