import React, { Component } from "react";
import WarningMessage from "../WarningMessage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import CONSTANTS from "../../constants";

import {
  withRouter
} from 'react-router-dom'


class DescriptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject_keywords: "",
      date: new Date(),
      warningMessageOpen: false,
      warningMessageText: ""
    }

    this.formSubmitted = false;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleDateChange = newdate => {
    this.setState({
      date: newdate
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push({ pathname: "/viewreport", state: { keywords:this.state.subject_keywords, date:this.state.date}})
  }

  handleWarningClose = () => {
    this.setState({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  

  render() {
    return (
      <div>
          <div>
            <h3>Protest Description</h3>
          </div>
          <form onSubmit={this.handleSubmit}>
              <p>Protest Subject Keywords : </p>
                <input
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.subject_keywords}
                  name="subject_keywords"
                  className="form-control"
                  placeholder="Protest Subject Keywords"
                  aria-label="Protest Subject Keywords"
                />
                <p>Protest Date : </p>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                />
            <br />  
            <button type="submit" className="btn btn-primary ml-2">
              Submit
            </button>
          </form>
          <WarningMessage
            open={this.state.warningMessageOpen}
            text={this.state.warningMessageText}
            onWarningClose={this.handleWarningClose}
          />
      </div>
    );
  }
}

export default withRouter(DescriptionForm)