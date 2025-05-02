let posts = JSON.parse(localStorage.getItem("posts")) || [];
let username = localStorage.getItem("username") || "";

// Save posts to localStorage
function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Ask for username if not set
function askUsername() {
  if (!username) {
    username = prompt("Enter your display name:");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      alert("Username is required to post.");
    }
  }
  updateUserArea();
}

// Display user area with change username option
function updateUserArea() {
  const userArea = document.getElementById("userArea");
  if (username) {
    userArea.innerHTML = `
      <p>You are posting as <strong>${username}</strong> 
      <button onclick="changeUsername()">Change</button></p>
    `;
  }
}

// Allow user to change their username
function changeUsername() {
  localStorage.removeItem("username");
  username = "";
  askUsername();
}

// Create a new post
function createPost() {
  if (!username) {
    askUsername();
    return;
  }

  const text = document.getElementById("postText").value.trim();
  if (text) {
    posts.push({
      id: Date.now(),
      text,
      user: username,
      replies: [],
    });
    document.getElementById("postText").value = "";
    savePosts();
    renderPosts();
  }
}

// Render posts and replies to the UI
function renderPosts() {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";
  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <div class="user">${post.user.charAt(0).toUpperCase()}</div>
      <div class="content">
        <p><strong>${post.user}</strong>: ${post.text}</p>
        <button class="edit" onclick="editPost(${post.id})">Edit</button>
        <button class="delete" onclick="deletePost(${post.id})">Delete</button>
        <button onclick="showReplyInput(${post.id})">Reply</button>
        <div id="replyInput-${post.id}"></div>
        <div id="replies-${post.id}">
          ${post.replies.map(reply => `
            <div class="reply">
              <div class="user">${reply.user.charAt(0).toUpperCase()}</div>
              <div class="content">
                <p><strong>${reply.user}</strong>: ${reply.text}</p>
                <button class="edit" onclick="editReply(${post.id}, ${reply.id})">Edit</button>
                <button class="delete" onclick="deleteReply(${post.id}, ${reply.id})">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    container.appendChild(postDiv);
  });
}

// Delete a post
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

// Edit a post
function editPost(id) {
  const post = posts.find(p => p.id === id);
  const newText = prompt("Edit your post:", post.text);
  if (newText !== null) {
    post.text = newText.trim();
    savePosts();
    renderPosts();
  }
}

// Show the reply input area for a post
function showReplyInput(postId) {
  const container = document.getElementById(`replyInput-${postId}`);
  container.innerHTML = `
    <textarea id="replyText-${postId}" placeholder="Write a reply..." maxlength="280"></textarea>
    <button onclick="addReply(${postId})">Submit</button>
  `;
}

// Add a reply to a post
function addReply(postId) {
  if (!username) {
    askUsername();
    return;
  }

  const replyText = document.getElementById(`replyText-${postId}`).value.trim();
  if (replyText) {
    const post = posts.find(p => p.id === postId);
    post.replies.push({ id: Date.now(), text: replyText, user: username });
    savePosts();
    renderPosts();
  }
}

// Delete a reply
function deleteReply(postId, replyId) {
  const post = posts.find(p => p.id === postId);
  post.replies = post.replies.filter(r => r.id !== replyId);
  savePosts();
  renderPosts();
}

// Edit a reply
function editReply(postId, replyId) {
  const post = posts.find(p => p.id === postId);
  const reply = post.replies.find(r => r.id === replyId);
  const newText = prompt("Edit your reply:", reply.text);
  if (newText !== null) {
    reply.text = newText.trim();
    savePosts();
    renderPosts();
  }
}

// Initialize app
askUsername();
renderPosts();
