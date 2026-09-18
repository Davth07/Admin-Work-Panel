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
let tempUser = null;
let timerInterval = null;
// * Behöver använda mer kommentarer
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
const feedback2 = document.getElementById("feedback2");

const form = document.getElementById("signUpForm");
const form2 = document.getElementById("signInForm");
const main = document.getElementById("main");

const loginStep1 = document.getElementById("login-step1");
const loginStep2 = document.getElementById("login-step2");
const sessionInfo = document.getElementById("session-info");
const loggedUser = document.getElementById("logged-user");
const sessionTime = document.getElementById("session-time");
const logoutBtn = document.getElementById("logoutBtn");

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskPrioritySelect = document.getElementById("task-priority");

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
		searchResult.innerHTML = `<p class="search-success">Hittade: <strong>${foundTask.title}</strong> (${foundTask.priority})</p>`;
	} else {
		searchResult.innerHTML = `<p class="search-error">Ingen uppgift hittades med ID ${searchInput.value}</p>`;
	}
});

signUp.addEventListener("click", () => {
	form.hidden = false;
	form2.hidden = true;
	feedback.textContent = "";
	form2.style.display = "none";
});
signIn.addEventListener("click", () => {
	form2.hidden = false;
	form.hidden = true;
	form2.hidden = false;
	form2.style.display = "flex";
	loginStep1.style.display = "flex";
	loginStep2.style.display = "none";
	feedback2.textContent = "";
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

	const users = JSON.parse(localStorage.getItem("adminPlannerUsers")) || [];

	const customer = {
		email: email,
		password: password,
	};

	users.push(customer);
	localStorage.setItem("adminPlannerUsers", JSON.stringify(users));

	feedback.textContent = "Konto skapat! Gå till Sign In.";
	form.reset();
}

function signInFunction() {
	const emailInput2 = document.getElementById("email2");
	const passwordInput2 = document.getElementById("password2");

	const email2 = emailInput2.value.trim();
	const password2 = passwordInput2.value;

	const users = JSON.parse(localStorage.getItem("adminPlannerUsers")) || [];
	const user = users.find((u) => u.email === email2);

	if (!user) {
		feedback2.textContent = "Ingen användare hittades med den e-posten.";
		return;
	}
	if (password2 !== user.password) {
		feedback2.textContent = "Lösenord eller Email är fel.";
		return;
	}

	tempUser = user;

	loginStep1.style.display = "none";
	loginStep2.style.display = "block";
}

document.querySelectorAll(".method-btn").forEach((btn) => {
	btn.addEventListener("click", (e) => {
		const chosenMethod = e.target.getAttribute("data-method");

		const session = {
			email: tempUser.email,
			method: chosenMethod,
			loginTime: Date.now(),
		};
		localStorage.setItem("adminPlannerSession", JSON.stringify(session));

		startApplication(session);
	});
});

function startApplication(session) {
	form.hidden = true;
	form2.hidden = true;
	signIn.style.display = "none";
	signUp.style.display = "none";
	form2.style.display = "none";

	sessionInfo.style.display = "flex";
	loggedUser.textContent = `Inloggad: ${session.email} (${session.method})`;

	main.hidden = false;
	feedback2.textContent = "";
	renderTasks();

	clearInterval(timerInterval);
	timerInterval = setInterval(() => {
		const elapsed = Date.now() - session.loginTime;
		const seconds = Math.floor(elapsed / 1000);
		sessionTime.textContent = `Session: ${seconds}s`;
	}, 1000);
}

logoutBtn.addEventListener("click", () => {
	localStorage.removeItem("adminPlannerSession");
	clearInterval(timerInterval);

	main.hidden = true;
	sessionInfo.style.display = "none";
	signIn.style.display = "inline-block";
	signUp.style.display = "inline-block";
	form2.hidden = false;
	form2.style.display = "flex";
	loginStep1.style.display = "block";
	loginStep2.style.display = "none";
	form2.reset();
});

form.addEventListener("submit", function (event) {
	event.preventDefault();
	signUpFunction();
});
form2.addEventListener("submit", function (event) {
	event.preventDefault();
	signInFunction();
});
taskForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const title = taskTitleInput.value.trim();
	const priority = taskPrioritySelect.value;

	if (title === "") return;

	const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

	const newTask = {
		id: newId,
		title: title,
		priority: priority,
		done: false,
	};

	tasks.push(newTask);
	saveToLocalStorage(tasks);
	renderTasks();

	taskForm.reset();
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

const activeSession = JSON.parse(localStorage.getItem("adminPlannerSession"));
if (activeSession) {
	startApplication(activeSession);
} else {
	renderTasks();
}
