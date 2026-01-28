document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const filterSelect = document.getElementById('filterSelect');
    const noTaskMessage = document.getElementById('noTaskMessage');
    const deleteAllButton = document.getElementById('deleteAllButton');

    let todos = loadTodos();
    renderTodos();


    addButton.addEventListener('click', addTodo);
    filterSelect.addEventListener('change', renderTodos);
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', deleteAllTodos);
    }

    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function addTodo() {
        const taskText = taskInput.value.trim();
        const dueDate = dateInput.value;

        if (taskText === "") {
            alert("Deskripsi tugas tidak boleh kosong.");
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: taskText,
            date: dueDate,
            completed: false
        };

        todos.push(newTodo);
        taskInput.value = '';
        dateInput.value = '';
        saveTodos();
        renderTodos();
    }

    function toggleComplete(id) {
        const index = todos.findIndex(t => t.id === id);
        if (index > -1) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    }

    function deleteAllTodos() {
        if (todos.length > 0 && confirm("Hapus semua tugas?")) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }


    function renderTodos() {
        todoList.innerHTML = '';
        const filterStatus = filterSelect.value;
        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);

        let filteredTodos = todos;


        if (filterStatus === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (filterStatus === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        } else if (filterStatus === 'expired') {
            filteredTodos = todos.filter(t => {
                const tgl = new Date(t.date);
                tgl.setHours(0, 0, 0, 0);
                return !t.completed && tgl < hariIni;
            });
        }

        if (filteredTodos.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';

            filteredTodos.forEach(todo => {
                const tglDeadline = new Date(todo.date);
                tglDeadline.setHours(0, 0, 0, 0);


                const isExpired = !todo.completed && tglDeadline < hariIni;

                const row = document.createElement('tr');


                let statusHtml = '<span>Aktif</span>';
                if (todo.completed) {
                    statusHtml = '<span style="color: green;">Selesai</span>';
                } else if (isExpired) {
                    statusHtml = '<span style="color: red; font-weight: bold;">Expired</span>';
                }


                let tombolHtml = "";
                if (isExpired) {
                    tombolHtml = `<button class="del-btn" data-id="${todo.id}">Hapus</button>`;
                } else {
                    tombolHtml = `
                        <button class="tgl-btn" data-id="${todo.id}">${todo.completed ? 'Un-do' : 'Selesai'}</button>
                        <button class="del-btn" data-id="${todo.id}">Hapus</button>
                    `;
                }


                row.innerHTML = `
                    <td style="${todo.completed ? 'text-decoration: line-through; color: gray;' : ''}">${todo.text}</td>
                    <td>${todo.date || '-'}</td>
                    <td>${statusHtml}</td>
                    <td>${tombolHtml}</td>
                `;
                todoList.appendChild(row);
            });
        }


        document.querySelectorAll('.tgl-btn').forEach(btn => {
            btn.onclick = (e) => toggleComplete(parseInt(e.target.dataset.id));
        });
        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = (e) => deleteTodo(parseInt(e.target.dataset.id));
        });
    }
});
