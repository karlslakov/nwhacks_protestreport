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
        this.setState({ tweets: result, responseReceived: true });
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

  averageSentimentByDate = () => {
    var sentimentByDate = {};
    for (var radiusGroup in this.state.tweets){
      sentimentByDate[radiusGroup] = {};
      this.state.tweets.radiusGroup.foreach((t) => {
        var dateObj = Date.parseDate(t.date);
        var dateKey = dateObj.getYear() * 10000 + dateObj.getMonth() * 100 + dateObj.getDate();
        if (! (dateKey in sentimentByDate[radiusGroup])) {
          sentimentByDate[radiusGroup][dateKey] = {};
          sentimentByDate[radiusGroup][dateKey]["score"] = 0;
          sentimentByDate[radiusGroup][dateKey]["count"] = 0;
        } 
        sentimentByDate[radiusGroup][dateKey]["score"] += t.sentiment_info.compound;
        sentimentByDate[radiusGroup][dateKey]["count"] += 1;
      })
      sentimentByDate[radiusGroup].foreach((dateKey)=> {
        sentimentByDate[radiusGroup][dateKey]["score"] /= sentimentByDate[radiusGroup][dateKey]["count"];
      })
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
        <Plot
        data={[
          {
            x: ,
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: ''} }
        />
        <WarningMessage
          open={this.state.warningMessageOpen}
          text={this.state.warningMessageText}
          onWarningClose={this.handleWarningClose}
        />
      </main>
    );
  }
}
