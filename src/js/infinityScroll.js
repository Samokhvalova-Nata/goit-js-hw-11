import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createGalleryCards from '../templates/gallery-card.hbs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
}
let gallery = null;
const pixabayAPI = new PixabayAPI();
refs.formEl.addEventListener('submit', handleSearchFormSubmit);


async function handleSearchFormSubmit(evt) {
    evt.preventDefault();
    clearMarkup();
    observer.unobserve(refs.sentinel);

    pixabayAPI.query = evt.target.elements.searchQuery.value.trim();
    pixabayAPI.resetPage();

    if (pixabayAPI.query === '') {
        Notify.failure("Sorry, enter something in search line.");
        return;
    };

    try {
        const { data } = await pixabayAPI.fetchPhotos();
        if (data.hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            refs.formEl.reset();
            return;
        }
        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        refs.galleryEl.innerHTML = createGalleryCards(data.hits);
        pixabayAPI.incrementPage();

        if (Math.ceil(data.totalHits / pixabayAPI.count) !== pixabayAPI.page) {
            observer.observe(refs.sentinel);
        }

        gallery = new SimpleLightbox('.gallery  a', {
                captionDelay: 250,
                scrollZoom: false,
        });
    } catch (err) {
        console.log(err);
    }
};

    const onEntry = async (entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting && pixabayAPI.query !== '') {

            try {
                const { data } = await pixabayAPI.fetchPhotos();
                refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
                pixabayAPI.incrementPage();

                gallery.refresh();
                smoothScroll();
            } catch (err) {
                console.log(err);
            }
        }
    };
};

const options = {
    rootMargin: '150px',
};
const observer = new IntersectionObserver(onEntry, options);





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



