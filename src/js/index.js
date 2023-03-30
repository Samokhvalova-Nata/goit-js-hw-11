import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createGalleryCards from '../templates/gallery-card.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    formEl: document.querySelector('.search-form'),
    loadMoreBtnEl: document.querySelector('.load-more'),
    galleryEl: document.querySelector('.gallery'),
}
let gallery = null;
const pixabayAPI = new PixabayAPI();

refs.formEl.addEventListener('submit', handleSearchFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

function handleSearchFormSubmit(evt) {
    evt.preventDefault();

    pixabayAPI.query = evt.target.elements.searchQuery.value.trim();
    if (pixabayAPI.query === '') {
        Notify.failure("Sorry, enter something in search line.");
        return;
    };

    pixabayAPI.resetPage();
    pixabayAPI.fetchPhotos()
        .then(({ data }) => {
            console.log(data)

            if (data.hits.length === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                clearMarkup();
                refs.loadMoreBtnEl.classList.add('is-hidden');
                return;
            }
            Notify.success(`Hooray! We found ${data.totalHits} images.`);

            refs.galleryEl.innerHTML = createGalleryCards(data.hits);
            refs.loadMoreBtnEl.classList.remove('is-hidden');

            gallery = new SimpleLightbox('.gallery  a', {
                captionDelay: 250,
                scrollZoom: false,
            });

            if (data.totalHits <= pixabayAPI.count) {
                refs.loadMoreBtnEl.classList.add('is-hidden');
            };
            smoothScroll();
        })
        .catch(console.log)
}

function handleLoadMoreBtnClick() {
    pixabayAPI.incrementPage();

    pixabayAPI.fetchPhotos()
        .then(({ data }) => {

            if (Math.ceil(data.totalHits / pixabayAPI.count) === pixabayAPI.page) {
                refs.loadMoreBtnEl.classList.add('is-hidden');
                Notify.info("We're sorry, but you've reached the end of search results.");
            }

            refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
            gallery.refresh();

            smoothScroll();
        })
        .catch(console.log)
}

function clearMarkup() {
    refs.galleryEl.innerHTML = '';
}

function smoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    console.log(document.querySelector(".gallery").firstElementChild.getBoundingClientRect());
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}
