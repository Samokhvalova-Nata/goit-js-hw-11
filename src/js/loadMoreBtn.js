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


async function handleSearchFormSubmit(evt) {
    evt.preventDefault();
    clearMarkup();

    pixabayAPI.query = evt.target.elements.searchQuery.value.trim();
    pixabayAPI.resetPage();

    if (pixabayAPI.query === '') {
        Notify.failure("Sorry, enter something in search line.");
        hideLoadMoreBtn();
        return;
    };

    try {
        const { data } = await pixabayAPI.fetchPhotos();
        if (data.hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            hideLoadMoreBtn();
            refs.formEl.reset();
            return;
        }

        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.galleryEl.innerHTML = createGalleryCards(data.hits);
        showLoadMoreBtn();

        gallery = new SimpleLightbox('.gallery  a', {
                captionDelay: 250,
                scrollZoom: false,
        });

        if (data.totalHits <= pixabayAPI.count) {
            hideLoadMoreBtn();
        };
    } catch (err) {
        console.log(err);
    }
};

async function handleLoadMoreBtnClick(evt) {
    pixabayAPI.incrementPage();

    try {
        const { data } = await pixabayAPI.fetchPhotos();
        
        if (Math.ceil(data.totalHits / pixabayAPI.count) === pixabayAPI.page) {
            hideLoadMoreBtn();
            Notify.info("We're sorry, but you've reached the end of search results.");
        }

        refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
        gallery.refresh();
        smoothScroll();
    } catch (err) {
        console.log(err);
    }
};

function clearMarkup() {
    refs.galleryEl.innerHTML = '';
};

function smoothScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

function hideLoadMoreBtn() {
    refs.loadMoreBtnEl.classList.add('is-hidden');
};

function showLoadMoreBtn() {
    refs.loadMoreBtnEl.classList.remove('is-hidden');
};
