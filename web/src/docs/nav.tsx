import React from 'react';
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

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

const Sidebar = styled.div`
    background-color: #353634;
    color: #e6e6eb;
    padding-left: .8rem;
    padding-top: .8rem;
    height: 100%;
    width: 240px;
    & a: {
        color: inherit;
        text-decoration: none;
        outline: none;
    }
`

const NavList = styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
    text-decoration: none;
    & link {
        text-decoration: none;
    }
    & a {
        text-decoration: none;
    }
`

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

export const Nav: React.FC = (props) => {

    return (
        <Sidebar>
            <NavList >
                {nav_items.map((item, i) => (<NavListItem key={i} {...item} />))}
            </NavList>
        </Sidebar>
    );
}
