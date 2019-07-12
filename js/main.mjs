'use strict';

import AppConstants from "./appConstants.js";


// ------LEARNING---------



// getPostList function

const getPostList = () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(`${AppConstants.API_URL}/posts?_sort=updatedAt&_order=desc`, options)
    .then(response => {
      // console.log(response);

      if (response.status >= 200 && response.status < 300) {
        // response.json().then(data => console.log(data));
        return response.json();
      }
    });
};

getPostList().then(data => console.log(data));

// getPostList function async - await version

const getPostListAsync = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const URL = `${AppConstants.API_URL}/posts?_sort=updatedAt&_order=desc`;
  const response = await fetch(URL, options);
  if (response.status >= 200 && response.status < 300) {
    // response.json().then(data => console.log(data));
    return response.json();
  }
};

// getPostListAsync().then(data => console.log(data));
// await getPostListAsync();

// getPostDetail function async - await version

const getPostDetail = async (postID) => {

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const URL = `${AppConstants.API_URL}/posts/${postID}`;
  const response = await fetch(URL, options);
  if (response.status >= 200 && response.status < 300) {
    // response.json().then(data => console.log(data));
    return response.json();
  }
};


// updatePost function async - await version

const updatePost = async (post) => {

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  };
  const URL = `${AppConstants.API_URL}/posts/${post.id}`
  const response = await fetch(URL, options);
  if (response.status >= 200 && response.status < 300) {
    // response.json().then(data => console.log(data));
    return response.json();
  }
};





// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  // Write your logic here ....
  const data = await getPostListAsync();
  const detail = await getPostDetail('1356b24a-8b63-41dc-9bbe-1bfd5f4a219a');

  detail.author = 'Long Nguyen';
  const update = await updatePost(detail);

  console.log(data, detail, update);
};

init();
