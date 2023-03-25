import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createGalleryCards from '../templates/gallery-card.hbs';


const refs = {
    formEl: document.querySelector('.search-form'),
    loadMoreBtnEl: document.querySelector('.load-more'),
    galleryEl: document.querySelector('.gallery'),
}

const pixabayAPI = new PixabayAPI();

refs.formEl.addEventListener('submit', handleSearchFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleSearchFormSubmit(evt) {
    evt.preventDefault();

    pixabayAPI.query = evt.target.elements.searchQuery.value.trim();

    pixabayAPI.fetchPhotos()
        .then(data => {
            console.log(data)

            if (data.hits.length === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }

            refs.galleryEl.innerHTML = createGalleryCards(data.hits);
            refs.loadMoreBtnEl.classList.remove('is-hidden');
        })
        .catch(console.log)
}

function handleLoadMoreBtnClick() {
    pixabayAPI.page += 1;

    pixabayAPI.fetchPhotos()
        .then(data => {

            refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
        }
        ).catch(console.log)
}
