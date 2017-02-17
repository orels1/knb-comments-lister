/**
 * Created by antonorlov on 17/02/2017.
 */
import React from 'react';
import Navbar from './Navbar';
class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Navbar router={this.props.router} />
                <div className="container main">
                    <div className="contents">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;