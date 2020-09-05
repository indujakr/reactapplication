import React, { Component } from 'react';
import '../css/App.css';
import AddAppointments from "./AddAppointments";
import ListAppointments from "./ListAppointments";
import SearchAppointments from "./SearchAppointments";
import { without, findIndex } from 'lodash';

class App extends Component {
    constructor(){
        super();
        this.state = {
            myAppoinments : [],
            formDisplay : false,
            orderBy : 'petName',
            orderAs : 'asc',
            searchKey : '',
            lastIndexId : 1
        };
        this.addNewAppoinment = this.addNewAppoinment.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.updateContent =this.updateContent.bind(this);
    }
    addNewAppoinment(apt){
        const appoinmentList = this.state.myAppoinments;
        apt.aptId = this.state.lastIndexId;
        appoinmentList.unshift(apt);
        this.setState({
          lastIndexId : this.state.lastIndexId +1
        });
    }
    deleteAppointment(apt){
        let updatedApts = this.state.myAppoinments;
        updatedApts = without(updatedApts,apt);
        this.setState({
            myAppoinments : updatedApts
        })
        
    }
    toggleForm(){
      this.setState({
        formDisplay : !this.state.formDisplay
      })
    }
    changeOrder(orderBy,orderAs){
      this.setState({
        orderBy : orderBy,
        orderAs : orderAs
      });
    }
    searchValue(value){
      this.setState({
        searchKey : value
      });
    }
    updateContent(name,value,id){
      let newAppoinmentList = this.state.myAppoinments;
      let requiredId = findIndex(this.state.myAppoinments,{
         aptId : id
      });
      newAppoinmentList [requiredId][name] = value;
      this.setState({
        myAppoinments : newAppoinmentList
      });
    }
    componentDidMount(){
        fetch('./data.json')
        .then(response => response.json())
        .then(result => {
            const apts = result.map(item => {
                item.aptId = this.state.lastIndexId;
                this.setState({
                    lastIndexId : this.state.lastIndexId+1
                });
                return item;
            })
            this.setState( {
             myAppoinments : apts
            })
        });
    }
    render(){   
      let sortedAppointments = this.state.myAppoinments;
      let order;
      if(this.state.orderAs === 'asc'){
        order = 1;
      } else{
        order = -1;
      }
      sortedAppointments = sortedAppointments.sort((a,b) => {
        if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase() ){
          return -1 * order;
        }else{
          return 1 * order;
        }
      })
      .filter(item => {
        return (
          item['petName'].toLowerCase()
          .includes(this.state.searchKey.toLowerCase()) ||
          item['ownerName'].toLowerCase()
          .includes(this.state.searchKey.toLowerCase()) ||
          item['aptNotes'].toLowerCase()
          .includes(this.state.searchKey.toLowerCase())
        );
      });
        return (
        <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                 formDisplay = {this.state.formDisplay} 
                 toggleForm = {this.toggleForm}
                 addNewAppoinment = {this.addNewAppoinment}/>
                <SearchAppointments 
                 orderAs={this.state.orderAs}
                 orderBy = {this.state.orderBy}
                 changeOrder = {this.changeOrder}
                 searchValue = {this.searchValue}/>
                <ListAppointments 
                 appointmentsList = {sortedAppointments}
                 deleteAppointment =  {this.deleteAppointment}
                 updateContent = {this.updateContent}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
    }
}

export default App;