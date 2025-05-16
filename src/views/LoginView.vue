<template>
    <div id="google-login-btn"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      window.google.accounts.id.initialize({
        client_id: "526768545355-jek11eo77n2aiob5ka52jqru6f2rpn2f.apps.googleusercontent.com",
        callback: this.handleCredentialResponse,
      });
  
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large" }
      );
    },
  
    methods: {
      async handleCredentialResponse(response) {
        const idToken = response.credential;
  
        const res = await fetch('http://127.0.0.1:8000/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: idToken }),
        });
  
        const data = await res.json();
        if (data.status_code =="200") {
          localStorage.setItem('token', data.data.token);
          // điều hướng hoặc gọi API khác
        } else {
          alert('Login failed: ' + data.message);
        }
      }
    }
  }
  </script>
  