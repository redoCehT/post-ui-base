import postApi from "./api/postApi.js";
import utils from "./utils.js";
import queryString from "../libs/querystring/querystring.js";

const wrapImageWithAnchorTag = (imageElement, anchorTag) => {
  imageElement.parentNode.insertBefore(anchorTag, imageElement);
  anchorTag.appendChild(imageElement);
};

const createAnchorTag = (src) => {
  const anchorTag = document.createElement('a');
  anchorTag.href = src;
  anchorTag.setAttribute('data-lightbox', 'image');
  anchorTag.setAttribute('data-title', 'Picsum photos');
  return anchorTag;
};

const renderPost = (post) => {
  // Set banner image
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl)
  // Set title
  utils.setTextByElementId('postDetailTitle', post.title);
  // Set author
  utils.setTextByElementId('postDetailAuthor', post.author);
  // Set date time
  utils.setTextByElementId('postDetailTimeSpan', utils.formatDate(post.updatedAt));
  // Set description
  utils.setTextByElementId('postDetailDescription', utils.truncateTextlength(post.description, 100));

  // Wrap image with anchor tag to use Lightbox
  const imageElementNodeList = document.querySelectorAll('img.post-image');
  if (imageElementNodeList) {
    imageElementNodeList.forEach((imageElement) => {
      // Create anchor tag
      const anchorTag = createAnchorTag(imageElement.src);
      // Wrap image with anchor tag
      wrapImageWithAnchorTag(imageElement, anchorTag);
    })
  }
};

const renderEditLink = (post) => {
  const editLink = document.querySelector('#goToEditPageLink');
  if (editLink) {
    editLink.href = `add-edit-post.html?postId=${post.id}`;
    editLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
  }
};

// MAIN LOGIC
// -----------------------
// ---------------------------
const init = async () => {
  try {
    // Retrieve postId from query params
    let search = window.location.search;
    if (search) {
      search = search.substring(1);
    }
    const { postId } = queryString.parse(search);
    const detail = await postApi.getDetail(postId);
    // render post
    renderPost(detail);
    // update edit link
    renderEditLink(detail);
  } catch (error) {
    console.log('Failed to get post detail', error);
  }
};

init();
