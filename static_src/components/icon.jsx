
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const ICON_TYPES = [
  'fill',
  'stroke'
];

const STYLE_TYPES = [
  'alt',
  'ok',
  'inactive',
  'error',
  'default'
];

const propTypes = {
  name: React.PropTypes.string.isRequired,
  styleType: React.PropTypes.oneOf(STYLE_TYPES),
  iconType: React.PropTypes.oneOf(ICON_TYPES),
  bordered: React.PropTypes.bool
};

const defaultProps = {
  styleType: 'default',
  iconType: 'stroke',
  bordered: false
};

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
  }

  getImagePath(iconName) {
    const img = require('cloudgov-style/img/cloudgov-sprite.svg');
    const fill = this.props.iconType === 'fill' ? 'fill-' : '';
    return `assets/${img}#i-${fill}${iconName}`;
  }

  render() {
    const mainClass = this.props.iconType === 'fill' ? 'icon-fill' : 'icon';
    const styleClass = `icon-${this.props.styleType}`;
    const borderedClass = (this.props.bordered) &&
      'icon-bordered';
    const iconClasses = this.styler(mainClass, styleClass, borderedClass);

    return (
      <svg className={ iconClasses }>
        <use
          xlinkHref={ this.getImagePath(this.props.name) }>
        </use>
      </svg>
    );
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;
