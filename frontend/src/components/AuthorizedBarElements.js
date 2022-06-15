import React from "react"
import * as BiIcons from "react-icons/bi"
import * as FiIcons from "react-icons/fi"

export const AuthorizedBarElements = [
    {
        title: "Strona domowa",
        path: "/",
        icon: <BiIcons.BiHome />,
        cName: "nav-text",
    },
    {
        title: "Multiplayer",
        path: "/speedTypingTestMultiplayer",
        icon: <FiIcons.FiUsers />,
        cName: "nav-text",
    },
    {
        title: "Singleplayer",
        path: "/speedTypingTest",
        icon: <FiIcons.FiUser />,
        cName: "nav-text",
    },
    {
        title: "Settings",
        path: "/settings",
        icon: <FiIcons.FiSettings />,
        cName: "nav-text",
    },
    {
        title: "Wyloguj",
        path: "/logout",
        icon: <FiIcons.FiLogOut />,
        cName: "nav-text",
    },
]
