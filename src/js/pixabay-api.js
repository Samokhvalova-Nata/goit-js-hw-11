import axios from 'axios';

export class PixabayAPI {
    #API_KEY = '8567776-638120a8f010cc2219911b3d1';
    #BASE_URL = 'https://pixabay.com/api/';

    constructor() {
        this.query = '';
        this.page = 1;
        this.count = 40;
    }

    fetchPhotos() {
        return axios.get(`${this.#BASE_URL}`, {
            params: {
                q: this.query,
                page: this.page,
                per_page: this.count,
                key: this.#API_KEY,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
            },
        });
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}   
