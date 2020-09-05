import React, { Component } from 'react';
import '../css/App.css';
import AddAppointments from "./AddAppointments";
import ListAppointments from "./ListAppointments";
import SearchAppointments from "./SearchAppointments";
import { result } from 'lodash';

class App extends Component {
    constructor(){
        super();
        this.state = {
            myAppoinments : []
        };
    }
    componentDidMount(){
        fetch('./data.json')
        .then(response => response.json())
        .then(result => {
            const apts = result.map(item => {
                return item;
            })
            this.setState( {
             myAppoinments : apts
            })
        });
    }
    render(){    
        return (
        <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments/>
                <SearchAppointments/>
                <ListAppointments appointmentsList = {this.state.myAppoinments}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
    }
}

export default App;