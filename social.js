
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
