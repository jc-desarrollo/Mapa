import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Mapa } from '../pages/Mapa';



const Router = () => {
   
    return (
        <div>
            <BrowserRouter>
                <Routes>
                        <Route path="/" element={<Mapa />}></Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Router