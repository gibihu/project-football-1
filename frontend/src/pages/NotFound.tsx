// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404</h1>
            <p>Oops! หน้าเว็บนี้ไม่มีอยู่ 😅</p>
            <Link to="/">กลับไปหน้าแรก</Link>
        </div>
    );
};

export default NotFound;
