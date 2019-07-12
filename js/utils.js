import AppConstants from './appConstants.js';

const truncateTextlength = (text, length) => {
  if (length < 0 || !text) return '';

  const truncatedText = text.length > length
    ? `${text.substring(0, length - 3)}...`
    : text;

  return truncatedText;
};

const formatDate = (dateString) => {
  if (!dateString) return null;

  // Format: HH:mm dd/MM/yyyy
  const date = new Date(dateString);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();

  return `${hour}:${minute} ${day}/${month}/${year}`;
};

const setNewSizeToPicsumUrl = (imageUrl, length, width) => {
  const urlFragmentArray = imageUrl.split('/');
  if (urlFragmentArray) {
    // Delete 2 last item in the array
    const urlFragmentArrayDel2Last = urlFragmentArray.filter((_, i, arr) => i < arr.length - 2);
    // Push 2 new item to the array
    const newUrlFragmentArray = [...urlFragmentArrayDel2Last, length, width];
    return newUrlFragmentArray.join('/');
  }
};

const setImageUrlSrcByElementInNode = (node, elementId, imageUrl) => {
  const element = node.querySelector(elementId);
  if (element) {
    element.src = imageUrl || AppConstants.DEFAULT_IMAGE_URL;
    element.removeAttribute('id');
  }
}

const setTextByElementIdInNode = (node, elementId, text) => {
  const element = node.querySelector(elementId);
  if (element) {
    element.innerText = text;
    element.removeAttribute('id');
  }
};

const setTextByElementId = (elementId, text) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = text;
  }
};

const setValueByElementId = (elementId, value) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value;
  }
};

const getValueByElementId = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    return element.value;
  }
};

const setBackgroundImageByElementId = (elementId, imageUrl) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.backgroundImage = `url(${imageUrl || AppConstants.DEFAULT_IMAGE_URL})`;
  }
};

const getBackgroundImageByElementId = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    const url = element.style.backgroundImage;
    const firstDoubleQuotePosition = url.indexOf("\"");
    const lastDoubleQuotePosition = url.lastIndexOf("\"");
    return url.substring(firstDoubleQuotePosition + 1, lastDoubleQuotePosition);
  }
};

const addClassByElementId = (elementId, classList) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add(...classList);
  }
};

const removeClassByElementId = (elementId, classList) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove(...classList);
  }
};

const randomNumber = (min, max) => min + Math.trunc(Math.random() * (max - min));

const utils = {
  truncateTextlength,
  formatDate,
  setNewSizeToPicsumUrl,
  setImageUrlSrcByElementInNode,
  setTextByElementIdInNode,
  setTextByElementId,
  setValueByElementId,
  getValueByElementId,
  setBackgroundImageByElementId,
  getBackgroundImageByElementId,
  addClassByElementId,
  removeClassByElementId,
  randomNumber,
};
export default utils;
