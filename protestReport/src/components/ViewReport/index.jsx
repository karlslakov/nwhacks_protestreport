import React, { Component } from "react";
import classnames from "classnames";
import WarningMessage from "../WarningMessage";
import styles from "./viewreport.module.css";
import CONSTANTS from "../../constants";
import Plot from 'react-plotly.js';

export default class Grid extends Component {
  constructor(props)
  {
      super(props)
      this.state = {
        tweets: {},
        sentimentByDate: {},
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
      .then(result => {
          this.setState({
            tweets: result,
            sentimentByDate: this.averageSentimentByDate(result),
            responseReceived: true });
        })
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

  averageSentimentByDate = (tweets) => {
    var sentimentByDate = {};
    for (var radiusGroup in tweets){
      sentimentByDate[radiusGroup] = {};
      tweets[radiusGroup].forEach((t) => {
        var dateObj = new Date(Date.parse(t["date"]));
        var dateKey = dateObj.getFullYear() * 10000 + dateObj.getMonth() * 100 + dateObj.getDate();
        if (! (dateKey in sentimentByDate[radiusGroup])) {
          sentimentByDate[radiusGroup][dateKey] = {};
          sentimentByDate[radiusGroup][dateKey]["score"] = 0;
          sentimentByDate[radiusGroup][dateKey]["count"] = 0;
        } 
        sentimentByDate[radiusGroup][dateKey]["score"] += t["sentiment_info"]["compound"];
        sentimentByDate[radiusGroup][dateKey]["count"] += 1;
      });
      for (var dateKey in sentimentByDate[radiusGroup]) {
        sentimentByDate[radiusGroup][dateKey]["score"] /= sentimentByDate[radiusGroup][dateKey]["count"];
      }
    }
    return sentimentByDate;
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
        {Object.keys(this.state.sentimentByDate).map((radiusGroup) => (
           <Plot
           data={[
             {
               x: Object.keys(this.state.sentimentByDate[radiusGroup]).map((dateGroup, ind) => ind),
               y: Object.keys(this.state.sentimentByDate[radiusGroup]).map((dateGroup) => this.state.sentimentByDate[radiusGroup][dateGroup]["score"]),
               type: 'bar',
               // mode: 'lines+markers',
               // marker: {color: 'red'},
             }
           ]}
           layout={ {width: 620, height: 440, title: radiusGroup + "km"} }
           />
        ))}
       <p>
         this.state.tweets.radglobal.reduce((soFar, t) => soFar + t.text);
       </p>
        <WarningMessage
          open={this.state.warningMessageOpen}
          text={this.state.warningMessageText}
          onWarningClose={this.handleWarningClose}
        />
      </main>
    );
  }
}
