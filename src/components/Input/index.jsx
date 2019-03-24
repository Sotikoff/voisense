import * as React from "react";
import { PropTypes } from "prop-types";
import { Mic } from "../Mic";
import "./index.scss";

export class Input extends React.Component {
  state = {
    containerFocusClass: ""
  };

  inputRef = React.createRef();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.inputRef.current.onfocus = () => {
      this.setState({ containerFocusClass: "container-focus" });
    };

    this.inputRef.current.onblur = () => {
      this.setState({ containerFocusClass: "" });
    };
  }

  getSpeechRecognition = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.recognitionLang = "ru-RU";
    recognition.start();
    recognition.onresult = e => {
      this.inputRef.current.value = e.results[0][0].transcript;
      recognition.stop();
    };
  };

  render() {
    const { placeholder, voiceSearch } = this.props;
    const containerClasses = `input-container ${
      this.state.containerFocusClass
    }`;
    return (
      <div className={containerClasses}>
        <input
          ref={this.inputRef}
          className="input"
          type="text"
          placeholder={placeholder}
        />
        {voiceSearch && <Mic startVoiceRec={this.getSpeechRecognition} />}
        <i className="material-icons search">search</i>
      </div>
    );
  }
}

Input.propTypes = {
  voiceSearch: PropTypes.bool,
  placeholder: PropTypes.string
};

Input.defaultProps = {
  voiceSearch: false
};
