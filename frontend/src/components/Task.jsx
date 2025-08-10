import ConfirmModal from './ConfirmModal';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Task.css';
const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getTasks();
            console.log(tasks);
        } else {
            navigate('/sign');
        }
    }, [navigate]);

    async function getTasks() {
        const url = 'http://localhost:5000/task/';
        const token = localStorage.getItem('token'); // lấy token từ localStorage

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // thêm header Authorization
            },
        });

        const resJson = await res.json();
        console.log('server response:', resJson);

        if (!res.ok) {
            showAlert('Truy vấn dữ liệu nhiệm vụ thất bại!', 'danger');
        } else {
            showAlert('Truy vấn dữ liệu nhiệm vụ thành công!', 'success');
            setTasks(resJson.Tasks);
        }
    }

    const showAlert = (message, type) => {
        setAlert({ message, type });

        setTimeout(() => {
            setVisible(true);
        }, 5);

        setTimeout(() => {
            setVisible(false);
        }, 1000);

        setTimeout(() => {
            setAlert({ message: '', type: '' });
        }, 1500);
    };

    async function handleAdd(task) {
        const url = 'http://localhost:5000/task/';
        const token = localStorage.getItem('token'); // lấy token từ localStorage

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // thêm header Authorization
            },
            body: JSON.stringify({
                name: task.name,
                priority: task.priority,
                progress: task.progress,
            }),
        });

        const resJson = await res.json();
        console.log('server response:', resJson);

        if (!res.ok) {
            showAlert('Tạo nhiệm vụ thất bại!', 'danger');
        } else {
            showAlert('Tạo nhiệm vụ thành công!', 'success');
            setTasks([...tasks, resJson.task]);
        }
    }

    async function handleUpdate(task, alert) {
        const url = 'http://localhost:5000/task/' + task._id;
        const token = localStorage.getItem('token'); // lấy token từ localStorage

        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // thêm header Authorization
            },
            body: JSON.stringify({
                name: task.name,
                priority: task.priority,
                progress: task.progress,
            }),
        });

        const resJson = await res.json();
        console.log('server response:', resJson);

        if (!res.ok) {
            showAlert('Cập nhật nhiệm vụ thất bại!', 'danger');
        } else {
            if (alert == 'yes')
                showAlert('Cập nhật nhiệm vụ thành công!', 'success');
            const newEditTask = resJson.task;
            setTasks(
                tasks.map((t) => (t._id === newEditTask._id ? newEditTask : t)),
            );
        }
    }

    async function handleDelete() {
        const task = taskToDelete;
        const url = 'http://localhost:5000/task/' + task._id;
        const token = localStorage.getItem('token');

        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const resJson = await res.json();
        console.log('server response:', resJson);

        if (!res.ok) {
            showAlert(resJson.message, 'danger');
        } else {
            showAlert(resJson.message, 'success');
            setTaskToDelete(null);
            setTasks(tasks.filter((t) => t._id !== task._id));
        }
    }

    function logout() {
        localStorage.removeItem('token');
        navigate('/sign');
    }

    function editProgress(task) {
        let progress = task.progress;

        if (progress === 'To Do') progress = 'In progress';
        else if (progress === 'In progress') progress = 'Done';
        else progress = 'To Do';

        handleUpdate({ ...task, progress }, 'no'); // pass task với progress mới
    }

    return (
        <div className="container-fluid m-0 p-0">
            <div className="container-fluid d-flex p-3 align-items-center justify-content-between bg-light rounded">
                <h1>Task List</h1>

                <div className="d-flex p-0 m-0 gap-3">
                    <button
                        className="btn btn-add"
                        onClick={() => {
                            setShowForm(true);
                        }}
                    >
                        + Add Task
                    </button>

                    <button
                        className="btn btn-logout"
                        onClick={() => {
                            logout();
                        }}
                    >
                        <i class="bi bi-box-arrow-left"></i>
                    </button>
                </div>
            </div>

            {alert.message && (
                <p
                    className={`alert alert-${alert.type} ${visible ? 'visible' : ''} m-4 `}
                    id="alert"
                >
                    {alert.message}
                </p>
            )}

            <TaskList
                tasks={tasks}
                onEdit={(task) => {
                    setEditingTask(task);
                    setShowForm(true);
                }}
                onDelete={(task) => setTaskToDelete(task)}
                editProgress={(task) => {
                    editProgress(task);
                }}
            />

            {showForm && (
                <TaskForm
                    tasks={tasks}
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    editingTask={editingTask}
                />
            )}

            {taskToDelete && (
                <ConfirmModal
                    task={taskToDelete}
                    onConfirm={handleDelete}
                    onCancel={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
};

export default Task;
