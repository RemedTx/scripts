
// FORM DIVS BUILD

const lottieSrc = "https://uploads-ssl.webflow.com/63fce3115f364af903bc6796/64e5fd4fc9d7fd6aab7a12ca_animation_llm8shsu.json"
const lottieSrc2 = "https://uploads-ssl.webflow.com/63fce3115f364af903bc6796/64edf6a33060781430b6cf9f_loaderText.json"
const slackUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/postSlackMessage";
const formPushUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/sleepQuiz";

const questions = document.getElementsByClassName("form-question");
const sliderContainer = document.getElementById("slider");

// Remove submit with enter
$(document).keypress(
    function(event){
    if (event.which == '13') {
        event.preventDefault();
    }
});

// Add necessary slides
const hiddenSlide = document.getElementsByClassName("w-slide")[1];
for (let i = 0; i < questions.length - 2; i++) {
    let slideCopy = hiddenSlide.cloneNode( true );
    sliderContainer.appendChild(slideCopy);
};

// Append question tags
let slides = Array.from(document.getElementsByClassName("w-slide"));
Array.from(questions).forEach((question, index) => {
    slides[index].setAttribute("aria-label", `${index+1} of ${questions.length}`);
    slides[index].lastChild.innerHTML = question.innerHTML;
});

// Hide long form
document.getElementById("form-to-hide").remove();

// FORM CUSTOMIZATION
slides = Array.from(document.getElementsByClassName("w-slide"));
const hiddenElements = document.getElementsByClassName("w-condition-invisible");
const rightArrow = document.getElementById("next-slide");
const leftArrow = document.getElementById("previous-slide");

const logoContainer = document.getElementById("logo-container");
const barContainer = document.getElementById("bar-container");
const progressBar = document.getElementById("progress-bar");
const logo = document.getElementById("logo");

// We remove hidden elements so that they do not interact with the form
Array.from(hiddenElements).forEach(element => {
    element.parentNode.removeChild(element);
    });

// Add attributes to checkbox and radioinputs
for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // RADIOS
    const radioInputs = slide.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
    input.setAttribute("data-name", `${i}`);
    input.setAttribute("name", `${i}`);
    text = input.parentNode.getElementsByClassName("w-form-label")[0].textContent;
    input.setAttribute("value", text); 
    });

    // CHECKBOXES
    const checkboxInputs = slide.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(input => {
    let value = input.parentNode.getElementsByClassName("w-form-label")[0].textContent;
    input.setAttribute("data-name", value);
    input.setAttribute("name", value);
    input.setAttribute("value", value);
    });

    slide.querySelector("#next-button")?.setAttribute("name", `${i}`);
    slide.querySelector("#previous-button")?.setAttribute("slideIndex", `${i}`);

    // NUMBER INPUTS
    slide.querySelector("input[type='number']")?.setAttribute("data-name", `${i}`);
    slide.querySelector("input[type='number']")?.setAttribute("name", `${i}`);
}


function changeHeader(mode) {
    if (mode == "logo") {
    logo.style.display = 'block';
    title.style.display = 'none';
    progressBar.style.display = 'none';
    } else {
    logo.style.display = 'none';
    title.style.display = 'block';
    progressBar.style.display = 'block';
    }
}
// Initially put the progress bar
changeHeader("bar");

function changeTitle(title) {
    document.getElementById("title").innerHTML = title;
}

const mappingLifeMoment = {
    "Trying to conceive": 6,
    "Pregnancy": 7,
    "Post Partum": 8,
    "Menopause": 9,
    "Menstruation": 5,
    "Peri Menopause": 9,
    "Other": 10
}
const feedbackSlides = ["4", "5", "6", "7", "8", "15", "19", "21", "25", "26"];
const lifemomentSlides = ["4", "5", "6", "7", "8", "9", "10"];

function updateLoadingBar() {
    const currentSlide = document.querySelector(".w-slide:not([aria-hidden])");
    const currentSlideIndex = parseInt(currentSlide.getAttribute("aria-label").split(" ")[0]);
    // Between 1-10 : 0 - 25% -> 10 ELEMENTS
    // Between 11-27 : 25 - 50% -> 16 ELEMENTS
    const percentage = Math.round(
        currentSlideIndex <= 9 ? currentSlideIndex * 25 / 8 : 25 + (currentSlideIndex - 10) * 25 / 16
    )
    document.getElementById('loading-bar').setAttribute("style",`display:flex;width:${percentage}%`);
    document.getElementById('loading-bar').style.width=`${percentage}%`;
}
updateLoadingBar();

// Automate next slide
const goToNextSlide = function(input) {
    updateLoadingBar();
    if (input.name == slides.length) {
    return ;

    // Go to next page
    } else if (input.name == "3") {
    showSlide(mappingLifeMoment[input.value]);
    } else if (lifemomentSlides.includes(input.name)) {
    showSlide(11);
    changeTitle("SLEEP PROFILE");
    } else {
    rightArrow.click();
    };

    // Update header
    if (feedbackSlides.includes(input.name)) {
    changeHeader("bar");
    } else if (feedbackSlides.includes(String(parseInt(input.name) + 1))) {
    changeHeader("logo");
    };
};

    // Automate next slide
const goToPreviousSlide = function() {
    const currentSlide = document.querySelector(".w-slide:not([aria-hidden])");
    const currentSlideIndex = parseInt(currentSlide.getAttribute("aria-label").split(" ")[0]) - 1;
    if (currentSlideIndex == 0) {
    return ;
    }
    if (lifemomentSlides.includes(String(currentSlideIndex))) {
        showSlide(4);
    } else {
        leftArrow.click();
    };
    if (feedbackSlides.includes(String(currentSlideIndex))) {
    changeHeader("bar");
    } else if (feedbackSlides.includes(String(currentSlideIndex - 1))) {
    changeHeader("logo");
    }
    if (currentSlideIndex == 9) {
    changeTitle("DEMOGRAPHIC PROFILE");
    }
    updateLoadingBar();
};

function showSlide(index) {
    $(`#flowbaseSlider div:nth-child(${index})`).trigger('tap');
}

// Add event listeners to buttons
$('.next-button, .final-button').on('click', function(){
    let error = "";
    const inputs = $('input:not([aria-hidden])');

    // Checkboxes
    const checkboxes = $(inputs).filter('[type="checkbox"]').toArray();
    if (checkboxes.length > 0 && !checkboxes.some((el) => $(el).is(':checked'))) {
          error = "Please choose at least one checkbox!";
    }
    
    const numberInputs = $(inputs).filter('[type="number"]').toArray();
    if (numberInputs.length > 0) {
    // Check if at least one is checked
    if (numberInputs.some((el) => $(el).val() < 0)) {
        error = "Please enter a positive number";
    } else if (numberInputs.some((el) => $(el).val() == "")) {
        error = "Please enter a number";
    }

    }
    if (!error) {
    goToNextSlide(this);
    error = "";
    } else {
    alert(error);
    }
});

$('.previous-button').on('click', function(){
    goToPreviousSlide(this);
});

$('input[type="radio"]').on('tap', function(){
    goToNextSlide(this);
    this.checked = true;
});

// Add conditions
$('input[type="number"]').attr("min", "0");


// Focus on next if enter is clicked
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener("keypress", (e) => checkKey(e, input));
    input.addEventListener("input", (e) => checkValue(e, input));
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
});

function checkValue(e, input) {
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    if (input.value === '') {
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
    } else {
    nextButton.style.backgroundColor = "#0b2889";
    nextButton.removeAttribute("disabled");
    }
}
function checkKey(e, input) {
    if (e.key == "Enter") {
    goToNextSlide(input);
    }
};

// Post function

async function postRequest(url, data) {
const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

function sendSlack(submitted, email) {
let data = {
    userName: email,
    warningType: 'QUIZ',
    warningContent: submitted? 'Someone submitted the form!' : 'Someone went to the final question!',
    emoji: ':ghost:',
    redirectUrl: 'https://www.moonalisa.co',
};
postRequest(slackUrl, data);
}

// Progress bar animation
$('#lottie-container').html(`<lottie-player autoplay mode="normal" speed=0.4 style="width: 400px"></lottie-player>`);
$('#lottie-container-2').html(`<lottie-player autoplay mode="normal" speed=1 style="width: 600px"></lottie-player>`);



// Before email
$('#final-button').on('click', function() {
    let loaderContainer = document.getElementById("final-progress");
    loaderContainer.style.display = 'block';
    const player = document.querySelector("lottie-player");
    const player2 = document.querySelector("lottie-player-2")
    player.load(lottieSrc);
    player2.load(lottieSrc2);
    setTimeout(() => {
        loaderContainer.style.display = 'none';
    }, 10000);
    sendSlack(false, "Unknown User");
})

// After email
$('.email-next-button').on('click', function(){
    let error = "";
    const inputs = $('input:not([aria-hidden])');
    const emailInputs = $(inputs).filter('[type="email"]').toArray();
    if (emailInputs.length > 0 && !emailInputs.some((el) => $(el).val().indexOf('@') !== -1 && $(el).val().indexOf('.') !== -1)) {
          error = "Please enter a valid email";
    }
    if (!error) {
    sendSlack(true, emailInputs[0].value);
    postRequest(formPushUrl, {data: {"email": emailInputs[0].value}});
    document.forms[0].submit();
    error = "";
    } else {
    alert(error);
    }
});