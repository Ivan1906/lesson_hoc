import React, {Component} from 'react';

const API = 'https://jsonplaceholder.typicode.com/';

const fetchData = (entity, params) => fetch(API + entity + params).then(response => response.json());

const withFetch = (entity, params = '') => BaseComponent => {
  class WithFetch extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        isLoader: true
      };
    };

    componentDidMount() {
      fetchData(entity, params).then(data => this.setState({data, isLoader: false}));
    };

    render() {
      const {data, isLoader} = this.state;
      return isLoader
        ? (
          <div className="center">
            <h1>Loader ...</h1>
          </div>
        )
        : (<BaseComponent {...this.props} data={data}/>);
    }
  };

  return WithFetch;
};

export default withFetch;