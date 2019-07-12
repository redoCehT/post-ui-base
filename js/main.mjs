'use strict';

import AppConstants from "./appConstants.js";
import postApi from "./api/postApi.js";
import utils from "./utils.js";
import queryString from "../libs/querystring/querystring.js";

const handleRemoveClicked = async (post) => {
  try {
    const confirmMessage = `Remove this post ${post.title} ???`;
    if (window.confirm(confirmMessage)) {
      await postApi.remove(post.id);

      window.location.reload();
    }
  } catch (error) {
    alert('Failed to remove post:', error);
  }
};

const buildPostItem = (post) => {
  const templateId = document.querySelector('#postItemTemplate');
  const postItemFragment = templateId.content.cloneNode(true);
  const postItemElement = postItemFragment.querySelector('li');

  // Set title
  utils.setTextByElementIdInNode(postItemElement, '#postItemTitle', post.title);
  // Set author
  utils.setTextByElementIdInNode(postItemElement, '#postItemAuthor', post.author);
  // Set description
  utils.setTextByElementIdInNode(postItemElement, '#postItemDescription', utils.truncateTextlength(post.description, 100));
  // Set date time
  utils.setTextByElementIdInNode(postItemElement, '#postItemTimeSpan', utils.formatDate(post.updatedAt));
  // Set image
  utils.setImageUrlSrcByElementInNode(postItemElement, '#postItemImage', utils.setNewSizeToPicsumUrl(post.imageUrl, '400', '177'));

  // Add item clicked event to go to detail page
  const postItem = postItemElement.querySelector('#postItem');
  if (postItem) {
    postItem.removeAttribute('id');
    postItem.addEventListener('click', () => {
      const detailPageUrl = `post-detail.html?postId=${post.id}`;

      window.location = detailPageUrl;
    });
  }

  // Add edit icon clicked event to go to edit page
  const editIcon = postItemElement.querySelector('#postItemEdit');
  if (editIcon) {
    editIcon.removeAttribute('id');
    editIcon.addEventListener('click', (e) => {
      const editPageUrl = `add-edit-post.html?postId=${post.id}`;

      window.location = editPageUrl;

      e.stopPropagation();
    })
  };

  // Add remove icon clicked event to remove post
  const removeIcon = postItemElement.querySelector('#postItemRemove');
  if (removeIcon) {
    removeIcon.removeAttribute('id');
    removeIcon.addEventListener('click', (e) => {
      handleRemoveClicked(post);

      e.stopPropagation();
    });
  }
  return postItemElement;
};


const resetPostsElementNode = (postsElement) => {
  if (postsElement) {
    while (postsElement.firstChild) {
      postsElement.removeChild(postsElement.firstChild);
    }
  }
};

const renderListOfPosts = (posts) => {
  const postsElement = document.getElementById('postsList');

  if (postsElement) {
    // Clean up current list of posts displayed on UI
    resetPostsElementNode(postsElement);

    // Map each post item -> post item element
    if (Array.isArray(posts)) {
      for (const post of posts) {
        const postItemElement = buildPostItem(post);
        if (postItemElement) {
          postsElement.appendChild(postItemElement);
        }
      }
    }
  } else {
    console.log('Ooops! Can\'t find postsList item');
  }
};

//
//  Return a list of 3 page value: prev, curr and next
//  -1 means you should hide that item
//  0 means you should disable that item
//  otherwise, show that item
//  @param pagination 
//  
const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let prevPage = -1;

  // Return -1 if invalid page detected
  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];

  // Calculate prev page
  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage, currPage, nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
}

const renderPostsPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    // Search list of 5 page items
    const pageItems = postPagination.querySelectorAll('.page-item');

    // Just to make sure pageItems has exactly 5 items
    if (pageItems.length === 5) {
      pageItems.forEach((item, idx) => {
        switch (pageList[idx]) {
          case -1:
            item.setAttribute('hidden', '');
            break;
          case 0:
            item.classList.add('disabled');
            break;
          default: {
            // Find page link
            const pageLink = item.querySelector('.page-link');
            if (pageLink) {
              // Update href of page link
              pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

              // Update text content of page link for item: 1, 2, 3 (zero base)
              if (idx > 0 && idx < 4) {
                pageLink.textContent = pageList[idx];
              }
            }

            // Set current active page item, only for 1, 2, 3 (zero base)
            if (idx > 0 && idx < 4 && pageList[idx] === _page) {
              item.classList.add('active');
            }
          }
        }
      });

      // Show pagination
      postPagination.removeAttribute('hidden');
    }
  }
};

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  try {
    let search = window.location.search;
    if (search) {
      search = search.substring(1);
      console.log(search);
    }
    const { _page, _limit } = queryString.parse(search);

    const params = {
      _page: _page || AppConstants.DEFAULT_PAGE,
      _limit: _limit || AppConstants.DEFAULT_LIMIT,
      _sort: 'updatedAt',
      _order: 'desc',
    };

    const response = await postApi.getAll(params);
    console.log(response);
    if (response) {
      const { data: posts, pagination } = response;
      renderListOfPosts(posts);
      renderPostsPagination(pagination);
    }

  } catch (error) {
    console.log('Failed to fetch post list', error);
  }
};

init();
