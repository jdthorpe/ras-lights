import React from "react"
import { Pivot, PivotItem } from '@fluentui/react';
import Manual from "./manual"
import Modes from "./modes"


function App() {

  return (
    <Modes />
    // <Pivot>
    //   <div style={{ margin: "1.5rem" }}>
    //     <PivotItem headerText="Manual">
    //       <Manual />
    //     </PivotItem>
    //     <PivotItem headerText="Modes">
    //       <Modes />
    //     </PivotItem>
    //   </div>
    // </Pivot>
  );
}

export default App;
