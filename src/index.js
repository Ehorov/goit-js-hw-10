import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';
import renderCountriesTpl from '../src/templates/renderCountriesTpl';
import renderCountryTpl from '../src/templates/renderCountryTpl';

import './css/styles.css';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInputEnterValue, DEBOUNCE_DELAY));

function onInputEnterValue(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    return cleaningRenderCountries();
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return cleaningRenderCountries();
      }
      if (countries.length >= 2 && countries.length <= 10) {
        refs.countryInfo.innerHTML = '';
        Notify.success('You found some countries.');
        cleaningRenderCountries();
        return renderCountries(countries);
      }
      if (countries.length === 1) {
        refs.countryList.innerHTML = '';
        Notify.success('You found one country.');
        cleaningRenderCountries();
        return renderCountry(countries);
      }
    })
    .catch(error => {
      console.log(error);
      errorHandler();
      cleaningRenderCountries();
    });
}

function renderCountries(countries) {
  const markup = renderCountriesTpl(countries);
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountry(countries) {
  const markup = renderCountryTpl(countries);
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function errorHandler() {
  Notify.failure('Oops, there is no country with that name.');
}

function cleaningRenderCountries() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
