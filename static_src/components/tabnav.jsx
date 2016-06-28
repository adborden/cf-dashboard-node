
import React from 'react';

import classNames from 'classnames';
import navStyles from 'cloudgov-style/css/components/nav.css';
import createStyler from '../util/create_styler';


export default class Tabnav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { current: this.props.initialItem };
    this.styler = createStyler(navStyles);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({current: nextProps.initialItem});
  }

  render() {
    var defaultClasses = [this.styler('nav'), this.styler('nav-tabs'), this.styler('nav-justified')];
    var classes = classNames(defaultClasses, this.props.classes);

    return (
    <ul className={ classes } role="tablist">
      { this.props.items.map((item, i) => {
        if (item.name === this.state.current) {
          let newProps = Object.assign({}, item.element.props, {
            selected: true});
          const nav = React.cloneElement(item.element, newProps);
          return <li role="presentation"
              className={ this.styler('active') } key={ i }>{ nav }</li>;
        } else {
          return <li role="presentation" key={ i }>{ item.element }</li>;
        }
      })}
    </ul>
    );
  }
};

Tabnav.propTypes = {
  initialItem: React.PropTypes.string.isRequired,
  items: React.PropTypes.any,
  classes: React.PropTypes.array
};
