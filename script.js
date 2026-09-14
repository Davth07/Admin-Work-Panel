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
