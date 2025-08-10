import user from '../module/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class SignController {
    //[POST] Dang ky
    static async register(req, res) {
        try {
            const { name, password } = req.body;

            let existingUser = await user.findOne({ name: name });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: 'Tên người sử dụng đã tồn tại!' });
            }

            // (Tùy chọn) Kiểm tra xem mật khẩu này đã tồn tại cho bất kỳ user nào chưa
            const allUsers = await user.find({});
            for (const u of allUsers) {
                const isSamePassword = await bcrypt.compare(
                    password,
                    u.password,
                );
                if (isSamePassword) {
                    return res
                        .status(400)
                        .json({ message: 'Mật khẩu đã tồn tại!' });
                }
            }

            const newUser = new user({
                name,
                password,
            });

            await newUser.save();

            res.status(201).json({ message: 'Đăng ký thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ!' });
        }
    }

    //[POST] Dang nhap
    static async login(req, res) {
        try {
            const { name, password } = req.body;

            let existingUser = await user.findOne({ name: name });
            if (!existingUser) {
                return res.status(400).json({
                    message: 'Không tồn tại tên người dùng!',
                });
            }

            const isMatch = await existingUser.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Sai mật khẩu!' });
            }

            //trong token da co id nguoi dung
            const token = jwt.sign(
                { userId: existingUser._id },
                process.env.SECRET_KEY,
                {
                    expiresIn: '30m',
                },
            );

            res.status(200).json({ message: 'Đăng nhập thành công!', token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Lỗi máy chủ nội bộ!' });
        }
    }
}
