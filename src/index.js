import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
// ==================onSearch========================
function onSearch(element) {
  element.preventDefault();
  const trimElement = element.target.value.trim();
  if (!trimElement) {
    return;
  }
  fetchCountries(trimElement)
    .then(onCountryLength)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

// =================Умови=========================
function onCountryLength(countries) {
  if (countries.length > 10) {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countries.length > 2 && countries.length < 10) {
    renderList(countries);
    countryInfo.innerHTML = '';
  }
  if (countries.length === 1) {
    list.innerHTML = '';
    renderCard(countries);
  }
}

// ====================list render=========================
function renderList(countries) {
  const markupList = countries
    .map(country => {
      return `<li class="list-item">
         <span>
          <img width="60px" height="30px"  src="${country.flags.svg}">
          </span> ${country.name.official}
          </li>`;
    })
    .join('');
  list.innerHTML = markupList;
}

// // ====================item render=========================
function renderCard(countries) {
  const countriesInfo = countries
    .map(country => {
      return `<div class=country>
      <h2>
      <span class="country_span">
        <img width="60px" height="30px" src="${country.flags.svg}">
      </span> ${country.name.official}
      </h2>
      <ul>
      <li class="country_capital"> <span class="country_capital--title">Capital: </span> ${
        country.capital
      }</li>
      <li class="country_capital"> <span class="country_capital--title">Population: </span> ${
        country.population
      } </li>
      <li class="country_capital"> <span class="country_capital--title">Languages: </span> ${Object.values(
        country.languages
      )}</li>
      </ul>
      </div>
    `;
    })
    .join('');
  countryInfo.innerHTML = countriesInfo;
}
