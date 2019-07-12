'use strict';

import queryString from "../../libs/querystring/querystring.js";

const request = async (url, options) => {
  try {
    const requestOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, requestOptions);
    if (response.status >= 200 && response.status < 300) {
      // response.json().then(data => console.log(data));
      return response.json();
    }
    console.log(response);
    // Handle Error
    const error = new Error(response.status);
    throw error;
  } catch (error) {
    throw error;
  }
};

const get = (url, params) => {
  const paramsString = params ? `?${queryString.stringify(params)}` : '';
  const requestUrl = `${url}${paramsString}`;

  return request(requestUrl, { method: 'GET' });
};

const post = (url, body) => request(url, { body: JSON.stringify(body), method: 'POST' });

const patch = (url, body) => request(url, { body: JSON.stringify(body), method: 'PATCH' });

const deleteRequest = (url) => request(url, { method: 'DELETE' });

const fetchClient = {
  get,
  post,
  patch,
  delete: deleteRequest,
};

export default fetchClient;