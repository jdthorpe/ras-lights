import React from "react"
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { BrowserRouter, useLocation } from "react-router-dom"
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Nav } from "./header"
import { Main } from "./main"

// gotta do it somewhere...
initializeIcons();

class ErrorBoundary extends React.Component<{}, { hasError: boolean, error?: any, message?: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(error: any, info: any) {
    console.log("Catching an error") // this is never logged
    this.setState(state => ({ ...state, error, message: error.message, hasError: true }))
  }

  render() {
    if (this.state.hasError) {
      console.log("error: ", this.state.error)
      return <>
        <div>Sorry, an error occurred</div>
        <div>{this.state.message}</div>
        <div>{JSON.stringify(this.state.error, null, 2)}</div>
      </>
    }

    return this.props.children
  }
}

export const Loading: React.FC = () => {
  return (<div style={{ marginTop: "2rem" }}>
    <Spinner label="I am totally loading..." size={SpinnerSize.large} />
  </div>)
}

export const FourOhFour: React.FC = () => {
  const location = useLocation()
  return <div>
    <p><strong>404</strong> Nothing to see here</p>
    <pre><code>{JSON.stringify(location, null, 2)}</code></pre>
  </div>
}


function App() {
  // bootstrap the router
  return <ErrorBoundary >
    <BrowserRouter>
      <Nav />
      <Main />
    </BrowserRouter>
  </ErrorBoundary >
}


export default App;
