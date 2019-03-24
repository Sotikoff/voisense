import * as React from "react";
import PropTypes from "prop-types";
import "./index.css";

export const Mic = props => {
  return (
    <i className="material-icons mic" onClick={props.startVoiceRec}>
      mic
    </i>
  );
};

Mic.propTypes = {
  startVoiceRec: PropTypes.func
};

Mic.defaultProps = {
  startVoiceRec: () => {}
};
