const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

//Capture Registration From Data and Fetch
const registrationElem = document.querySelector(".form-box.register form");
console.log(registrationElem);
registrationElem.addEventListener('submit', event => {
  event.preventDefault();

  const registrationData = new FormData(registrationElem);
  console.log(registrationData);
  const data = new URLSearchParams(registrationData);
  console.log(data);

  sendRegistration(data);
})

//Send the form data
async function sendRegistration(data) {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.get('text'),
        email: data.get('email'),
        password: data.get('password')
      }),
    }
    );
  } catch (e) {
    console.error(e)
  }
}
