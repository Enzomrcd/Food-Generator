
// Social features module for CulinaryCompass
// Handles posts, comments, and image uploads

// In-memory database for development
// In a production app, this would be a real database
let socialData = {
    posts: JSON.parse(localStorage.getItem('socialPosts')) || [],
    comments: JSON.parse(localStorage.getItem('socialComments')) || [],
    nextPostId: 1,
    nextCommentId: 1
};

// Update nextPostId based on existing posts
if (socialData.posts.length > 0) {
    socialData.nextPostId = Math.max(...socialData.posts.map(post => parseInt(post.id.replace('post_', '')))) + 1;
}

// Update nextCommentId based on existing comments
if (socialData.comments.length > 0) {
    socialData.nextCommentId = Math.max(...socialData.comments.map(comment => parseInt(comment.id.replace('comment_', '')))) + 1;
}

// Initialize social features
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadPosts();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Hamburger menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Post form
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
    
    // Post image upload
    const postImageInput = document.getElementById('post-image');
    if (postImageInput) {
        postImageInput.addEventListener('change', handlePostImageUpload);
    }
    
    // Remove post image
    const removePostImageBtn = document.getElementById('remove-post-image');
    if (removePostImageBtn) {
        removePostImageBtn.addEventListener('click', removePostImage);
    }
}

// Handle post image upload
function handlePostImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const previewContainer = document.getElementById('post-image-preview-container');
    const preview = document.getElementById('post-image-preview');
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(event) {
        preview.src = event.target.result;
        previewContainer.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
}

// Remove post image
function removePostImage() {
    const previewContainer = document.getElementById('post-image-preview-container');
    const imageInput = document.getElementById('post-image');
    
    // Clear file input
    imageInput.value = '';
    previewContainer.style.display = 'none';
}

// Handle post form submission
function handlePostSubmit(e) {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to create a post.');
        return;
    }
    
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const imageInput = document.getElementById('post-image');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
    }
    
    // Get current user
    const currentUser = window.auth.getCurrentUser();
    
    // Create new post object
    const postId = 'post_' + socialData.nextPostId++;
    const newPost = {
        id: postId,
        title: title,
        content: content,
        author: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage
        },
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        hasImage: false,
        imageUrl: null
    };
    
    // Handle image if present
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newPost.hasImage = true;
            newPost.imageUrl = event.target.result;
            
            // Save post and update UI
            savePost(newPost);
            resetPostForm();
            loadPosts();
        };
        reader.readAsDataURL(file);
    } else {
        // Save post without image and update UI
        savePost(newPost);
        resetPostForm();
        loadPosts();
    }
}

// Save post to local storage
function savePost(post) {
    socialData.posts.push(post);
    localStorage.setItem('socialPosts', JSON.stringify(socialData.posts));
}

// Reset post form
function resetPostForm() {
    const form = document.getElementById('post-form');
    const previewContainer = document.getElementById('post-image-preview-container');
    
    if (form) form.reset();
    if (previewContainer) previewContainer.style.display = 'none';
}

// Load posts from storage and display
function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = [...socialData.posts].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    if (sortedPosts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">No posts yet. Be the first to share your creation!</p>';
        return;
    }
    
    postsContainer.innerHTML = '';
    
    // Add each post to the container
    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.id = post.id;
    
    // Format date
    const postDate = new Date(post.timestamp);
    const formattedDate = formatDate(postDate);
    
    // Image HTML
    const imageHtml = post.hasImage && post.imageUrl
        ? `<div class="post-image-container">
             <img src="${post.imageUrl}" alt="${post.title}" class="post-image">
           </div>`
        : '';
    
    // Like button status
    const isLiked = post.likedBy && post.likedBy.includes(window.auth?.getCurrentUser()?.id);
    const likeButtonClass = isLiked ? 'liked' : '';
    
    // Get comments for this post
    const postComments = socialData.comments.filter(comment => comment.postId === post.id);
    
    // Post HTML
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${post.author.profileImage}" alt="${post.author.name}" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${post.author.name}</span>
                    <span class="post-date">${formattedDate}</span>
                </div>
            </div>
        </div>
        <div class="post-content">
            <h4 class="post-title">${post.title}</h4>
            <p class="post-text">${post.content}</p>
            ${imageHtml}
        </div>
        <div class="post-actions">
            <button class="like-button ${likeButtonClass}" data-post-id="${post.id}">
                <i class="fas fa-heart"></i> ${post.likes || 0}
            </button>
            <button class="comment-button" data-post-id="${post.id}">
                <i class="fas fa-comment"></i> ${postComments.length || 0}
            </button>
        </div>
        <div class="post-comments" id="comments-${post.id}">
            <div class="comment-form-container">
                <form class="comment-form" data-post-id="${post.id}">
                    <div class="comment-input-container">
                        <input type="text" class="comment-input" placeholder="Add a comment..." required>
                        <label for="comment-image-${post.id}" class="comment-image-label">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" id="comment-image-${post.id}" class="comment-image-input" accept="image/*">
                    </div>
                    <button type="submit" class="comment-submit">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
                <div id="comment-image-preview-container-${post.id}" class="comment-image-preview-container" style="display: none;">
                    <img id="comment-image-preview-${post.id}" class="comment-image-preview">
                    <button type="button" class="remove-comment-image-btn" data-post-id="${post.id}">×</button>
                </div>
            </div>
            <div class="comments-list" id="comments-list-${post.id}">
                ${renderComments(postComments)}
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    setTimeout(() => {
        // Like button
        const likeButton = postElement.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', handleLikePost);
        }
        
        // Comment form
        const commentForm = postElement.querySelector('.comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }
        
        // Comment image upload
        const commentImageInput = postElement.querySelector('.comment-image-input');
        if (commentImageInput) {
            commentImageInput.addEventListener('change', handleCommentImageUpload);
        }
        
        // Remove comment image
        const removeCommentImageBtn = postElement.querySelector('.remove-comment-image-btn');
        if (removeCommentImageBtn) {
            removeCommentImageBtn.addEventListener('click', removeCommentImage);
        }
    }, 0);
    
    return postElement;
}

// Format date
function formatDate(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Handle like post
function handleLikePost() {
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to like posts.');
        return;
    }
    
    const postId = this.getAttribute('data-post-id');
    const userId = window.auth.getCurrentUser().id;
    
    // Find post
    const postIndex = socialData.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;
    
    const post = socialData.posts[postIndex];
    
    // Initialize likedBy array if it doesn't exist
    if (!post.likedBy) {
        post.likedBy = [];
    }
    
    // Toggle like
    const alreadyLiked = post.likedBy.includes(userId);
    
    if (alreadyLiked) {
        // Unlike
        post.likes = Math.max(0, (post.likes || 0) - 1);
        post.likedBy = post.likedBy.filter(id => id !== userId);
        this.classList.remove('liked');
    } else {
        // Like
        post.likes = (post.likes || 0) + 1;
        post.likedBy.push(userId);
        this.classList.add('liked');
    }
    
    // Update UI
    this.innerHTML = `<i class="fas fa-heart"></i> ${post.likes}`;
    
    // Save to storage
    localStorage.setItem('socialPosts', JSON.stringify(socialData.posts));
}

// Handle comment image upload
function handleCommentImageUpload() {
    const file = this.files[0];
    if (!file) return;
    
    const postId = this.id.replace('comment-image-', '');
    const previewContainer = document.getElementById(`comment-image-preview-container-${postId}`);
    const preview = document.getElementById(`comment-image-preview-${postId}`);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(event) {
        preview.src = event.target.result;
        previewContainer.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
}

// Remove comment image
function removeCommentImage() {
    const postId = this.getAttribute('data-post-id');
    const previewContainer = document.getElementById(`comment-image-preview-container-${postId}`);
    const imageInput = document.getElementById(`comment-image-${postId}`);
    
    // Clear file input
    imageInput.value = '';
    previewContainer.style.display = 'none';
}

// Handle comment submit
function handleCommentSubmit(e) {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to comment.');
        return;
    }
    
    const postId = this.getAttribute('data-post-id');
    const commentInput = this.querySelector('.comment-input');
    const commentImageInput = document.getElementById(`comment-image-${postId}`);
    
    const content = commentInput.value.trim();
    
    if (!content) {
        alert('Please enter a comment.');
        return;
    }
    
    // Get current user
    const currentUser = window.auth.getCurrentUser();
    
    // Create new comment object
    const commentId = 'comment_' + socialData.nextCommentId++;
    const newComment = {
        id: commentId,
        postId: postId,
        content: content,
        author: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage
        },
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        hasImage: false,
        imageUrl: null
    };
    
    // Handle image if present
    const file = commentImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newComment.hasImage = true;
            newComment.imageUrl = event.target.result;
            
            // Save comment and update UI
            saveComment(newComment);
            resetCommentForm(postId);
            updateCommentsList(postId);
            updateCommentCount(postId);
        };
        reader.readAsDataURL(file);
    } else {
        // Save comment without image and update UI
        saveComment(newComment);
        resetCommentForm(postId);
        updateCommentsList(postId);
        updateCommentCount(postId);
    }
}

// Save comment to storage
function saveComment(comment) {
    socialData.comments.push(comment);
    localStorage.setItem('socialComments', JSON.stringify(socialData.comments));
}

// Reset comment form
function resetCommentForm(postId) {
    const form = document.querySelector(`.comment-form[data-post-id="${postId}"]`);
    const previewContainer = document.getElementById(`comment-image-preview-container-${postId}`);
    
    if (form) form.reset();
    if (previewContainer) previewContainer.style.display = 'none';
}

// Update comments list for a post
function updateCommentsList(postId) {
    const commentsListElement = document.getElementById(`comments-list-${postId}`);
    if (!commentsListElement) return;
    
    // Get comments for this post
    const postComments = socialData.comments.filter(comment => comment.postId === postId);
    
    // Render comments
    commentsListElement.innerHTML = renderComments(postComments);
    
    // Add event listeners to buttons
    setTimeout(() => {
        const likeButtons = commentsListElement.querySelectorAll('.comment-like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', handleLikeComment);
        });
    }, 0);
}

// Update comment count on post
function updateCommentCount(postId) {
    const commentButton = document.querySelector(`.comment-button[data-post-id="${postId}"]`);
    if (!commentButton) return;
    
    // Get comments for this post
    const postComments = socialData.comments.filter(comment => comment.postId === postId);
    
    // Update button text
    commentButton.innerHTML = `<i class="fas fa-comment"></i> ${postComments.length || 0}`;
}

// Render comments
function renderComments(comments) {
    if (comments.length === 0) {
        return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    }
    
    // Sort comments by timestamp (newest first)
    const sortedComments = [...comments].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return sortedComments.map(comment => {
        // Format date
        const commentDate = new Date(comment.timestamp);
        const formattedDate = formatDate(commentDate);
        
        // Image HTML
        const imageHtml = comment.hasImage && comment.imageUrl
            ? `<div class="comment-image-container">
                 <img src="${comment.imageUrl}" alt="Comment image" class="comment-image">
               </div>`
            : '';
        
        // Like button status
        const isLiked = comment.likedBy && comment.likedBy.includes(window.auth?.getCurrentUser()?.id);
        const likeButtonClass = isLiked ? 'liked' : '';
        
        return `
            <div class="comment" id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-author">
                        <img src="${comment.author.profileImage}" alt="${comment.author.name}" class="comment-author-avatar">
                        <div class="comment-author-info">
                            <span class="comment-author-name">${comment.author.name}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="comment-content">
                    <p class="comment-text">${comment.content}</p>
                    ${imageHtml}
                </div>
                <div class="comment-actions">
                    <button class="comment-like-button ${likeButtonClass}" data-comment-id="${comment.id}">
                        <i class="fas fa-heart"></i> ${comment.likes || 0}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Handle like comment
function handleLikeComment() {
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to like comments.');
        return;
    }
    
    const commentId = this.getAttribute('data-comment-id');
    const userId = window.auth.getCurrentUser().id;
    
    // Find comment
    const commentIndex = socialData.comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) return;
    
    const comment = socialData.comments[commentIndex];
    
    // Initialize likedBy array if it doesn't exist
    if (!comment.likedBy) {
        comment.likedBy = [];
    }
    
    // Toggle like
    const alreadyLiked = comment.likedBy.includes(userId);
    
    if (alreadyLiked) {
        // Unlike
        comment.likes = Math.max(0, (comment.likes || 0) - 1);
        comment.likedBy = comment.likedBy.filter(id => id !== userId);
        this.classList.remove('liked');
    } else {
        // Like
        comment.likes = (comment.likes || 0) + 1;
        comment.likedBy.push(userId);
        this.classList.add('liked');
    }
    
    // Update UI
    this.innerHTML = `<i class="fas fa-heart"></i> ${comment.likes}`;
    
    // Save to storage
    localStorage.setItem('socialComments', JSON.stringify(socialData.comments));
}


// Social features module for CulinaryCompass
// Handles posts, comments, and image uploads

// In-memory database for development
// In a production app, this would be a real database
const socialData = {
    posts: [],
    comments: [],
    nextPostId: 1,
    nextCommentId: 1
};

// Initialize social features
document.addEventListener('DOMContentLoaded', function() {
    setupSocialUI();
    setupEventListeners();
    loadPosts();
});

// Setup social UI
function setupSocialUI() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    // Create social section if it doesn't exist
    let socialSection = document.getElementById('social-section');
    if (!socialSection) {
        socialSection = document.createElement('div');
        socialSection.id = 'social-section';
        socialSection.className = 'social-section social-feature hidden';
        
        // Add social section title
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'social-section-title';
        sectionTitle.innerHTML = '<i class="fas fa-users"></i> Community Creations';
        socialSection.appendChild(sectionTitle);
        
        // Add post form
        const postForm = document.createElement('div');
        postForm.id = 'social-post-form';
        postForm.className = 'social-post-form hidden';
        postForm.innerHTML = `
            <h4>Share Your Creation</h4>
            <form id="post-form">
                <div class="post-form-group">
                    <input type="text" id="post-title" placeholder="Title of your dish" required>
                </div>
                <div class="post-form-group">
                    <textarea id="post-content" placeholder="Share your experience, recipe modifications, or thoughts..." required></textarea>
                </div>
                <div class="post-form-group">
                    <label for="post-image" class="file-upload-label">
                        <i class="fas fa-camera"></i> Add Image
                        <input type="file" id="post-image" accept="image/*" class="file-upload-input">
                    </label>
                    <div id="image-preview-container" class="image-preview-container hidden">
                        <img id="image-preview" src="#" alt="Preview">
                        <button type="button" id="remove-image" class="remove-image-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="submit" class="post-submit-btn">
                    <i class="fas fa-paper-plane"></i> Share
                </button>
            </form>
        `;
        socialSection.appendChild(postForm);
        
        // Add posts container
        const postsContainer = document.createElement('div');
        postsContainer.id = 'posts-container';
        postsContainer.className = 'posts-container';
        socialSection.appendChild(postsContainer);
        
        // Add social section after saved dishes section
        const savedDishesSection = document.getElementById('savedDishes');
        if (savedDishesSection) {
            savedDishesSection.after(socialSection);
        } else {
            mainElement.appendChild(socialSection);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Post form submission
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
    
    // Image upload preview
    const postImage = document.getElementById('post-image');
    if (postImage) {
        postImage.addEventListener('change', handleImagePreview);
    }
    
    // Remove image button
    const removeImageBtn = document.getElementById('remove-image');
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', handleRemoveImage);
    }
}

// Handle post submission
function handlePostSubmit(event) {
    event.preventDefault();
    
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to share your creation.');
        return;
    }
    
    const currentUser = window.auth.getCurrentUser();
    const postTitle = document.getElementById('post-title').value;
    const postContent = document.getElementById('post-content').value;
    const postImage = document.getElementById('post-image').files[0];
    
    // Create post object
    const post = {
        id: socialData.nextPostId++,
        title: postTitle,
        content: postContent,
        imageUrl: null,
        author: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    // Process image if provided
    if (postImage) {
        // Convert image to base64 for demo purposes
        // In a production app, you would upload this to a proper storage service
        const reader = new FileReader();
        reader.onload = function(e) {
            post.imageUrl = e.target.result;
            
            // Add post to data
            addPost(post);
            
            // Reset form
            resetPostForm();
        };
        reader.readAsDataURL(postImage);
    } else {
        // Add post to data
        addPost(post);
        
        // Reset form
        resetPostForm();
    }
}

// Add post to data and UI
function addPost(post) {
    // Add to data
    socialData.posts.unshift(post);
    
    // Update UI
    renderPosts();
}

// Load posts
function loadPosts() {
    // In a real app, this would fetch posts from a server
    // For demo purposes, we'll just render the in-memory posts
    renderPosts();
}

// Render posts
function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    // Clear container
    postsContainer.innerHTML = '';
    
    if (socialData.posts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">No creations have been shared yet. Be the first to share your culinary creation!</p>';
        return;
    }
    
    // Add each post
    socialData.posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.dataset.postId = post.id;
    
    // Format date
    const postDate = new Date(post.createdAt);
    const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create image HTML if post has an image
    const postImageHtml = post.imageUrl 
        ? `<div class="post-image-container">
            <img src="${post.imageUrl}" alt="${post.title}" class="post-image">
           </div>`
        : '';
    
    // Create post HTML
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${post.author.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name)}" alt="${post.author.name}" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${post.author.name}</span>
                    <span class="post-date">${formattedDate}</span>
                </div>
            </div>
        </div>
        <div class="post-content">
            <h4 class="post-title">${post.title}</h4>
            <p class="post-text">${post.content}</p>
            ${postImageHtml}
        </div>
        <div class="post-actions">
            <button class="like-button" data-post-id="${post.id}">
                <i class="far fa-heart"></i> <span class="like-count">${post.likes}</span>
            </button>
            <button class="comment-button" data-post-id="${post.id}">
                <i class="far fa-comment"></i> <span class="comment-count">${post.comments.length}</span>
            </button>
        </div>
        <div class="post-comments" id="comments-${post.id}">
            <div class="comment-form-container">
                <form class="comment-form" data-post-id="${post.id}">
                    <div class="comment-input-container">
                        <input type="text" class="comment-input" placeholder="Add a comment..." required>
                        <label for="comment-image-${post.id}" class="comment-image-label">
                            <i class="fas fa-camera"></i>
                            <input type="file" id="comment-image-${post.id}" class="comment-image-input" accept="image/*">
                        </label>
                    </div>
                    <button type="submit" class="comment-submit">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
                <div class="comment-image-preview-container hidden" id="comment-preview-${post.id}">
                    <img src="#" alt="Preview" class="comment-image-preview">
                    <button type="button" class="remove-comment-image-btn" data-post-id="${post.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="comments-list" id="comments-list-${post.id}">
                ${renderComments(post.comments)}
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        // Like button
        const likeButton = postElement.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', handleLikePost);
        }
        
        // Comment form
        const commentForm = postElement.querySelector('.comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }
        
        // Comment image upload
        const commentImageInput = postElement.querySelector(`#comment-image-${post.id}`);
        if (commentImageInput) {
            commentImageInput.addEventListener('change', function() {
                handleCommentImagePreview(post.id);
            });
        }
        
        // Remove comment image button
        const removeCommentImageBtn = postElement.querySelector('.remove-comment-image-btn');
        if (removeCommentImageBtn) {
            removeCommentImageBtn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                handleRemoveCommentImage(postId);
            });
        }
    }, 0);
    
    return postElement;
}

// Render comments
function renderComments(comments) {
    if (comments.length === 0) {
        return '<div class="no-comments">No comments yet. Be the first to comment!</div>';
    }
    
    let commentsHtml = '';
    
    comments.forEach(comment => {
        // Format date
        const commentDate = new Date(comment.createdAt);
        const formattedDate = commentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create image HTML if comment has an image
        const commentImageHtml = comment.imageUrl 
            ? `<div class="comment-image-container">
                <img src="${comment.imageUrl}" alt="Comment image" class="comment-image">
               </div>`
            : '';
        
        commentsHtml += `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-author">
                        <img src="${comment.author.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author.name)}" alt="${comment.author.name}" class="comment-author-avatar">
                        <div class="comment-author-info">
                            <span class="comment-author-name">${comment.author.name}</span>
                            <span class="comment-date">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="comment-content">
                    <p class="comment-text">${comment.content}</p>
                    ${commentImageHtml}
                </div>
                <div class="comment-actions">
                    <button class="comment-like-button" data-comment-id="${comment.id}">
                        <i class="far fa-heart"></i> <span class="comment-like-count">${comment.likes}</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    return commentsHtml;
}

// Handle image preview
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        event.target.value = '';
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        event.target.value = '';
        return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Handle remove image
function handleRemoveImage() {
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const postImage = document.getElementById('post-image');
    
    // Clear file input
    postImage.value = '';
    
    // Hide preview
    imagePreviewContainer.classList.add('hidden');
}

// Handle like post
function handleLikePost() {
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to like posts.');
        return;
    }
    
    const postId = parseInt(this.dataset.postId);
    const post = socialData.posts.find(p => p.id === postId);
    
    if (post) {
        // Toggle like (in a real app, you would track which users liked which posts)
        post.likes++;
        
        // Update UI
        const likeCount = this.querySelector('.like-count');
        likeCount.textContent = post.likes;
        
        // Change icon to solid heart
        const heartIcon = this.querySelector('i');
        heartIcon.className = 'fas fa-heart';
    }
}

// Handle comment submission
function handleCommentSubmit(event) {
    event.preventDefault();
    
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to comment.');
        return;
    }
    
    const currentUser = window.auth.getCurrentUser();
    const postId = parseInt(this.dataset.postId);
    const commentInput = this.querySelector('.comment-input');
    const commentText = commentInput.value;
    const commentImageInput = document.getElementById(`comment-image-${postId}`);
    const commentImage = commentImageInput ? commentImageInput.files[0] : null;
    
    // Find post
    const post = socialData.posts.find(p => p.id === postId);
    if (!post) return;
    
    // Create comment object
    const comment = {
        id: socialData.nextCommentId++,
        content: commentText,
        imageUrl: null,
        author: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage
        },
        createdAt: new Date().toISOString(),
        likes: 0
    };
    
    // Process image if provided
    if (commentImage) {
        // Convert image to base64 for demo purposes
        const reader = new FileReader();
        reader.onload = function(e) {
            comment.imageUrl = e.target.result;
            
            // Add comment to post
            addComment(post, comment);
            
            // Reset form
            commentInput.value = '';
            commentImageInput.value = '';
            handleRemoveCommentImage(postId);
        };
        reader.readAsDataURL(commentImage);
    } else {
        // Add comment to post
        addComment(post, comment);
        
        // Reset form
        commentInput.value = '';
    }
}

// Add comment to post
function addComment(post, comment) {
    // Add to post
    post.comments.push(comment);
    
    // Update UI
    const commentsListElement = document.getElementById(`comments-list-${post.id}`);
    if (commentsListElement) {
        // Check if "no comments" message exists and remove it
        const noCommentsElement = commentsListElement.querySelector('.no-comments');
        if (noCommentsElement) {
            commentsListElement.removeChild(noCommentsElement);
        }
        
        // Create comment element
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.id;
        
        // Format date
        const commentDate = new Date(comment.createdAt);
        const formattedDate = commentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create image HTML if comment has an image
        const commentImageHtml = comment.imageUrl 
            ? `<div class="comment-image-container">
                <img src="${comment.imageUrl}" alt="Comment image" class="comment-image">
               </div>`
            : '';
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <img src="${comment.author.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author.name)}" alt="${comment.author.name}" class="comment-author-avatar">
                    <div class="comment-author-info">
                        <span class="comment-author-name">${comment.author.name}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                </div>
            </div>
            <div class="comment-content">
                <p class="comment-text">${comment.content}</p>
                ${commentImageHtml}
            </div>
            <div class="comment-actions">
                <button class="comment-like-button" data-comment-id="${comment.id}">
                    <i class="far fa-heart"></i> <span class="comment-like-count">${comment.likes}</span>
                </button>
            </div>
        `;
        
        // Add to DOM
        commentsListElement.appendChild(commentElement);
        
        // Update comment count
        const commentCountElement = document.querySelector(`.comment-button[data-post-id="${post.id}"] .comment-count`);
        if (commentCountElement) {
            commentCountElement.textContent = post.comments.length;
        }
        
        // Add event listener for like button
        const likeButton = commentElement.querySelector('.comment-like-button');
        if (likeButton) {
            likeButton.addEventListener('click', handleLikeComment);
        }
    }
}

// Handle comment image preview
function handleCommentImagePreview(postId) {
    const commentImageInput = document.getElementById(`comment-image-${postId}`);
    const file = commentImageInput.files[0];
    if (!file) return;
    
    const previewContainer = document.getElementById(`comment-preview-${postId}`);
    const imagePreview = previewContainer.querySelector('.comment-image-preview');
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        commentImageInput.value = '';
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        commentImageInput.value = '';
        return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Handle remove comment image
function handleRemoveCommentImage(postId) {
    const commentImageInput = document.getElementById(`comment-image-${postId}`);
    const previewContainer = document.getElementById(`comment-preview-${postId}`);
    
    // Clear file input
    if (commentImageInput) {
        commentImageInput.value = '';
    }
    
    // Hide preview
    if (previewContainer) {
        previewContainer.classList.add('hidden');
    }
}

// Handle like comment
function handleLikeComment() {
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        alert('Please log in to like comments.');
        return;
    }
    
    const commentId = parseInt(this.dataset.commentId);
    
    // Find comment
    let foundComment = null;
    for (const post of socialData.posts) {
        foundComment = post.comments.find(c => c.id === commentId);
        if (foundComment) break;
    }
    
    if (foundComment) {
        // Toggle like (in a real app, you would track which users liked which comments)
        foundComment.likes++;
        
        // Update UI
        const likeCount = this.querySelector('.comment-like-count');
        likeCount.textContent = foundComment.likes;
        
        // Change icon to solid heart
        const heartIcon = this.querySelector('i');
        heartIcon.className = 'fas fa-heart';
    }
}

// Reset post form
function resetPostForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-image').value = '';
    document.getElementById('image-preview-container').classList.add('hidden');
}
