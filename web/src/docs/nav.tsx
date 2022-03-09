import React, { useState } from 'react';
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from "react-device-detect"
import "./nav.scss"

interface NavItem {
    name: string;
    path: string;
    level: number;
}

const nav_items: NavItem[] = [
    { name: "Home", path: "index", level: 1 },
    { name: "Getting Started", path: "getting-started", level: 1 },
    { name: "Connecting to your Pi", path: "connecting-to-your-pi", level: 2 },
    { name: "Hardware Setup", path: "hardware-setup", level: 2 },
    { name: "Configuration", path: "configuration", level: 2 },
    { name: "Using the Editor", path: "editor", level: 1 },
    { name: "User Libraries", path: "user-library-overview", level: 1 },
    { name: "Initial Setup", path: "user-library-setup", level: 2 },
    { name: "Workflow", path: "user-library-workflow", level: 2 },
    { name: "Tips And Tricks", path: "tips-and-tricks", level: 1 },
    { name: "Getter Functions", path: "getter-functions", level: 2 },
    { name: 'Storing State with "this"', path: "using-this", level: 2 },
    { name: 'Storing State in Closures', path: "using-closures", level: 2 },
]

const _NavListItem = styled.li<{ level: number }>`
    font-size: ${props => props.level === 1 ? "18" : "16"}px;
    color: #eeeeee;
    padding: 6px 0 6px 16px;
    border-left: 4px solid transparent;
    box-sizing: content-box;
    text-decoration: none;
    &:hover {
        border-left-color:  #aaaaaa;
    };
`


const NavListItem: React.FC<NavItem> = ({ name, path, level }) => {

    const location = useLocation()
    const link = `/docs/${path}`

    return (
        <Link to={link} style={{ textDecoration: "none" }}>
            {
                // eslint-disable-next-line react/jsx-pascal-case 
                <_NavListItem
                    level={level}
                    style={{
                        borderLeftColor: location.pathname === link ? "#eeeeee" : undefined,
                        paddingLeft: `calc( 10px + ${1.2 * (level - 1)}rem)`
                    }}>
                    {name}
                </_NavListItem>
            }
        </Link >
    )
}

export const Nav: React.FC = () => {

    const [hidden, set_hidden] = useState(isMobile)
    return (
        <div className={"side-bar" + (hidden ? " side-bar-hidden" : "")}>
            <div className="side-bar-handle"
                onClick={() => set_hidden(!hidden)}
            >
                <FontAwesomeIcon
                    style={{ margin: "0 7px", color: "#eeeeee" }}
                    icon={faBars}
                    title="Add"
                />
            </div>
            <ul className="nav-list" >
                {nav_items.map((item, i) => (<NavListItem key={i} {...item} />))}
            </ul>
        </div>
    );
}
