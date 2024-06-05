(function() {
	// get all data in form and return object
	function getFormData(form) {
		var elements = form.elements;
		var honeypot;

		var fields = Object.keys(elements).filter(function(k) {
			if (elements[k].name === "honeypot") {
				honeypot = elements[k].value;
				return false;
			}
			return true;
		}).map(function(k) {
			if(elements[k].name !== undefined) {
				return elements[k].name;
				// special case for Edge's html collection
			}else if(elements[k].length > 0){
				return elements[k].item(0).name;
			}
		}).filter(function(item, pos, self) {
			return self.indexOf(item) == pos && item;
		});

		var formData = {};
		fields.forEach(function(name){
			var element = elements[name];
		  
			// singular form elements just have one value
			formData[name] = element.value;

			// when our element has multiple items, get their values
			if (element.length) {
				var data = [];
				for (var i = 0; i < element.length; i++) {
					var item = element.item(i);
					if (item.checked || item.selected) {
						data.push(item.value);
					}
				}
				formData[name] = data.join(', ');
			}
		});

		// add form-specific values into the data
		formData.formDataNameOrder = JSON.stringify(fields);
		formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
		formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default
		return {data: formData, honeypot: honeypot};
	}

	function handleFormSubmit(event) {  // handles form submit without any jquery
		event.preventDefault(); // we are submitting via xhr below
		$("#mySubmit").css({"opacity": "0.30"});
		$("#mySubmit1").css({"opacity": "0.30"});		
		var form = event.target;
		var formData = getFormData(form);
		var data = formData.data;
		
		if(data.formname == 'appointment'){
			$('.appointment-btn').hide();
			$('.loading-appointment').show();
		}
		if(data.formname == 'newsletter'){
			$('.newslett').hide();
			$('.loading-newsletter').show();
		}
		if(data.formname == 'contact'){
			$('.contfott').hide();
			$('.loading-contact').show();
		}
		if(data.formname == 'contactpage'){
			$('.contpage').hide();
			$('.loading-contactpage').show();
		}
		if(data.formname == 'phonepopup'){
			$('.popnewlett').hide();
			$('.loading-phonepopup').show();
		}
				

		// If a honeypot field is filled, assume it was done so by a spam bot.
		if (formData.honeypot) {
			return false;
		}

		disableAllButtons(form);
		var url = form.action;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		// xhr.withCredentials = true;
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				$('.loading-indicator').hide();
				$("#mySubmit").css({"opacity": "1"});
				$("#mySubmit1").css({"opacity": "1"});
				if(data.formname == 'appointment'){
					$('.appointment-btn').show();
					$('.loading-appointment').hide();
					$(".result_down").html("Your Appointment has been booked successfully.");
				}
				if(data.formname == 'newsletter'){
					$('.newslett').show();
					$('.loading-newsletter').hide();
					$(".result_newsletter").html("You have been successfully subscribed.");
				}
				if(data.formname == 'contact'){
					$('.contfott').show();
					$('.loading-contact').hide();
					$(".result_contact").html("Thank You for contacting us, We will get back to you soon.");
				}
				if(data.formname == 'contactpage'){
					$('.contpage').show();
					$('.loading-contactpage').hide();
					$(".result_contacts").html("Thank You for contacting us, We will get back to you soon.");
				}
				if(data.formname == 'phonepopup'){
					$('.popnewlett').show();
					$('.loading-phonepopup').hide();
					$(".result_phonepopup").html("Thank You!");
				}
				
				$('#hidaftersubmit').css({'display':'none'});
				$('#hidaftersubmit1').css({'display':'none'});
				$('.desktop').css({'margin-top':'8rem', 'transition':'.4s'});
				form.reset();
				var formElements = form.querySelector(".form-elements")
				if (formElements) {
					formElements.style.display = "none"; // hide form
				}
				var thankYouMessage = form.querySelector(".thankyou_message");
				if (thankYouMessage) {
					thankYouMessage.style.display = "block";
				}
			}
		};
		// url encode form data for sending as post data
		var encoded = Object.keys(data).map(function(k) {
			return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
		}).join('&');
		xhr.send(encoded);
	}
  
	function loaded() {
		// bind to the submit event of our form
		var forms = document.querySelectorAll("form.gform");
		for (var i = 0; i < forms.length; i++) {
			forms[i].addEventListener("submit", handleFormSubmit, false);
		}
	};
	document.addEventListener("DOMContentLoaded", loaded, false);

	function disableAllButtons(form) {
		var buttons = form.querySelectorAll("button");
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].disabled = true;
		}
	}
})();

function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!regex.test(email)) {
		return false;
	}else{
		return true;
	}
}
function phone_validate(phno) 
{ 
	var regexPattern=new RegExp(/^[0-9-+]+$/);
	return regexPattern.test(phno);
}
function onlyNumberKey(evt) 
{ 
	var ASCIICode = (evt.which) ? evt.which : evt.keyCode 
	if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) 
		return false; 
	return true; 
}
