function loadInitialTasks() {
	const savedData = localStorage.getItem("admin_tasks");
	if (savedData) {
		return JSON.parse(savedData);
	} else {
		return [
			{
				id: 1,
				title: "Kontrollera inventarielistan för IT-utrustning",
				done: false,
				priority: "Medium",
			},
			{
				id: 2,
				title: "Uppdatera veckans supportstatistik",
				done: false,
				priority: "Medium",
			},
			{
				id: 3,
				title: "Granska nya användarkonton före aktivering",
				done: false,
				priority: "High",
			},
			{
				id: 4,
				title: "Kontrollera att mötesrummens skärmar fungerar",
				done: true,
				priority: "Low",
			},
			{
				id: 5,
				title: "Sammanställa felrapporter från helpdesk",
				done: false,
				priority: "Medium",
			},
			{
				id: 6,
				title: "Arkivera avslutade serviceärenden",
				done: true,
				priority: "Low",
			},
			{
				id: 7,
				title: "Verifiera backup-loggen från natten",
				done: false,
				priority: "High",
			},
			{
				id: 8,
				title: "Uppdatera kontaktlistan för externa leverantörer",
				done: false,
				priority: "Low",
			},
			{
				id: 9,
				title: "Kontrollera licenser som går ut denna månad",
				done: false,
				priority: "High",
			},
			{
				id: 10,
				title: "Förbereda sammanfattning till veckomötet",
				done: false,
				priority: "Medium",
			},
		];
	}
}

let tasks = loadInitialTasks();
let currentFilter = "all";

const taskList = document.getElementById("task-list");
const totalCounter = document.getElementById("count");
const doneCounter = document.getElementById("done");
const filterButtons = document.querySelectorAll(".filter-btn");

const searchInput = document.getElementById("search-id");
const searchBtn = document.getElementById("search-btn");
const searchResult = document.getElementById("search-result");
const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const feedback = document.getElementById("feedback");

const form = document.getElementById("signUpForm");
const form2 = document.getElementById("signInForm");
const main = document.getElementById("main");

function saveToLocalStorage(arrayToSave) {
	localStorage.setItem("admin_tasks", JSON.stringify(arrayToSave));
}

function toggleTaskDone(id) {
	const task = tasks.find((t) => t.id === id);
	if (task) {
		task.done = !task.done;
		saveToLocalStorage(tasks);
		renderTasks();
	}
}

function deleteTask(id) {
	tasks = tasks.filter((t) => t.id !== id);
	saveToLocalStorage(tasks);
	renderTasks();
}

filterButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		currentFilter = btn.getAttribute("data-filter");
		renderTasks();
	});
});

searchBtn.addEventListener("click", () => {
	const searchId = parseInt(searchInput.value);
	const foundTask = tasks.find((t) => t.id === searchId);

	if (foundTask) {
		searchResult.innerHTML = `<p style="color: green;">Hittade: <strong>${foundTask.title}</strong> (${foundTask.priority})</p>`;
	} else {
		searchResult.innerHTML = `<p style="color: red;">Ingen uppgift hittades med ID ${searchInput.value}</p>`;
	}
});

signUp.addEventListener("click", () => {
	form.hidden = false;
	form2.hidden = true;
	feedback.textContent = "";
});
signIn.addEventListener("click", () => {
	form2.hidden = false;
	form.hidden = true;
	feedback.textContent = "";
});

function signUpFunction() {
	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const confirmInput = document.getElementById("confirm");

	const email = emailInput.value.trim();
	const password = passwordInput.value;
	const confirm = confirmInput.value;

	if (email === "" || !email.includes("@")) {
		feedback.textContent = "Email får inte vara tom och måste innehålla '@'.";
		return;
	}
	if (password.length < 8) {
		feedback.textContent = "Lösenord måste vara minst 8 tecken.";
		return;
	}
	if (password !== confirm) {
		feedback.textContent = "Lösenorden matchar inte.";
		return;
	}
	const customer = {
		id: 1,
		email: emailInput.value.trim(),
		password: passwordInput.value,
	};

	const customerJSON = JSON.stringify(customer);

	localStorage.setItem("registeredCustomer", customerJSON);
	feedback.textContent = "Konto skapat!";
	form.hidden = true;
}

function signInFunction() {
	const emailInput2 = document.getElementById("email2");
	const passwordInput2 = document.getElementById("password2");

	const email2 = emailInput2.value.trim();
	const password2 = passwordInput2.value;
	const user = JSON.parse(localStorage.getItem("registeredCustomer"));
	if (!user) {
		feedback.textContent = "Inga användare hittats. Skapa ett konto. ";
		return;
	}
	if (email2 !== user.email) {
		feedback.textContent = "Lösenord eller Email är fel.";
		return;
	}
	if (password2 !== user.password) {
		feedback.textContent = "Lösenord eller Email är fel.";
		return;
	}

	form.hidden = true;
	form2.hidden = true;
	signIn.hidden = true;
	signUp.hidden = true;
	main.hidden = false;
	feedback.textContent = "";
}

form.addEventListener("submit", function (event) {
	event.preventDefault();
	signUpFunction();
});
form2.addEventListener("submit", function (event) {
	event.preventDefault();
	signInFunction();
});

function renderTasks() {
	taskList.innerHTML = "";

	const filteredTasks = tasks.filter((task) => {
		if (currentFilter === "all") return true;
		return task.priority === currentFilter;
	});

	filteredTasks.forEach((task) => {
		const li = document.createElement("li");

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = task.done;
		checkbox.addEventListener("change", () => toggleTaskDone(task.id));

		const text = document.createElement("span");
		text.textContent = ` [ID: ${task.id}] ${task.title} (${task.priority}) `;

		if (task.done) {
			text.style.textDecoration = "line-through";
			text.classList.add("completed");
		}

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "Ta bort";
		deleteBtn.addEventListener("click", () => deleteTask(task.id));

		li.appendChild(checkbox);
		li.appendChild(text);
		li.appendChild(deleteBtn);

		taskList.appendChild(li);
	});

	totalCounter.textContent = tasks.length;
	doneCounter.textContent = tasks.filter((task) => task.done).length;
}

renderTasks();
