import React, { Component } from "react";
import classnames from "classnames";
import WarningMessage from "../WarningMessage";
import styles from "./viewreport.module.css";
import CONSTANTS from "../../constants";

export default class Grid extends Component {
  constructor(props)
  {
      super(props)
      this.state = {
        tweets: [],
        responseReceived: false,
        warningMessageOpen: false,
        warningMessageText: ""
      }
  }
  

  centeredHeaderStyle = classnames("text-center", styles.header)

  // Get the text sample data from the back end
  componentDidMount() {
    fetch(CONSTANTS.ENDPOINT.GETREPORT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.props.location.state)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(result => this.setState({ tweets: result.tweets, responseReceived: true }))
      .catch(error =>
        this.setState({
          warningMessageOpen: true,
          warningMessageText: `Failed to recieve twitter sentiment data: ${error}`
        })
      );
  }

  handleWarningClose = () => {
    this.setState({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  render() {
    if (!this.state.responseReceived)
      return (
        <main id="mainContent">
          <div className={this.centeredHeaderStyle}>
            <h1>Loading</h1>
          </div>
        </main>
      );
    return (
      <main id="mainContent">
        <div className={this.centeredHeaderStyle}>
          <h1>Protest Report</h1>
          <p>Here's how your protest went...</p>
        </div>
        <p>{this.state.response}</p> 
        <WarningMessage
          open={this.state.warningMessageOpen}
          text={this.state.warningMessageText}
          onWarningClose={this.handleWarningClose}
        />
      </main>
    );
  }
}
