/**
 * Created by antonorlov on 17/02/2017.
 */
import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        // And listen to any changes to get the two-way binding
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // Will fire once, after markup has been injected
    }

    componentWillUnmount() {
        // Will fire once before markup has been removed
    }

    onChange(state) {
        // We are listening to the store here and apply changes to this.state accordingly
        this.setState(state);
    }

    render() {
        return (
            <div className="home d-flex justify-content-center flex-column">
                <h1>Hello!</h1>
            </div>
        );
    }
}

export default Home;