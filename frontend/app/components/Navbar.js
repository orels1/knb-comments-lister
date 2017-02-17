/**
 * Created by antonorlov on 17/02/2017.
 */
import React from 'react';
import {Link} from 'react-router';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        return (
            <nav className='navbar navbar-toggleable-lg navbar-inverse'>
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa fa-bars" style={{'fontSize': '24px'}}></i>
                </button>
                <div className="navbar-brand mr-auto d-flex align-items-center">
                    <span className="fa-stack">
                        <i className="fa fa-square fa-stack-2x fa-inverse"></i>
                        <i className="fa fa-bolt fa-stack-1x" style={{'color': '#000'}}></i>
                    </span>
                    <span>&nbsp;Comments Lister</span>
                </div>
                <div className='collapse navbar-collapse justify-content-between' id='navbar'>
                </div>
            </nav>
        );
    }
}

export default Navbar;