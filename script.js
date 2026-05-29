const taskList = document.querySelector(".task-list");
const input = document.querySelector(".input input");
const addTask = document.querySelector(".addtask");
const priorities = ["Low", "Medium", "High"]
const prioritybtn = document.querySelector(".priority-btn")
let currentPriority = "Low"
let taskData = [];


addTask.addEventListener("click", () => {

    if (input.value.trim() != "") {

        const newTask = {
            text: input.value,
            completed: false,
            priority: currentPriority
        }

        taskData.push(newTask)   // array mai add 

        renderTask()

        input.value = ""
        currentPriority = "Low"                // ← add karo
        prioritybtn.textContent = currentPriority
        localStorage.setItem("tasks", JSON.stringify(taskData))
    } else {
        alert("Please enter a Task")
    }

})

function renderTask() {
    taskList.innerHTML = ""

    taskData.forEach((task) => {
        const div = document.createElement("div")
        div.className = "task"
        div.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <span class="badge ${task.priority}">${task.priority}</span>
        <button>Edit</button>
        <button>Delete</button>
        `
        // complete counter
        const checkbox = div.querySelector("input[type='checkbox']")
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked  // object update karo
            updateStates()                 // counter update karo
            localStorage.setItem("tasks", JSON.stringify(taskData))
        })

        // delete button work
        const deletebtn = div.querySelector("button:last-child")

        deletebtn.addEventListener("click", () => {
            taskData = taskData.filter((t) => t !== task)
            localStorage.setItem("tasks", JSON.stringify(taskData))
            renderTask()
        })

        // edit button work

        const editbtn = div.querySelector("button:first-of-type")
        editbtn.addEventListener("click", () => {
            const span = div.querySelector("span")

            // Creating input field 
            const editInput = document.createElement("input")
            editInput.value = task.text
            editInput.type = "text"
            editInput.className = "inputEdit"

            // coverting span into input 
            span.replaceWith(editInput)
            editInput.focus()

            // enter pr save 
            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    if (editInput.value.trim() === "") return
                    task.text = editInput.value // array update
                    localStorage.setItem("tasks", JSON.stringify(taskData))
                    renderTask()
                }
            })
            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") saveEdit()
            })
            editInput.addEventListener("blur", () => {
                if (editInput.value.trim() === "") return
                task.text = editInput.value.trim()
                localStorage.setItem("tasks", JSON.stringify(taskData))
                renderTask()
            })

        })

        taskList.appendChild(div)
    })

    updateStates()
}


function updateStates() {
    const total = taskData.length
    const done = taskData.filter((task) => task.completed === true).length
    const pending = total - done

    document.getElementById("totalCount").textContent = total
    document.getElementById("doneCount").textContent = done
    document.getElementById("pendingCount").textContent = pending
}

const toggle = document.querySelector(".toggle_icon")

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark")
    const isDark = document.body.classList.contains("dark")
    localStorage.setItem("darkMode", isDark)

    const icon = toggle.querySelector("i")
    if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-moon"   // 🌙
    } else {
        icon.className = "fa-regular fa-sun"  // ☀️
    }

})

// Page load pe restore karo — script ke end mein
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark")
    toggle.querySelector("i").className = "fa-solid fa-moon"
}


// Poori file ke end mein — ek baar chalega
const savedTasks = localStorage.getItem("tasks")

if (savedTasks) {
    taskData = JSON.parse(savedTasks)  // string → array
    renderTask()
}

prioritybtn.addEventListener("click", () => {
    const idx = priorities.indexOf(currentPriority)
    currentPriority = priorities[(idx + 1) % 3]
    prioritybtn.textContent = currentPriority
})