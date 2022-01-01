import React from "react"
import { Pivot, PivotItem } from '@fluentui/react';
import Manual from "./manual"
import Modes from "./modes"
import Editor from "./editor/editor"
import Schedule from "./schedule/schedule";
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();

function App() {

  return (
    <Pivot>
      <PivotItem headerText="Manual">
        <Manual />
      </PivotItem>
      <PivotItem headerText="Modes">
        <Modes />
      </PivotItem>
      <PivotItem headerText="Schedule">
        <Schedule />
      </PivotItem>
      <PivotItem headerText="Editor">
        <Editor />
      </PivotItem>
    </Pivot>
  );
}

export default App;
