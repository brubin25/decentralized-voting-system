const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;
  const token = voter_id;

  const headers = {
    method: "GET",
    Authorization: `Bearer ${token}`
  };

  // Updated to correct backend port 8080
  fetch(`http://127.0.0.1:8080/login?voter_id=${voter_id}&password=${password}`, { headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      if (data.role === 'admin') {
        localStorage.setItem('jwtTokenAdmin', data.token);
        window.location.replace(`http://127.0.0.1:8080/admin.html?Authorization=Bearer ${data.token}`);
      } else if (data.role === 'user') {
        localStorage.setItem('jwtTokenVoter', data.token);
        window.location.replace(`http://127.0.0.1:8080/index.html?Authorization=Bearer ${data.token}`);
      }
    })
    .catch(error => {
      console.error('Login failed:', error.message);
    });
});
