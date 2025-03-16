
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const postForm = document.getElementById('post-form');
  const postTitleInput = document.getElementById('post-title');
  const postContentInput = document.getElementById('post-content');
  const postImageInput = document.getElementById('post-image');
  const imagePreviewContainer = document.getElementById('post-image-preview-container');
  const postImagePreview = document.getElementById('post-image-preview');
  const removePostImageBtn = document.getElementById('remove-post-image');
  const postsContainer = document.getElementById('posts-container');

  // Image Preview Functionality
  postImageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        postImagePreview.src = e.target.result;
        imagePreviewContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  removePostImageBtn.addEventListener('click', function() {
    postImageInput.value = '';
    imagePreviewContainer.style.display = 'none';
  });

  // Post Form Submission
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    const currentUser = sessionStorage.getItem('currentUser') || 'Anonymous';
    let imageData = postImagePreview.src || null;

    if (!title || !content) {
      alert('Please fill in both title and content');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      author: currentUser,
      image: imageData,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      likedBy: []
    };

    // Get existing posts and add new one
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Reset form and render posts
    postForm.reset();
    imagePreviewContainer.style.display = 'none';
    renderPosts();
  });

  // Like Post
  function likePost(postId) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }

    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      const post = posts[postIndex];
      const userLikedIndex = post.likedBy.indexOf(currentUser);
      
      if (userLikedIndex === -1) {
        post.likes++;
        post.likedBy.push(currentUser);
      } else {
        post.likes--;
        post.likedBy.splice(userLikedIndex, 1);
      }
      
      localStorage.setItem('posts', JSON.stringify(posts));
      renderPosts();
    }
  }

  // Add Comment
  function addComment(postId, commentText) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Please log in to comment');
      return;
    }

    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      const newComment = {
        id: Date.now(),
        author: currentUser,
        content: commentText,
        timestamp: new Date().toISOString()
      };
      
      posts[postIndex].comments.push(newComment);
      localStorage.setItem('posts', JSON.stringify(posts));
      renderPosts();
    }
  }

  // Render Posts
  function renderPosts() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="no-posts">No posts yet. Be the first to share!</p>';
      return;
    }

    posts.forEach(post => {
      const currentUser = sessionStorage.getItem('currentUser');
      const isLiked = post.likedBy.includes(currentUser);
      
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      
      const imageHtml = post.image ? `
        <div class="post-image-container">
          <img src="${post.image}" alt="Post image" class="post-image">
        </div>
      ` : '';

      postElement.innerHTML = `
        <div class="post-header">
          <div class="post-author">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}" alt="Author" class="author-avatar">
            <span>${post.author}</span>
          </div>
          <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
        </div>
        <div class="post-content">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          ${imageHtml}
        </div>
        <div class="post-actions">
          <button onclick="window.likePost(${post.id})" class="action-btn ${isLiked ? 'liked' : ''}">
            <i class="fas fa-heart"></i> ${post.likes}
          </button>
          <button onclick="this.nextElementSibling.classList.toggle('active')" class="action-btn">
            <i class="fas fa-comment"></i> ${post.comments.length}
          </button>
        </div>
        <div class="comments-section">
          <div class="comments-list">
            ${post.comments.map(comment => `
              <div class="comment">
                <div class="comment-author">
                  <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}" alt="Commenter" class="author-avatar">
                  <span>${comment.author}</span>
                </div>
                <p>${comment.content}</p>
                <span class="comment-date">${new Date(comment.timestamp).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <form onsubmit="event.preventDefault(); window.addComment(${post.id}, this.querySelector('input').value); this.querySelector('input').value = '';">
            <input type="text" placeholder="Write a comment..." required>
            <button type="submit"><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      `;
      
      postsContainer.appendChild(postElement);
    });
  }

  // Make functions available globally
  window.likePost = likePost;
  window.addComment = addComment;

  // Initial render
  renderPosts();
});
