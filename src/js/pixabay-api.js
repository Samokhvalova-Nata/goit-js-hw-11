import axios from 'axios';

export class PixabayAPI {
    #API_KEY = '8567776-638120a8f010cc2219911b3d1';
    #BASE_URL = 'https://pixabay.com/api/';

    query = null;
    page = 1;
    count = 40;

    baseSearchParams = {
    per_page: this.count,
    key: this.#API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    };

    async fetchPhotos() {
        try {
            return await axios.get(`${this.#BASE_URL}`, {
                params: {
                    q: this.query,
                    page: this.page,
                    ...this.baseSearchParams,
                },
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}   
