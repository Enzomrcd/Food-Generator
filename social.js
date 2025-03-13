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
    setupSocialUI();
    setupEventListeners();
    loadPosts();
    
    // Show or hide hamburger menu based on auth status
    updateHamburgerVisibility();
});

// Function to update hamburger menu visibility
function updateHamburgerVisibility() {
    const isAuthenticated = window.auth && window.auth.isAuthenticated();
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (hamburgerMenu) {
        hamburgerMenu.style.display = isAuthenticated ? 'block' : 'none';
    }
}

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

            // Close mobile menu if open
            const mainNav = document.getElementById('main-nav');
            if (mainNav) {
                mainNav.classList.remove('active');
            }
        });
    });

    // Hamburger menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        // Improve hamburger menu functionality
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
            }
        });
    }

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

    if (previewContainer && preview) {
        // Show preview
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.src = event.target.result;
            previewContainer.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

// Remove post image
function removePostImage() {
    const previewContainer = document.getElementById('post-image-preview-container');
    const imageInput = document.getElementById('post-image');

    if (previewContainer && imageInput) {
        // Clear file input
        imageInput.value = '';
        previewContainer.style.display = 'none';
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
        id: 'post_' + socialData.nextPostId++,
        title: postTitle,
        content: postContent,
        imageUrl: null,
        author: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)
        },
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: []
    };

    // Process image if provided
    if (postImage) {
        // Convert image to base64 for demo purposes
        const reader = new FileReader();
        reader.onload = function(e) {
            post.imageUrl = e.target.result;
            post.hasImage = true;

            // Add post to data
            savePost(post);

            // Reset form
            resetPostForm();

            // Update UI
            loadPosts();
        };
        reader.readAsDataURL(postImage);
    } else {
        // Add post to data
        savePost(post);

        // Reset form
        resetPostForm();

        // Update UI
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

// Handle image preview
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');

    if (!imagePreviewContainer || !imagePreview) return;

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

    if (!imagePreviewContainer || !postImage) return;

    // Clear file input
    postImage.value = '';

    // Hide preview
    imagePreviewContainer.classList.add('hidden');
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

    if (!previewContainer || !preview) return;

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

    if (!previewContainer || !imageInput) return;

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

    if (!commentInput) return;

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
            profileImage: currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)
        },
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        hasImage: false,
        imageUrl: null
    };

    // Handle image if present
    if (commentImageInput && commentImageInput.files && commentImageInput.files[0]) {
        const file = commentImageInput.files[0];
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