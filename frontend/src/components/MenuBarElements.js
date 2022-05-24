import React from "react"
import * as BiIcons from "react-icons/bi"
import * as FiIcons from "react-icons/fi"

export const ManuBarElements = [
    {
        title: "Strona domowa",
        path: "/",
        icon: <BiIcons.BiHome />,
        cName: "nav-text",
    },
    {
        title: "Zaloguj",
        path: "/login",
        icon: <FiIcons.FiLogIn />,
        cName: "nav-text",
    },
    {
        title: "Zarejestruj",
        path: "/register",
        icon: <BiIcons.BiLogIn />,
        cName: "nav-text",
    },
]
