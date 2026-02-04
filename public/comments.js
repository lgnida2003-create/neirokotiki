// comments.js — логика комментариев (общение)
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
function getComments() {
  return JSON.parse(localStorage.getItem('comments')||'[]');
}
function saveComments(arr) {
  localStorage.setItem('comments',JSON.stringify(arr));
}
function renderComments() {
  commentsList.innerHTML = '';
  getComments().forEach(c=>{
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<span class='comment-nick'>${c.nick}</span><span class='comment-text'>${c.text}</span><span class='comment-time'>${c.time}</span>`;
    commentsList.appendChild(div);
  });
}
commentForm.onsubmit = e => {
  e.preventDefault();
  const nick = document.getElementById('comment-nick').value.trim()||'Гость';
  const text = document.getElementById('comment-text').value.trim();
  if(!text) return;
  const arr = getComments();
  arr.push({nick,text,time:new Date().toLocaleString()});
  saveComments(arr);
  renderComments();
  commentForm.reset();
};
renderComments();
