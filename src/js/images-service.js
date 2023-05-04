export { fetchImages };

class NewFetchImages
  
async function fetchImages(axios) {
  const URL = 'https://pixabay.com/api/';
  const API_KEY = '35942187-b77c4f748861cf3ef2baf285c';
  try {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuarry}&${this.filters}`
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

this.filters = 'image_type=photo&orientation=horizontal&safesearch=true';
