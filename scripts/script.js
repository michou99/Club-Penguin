//Get elements for the login/signup buttons and modals
let signupBtn = document.getElementById('signup');
let loginBtn = document.getElementById('login');
let signupModal = document.getElementById('signupmodal');
let loginModal = document.getElementById('loginmodal');
let overlay = document.getElementById('overlay');
let xbtn1 = document.getElementById('xbtn1');
let xbtn2 = document.getElementById('xbtn2');

//Open Modals with the Buttons
signupBtn.addEventListener("click", () => {
    signupModal.style.display = "inline";
    overlay.style.display = "inline";
});
loginBtn.addEventListener("click", () => {
    loginModal.style.display = "inline";
    overlay.style.display = "inline";
});

//Close Modals
xbtn1.addEventListener("click", () => {
    signupModal.style.display = "none";
    overlay.style.display = "none";
})
xbtn2.addEventListener("click", () => {
    loginModal.style.display = "none";
    overlay.style.display = "none";
})

//Get elements within the signup modal
let newUsername = document.getElementById('newUsername');
let newEmail = document.getElementById('newEmail');
let newPwd = document.getElementById('newPwd');
let confirmPwd = document.getElementById('confirmPwd');
let newUserBtn = document.getElementById('newUser');
let pwderr = document.getElementById('pwderr');
let usertaken = document.getElementById('usertaken');

//Validate user inputs valid email address 
newEmail.addEventListener("input", () => {
    if (newEmail.validity.typeMismatch) {
        newEmail.setCustomValidity("Enter a valid email address!");
        newEmail.reportValidity();
    } else {
        newEmail.setCustomValidity("");
    }
});

//New password must match the confirmed password
newUserBtn.addEventListener("click", () => {
    if (newPwd.value != confirmPwd.value) {
        pwderr.style.display = "inline";
        setTimeout(pwderrDisplay, 5.0 * 1000);
    } else {
        signUp(newEmail, confirmPwd, newUsername);
    }

});

//Function for removing password error after 5 seconds
function pwderrDisplay() {
    pwderr.style.display = "none";
}

//SignUp Function
function signUp(email, password, user) {
    let selectElement = document.getElementById('colors');
    let output = selectElement;

    // setup data
    const data = {
        email: email.value,
        username: user.value,
        password: password.value,
        penguinColor: output.value
    }

    // send data to backend
    const response = fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            accept: 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response => response.json())).then(
        data => {
            // if there is a issue, display it
            if (JSON.stringify(data) == `{"error":"Issue creating user. Please try again."}`) {
                usertaken.style.display = "inline";
                setTimeout(usertakenerrDisplay, 4.0 * 1000);
            // set local storage and reload
            } else {
                localStorage.setItem('penguinColor', data.penguinColor);
                window.location.reload();
            }
            return data;
    }).catch(err => new Error('Failed to sign up.'));

    return response;

}

//Function for removing username error after 4 seconds
function usertakenerrDisplay() {
    usertaken.style.display = "none";
}

//Get elements within the login modal
let username = document.getElementById('username');
let pwd = document.getElementById('pwd');
let login = document.getElementById('loginbtn');
let loginerr = document.getElementById('loginerr')

//When login button is clicked
login.addEventListener("click", () => {
    loginUser(pwd, username);
});

//Login Function 
function loginUser(password, user) {
    // setup data
    const data = {
        password: password.value
    }

    // send data to backend
    const response = fetch(`http://localhost:3000/user/${user.value}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            accept: 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response => {
        // if bad login, display error
        if (!response.ok) {
            loginerr.style.display = "inline";
            setTimeout(loginerrDisplay, 5.0 * 1000);
        } else {
            return response.json();
        }
    }
    )).then(
        data => {
            // set local storage of player without password
            delete data.password
            localStorage.setItem('player', JSON.stringify(data))
            location.href = "../html/game.html"
            return data;
        }).catch(err => new Error('Failed to log in'))

    return response;
}

//Function for removing username error after 5 seconds
function loginerrDisplay() {
    loginerr.style.display = "none";
}

