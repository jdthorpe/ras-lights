import * as React from 'react';
import { Nav, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav'; // INavLink, 


const navStyles: Partial<INavStyles> = {
    root: {
        backgroundColor: "#eeeeee",
        width: 208,
        height: "calc(100vh - 60px)",
        boxSizing: 'border-box',
        border: '1px solid #eee',
        overflowY: 'auto',
    },
};

const navLinkGroups: INavLinkGroup[] = [
    {
        links: [
            { name: "Home", url: "/docs/index" },
            {
                name: "getting-started", url: "/docs/getting-started", links: [
                    { name: "Connecting to your pi", url: "/docs/connecting-to-your-pi" },
                    { name: "hardware-setup", url: "/docs/hardware-setup" },
                    { name: "Configuration", url: "/docs/configuration" },
                ]
            },
            { name: "Using the Editor", url: "/docs/editor" },
            {
                name: "User Libraries", url: "/docs/user-library-overview", links: [
                    { name: "Initial Setup", url: "/docs/user-library-setup" },
                    { name: "Workflow", url: "/docs/user-library-workflow" },
                ]
            },
        ],
    },
];

export const DocsNav: React.FunctionComponent = () => {
    return (
        <Nav
            // onLinkClick={_onLinkClick}
            // selectedKey="key3"
            // ariaLabel="Nav basic example"
            styles={navStyles}
            groups={navLinkGroups}
        />
    );
};

// function _onLinkClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
//     if (item && item.name === 'News') {
//         alert('News link clicked');
//     }
// }
