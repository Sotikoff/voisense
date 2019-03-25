import React, { Component } from "react";
import "./App.css";
import { Input } from "./components/Input";

class App extends Component {
  checkVoiceSearchAvailable = () => {
    if (!window.webkitSpeechRecognition && !window.MediaRecorder) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const isVoiceSearchAvailable = this.checkVoiceSearchAvailable();
    return (
      <div className="App">
        <Input
          placeholder="Нажмите здесь, чтобы вводить"
          voiceSearch={isVoiceSearchAvailable}
        />
      </div>
    );
  }
}

export default App;
