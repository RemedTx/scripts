// Remove submit with enter
$(document).keypress(
    function(event){
    if (event.which == '13') {
        event.preventDefault();
    }
});

// FORM DIVS BUILD
const questions = document.getElementsByClassName("form-question");
const sliderContainer = document.getElementById("slider");

// Add necessary slides & append tags
const hiddenSlide = document.getElementsByClassName("w-slide")[1];
for (let i = 0; i < questions.length - 2; i++) {
    let slideCopy = hiddenSlide.cloneNode( true );
    sliderContainer.appendChild(slideCopy);
};
let slides = Array.from(document.getElementsByClassName("w-slide"));
Array.from(questions).forEach((question, index) => {
    slides[index].setAttribute("aria-label", `${index+1} of ${questions.length}`);
    slides[index].lastChild.innerHTML = question.innerHTML;
});

// Hide long form
document.getElementById("form-to-hide").remove();

// FORM CUSTOMIZATION
slides = Array.from(document.getElementsByClassName("w-slide"));
const rightArrow = document.getElementById("next-slide");
const leftArrow = document.getElementById("previous-slide");

const logoContainer = document.getElementById("logo-container");
const barContainer = document.getElementById("bar-container");
const progressBar = document.getElementById("progress-bar");
const logo = document.getElementById("logo");

// Remove invisible form element
const hiddenElements = document.getElementsByClassName("w-condition-invisible");
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

    // NUMBER INPUTS
    slide.querySelector("input[type='number']")?.setAttribute("data-name", `${i}`);
    slide.querySelector("input[type='number']")?.setAttribute("name", `${i}`);
}


function getCurrentSlideIndex() {
    const currentSlide = document.querySelector(".w-slide:not([aria-hidden])");
    return parseInt(currentSlide.getAttribute("aria-label").split(" ")[0]);
}


// Show logo if feedback slide
const feedbackSlides = [1, 10, 12];
function changeHeader() {
    const currentSlideIndex = getCurrentSlideIndex();
    if (feedbackSlides.includes(currentSlideIndex)) {
        
        // display logo
        logo.style.display = 'block';
        title.style.display = 'none';
        progressBar.style.display = 'none';

        // change header color
        document.querySelector('body').style.backgroundColor = "#f6f4ef";
        document.querySelector('#form-header').style.borderColor = "#D4D4D2";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 1px 0px"
    } else {
        logo.style.display = 'none';
        title.style.display = 'block';
        progressBar.style.display = 'block';

        document.querySelector('body').style.backgroundColor = "#ffffff";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 0px 0px"
    }
}
// Initially put the logo
changeHeader();

function changeTitle(title) {
    document.getElementById("title").innerHTML = title;
}

function updateLoadingBar() {
    const currentSlideIndex = getCurrentSlideIndex();
    // Between 1-13 : 50 - 75% -> 13 ELEMENTS
    const percentage = Math.round(
        50 + currentSlideIndex * 25 / 13
    )
    document.getElementById('loading-bar').setAttribute("style",`display:flex;width:${percentage}%`);
    document.getElementById('loading-bar').style.width=`${percentage}%`;
}

// Initialize loading bar
updateLoadingBar();

function submitForm() {
    console.log("Submitting Form...");
    document.forms[0].submit();
};

// Automate next slide
const goToNextSlide = function() {
    let currentSlideIndex = getCurrentSlideIndex();
    if (currentSlideIndex == slides.length) {
        console.log("Submitting Form...");
        submitForm();
        return;
    } else {
        rightArrow.click();
    };
    updateLoadingBar();
    changeHeader();

};

    // Automate next slide
const goToPreviousSlide = function() {
    const currentSlideIndex = getCurrentSlideIndex() - 1;
    if (currentSlideIndex == 0) {
    return ;
    } else {
        leftArrow.click();
    }
    updateLoadingBar();
    changeHeader();
};


// Add event listeners to buttons
$('.next-button').on('click', function(){
    let error = "";
    const inputs = $('input:not([aria-hidden])');

    // Checkboxes
    const checkboxes = $(inputs).filter('[type="checkbox"]').toArray();
    if (checkboxes.length > 0 && !checkboxes.some((el) => $(el).is(':checked'))) {
          error = "Please choose at least one checkbox!";
    }
    
    // Number Inputs
    const numberInputs = $(inputs).filter('[type="number"]').toArray();
    if (numberInputs.length > 0 && numberInputs.some((el) => $(el).val() < 0)) {
        error = "Please enter a positive number";
    } else if (numberInputs.length > 0 && numberInputs.some((el) => $(el).val() == "")) {
        error = "Please enter a number";
    }

    error? alert(error) : goToNextSlide();
});

$('.previous-button').on('click', function(){
    goToPreviousSlide(this);
});

$('input[type="radio"]').on('tap', function(){
    goToNextSlide();
    this.checked = true;
});

// Add conditions
$('input[type="number"]').attr("min", "0");

// Focus on next if enter is clicked
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener("keypress", (e) => checkKey(e, input));
    input.addEventListener("input", (e) => validateNumberInput(e, input));
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
});

function validateNumberInput(e, input) {
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
    goToNextSlide();
    }
};

// Post function
async function postRequest(url, data) {
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

function sendSlack(submitted, email) {
    let data = {
        userName: email,
        warningType: 'QUIZ 2',
        warningContent: submitted? 'Someone submitted the second form!' : 'Someone went to the final question!',
        emoji: ':ghost:',
        redirectUrl: 'https://www.moonalisa.co',
    };
    postRequest(slackUrl, data);
}