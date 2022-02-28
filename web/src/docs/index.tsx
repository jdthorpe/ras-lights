import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { FourOhFour, Loading } from "../App"
import { Routes, Route, Link, useParams } from "react-router-dom";
import { Nav } from "./nav"

// markdown:
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import sh from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
// import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atomOneDark';



import style from "./markdown-style.module.css"
import rehypeRaw from 'rehype-raw'
import Markdown from "react-markdown"

// fixed pages
import Configuration from "./md/configuration.md"
import ConnectingToYourPi from "./md/connecting-to-your-pi.md"
import Editor from "./md/editor.md"
import GettingStarted from "./md/getting-started.md"
import HardwareSetup from "./md/hardware-setup.md"
import Index from "./md/index.md"
import UserLibraryOverview from "./md/user-library-overview.md"
import UserLibrarySetup from "./md/user-library-setup.md"
import UserLibraryWorkflow from "./md/user-library-workflow.md"
import TipsAndTricks from "./md/tips-and-tricks.md"
import UsingThis from "./md/using-this.md"
import Timers from "./md/timers.md"

SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('bash', sh);

const Body = styled.div`
    padding: 10px;
    height: calc(100vh - 60px);
    width: 100%;
    overflow-y: scroll;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const pageMap: { [x: string]: string } = {
    "configuration": Configuration,
    "connecting-to-your-pi": ConnectingToYourPi,
    "editor": Editor,
    "getting-started": GettingStarted,
    "hardware-setup": HardwareSetup,
    "index": Index,
    "user-library-overview": UserLibraryOverview,
    "user-library-setup": UserLibrarySetup,
    "user-library-workflow": UserLibraryWorkflow,
    "tips-and-tricks": TipsAndTricks,
    "using-this": UsingThis,
    "timers": Timers,
}


const MD: React.FC<{ url: string }> = ({ url }) => {

    const [contents, set_contents] = useState<string>()
    useEffect(() => {
        (async () => {
            const res = await fetch(url)
            set_contents(await res.text())
        })()
    }, [url])

    if (typeof contents === "undefined")
        return <Loading />

    return <div style={{ marginLeft: 15, maxWidth: 800 }}>
        <Markdown
            rehypePlugins={[rehypeRaw]}
            children={contents}
            className={style.markdown}
            components={{
                a(props) {
                    return (
                        props.href!.match(/^(https?:)?\/\//)
                            ? <a href={props.href}>{props.children}</a>
                            : <Link to={props.href!}>{props.children}</Link>
                    );
                },
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={atomOneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    </div >
}

const _Page: React.FC<{ page?: string }> = ({ page }) => {
    const content = page && pageMap[page]
    // return <div>hi world, i'm a document page: {page}</div>
    if (typeof content === "undefined")
        return <FourOhFour />
    return <MD url={content} />
}

const Page: React.FC = () => {
    const { page } = useParams();
    // eslint-disable-next-line react/jsx-pascal-case
    return <_Page page={page} />
}

export const Docs: React.FC = () => {


    return (
        < Row>
            <div>
                <Nav />
            </div>
            <Body>
                <Routes>
                    <Route path="/:page" element={<Page />} />
                    <Route path="/" element={
                        // eslint-disable-next-line react/jsx-pascal-case 
                        <_Page page="index" />} />
                    <Route path="*" element={<FourOhFour />} />
                </Routes>
            </Body>
        </Row>)
}

export default Docs;