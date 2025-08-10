import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    name: yup
        .string()
        .required('Tên nhiệm vụ không được để trống.')
        .max(100, 'Tối đa 100 ký tự'),
    priority: yup.string().required('Mức độ ưu tiên không được để trống.'),
});

const TaskForm = ({ editingTask, onAdd, onUpdate, onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (editingTask) {
            reset({ ...editingTask });
        } else {
            reset({
                name: '',
                priority: '',
            });
        }
    }, [editingTask, reset]);

    const onSubmit = (data) => {
        const { ...restData } = data;

        const task = {
            ...restData,
            ...(editingTask && { _id: editingTask._id }), // chỉ thêm nếu editingTask tồn tại
            progress: editingTask ? editingTask.progress : 'To Do',
        };

        editingTask ? onUpdate(task, 'yes') : onAdd(task);
        onClose();
    };

    const getInputClass = (field) => {
        return errors[field] ? 'form-control is-invalid' : 'form-control';
    };

    function colorPriority(priority) {
        return priority === 'High'
            ? 'danger'
            : priority === 'Low'
              ? 'success'
              : 'warning';
    }

    return (
        <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog " style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-content no-radius border border-2 ">
                        {/* Header */}
                        <div
                            className="modal-header bg-light text-black"
                            style={{ borderBottom: 'none' }}
                        >
                            <h5 className="modal-title">
                                {editingTask ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-muted">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    className={getInputClass('name')}
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-muted">
                                    Priority
                                </label>
                                <div className="d-flex align-content-center gap-3">
                                    {['High', 'Medium', 'Low'].map(
                                        (value, index) => (
                                            <div className="d-flex" key={index}>
                                                <input
                                                    type="radio"
                                                    id={`priority${value}`}
                                                    value={value}
                                                    {...register('priority')}
                                                    className={`btn-check ${errors.priority ? 'is-invalid' : ''}`}
                                                />
                                                <label
                                                    className={`btn btn-${value} btn-outline-${colorPriority(value)}`}
                                                    htmlFor={`priority${value}`}
                                                >
                                                    {value}
                                                </label>
                                            </div>
                                        ),
                                    )}
                                </div>
                                {errors.priority && (
                                    <div className="invalid-feedback d-block">
                                        {errors.priority.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="modal-footer"
                            style={{ borderTop: 'none' }}
                        >
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingTask ? 'Cập nhật' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
