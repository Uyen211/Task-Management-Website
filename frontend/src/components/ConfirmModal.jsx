import React from 'react';

function ConfirmModal({ task, onConfirm, onCancel }) {
    return (
        <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Xác nhận xóa</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            Bạn có chắc chắn muốn xóa nhiệm vụ? "
                            <strong>{task.name}</strong>"?
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Hủy
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm}>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
