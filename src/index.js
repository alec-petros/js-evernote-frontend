document.addEventListener('ready', () => {
  const appContent = $('#app-content')
  const url = "http://localhost:3000/api/v1/"
  document.getElementById('test').innerText = "hello"
  fetch(url+'notes').then(r => r.json()).then(r => console.log(r))
})
