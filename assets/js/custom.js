document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const telefonas = form.querySelector("input[name='telefonas']");
    const output = document.getElementById("formOutput");
    const successPopup = document.createElement("div");
    successPopup.classList.add("success-popup");
    document.body.appendChild(successPopup);

    function validatePhone(value) {
        const valid = /^\+3706\d{7}$/.test(value.trim());
        console.log("validatePhone:", value, valid);
        return valid;
    }

    function validateName(value) {
        const valid = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(value.trim());
        console.log("validateName:", value, valid);
        return valid;
    }

    function validateEmail(value) {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        console.log("validateEmail:", value, valid);
        return valid;
    }

    function validateAddress(value) {
        const valid = value.trim() !== "";
        console.log("validateAddress:", value, valid);
        return valid;
    }

    function showError(input, message) {
        console.log("showError:", input.name, message);
        input.classList.add("is-invalid");
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains("invalid-feedback")) {
            feedback = document.createElement("div");
            feedback.classList.add("invalid-feedback");
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }

    function clearError(input) {
        console.log("clearError:", input.name);
        input.classList.remove("is-invalid");
        let feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains("invalid-feedback")) {
            feedback.remove();
        }
    }

    function validateField(input) {
        const name = input.name;
        const value = input.value;
        let valid = false;

        if (name === "vardas" || name === "pavarde") {
            if (value.trim() === "") showError(input, "Laukas negali būti tuščias");
            else if (!validateName(value)) showError(input, "Laukas turi būti sudarytas tik iš raidžių");
            else { clearError(input); valid = true; }
        } else if (name === "elpastas") {
            if (value.trim() === "") showError(input, "Laukas negali būti tuščias");
            else if (!validateEmail(value)) showError(input, "Įveskite teisingą el. paštą");
            else { clearError(input); valid = true; }
        } else if (name === "adresas") {
            if (!validateAddress(value)) showError(input, "Laukas negali būti tuščias");
            else { clearError(input); valid = true; }
        } else if (name === "telefonas") {
            if (!validatePhone(value)) showError(input, "Telefono numeris turi būti +3706xxxxxxx formatu");
            else { clearError(input); valid = true; }
        } else {
            valid = true;
        }

        console.log("validateField:", name, value, valid);
        return valid;
    }

    function checkFormValidity() {
        let valid = true;
        const inputs = form.querySelectorAll("input[name]");
        inputs.forEach(input => { if (!validateField(input)) valid = false; });
        submitBtn.disabled = !valid;
        console.log("checkFormValidity:", valid);
    }

    form.querySelectorAll("input[name]").forEach(input => {
        input.addEventListener("input", () => {
            console.log("input event on:", input.name, input.value);
            validateField(input);
            checkFormValidity();
        });
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Form submitted");

        let allValid = true;
        const inputs = form.querySelectorAll("input[name]");
        inputs.forEach(input => { if (!validateField(input)) allValid = false; });

        if (!allValid) {
            console.log("Form invalid, cannot submit");
            alert("Prašome užpildyti formą teisingai!");
            return;
        }

        const formData = {
            vardas: form.vardas.value,
            pavarde: form.pavarde.value,
            elpastas: form.elpastas.value,
            telefonas: form.telefonas.value,
            adresas: form.adresas.value,
            klausimas1: Number(form.q1.value),
            klausimas2: Number(form.q2.value),
            klausimas3: Number(form.q3.value)
        };

        console.log("FormData:", formData);

        const vidurkis = (formData.klausimas1 + formData.klausimas2 + formData.klausimas3) / 3;
        const vidurkisRounded = vidurkis.toFixed(1);
        console.log("Average:", vidurkisRounded);

        output.innerHTML = `
            <div class="alert alert-info mt-4">
                <h5>Jūsų įvesti duomenys:</h5>
                <p><strong>Vardas:</strong> ${formData.vardas}</p>
                <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
                <p><strong>El. paštas:</strong> ${formData.elpastas}</p>
                <p><strong>Telefonas:</strong> ${formData.telefonas}</p>
                <p><strong>Adresas:</strong> ${formData.adresas}</p>
                <p><strong>Klausimas 1:</strong> ${formData.klausimas1}</p>
                <p><strong>Klausimas 2:</strong> ${formData.klausimas2}</p>
                <p><strong>Klausimas 3:</strong> ${formData.klausimas3}</p>
                <hr>
                <h5><strong>${formData.vardas} ${formData.pavarde}:</strong> ${vidurkisRounded}</h5>
            </div>
        `;

        successPopup.textContent = "Forma sėkmingai pateikta!";
        successPopup.style.display = "block";
        setTimeout(() => { successPopup.style.display = "none"; }, 3000);
    });
});
