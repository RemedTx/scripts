// Remove submit with enter
$(document).keypress(
    function(event){
    if (event.which == '13') {
        event.preventDefault();
    }
});


const lottieSrc = "https://lottie.host/186d5b64-22b9-4c26-9068-8d0b40cbef57/UC2tpZmJA6.json"
const mappingLifeMoment = {
    "Menstruation": 5,
    "Trying to conceive": 6,
    "Pregnancy": 7,
    "Post Partum": 8,
    "Menopause": 9,
    "Peri Menopause": 9,
    "Other": 10
}

const questions = document.getElementsByClassName("form-question");
const sliderContainer = document.getElementById("slider");

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

    // NUMBER INPUTS
    slide.querySelector("input[type='number']")?.setAttribute("data-name", `${i}`);
    slide.querySelector("input[type='number']")?.setAttribute("name", `${i}`);
}

function getCurrentSlideIndex() {
    const currentSlide = document.querySelector(".w-slide:not([aria-hidden])");
    return parseInt(currentSlide.getAttribute("aria-label").split(" ")[0]);
}


// Show logo if feedback slide
const feedbackSlides = [5, 6, 7, 8, 9, 10, 16, 20, 22, 26, 27];

function changeHeader() {
    const currentSlideIndex = getCurrentSlideIndex();
    if (feedbackSlides.includes(currentSlideIndex)) {
        
        // display logo
        logo.style.display = 'block';
        title.style.display = 'none';
        progressBar.style.display = 'none';

        // change header color
        document.body.style.backgroundColor = "#f6f4ef";
        document.querySelector('#form-header').style.borderColor = "#D4D4D2";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 1px 0px"
    } else {
        logo.style.display = 'none';
        title.style.display = 'block';
        progressBar.style.display = 'block';

        document.body.style.backgroundColor = "#ffffff";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 0px 0px"
    }
}
// Initially put the map
changeHeader();

function changeTitle(title) {
    document.getElementById("title").innerHTML = title;
}

function showSlide(index) {
    $(`#flowbaseSlider div:nth-child(${index})`).trigger('tap');
}

function updateLoadingBar() {
    const currentSlideIndex = getCurrentSlideIndex();
    const percentage = Math.round(
        currentSlideIndex <= 9 ? currentSlideIndex * 25 / 8 : 25 + (currentSlideIndex - 10) * 25 / 16
    )
    document.getElementById('loading-bar').setAttribute("style",`display:flex;width:${percentage}%`);
    document.getElementById('loading-bar').style.width=`${percentage}%`;
}

// Initialize loading bar
updateLoadingBar();

// Automate next slide
const goToNextSlide = function(input) {
    let currentSlideIndex = getCurrentSlideIndex();

    console.log("current slide Index :", currentSlideIndex);

    if (currentSlideIndex == slides.length) {
        return;
    }else if (currentSlideIndex == 4) {
        showSlide(mappingLifeMoment[input.value]);
    } else if ((4 <= currentSlideIndex) && (currentSlideIndex <= 10)) {
        showSlide(11);
        changeTitle("SLEEP PROFILE");
    } else {
        showSlide(currentSlideIndex + 1)
    };
    updateLoadingBar();
    changeHeader();

};

    // Automate next slide
const goToPreviousSlide = function() {
    const currentSlideIndex = getCurrentSlideIndex();
    if (currentSlideIndex == 0) {
    return ;
    } else if ((currentSlideIndex >= 5) && (currentSlideIndex <= 11)) {
        showSlide(4);
        changeTitle("DEMOGRAPHIC PROFILE");
    } else {
        showSlide(currentSlideIndex - 1)
    }
    updateLoadingBar();
    changeHeader();
};


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


// Add listeners to numerical inputs
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

const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener("keypress", (e) => checkKey(e, input));
    input.addEventListener("input", (e) => checkValue(e, input));
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
});

// Post function
async function postRequest(url, data) {
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

function sendSlack(submitted, email) {
    const slackUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/postSlackMessage";
    let data = {
        userName: email,
        warningType: 'QUIZ',
        warningContent: submitted? 'Someone submitted the form!' : 'Someone went to the final question!',
        emoji: ':ghost:',
        redirectUrl: 'https://www.moonalisa.co',
    };
    postRequest(slackUrl, data);
}

// Just before last view : progress bar animation
$('#lottie-container').html(`<lottie-player autoplay mode="normal" speed=1 style="width: 400px"></lottie-player>`);
$('#final-button').on('click', function() {
    // Display animation container
    let loaderContainer = document.getElementById("final-progress");
    loaderContainer.style.display = 'block';

    // Play animation
    const player = document.querySelector("lottie-player");
    player.load(lottieSrc);
    setTimeout(() => {
        loaderContainer.style.display = 'none';
    }, 15000);

    // Send slack
    sendSlack(false, "Unknown User");
})


// After email input
$('.email-next-button').on('click', validateEmailForm);

function validateEmailForm() {
    const formPushUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/postForm";

    // Check for errors
    let error = "";
    const inputs = $('input:not([aria-hidden])');
    const emailInputs = $(inputs).filter('[type="email"]').toArray();
    if (emailInputs.length > 0 && !emailInputs.some((el) => $(el).val().indexOf('@') !== -1 && $(el).val().indexOf('.') !== -1)) {
        error = "Please enter a valid email";
    }
    // If not error -> submit form
    if (!error) {
        sendSlack(true, emailInputs[0].value);
        postRequest(formPushUrl, {data: {"email": emailInputs[0].value}});
        document.forms[0].submit();
        error = "";
    }
     
     else {
     alert(error);
     }
}


const FormAbandonmentTracker = {
    init: function(form_id, event_category, event_action = 'FormAbandonment') {
      this.$eventCategory = event_category || form_id;
      this.$eventAction = event_action;
  
      this.$formHistory = [];
      this.$formIsSubmitted = false;
      this.$formId = form_id;
      this.$form = document.getElementById(form_id);
  
      if(!this.$form) {
        console.error("FormTracker Error: Please specify the correct form id when initializing FormTracker.");
        return;
      }
      this.attachEvents();
    },
    attachEvents: function() {
      let that = this;
      this.$form.querySelectorAll('select').forEach(function(el) {
        el.addEventListener('change', function(e) { return that.onFieldChange(e); });
      });
      this.$form.querySelectorAll('input, textarea').forEach(function(el) {
        el.addEventListener('input', function(e) { return that.onFieldInput(e); });
      });
      this.$form.addEventListener('submit', function(e) { return that.onFormSubmit() });
      window.addEventListener('beforeunload', function(e) { return that.onFormAbandonment() } );
    },
    onFieldChange: function(event) {
      let field_id = event.target.id;
      this.addFieldToHistory(field_id);
    },
    onFieldInput: function(event) {
      let field_id = event.target.id;
      this.addFieldToHistory(field_id);
    },
    addFieldToHistory: function(field_id) {
      this.$formHistory.push(field_id);
      this.$formHistory = this.$formHistory.filter((v, i, a) => a.indexOf(v) === i).sort();
    },
    onFormSubmit: function() {
      this.$formIsSubmitted = true;
      this.clearFormHistory();
    },
    onFormAbandonment: function() {
      if(!this.$formIsSubmitted) {
        this.sendEvents();
      }
    },
    sendEvents: function() {
      let joined_history = this.$formHistory.join(', ');
      // Send the data off to Google
    //   this.$gtag('event', this.$eventAction, {
    //     'event_category': this.$eventCategory,
    //     'event_label': 'Fields with input: ' + joined_history,
    //     'event_callback': function() {
    //       console.log("Data sent to Google.");
    //     }
    //   });
      postRequest("https://europe-west1-test-firebase-1240d.cloudfunctions.net/postForm", {sheet: 0, data: joined_history});
    },
    clearFormHistory: function() {
      this.$formHistory = [];
    }
  };
  (function(){
    FormAbandonmentTracker.init('onboarding-form', 'Onboarding Form', 'FormAbandonment');
  })();