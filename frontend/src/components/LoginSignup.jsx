import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../assets/user.png';
import password_icon from '../assets/locked.png';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    username: yup
        .string()
        .required('Tên người dùng không được để trống.')
        .max(100, 'Tối đa 100 ký tự'),
    userpassword: yup
        .string()
        .required('Mật khẩu không được để trống.')
        .min(10, 'Tối thiểu 10 ký tự'),
});

const LoginSignup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [action, setAction] = useState('Sign Up');
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setVisible(true);
        setTimeout(() => setVisible(false), 1200);
        setTimeout(() => setAlert({ message: '', type: '' }), 1500);
    };

    async function onSubmit(data) {
        const { username, userpassword } = data;
        const url =
            action === 'Sign Up'
                ? 'http://localhost:5000/sign/signUp'
                : 'http://localhost:5000/sign/signIn';

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username,
                    password: userpassword,
                }),
            });

            const resJson = await res.json();
            console.log('server response:', resJson);

            if (!res.ok) {
                showAlert(resJson.message || JSON.stringify(resJson), 'danger');
            } else {
                // hiển thị message nếu server trả về message string
                showAlert(resJson.message || 'Thành công!', 'success');
                reset();

                if (action === 'Login') {
                    localStorage.setItem('token', resJson.token);
                    navigate('/task');
                } else {
                    setAction('Login');
                }
            }
        } catch (err) {
            console.error(err);
            showAlert(err.message || 'Lỗi mạng', 'danger');
        }
    }

    const inputClass = (field) =>
        `input-loginSignup ${errors[field] ? 'div-is-invalid' : ''}`;

    return (
        <div className="ctn-center">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            {/* ĐẶT button TRONG form để submit hoạt động */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="inputs">
                    {alert.message && (
                        <p
                            className={`alert alert-${alert.type} ${visible ? 'visible' : ''}`}
                            id="alert"
                        >
                            {alert.message}
                        </p>
                    )}

                    <div className={inputClass('username')}>
                        <img src={user_icon} alt="" />
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('username')}
                        />
                    </div>
                    {errors.username && (
                        <div className="feedback">
                            {errors.username.message}
                        </div>
                    )}

                    <div className={inputClass('userpassword')}>
                        <img src={password_icon} alt="" />
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('userpassword')}
                        />
                    </div>
                    {errors.userpassword && (
                        <div className="feedback">
                            {errors.userpassword.message}
                        </div>
                    )}
                </div>

                <div className="submit-container-div">
                    <button
                        type={action === 'Sign Up' ? 'submit' : 'button'}
                        className={
                            action === 'Sign Up'
                                ? 'btn btn-primary rounded-pill submit '
                                : 'btn btn-secondary rounded-pill '
                        }
                        onClick={() => {
                            if (action !== 'Sign Up') setAction('Sign Up');
                        }}
                    >
                        Sign Up
                    </button>

                    <button
                        type={action === 'Login' ? 'submit' : 'button'}
                        className={
                            action === 'Login'
                                ? 'btn btn-primary rounded-pill submit '
                                : 'btn btn-secondary rounded-pill '
                        }
                        onClick={() => {
                            if (action !== 'Login') setAction('Login');
                        }}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginSignup;
