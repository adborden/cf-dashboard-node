
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const DISPLAY_TYPES = [
  'inline',
  'global'
];

const propTypes = {
  error: React.PropTypes.object,
  displayType: React.PropTypes.oneOf(DISPLAY_TYPES)
};

const defaultProps = {
  error: null,
  displayType: 'inline'
};

export default class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
  }

  get errorMessage() {
    const err = this.props.error;
    return err && err.message || err.description;
  }

  get hasErrorMessage() {
    const message = this.errorMessage;
    return message && message.length;
  }

  get statusCode() {
    return this.props.error && this.props.error.status_code || 500;
  }

  get shortDefaultMessage() {
    return (
      <span>The system returned an error ("status { this.statusCode }"). If
      you didn't expect this, <a href="https://cloud.gov/docs/help/">contact support</a>.
      You can also try again.
      </span>
    );
  }

  get knownMessage() {
    return (<span>The system returned an error, { this.errorMessage }. Please
      try again.</span>);
  }

  render() {
    const typeClass = `error-${this.props.displayType}`;
    let content = <span>{ this.shortDefaultMessage }</span>;

    if (this.hasErrorMessage) {
      content = <span>{ this.knownMessage }</span>;
    }

    return (
    <div className={ this.styler('error_message', typeClass) }>
      { content }
    </div>
    );
  }
}

ErrorMessage.propTypes = propTypes;
ErrorMessage.defaultProps = defaultProps;
