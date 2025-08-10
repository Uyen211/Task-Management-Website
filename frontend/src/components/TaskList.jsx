import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, editProgress, onDelete }) => {
    function colorPriority(priority) {
        return priority === 'High'
            ? 'danger'
            : priority === 'Low'
              ? 'success'
              : 'warning';
    }

    function percentProgress(progress) {
        return progress === 'To Do'
            ? '0%'
            : progress === 'Done'
              ? '100%'
              : '50%';
    }

    return (
        <div className=" my-4">
            {tasks.map((task) => (
                <div
                    key={task._id}
                    className="d-flex mx-4 align-items-center p-3 border rounded-5 mb-3 shadow-sm bg-light"
                    style={{ gap: '4rem' }}
                >
                    <div
                        className="flex-wrap text-break"
                        style={{ width: '25%' }}
                    >
                        <p
                            className="text-muted mb-1"
                            style={{ fontSize: '0.85rem', fontWeight: '600' }}
                        >
                            Task
                        </p>
                        <p className="mb-0" style={{ fontSize: '1.1rem' }}>
                            {task.name}
                        </p>
                    </div>

                    <div style={{ width: '15%' }}>
                        <p
                            className="text-muted mb-1"
                            style={{ fontSize: '0.85rem', fontWeight: '600' }}
                        >
                            Priority
                        </p>
                        <p
                            className={`mb-0 text-${colorPriority(task.priority)} fw-bold`}
                            style={{ fontSize: '1rem' }}
                        >
                            {task.priority}
                        </p>
                    </div>

                    <div style={{ width: '15%' }}>
                        <button
                            className="btn btn-progress px-3 py-1"
                            onClick={() => editProgress(task)}
                            style={{ fontWeight: '600', fontSize: '0.95rem' }}
                        >
                            {task.progress}
                        </button>
                    </div>

                    <div style={{ width: '30%' }}>
                        <div
                            className="progress"
                            style={{
                                height: 20,
                                borderRadius: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                className="progress-bar bg-success"
                                style={{
                                    width: percentProgress(task.progress),
                                    transition: 'width 0.5s ease',
                                    borderRadius: '10px 0 0 10px',
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className=" d-flex justify-content-end gap-2 my-2"
                        style={{ width: '15%' }}
                    >
                        <button
                            className="btn btn-warning"
                            onClick={() => onEdit(task)}
                        >
                            Cập nhật
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => onDelete(task)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
