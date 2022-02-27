import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

const IconBox = styled.div`
    width: 2rem;
    height: 2rem;
    font-size: 1.2rem;
    border-radius: 2px;
    background: grey;
    padding-top: 0.4rem;
    box-sizing: border-box;
`

interface props {
    icon: IconDefinition;
    title?: string;
    onClick?: () => void;
    buttonStyle?: any;
    style?: any;
    iconStyle?: any;
}

export const IconButton: React.FC<props> = ({
    icon, title, onClick, style, buttonStyle, iconStyle
}) => (
    <IconBox
        onClick={onClick}
        style={{ ...style, ...buttonStyle }} >
        <FontAwesomeIcon
            title={title}
            style={{
                margin: "auto",
                display: "block",
                ...style,
                ...iconStyle
            }}
            icon={icon} />
    </IconBox>
)