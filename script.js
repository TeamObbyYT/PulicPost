let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function createPost() {
  const text = document.getElementById("postText").value.trim();
  if (text) {
    posts.push({ id: Date.now(), text, replies: [] });
    document.getElementById("postText").value = "";
    savePosts();
    renderPosts();
  }
}

function renderPosts() {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";
  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <p>${post.text}</p>
      <button onclick="editPost(${post.id})">Edit</button>
      <button onclick="deletePost(${post.id})">Delete</button>
      <button onclick="showReplyInput(${post.id})">Reply</button>
      <div id="replyInput-${post.id}"></div>
      <div id="replies-${post.id}">
        ${post.replies.map(reply => `
          <div class="reply" id="reply-${reply.id}">
            <p>${reply.text}</p>
            <button onclick="editReply(${post.id}, ${reply.id})">Edit</button>
            <button onclick="deleteReply(${post.id}, ${reply.id})">Delete</button>
          </div>
        `).join("")}
      </div>
    `;
    container.appendChild(postDiv);
  });
}

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);
  const newText = prompt("Edit your post:", post.text);
  if (newText !== null) {
    post.text = newText.trim();
    savePosts();
    renderPosts();
  }
}

function showReplyInput(postId) {
  const container = document.getElementById(`replyInput-${postId}`);
  container.innerHTML = `
    <textarea id="replyText-${postId}" placeholder="Write a reply..."></textarea>
    <button onclick="addReply(${postId})">Submit</button>
  `;
}

function addReply(postId) {
  const replyText = document.getElementById(`replyText-${postId}`).value.trim();
  if (replyText) {
    const post = posts.find(p => p.id === postId);
    post.replies.push({ id: Date.now(), text: replyText });
    savePosts();
    renderPosts();
  }
}

function deleteReply(postId, replyId) {
  const post = posts.find(p => p.id === postId);
  post.replies = post.replies.filter(r => r.id !== replyId);
  savePosts();
  renderPosts();
}

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

// Initial load
renderPosts();
