window.fbAsyncInit = function() {
  FB.init({
    appId      : '343375922744669',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  FB.getLoginStatus(function(response){
    statusChangeCallback(response)
    console.log(response);
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback (response) {
  if(response.status === 'connected'){
    FB.api('/me', 'GET', {fields: 'name,id,email'}, function(user) {
      //window.localStorage.setItem('username',user.name);
      //window.localStorage.setItem('email',user.email);
      // console.log(user.name);
      console.log(response.authResponse.accessToken);
      window.localStorage.setItem('token',response.authResponse.accessToken);
      axios.post('http://localhost:3000/api/users/login-fb', {username: user.name, email: user.email, fb_account: true})
        .then ((res) => {
          console.log('sukses dong');
          console.log(res);
          window.location.href="http://localhost:8080/index.html"
        })
        .catch ((err) => {
          console.log('error cuy');
          console.log(err);
          // window.location.href="http://localhost:8080/login.html";
        });
    });
    console.log('we are connected');
  } else if(response.status === 'not_authorized') {
    console.log('we are not logged in.');
  } else {
    console.log('you are not logged in to Facebook');
  }
}

function logout(){
  //FB.logout(function(response) {
    console.log(window.localStorage.getItem("token"));
    window.localStorage.clear();
    //window.location.href="http://localhost:3000/signout";
    //document.location.reload();
  //});
}
