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

    fetchPhotos() {
        const searchParams = new URLSearchParams({
            q: this.query,
            page: this.page,
            ...this.baseSearchParams,
        });

        return fetch(`${this.#BASE_URL}?${searchParams}`)
            .then( response => {
                if (!response.ok) {
                    throw new Error(res.statusText);
                }
                return response.json();
                }
            );
    }
}   
