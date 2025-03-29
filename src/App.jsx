import { useState, useEffect } from "react";
import serverurl from "./server";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [editId, setEditId] = useState(null);
    const [editTask, setEditTask] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");

    useEffect(() => {
        fetch(`${serverurl}/tasks`)
            .then((response) => response.json())
            .then((data) => setTasks(data));
    }, []);

    const addTask = () => {
        if (task && date && time) {
            const newTask = { task, date, time, done: false };
            fetch(`${serverurl}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            })
                .then((response) => response.json())
                .then((data) => setTasks([...tasks, data]));

            setTask("");
            setDate("");
            setTime("");
        }
    };

    const removeTask = (id) => {
        fetch(`${serverurl}/tasks/${id}`, {
            method: "DELETE",
        }).then(() => setTasks(tasks.filter((t) => t.id !== id)));
    };

    const startEdit = (task) => {
        setEditId(task.id);
        setEditTask(task.task);
        setEditDate(task.date);
        setEditTime(task.time);
    };

    const updateTask = () => {
        if (editTask && editDate && editTime) {
            const updatedTask = { task: editTask, date: editDate, time: editTime };
            fetch(`${serverurl}/tasks/${editId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            }).then(() => {
                setTasks(tasks.map((t) => (t.id === editId ? { ...t, ...updatedTask } : t)));
                setEditId(null);
            });
        }
    };

    const toggleTaskStatus = (id, done) => {
        fetch(`${serverurl}/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done: !done }),
        }).then(() => {
            setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !done } : t)));
        });
    };

    return (
        <div className="container main align-items-center w-100">
            <h2>TO-DO LIST</h2>
            <div className="box">
                <input type="text" placeholder="Task" value={task} onChange={(e) => setTask(e.target.value)} />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <button onClick={addTask}>ADD</button>
            </div>
            <ul>
                {tasks.map((t) => (
                    <li key={t.id} className={t.done ? "done" : "pending"}>
                        {editId === t.id ? (
                            <>
                                <input type="text" value={editTask} onChange={(e) => setEditTask(e.target.value)} />
                                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                                <button onClick={updateTask}>Save</button>
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{t.task} - {t.date} - {t.time}</span>
                                <button onClick={() => toggleTaskStatus(t.id, t.done)}>{t.done ? "Mark as Pending" : "Mark as Done"}</button>
                                <button onClick={() => startEdit(t)}>Edit</button>
                                <button onClick={() => removeTask(t.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
