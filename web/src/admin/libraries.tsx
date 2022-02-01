import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
// import { Toggle } from '@fluentui/react/lib/Toggle';
import { user_library_data } from 'shared/types/admin';
import * as API from "./lib-api"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useBoolean } from '@fluentui/react-hooks';

const dialogStyles = { main: { maxWidth: 450 } };

const Row = styled.div`
    display: flex;
    flex-directio: row;
    gap: 1rem;
    align-items: flex-end;
`

const Table = styled.table`
    border-collapse: collapse;
    tr:nth-child(even) {background: #DDD};
    tr:nth-child(odd) {background: #FFF};
`
const Th = styled.th`
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
`
const Td = styled.td`
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
`

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Are you sure?',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure you want to delete this library?',
}

const LibraryList: React.FC = ({ }) => {


    const [libraries, set_libraries] = useState<user_library_data[]>()


    const fetchLibraries = async () => {
        const libs = await API.fetch_libraries()
        set_libraries(libs.sort((a, b) => (a.name < b.name) ? -1 : 1))
    }

    useEffect(() => {
        if (typeof libraries === "undefined")
            fetchLibraries()
    }, [])

    if (typeof libraries === "undefined")
        return (<div><Spinner label="Loading Libraries..." size={SpinnerSize.large} /></div>)

    return (
        <div>
            <h2>Library Folders</h2>
            <Table>
                <colgroup>
                    <col style={{ minWidth: "6rem" }} />
                    <col style={{ minWidth: "20rem" }} />
                    <col style={{ width: "3rem" }} />
                </colgroup>
                <thead>
                    <tr>
                        <Th>Name</Th>
                        <Th>Path</Th>
                        <Th></Th>
                    </tr>
                </thead>
                <tbody>
                    {libraries.map((lib, i) => <LibRow lib={lib} key={i} rowkey={i} update={fetchLibraries} />)}
                    <AddLibrary update={fetchLibraries} />
                </tbody>
            </Table>
        </div>
    )
}

const REQUIRED = "Required field"
const AddLibrary: React.FC<{ update: { (): void } }> = ({ update }) => {

    const [active, set_active] = useState(true)
    const [name, set_name] = useState<string>()
    const [name_error, set_name_error] = useState<string>()
    const [path, set_path] = useState<string>()
    const [path_error, set_path_error] = useState<string>()

    const [saveError, set_save_error] = useState<string>()


    const onPathChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        set_path(newValue)
        set_active(true)
        if (path_error === REQUIRED && newValue && newValue.length)
            set_path_error(undefined)
    }, [set_path])

    const onNameChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        set_name(newValue)
        set_active(true)
        if (name_error === REQUIRED && newValue && newValue.length)
            set_name_error(undefined)

    }, [set_path])

    const onAddLibrary = useCallback(async () => {
        if (!active) { return }
        if (!path) {
            set_path_error(REQUIRED)
        }
        if (!name) {
            set_name_error(REQUIRED)
        }
        if (!path || !name) {
            return
        }

        set_active(false)

        try {
            await API.save_library({
                type: "LIBRARY",
                name,
                path,
            })
            set_save_error(undefined)
        } catch (error) {
            set_save_error(((error as any).message || "Something went wrong"))
        }
        update()
    }, [name, path, active, set_active])

    return (
        <>
            <tr >
                <Td><TextField
                    onChange={onNameChange}
                    errorMessage={name_error}
                /></Td>
                <Td><TextField
                    onChange={onPathChange}
                    errorMessage={path_error}
                /></Td>
                <Td>
                    <FontAwesomeIcon
                        style={{ margin: "0 7px", color: (active ? "black" : "grey") }}
                        icon={faPlus}
                        title="Add"
                        onClick={onAddLibrary}
                    />
                </Td>
            </tr>
            {saveError && <p style={{ color: "red" }}>Somethig went wrong while saving: {saveError}</p>}

        </>

    )
}

const LibRow: React.FC<{ lib: user_library_data, rowkey: number, update: { (): void } }> = ({ lib, rowkey, update }) => {

    const [active, set_active] = useState(true)

    // are you sure dialog
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

    useEffect(() => {
        return () => set_active(true)
    }, [set_active, lib])

    const onDelete = useCallback(async () => {
        if (!active)
            return
        set_active(false)
        await API.delete_library(lib.name)
        update()
    }, [lib, active])


    return (
        <tr key={rowkey}>
            <Td>{lib.name}</Td>
            <Td>{lib.path}</Td>
            <Td>
                <FontAwesomeIcon
                    style={{ margin: "0 7px", color: (active ? "black" : "grey") }}
                    icon={faTrashAlt}
                    title="Delete"
                    onClick={toggleHideDialog}
                />
            </Td>
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={dialogContentProps}
                modalProps={{ isBlocking: false, styles: dialogStyles, }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => { toggleHideDialog(); onDelete() }} text="Delete" />
                    <DefaultButton onClick={toggleHideDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        </tr>

    )
}


export default LibraryList


