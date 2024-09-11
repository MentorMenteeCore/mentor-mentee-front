import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        "email": "cbnucbnu22@example.com",
        "userName" : "안녕하세요",
        "nickname":"bs2",
        "password":"password1234567",
        "role":"ROLE_MENTOR",
        "userId" : 4,
        "yearInUni" : 2
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://15.165.151.12/api/user/sign-up", formData);
            console.log("회원가입 성공:", response.data);
        } catch (error) {
            console.error("회원가입 실패:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleChange} placeholder="이메일" required />
            <input type="text" name="userName" onChange={handleChange} placeholder="사용자 이름" required />
            <input type="text" name="nickname" onChange={handleChange} placeholder="닉네임" required />
            <input type="password" name="password" onChange={handleChange} placeholder="비밀번호" required />
            <button type="submit">회원가입</button>
        </form>
    );
};

export default SignUp;
