import React, { useState } from "react"
import { IconContext } from "react-icons"
import { Link } from "react-router-dom"
import { ManuBarElements } from "./MenuBarElements"
import * as FiIcons from "react-icons/fi"
import { AuthorizedBarElements } from "./AuthorizedBarElements"

export default function AuthorizedBar() {
    const [BarState, setBarState] = useState(false)

    const changeBar = () => {
        setBarState(!BarState)
    }

    return (
        <div className="taskbarWrapper">
            <IconContext.Provider value={{ color: "#15172b", size: "50px" }}>
                <nav className={BarState ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items">
                        {AuthorizedBarElements.map((element, index) => {
                            return (
                                <li key={index} className={element.cName}>
                                    <Link id={index} to={element.path}>
                                        {element.icon}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    )
}
