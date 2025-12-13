document.addEventListener('DOMContentLoaded', () => {
    // Pastikan koneksi elemen
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const filterSelect = document.getElementById('filterSelect');
    const noTaskMessage = document.getElementById('noTaskMessage');

    // LAKUKAN PENGUJIAN KONEKSI SAAT STARTUP
    if (!taskInput || !addButton || !todoList) {
        console.error("CRITICAL ERROR: Salah satu elemen HTML utama (Input Tugas, Tombol Add, atau Todo List) TIDAK DITEMUKAN. Periksa ID di index.html.");
    }

    let todos = loadTodos();
    renderTodos();

    addButton.addEventListener('click', addTodo);
    deleteAllButton.addEventListener('click', deleteAllTodos);
    filterSelect.addEventListener('change', renderTodos);

    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function addTodo() {
        // --- BLOK PENGAMANAN BARU DI SINI ---
        if (!taskInput || !dateInput || !todoList) {
            console.error("ERROR: Elemen input hilang saat mencoba menambahkan tugas.");
            alert("Gagal menambahkan tugas. Periksa Console untuk detailnya (Kemungkinan ID HTML salah).");
            return; // Hentikan eksekusi jika elemen hilang
        }
        // --- AKHIR BLOK PENGAMANAN BARU ---

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

        console.log("SUCCESS: Tugas berhasil ditambahkan dan fungsi render dipanggil.");
    }

    // ... (fungsi toggleComplete, deleteTodo, deleteAllTodos, renderTodos tidak perlu diubah)

    function toggleComplete(id) {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex > -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function deleteAllTodos() {
        if (todos.length > 0 && confirm("Apakah Anda yakin ingin menghapus SEMUA tugas?")) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }

    function renderTodos() {
        // ... (kode fungsi renderTodos yang sangat panjang yang Anda kirimkan sebelumnya)
        // ... (fungsi ini tetap sama, saya tidak menampilkannya di sini untuk keringkasan)

        // *CATATAN: Pastikan Anda menyalin kode renderTodos() yang LENGKAP dari versi yang Anda miliki*

        // Hapus semua baris yang ada
        todoList.innerHTML = '';
        const filterStatus = filterSelect.value;
        let filteredTodos = todos;

        // Logika Filter
        if (filterStatus === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filterStatus === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        if (filteredTodos.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';

            filteredTodos.forEach(todo => {
                const row = document.createElement('tr');
                row.classList.add(todo.completed ? 'completed-task' : 'active-task');

                const statusText = todo.completed ?
                    `<span class="completed-text">Selesai</span>` :
                    `<span>Aktif</span>`;

                const taskCell = `<td class="task-title">${todo.text}</td>`;
                const dateCell = `<td>${todo.date || '-'}</td>`;
                const statusCell = `<td>${statusText}</td>`;
                const actionsCell = `
                     <td>
                         <button class="action-button toggle-btn" data-id="${todo.id}">
                             ${todo.completed ? 'Un-do' : 'Selesai'}
                         </button>
                         <button class="action-button delete-btn" data-id="${todo.id}">Hapus</button>
                     </td>
                 `;

                row.innerHTML = taskCell + dateCell + statusCell + actionsCell;
                todoList.appendChild(row);
            });
        }

        // Tambahkan event listener untuk tombol di baris baru
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                toggleComplete(parseInt(e.target.dataset.id));
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                deleteTodo(parseInt(e.target.dataset.id));
            });
        });
    }

});