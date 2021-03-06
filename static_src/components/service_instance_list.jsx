
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import ComplexList from './complex_list.jsx';
import ServiceInstance from './service_instance.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  currentAppGuid: React.PropTypes.string.isRequired,
  serviceInstances: React.PropTypes.array,
  bound: React.PropTypes.bool,
  empty: React.PropTypes.bool,
  titleElement: React.PropTypes.element
};

const defaultProps = {
  serviceInstances: [],
  bound: false,
  empty: false
};

export default class ServiceInstanceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.styler = createStyler(style);
  }

  render() {
    // TODO, when react implements returning unwraped arrays, move ComplexList
    // to container of this.
    let content = <div></div>;

    if (this.props.empty) {
      content = (
        <ComplexList titleElement={ this.props.titleElement }
          emptyMessage={ <h4>No services</h4> }
        />
      );
    } else {
      content = (
        <ComplexList titleElement={ this.props.titleElement }>
          { this.props.serviceInstances.map((serviceInstance) =>
            <ServiceInstance
              key={serviceInstance.guid}
              currentAppGuid={this.props.currentAppGuid}
              serviceInstance={serviceInstance}
              bound={this.props.bound}
            />
         )}
        </ComplexList>
      );
    }

    return content;
  }
}

ServiceInstanceList.propTypes = propTypes;
ServiceInstanceList.defaultProps = defaultProps;
