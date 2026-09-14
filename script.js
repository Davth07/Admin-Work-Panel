let tasks = [
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

let currentFilter = "all";

const taskList = document.getElementById("task-list");
const totalCounter = document.getElementById("count");
const doneCounter = document.getElementById("done");
const filterButtons = document.querySelectorAll(".filter-btn");

function toggleTaskDone(id) {
	const task = tasks.find((t) => t.id === id);
	if (task) {
		task.done = !task.done;
		renderTasks();
	}
}

function deleteTask(id) {
	tasks = tasks.filter((t) => t.id !== id);
	renderTasks();
}

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
			text.style.color = "gray";
		}

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "Radera";
		deleteBtn.addEventListener("click", () => deleteTask(task.id));

		li.appendChild(checkbox);
		li.appendChild(text);
		li.appendChild(deleteBtn);
		taskList.appendChild(li);
	});

	totalCounter.textContent = tasks.length;
	doneCounter.textContent = tasks.filter((task) => task.done).length;
}

filterButtons.forEach((button) => {
	button.addEventListener("click", (event) => {
		currentFilter = event.target.getAttribute("data-filter");
		renderTasks();
	});
});

const searchInput = document.getElementById("search-id");
const searchBtn = document.getElementById("search-btn");
const searchResult = document.getElementById("search-result");

searchBtn.addEventListener("click", () => {
	const inputId = parseInt(searchInput.value);
	searchResult.innerHTML = "";

	if (isNaN(inputId)) {
		searchResult.textContent = "Vänligen skriv in ett giltigt ID-nummer.";
		return;
	}

	const foundTask = tasks.find((task) => task.id === inputId);

	if (foundTask) {
		searchResult.innerHTML = `
      <p><strong>Hittad:</strong> ${foundTask.title} <br> 
      Status: ${foundTask.done ? "Klar" : "Ej klar"} | Prioritet: ${foundTask.priority}</p>
    `;
	} else {
		searchResult.textContent = `Kunde inte hitta någon task med ID: ${inputId}`;
	}
});

renderTasks();
