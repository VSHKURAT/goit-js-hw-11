import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/?key=27703971-6664942d76d9cc6bb597264ae&image_type=photo&orientation=horizontal&safesearch=true'
const refs = {
    form : document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

refs.loadMoreBtn.classList.add('hide')
refs.form.addEventListener('input', onFormInput)
refs.form.addEventListener('submit', onFormSubmit)
refs.loadMoreBtn.addEventListener('click', onBtnLoadMore )
let userInput = null
let counter = 1

function onFormInput(event){
refs.gallery.innerHTML = ''
counter = 1
refs.loadMoreBtn.classList.add('hide')
return  userInput = event.target.value

}

async function  onFormSubmit(e){
e.preventDefault()

try{
    const response = await axios.get(`${BASE_URL}&q=${userInput}&per_page=40&page=${counter}`);
    if(response.data.hits.length === 0){
    Notiflix.Notify.warning(`Sorry, there are no images matching your search query. Please try again.`)
    } 
    else {
const images = response.data.hits
createMarkup(images)
Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
counter += 1
console.log(response.data)
    }
    
} catch(error){
Notiflix.Notify.warning(`${error}`)
} 
}



async function onBtnLoadMore(){
try{
    const response = await axios.get(`${BASE_URL}&q=${userInput}&per_page=40&page=${counter}`);
    if(response.data.hits.length === 0){
    refs.loadMoreBtn.classList.add('hide')
    Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`)
    } 
    else {
const images = response.data.hits
createMarkup(images)
counter += 1
    }
    
} catch(error){
Notiflix.Notify.warning(`Sorry, there are no images matching your search query. Please try again.`)
} 

}





function createMarkup(images){
const markup = images.map(image => {
return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" width=250px loading="lazy"/>
  <div class="info">
    <div class="info-item">
      <b class="stats">Likes</b>
      <p>${image.likes}</p>
    </div>
    <div class="info-item">
      <b class="stats">Views</b>
      <p>${image.views}</p>
    </div>
    <div class="info-item">
      <b class="stats">Comments</b>
      <p>${image.comments}</p>
    </div>
    <div class="info-item">
      <b class="stats">Downloads</b>
      <p>${image.downloads}</p>
    </div>
  </div>
</div>`
}).join('')
refs.gallery.insertAdjacentHTML('beforeend', markup)
refs.loadMoreBtn.classList.remove('hide')
}