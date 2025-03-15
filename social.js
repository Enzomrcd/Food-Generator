document.addEventListener('DOMContentLoaded', function() {
  // ---------------------------
  // DOM ELEMENTS for Post Creation
  // ---------------------------
  const postForm = document.getElementById('post-form');
  const postTitleInput = document.getElementById('post-title');
  const postContentInput = document.getElementById('post-content');
  const postImageInput = document.getElementById('post-image');
  const imagePreviewContainer = document.getElementById('post-image-preview-container');
  const postImagePreview = document.getElementById('post-image-preview');
  const removePostImageBtn = document.getElementById('remove-post-image');
  const postsContainer = document.getElementById('posts-container');

  // ---------------------------
  // Image Preview Functionality
  // ---------------------------
  postImageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        postImagePreview.src = e.target.result;
        imagePreviewContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      imagePreviewContainer.style.display = 'none';
    }
  });

  removePostImageBtn.addEventListener('click', function() {
    postImageInput.value = "";
    imagePreviewContainer.style.display = 'none';
  });

  // ---------------------------
  // Post Form Submission
  // ---------------------------
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    let imageData = null;
    if (postImageInput.files[0]) {
      // Use the image preview's src which is already set
      imageData = postImagePreview.src;
    }

    if (!title || !content) {
      alert("Please fill in both the title and content for your post.");
      return;
    }
    
    // Retrieve current user (if logged in) from sessionStorage; otherwise, default to "Anonymous"
    const currentUser = sessionStorage.getItem('currentUser') || 'Anonymous';
    
    const newPost = {
      title,
      content,
      image: imageData,
      author: currentUser,
      timestamp: new Date().toISOString()
    };

    // Save the new post to localStorage (prepend for latest-first order)
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Render posts and reset the form
    renderPosts();
    postForm.reset();
    imagePreviewContainer.style.display = 'none';
  });

  // ---------------------------
  // Render Posts Function
  // ---------------------------
  function renderPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="no-posts">No posts yet. Be the first to share your creation!</p>';
      return;
    }
    
    posts.forEach((post) => {
      const postCard = document.createElement('div');
      postCard.className = 'post-card';
      
      // Format timestamp for display
      const postDate = new Date(post.timestamp).toLocaleString();
      
      let postImageHtml = '';
      if (post.image) {
        postImageHtml = `
          <div class="post-image-container">
            <img src="${post.image}" alt="Post Image" class="post-image">
          </div>
        `;
      }
      
      postCard.innerHTML = `
        <div class="post-header">
          <div class="post-author">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}" alt="Author Avatar" class="author-avatar">
            <div class="author-info">
              <span class="author-name">${post.author}</span>
              <span class="post-date">${postDate}</span>
            </div>
          </div>
        </div>
        <div class="post-content">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-text">${post.content}</p>
          ${postImageHtml}
        </div>
        <div class="post-actions">
          <button class="like-button"><i class="fas fa-heart"></i> Like</button>
          <button class="comment-button"><i class="fas fa-comment"></i> Comment</button>
        </div>
      `;
      postsContainer.appendChild(postCard);
    });
  }

  // ---------------------------
  // Initial Render on Page Load
  // ---------------------------
  renderPosts();
});
    
