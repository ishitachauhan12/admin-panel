import obj from "./student_data.json" assert { type: "json" };
const table = document.querySelector("tbody");
const addButton = document.querySelector(".add");
const submitButton = document.querySelector(".submit");
const name = document.querySelector(".name");
const email = document.querySelector(".email");
const phone = document.querySelector(".phone");
const percentage = document.querySelector(".percentage");
const hobbies = document.querySelector(".hobbies");
const showPassed = document.querySelector(".show-pass");
const showFailed = document.querySelector(".show-fail");
const failed = document.getElementsByClassName("roww fail");
const passed = document.getElementsByClassName("roww pass");

let isEditing = false;

// create row
function createRow(data, idx) {
  const row = document.createElement("tr");

  const indexCell = document.createElement("td");
  indexCell.textContent = idx + 1;
  row.appendChild(indexCell);

  const nameCell = document.createElement("td");
  nameCell.textContent = data.Name;
  row.appendChild(nameCell);

  const emailCell = document.createElement("td");
  emailCell.textContent = data.Email;
  emailCell.classList.add("email");
  row.appendChild(emailCell);

  const phoneCell = document.createElement("td");
  phoneCell.textContent = data.Phone_No;
  phoneCell.classList.add("phone");
  row.appendChild(phoneCell);

  const percentageCell = document.createElement("td");
  percentageCell.textContent = data.Percentage;
  percentageCell.classList.add("percentage");
  row.appendChild(percentageCell);

  const hobbiesCell = document.createElement("td");

  if (data.Hobbies !== undefined) {
    data.Hobbies.forEach((i, idx) => {
      if (idx !== 0) hobbiesCell.textContent += `, `;
      hobbiesCell.textContent += `${i}`;
    });
    hobbiesCell.classList.add("hobbies");
    row.appendChild(hobbiesCell);
  }

  const statusCell = document.createElement("td");
  statusCell.textContent = data.Percentage > 40 ? "PASS" : "FAIL";
  statusCell.classList.add("status");
  row.appendChild(statusCell);
  row.classList.add("roww");
  row.classList.add(data.Percentage > 40 ? "pass" : "fail");

  table.appendChild(row);

  const cells = row.querySelectorAll("td");
  cells.forEach(function (cell) {
    cell.addEventListener("dblclick", function (event) {
      if (isEditing) {
        return;
      }

      var cellValue = this.innerHTML;
      var input = document.createElement("input");
      input.value = cellValue;
      input.style.width = this.offsetWidth + "px";
      this.innerHTML = "";
      this.appendChild(input);
      input.focus();
      isEditing = true;

      input.addEventListener("blur", function () {
        console.log(cell.classList.value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hobbiesArray;
        if (cell.classList.value == "hobbies") {
          hobbiesArray = this.value
            .split(",")
            .map((hobby) => hobby.trim())
            .filter((hobby) => hobby !== "");

          console.log(hobbiesArray);
        }
        if (this.value === "") {
          cell.innerHTML = cellValue;
          alert("Required field cannot be empty!");
        } else if (
          cell.classList.value == "email" &&
          !emailRegex.test(this.value)
        ) {
          cell.innerHTML = cellValue;
          alert("invalid email!");
        } else if (
          cell.classList.value == "phone" &&
          (Number(this.value) > 9999999999 ||
            Number(this.value) < 1000000000 ||
            isNaN(this.value))
        ) {
          cell.innerHTML = cellValue;

          alert("invalid phone no!");
        } else if (
          cell.classList.value == "percentage" &&
          (isNaN(this.value) ||
            Number(this.value) > 100 ||
            Number(this.value) < 0)
        ) {
          cell.innerHTML = cellValue;
          alert("invalid percentage!");
        } else if (
          cell.classList.value == "hobbies" &&
          (hobbiesArray.length > 5 || hobbiesArray.length < 1)
        ) {
          console.log(this.value);
          alert("You can add upto 5 hobbies only");
          cell.innerHTML = cellValue;
        } else {
          cell.innerHTML = this.value;
        }
        isEditing = false;
      });
    });
  });
}

// Get JSON data
obj.students.forEach((data, idx) => {
  createRow(data, idx);
});

// Open form
addButton.addEventListener("click", () => {
  if (document.querySelector(".form-card").style.display === "block") {
    document.querySelector(".form-card").style.display = "none";
    addButton.innerHTML = "Add row";
  } else {
    document.querySelector(".form-card").style.display = "block";
    addButton.innerHTML = "Close add row";
  }
});

// Submit data
submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  name.classList.remove("error-field");
  email.classList.remove("error-field");
  phone.classList.remove("error-field");
  percentage.classList.remove("error-field");

  document.querySelector(".email-feedback").style.display = "none";
  document.querySelector(".phone-feedback").style.display = "none";
  document.querySelector(".percentage-feedback").style.display = "none";

  const nameValue = name.value;
  const emailValue = email.value;
  const phoneValue = phone.value;
  const percentageValue = percentage.value;
  const hobbiesValue = hobbies.value;

  let hasError = false;

  if (nameValue === "") {
    name.classList.add("error-field");
    hasError = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    email.classList.add("error-field");
    document.querySelector(".email-feedback").style.display = "block";

    hasError = true;
  }
  if (
    phoneValue === "" ||
    Number(phoneValue) > 9999999999 ||
    Number(phoneValue) < 1000000000 ||
    isNaN(phoneValue)
  ) {
    document.querySelector(".phone-feedback").style.display = "block";

    phone.classList.add("error-field");
    hasError = true;
  }
  if (
    percentageValue === "" ||
    isNaN(percentageValue) ||
    Number(percentageValue) > 100 ||
    Number(percentageValue) < 0
  ) {
    console.log(percentageValue, typeof percentageValue);
    percentage.classList.add("error-field");
    document.querySelector(".percentage-feedback").style.display = "block";

    hasError = true;
  }

  const hobbiesArray = hobbiesValue
    .split(",")
    .map((hobby) => hobby.trim())
    .filter((hobby) => hobby !== "");

  console.log(hobbiesArray.length);

  if (hobbiesArray.length < 1 || hobbiesArray.length > 5) {
    hobbies.classList.add("error-field");
    document.querySelector(".hobbies-feedback").style.display = "block";
    hasError = true;
  }

  if (hasError) {
    alert("Please fill in all required fields correctly.");
    return;
  }

  const object = {
    Name: nameValue,
    Email: emailValue,
    Phone_No: phoneValue,
    Percentage: percentageValue,
    Hobbies: hobbiesArray,
  };

  console.log(hobbiesArray);
  createRow(object, table.rows.length);

  name.value = "";
  email.value = "";
  phone.value = "";
  percentage.value = "";
  hobbies.value = "";
});

showPassed.addEventListener("click", (e) => {
  e.preventDefault();
  Array.from(failed).forEach((element) => {
    element.classList.add("display-none");
  });
});

showFailed.addEventListener("click", (e) => {
  e.preventDefault();
  Array.from(passed).forEach((element) => {
    element.classList.add("display-none");
  });
});
