import React from 'react';
import LibraryList from './libraries';
import Driver from "./driver"
import styled from "styled-components"
import GeneralSettings from './general';

const Col = styled.div`
    display: flex;
    flex-direction: Column;
    gap: 1rem;
    margin: 1rem;
    max-width: 1000px;
`
const Card = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 0 1rem 1rem;
`

const Admin: React.FC = () => {
    return <Col>
        <Card>
            <GeneralSettings />
        </Card>
        <Card>
            <Driver />
        </Card>

        <Card style={{ marginBottom: "2rem" }}>
            <LibraryList />
        </Card>
    </Col >
}

export default Admin