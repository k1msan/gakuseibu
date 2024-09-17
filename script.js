document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const dashboardCard = document.getElementById('dashboard-card');
    const loginCard = document.getElementById('login-card');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const logoutButton = document.getElementById('logout-button');
    const tabsTriggers = document.querySelectorAll('.tabs-trigger');
    const tabsContents = document.querySelectorAll('.tabs-content');

    const announcementForm = document.getElementById('announcement-form');
    const announcementList = document.getElementById('announcement-list');
    const announcementTable = document.querySelector('#announcement-table tbody');
    const minutesForm = document.getElementById('minutes-form');
    const minutesList = document.getElementById('minutes-list');
    const minutesTable = document.querySelector('#minutes-table tbody');
    const taskForm = document.getElementById('task-form');
    const taskListPending = document.getElementById('task-list-pending');
    const taskListCompleted = document.getElementById('task-list-completed');
    const monthSelect = document.getElementById('month-select');
    const searchInput = document.getElementById('search-input');

    let announcements = [];
    let minutes = [];
    let tasks = [];

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (password === '0429') {
            loginCard.style.display = 'none';
            dashboardCard.style.display = 'block';
            errorMessage.style.display = 'none';
        } else {
            errorMessage.style.display = 'block';
            errorText.textContent = 'パスワードが間違っています。';
        }
    });

    logoutButton.addEventListener('click', function() {
        loginCard.style.display = 'block';
        dashboardCard.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

    tabsTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            tabsTriggers.forEach(btn => btn.classList.remove('active'));
            tabsContents.forEach(content => content.style.display = 'none');
            document.getElementById(trigger.getAttribute('data-target')).style.display = 'block';
            trigger.classList.add('active');
        });
    });

    searchInput.addEventListener('input', updateSearchResults);

    function updateSearchResults() {
        const query = searchInput.value.toLowerCase();
        filterAnnouncements(query);
        filterMinutes(query);
        filterTasks(query);
    }

    announcementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('announcement-title').value;
        const text = document.getElementById('announcement-input').value;
        const username = document.getElementById('username').value;

        if (title && text) {
            const announcement = { title, text, username, date: new Date() };
            announcements.unshift(announcement);
            updateAnnouncements();
            document.getElementById('announcement-title').value = '';
            document.getElementById('announcement-input').value = '';
        }
    });

    minutesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('minutes-title').value;
        const text = document.getElementById('minutes-input').value;
        const username = document.getElementById('username').value;

        if (title && text) {
            const minute = { title, text, username, date: new Date() };
            minutes.unshift(minute);
            updateMinutes();
            document.getElementById('minutes-title').value = '';
            document.getElementById('minutes-input').value = '';
        }
    });

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const text = document.getElementById('task-input').value;
        const deadline = document.getElementById('task-deadline').value;
        const username = document.getElementById('username').value;

        if (title && text && deadline) {
            const task = { title, text, deadline, username, completed: false, date: new Date() };
            tasks.unshift(task);
            updateTasks();
            document.getElementById('task-title').value = '';
            document.getElementById('task-input').value = '';
            document.getElementById('task-deadline').value = '';
        }
    });

    monthSelect.addEventListener('change', updateTasks);

    function filterAnnouncements(query = '') {
        announcementList.innerHTML = '';
        announcementTable.innerHTML = '';
        announcements.forEach(item => {
            if (item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.title}</strong> - ${item.text} - ${item.username} (${item.date.toLocaleString()})`;
                announcementList.appendChild(li);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-4 py-2 border">${item.title}</td>
                    <td class="px-4 py-2 border">${item.text}</td>
                    <td class="px-4 py-2 border">${item.username}</td>
                    <td class="px-4 py-2 border">${item.date.toLocaleString()}</td>
                `;
                announcementTable.appendChild(tr);
            }
        });
    }

    function filterMinutes(query = '') {
        minutesList.innerHTML = '';
        minutesTable.innerHTML = '';
        minutes.forEach(item => {
            if (item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.title}</strong> - ${item.text} - ${item.username} (${item.date.toLocaleString()})`;
                minutesList.appendChild(li);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-4 py-2 border">${item.title}</td>
                    <td class="px-4 py-2 border">${item.text}</td>
                    <td class="px-4 py-2 border">${item.username}</td>
                    <td class="px-4 py-2 border">${item.date.toLocaleString()}</td>
                `;
                minutesTable.appendChild(tr);
            }
        });
    }

    function filterTasks(query = '') {
        taskListPending.innerHTML = '';
        taskListCompleted.innerHTML = '';

        const selectedMonth = monthSelect.value; // "YYYY-MM"形式

        tasks.forEach((item, index) => {
            const taskMonth = item.deadline.slice(0, 7); // "YYYY-MM"形式に変換
            if (selectedMonth && taskMonth !== selectedMonth) return;

            if (item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.title}</strong> - ${item.text} - ${item.username} (期限: ${item.deadline}) - ${item.date.toLocaleString()}`;
                li.style.cursor = 'pointer';

                const completeButton = document.createElement('button');
                completeButton.innerHTML = item.completed ? '↩️' : '✔️';
                completeButton.classList.add('button', 'checkmark');
                completeButton.addEventListener('click', () => toggleTaskCompletion(index));

                li.appendChild(completeButton);

                if (item.completed) {
                    taskListCompleted.appendChild(li);
                } else {
                    taskListPending.appendChild(li);
                }
            }
        });
    }

    function updateAnnouncements() {
        filterAnnouncements(); // 検索条件なしで全ての項目を更新表示
    }

    function updateMinutes() {
        filterMinutes(); // 検索条件なしで全ての項目を更新表示
    }

    function updateTasks() {
        filterTasks(); // 検索条件なしで全ての項目を更新表示
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        updateTasks();
    }
});
