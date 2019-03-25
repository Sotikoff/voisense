import * as React from "react";
import { PropTypes } from "prop-types";
import { Mic } from "../Mic";
import "./index.scss";

export class Input extends React.Component {
  apiUrl = "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize";

  state = {
    containerFocusClass: "",
    isRecording: false
  };

  inputRef = React.createRef();

  constraints = {
    audio: true
  };

  componentDidMount() {
    this.inputRef.current.onfocus = () => {
      this.setState({ containerFocusClass: "container-focus" });
    };
    this.inputRef.current.onblur = () => {
      this.setState({ containerFocusClass: "" });
    };
  }

  // sendPostSpeechRecognition = stream => {
  //   const queryParams = {
  //     lang: "ru-RU",
  //     profanityFilter: true,
  //     format: "oggopus"
  //   };

  //   const queryString = new URLSearchParams();
  //   for (let key in queryParams) {
  //     queryString.set(key, queryParams[key]);
  //   }

  //   return fetch(`${this.apiUrl}/?${queryString.toString()}`, {
  //     method: "POST",
  //     body: stream
  //   });
  // };

  // getSpeechRecognition = async () => {
  //   console.log("getSpeechRecognition enabled");
  //   let stream;
  //   try {
  //     console.log("Requested stream");
  //     stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     console.log("Got stream");
  //   } catch (e) {
  //     return;
  //   }
  //   const chunks = [];
  //   const recorder = new MediaRecorder(stream);
  //   recorder.ondatavalidate = async e => {
  //     chunks.push(e.data);
  //     if (recorder.state === "inactive") {
  //       const blob = new Blob(chunks, { type: "audio/oggopus" });
  //       // const result = await this.sendPostSpeechRecognition(blob);
  //       console.log("inactive");
  //       console.log(blob);
  //       // this.inputRef.current.value = result;
  //     }
  //   };
  //   recorder.start();
  //   console.log("Recorder started");
  //   setTimeout(() => {
  //     recorder.stop();
  //     console.log("Recorder stopped");
  //   }, 5000);
  // };

  processVoiceSearchByWebkit = () => {
    this.setState({ isRecording: true });
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.recognitionLang = "ru-RU";
    recognition.start();
    recognition.onresult = e => {
      this.inputRef.current.value = e.results[0][0].transcript;
      recognition.stop();
      this.setState({ isRecording: false });
    };
  };

  initEndSpeechTimer = (voiceRecorder, time, commonTimer = undefined) => {
    return setTimeout(() => {
      voiceRecorder.stream.getTracks()[0].stop();
      voiceRecorder.stop();
      this.setState({ isRecording: false });
      if (commonTimer) {
        clearTimeout(commonTimer);
      }
      console.log("Speech is cancelled");
    }, time);
  };

  processVoiceSearchByYandexSpeechKit = () => {
    //  Получить доступ к микрофону
    navigator.mediaDevices.getUserMedia({ audio: true }).then(mediaStream => {
      this.setState({ isRecording: true });
      const voiceRecorder = new MediaRecorder(mediaStream);

      const commonTimer = this.initEndSpeechTimer(voiceRecorder, 10000);
      console.log("Init end speech timer");
      let endSpeechTimer = this.initEndSpeechTimer(
        voiceRecorder,
        3000,
        commonTimer
      );
      const chunks = [];

      voiceRecorder.ondataavailable = e => {
        chunks.push(e.data);
        clearTimeout(endSpeechTimer);
        endSpeechTimer = this.initEndSpeechTimer(
          voiceRecorder,
          3000,
          commonTimer
        );
        if (voiceRecorder.state === "inactive") {
          const blob = new Blob(chunks, { type: "audio/webm" });
          console.log(blob);
        }
      };

      voiceRecorder.start();
    });
    //  Начать запись
    //  Закончить запись
    //  Сформировать аудиофайл
    //  Отправить запрос в YandexSpeechKit
    //  Дождаться ответа
    //  Заполнить контрол тем, что пришло от сервиса
    console.log("Exec by yandex");
  };

  getSpeechRecognition = () => {
    if (window.webkitSpeechRecognition) {
      this.processVoiceSearchByWebkit();
      return;
    } else if (window.MediaRecorder && navigator.mediaDevices.getUserMedia) {
      this.processVoiceSearchByYandexSpeechKit();
      return;
    } else {
      console.log(window.navigator.getUserMedia);
      throw new Error("Voice search is unavailable");
    }
  };

  handleClick = () => {
    this.getSpeechRecognition();
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
        {voiceSearch && (
          <Mic
            startVoiceRec={this.handleClick}
            isEnabled={this.state.isRecording}
          />
        )}
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
