import React from "react"
import classes from "./Toolbar.module.css"
import Logo from "../../../Components/Logo/Logo"
import NavigationItems from "../NavigationItems/NavigationItems"

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <div>Menu</div>
        <Logo />
        <NavigationItems/>
    </header>
)

export default toolbar