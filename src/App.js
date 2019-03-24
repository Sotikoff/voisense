import React, { Component } from "react";
import "./App.css";
import { Input } from "./components/Input";
import { Mic } from "./components/Mic";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Input placeholder="Нажмите здесь, чтобы вводить" voiceSearch />
      </div>
    );
  }
}

export default App;
