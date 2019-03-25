import * as React from "react";
import PropTypes from "prop-types";
import "./index.css";

export const Mic = props => {
  const micStyles = `material-icons mic ${
    props.isEnabled ? "mic-enabled" : ""
  }`;
  console.log(micStyles);
  return (
    <i className={micStyles} onClick={props.startVoiceRec}>
      mic
    </i>
  );
};

Mic.propTypes = {
  startVoiceRec: PropTypes.func,
  isEnabled: PropTypes.bool
};

Mic.defaultProps = {
  startVoiceRec: () => {},
  isEnabled: false
};
