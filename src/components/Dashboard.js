import React, { Component } from 'react'

import BarWidget from './BarWidget';
import TextWidget from './TextWidget';
import Dropdown from 'react-dropdown';
import { Container, Col, Row } from 'react-bootstrap';
import '../dashboard.css';
import 'react-dropdown/style.css';
import { formatNumber } from 'fusioncharts';
import Doughnut from './Doughnut';
import LineWidget from './LineWidget';
const config = {
    apiKey: 'AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI',
    spreadsheetId: '1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg'
}
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId
    }/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            item: [],
            dropdownOptions: [],
            selectedValue: null,
            organicSource: null,
            directSource: null,
            referralSource: null,
            pageViews: null,
            users: null,
            newUsers: null,
            sourceData:[], 
            userData:[],
            sess_data:[],
            views_data:[],
            user_sess_comp:[],
            bounceRate:null
        }
    }
    getData = (args) => {
        const arr = this.state.items;
        const arrLen = arr.length;
        let bounceRate=0;
        let organicSource = 0;
        let directSource = 0;
        let referralSource = 0;
        let pageViews = 0;
        let users = 0;
        let newUsers = 0;
        let sourceData=[];
        let userData=[];
        let sess_data=[];
        let views_data=[];
        let user_sess_comp=[];
        let selectedValue = null;
        for (let i = 0; i < arrLen; i++) {
            if (args == arr[i]["month"]) {
                organicSource = arr[i].organic_source;
                directSource = arr[i].direct_source;
                referralSource = arr[i].referral_source;
                pageViews = arr[i].page_views;
                users = arr[i].users;
                newUsers = arr[i].new_users;
                bounceRate=arr[i].bounce_rate;
                sourceData.push({
                    label:"Organic Source",
                    value:arr[i].organic_source
                },
                {
                    label:"Direct Source",
                    value:arr[i].direct_source
                },
                {
                    label:"Referral Source",
                    value:arr[i].referral_source
                }

                );
                userData.push({
                    label:"Users",
                    value:arr[i].users
                },{
                    label:"New Users",
                    value:arr[i].new_users
                });
               
            }
            sess_data.push(
                {
                    label:arr[i].month,
                    value:arr[i].sessions
                }
            );
            views_data.push({
                label:arr[i].month,
                value:arr[i].page_views
            });
            user_sess_comp.push({
                label:arr[i].users+arr[i].new_users,
                value:arr[i].number_of_sessions_per_users
            });
        }
        selectedValue = args;
        this.setState({
            organicSource: organicSource,
            directSource: directSource,
            referralSource: referralSource,
            pageViews: pageViews,
            users: users,
            newUsers: newUsers,
            sourceData:sourceData,
            userData:userData,
            sess_data:sess_data,
            views_data:views_data,
            user_sess_comp:user_sess_comp,
            bounceRate:bounceRate

        }, () => {
            console.log(this.state.organicSource);
        });

    }
    updateDashboard = (event) => {
        this.getData(event.value);
        this.setState({
            selectedValue: event.value
        });
    }
    componentDidMount() {
        fetch(url)
            .then(response => response.json())
            .then(data => {

                let batchRowValues = data.valueRanges[0].values;

                const rows = [];

                for (let i = 1; i < batchRowValues.length; i++) {
                    let rowObject = {};
                    for (let j = 0; j < batchRowValues[i].length; j++) {
                        rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
                    }

                    rows.push(rowObject);
                }
                let dropdownOptions = [];

                for (let i = 0; i < rows.length; i++) {
                    dropdownOptions.push(rows[i].month);
                }

                dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
                this.setState(
                    {
                        items: rows,
                        dropdownOptions: dropdownOptions,
                        selectedValue: "Jan 2018"
                    },
                    () => this.getData("Jan 2018")
                );
                console.log(rows);
            });
    }
    render() {

        return (
            <div>
                <Container fluid>
                    <Row className="Top-Header">
                        <Col>
                           <div className="Header-Title">Dashboard</div> 
                         </Col>
                        <Col className="Dropdown-Holder">
                            <Dropdown options={this.state.dropdownOptions} onChange={this.updateDashboard} value={this.state.selectedValue} placeholder="Select an option" />
                        </Col>
                    </Row>
                </Container>
                <Container>
                   <div className="Main-Dashboard"> 
                    <Row>
                        <Col>
                            <TextWidget title="Organic Source" value={this.state.organicSource} description="Users who visited organically."></TextWidget>
                        </Col>
                        <Col>
                            <TextWidget title="Direct Source" value={this.state.directSource} description="Users who visited through a link."></TextWidget>
                        </Col>
                        <Col>
                            <TextWidget title="Refferal Source" value={this.state.referralSource} description="Users who visited through referrals."></TextWidget>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                            <TextWidget title="Page Views" value={this.state.pageViews} description="Total views this month."></TextWidget>
                        </Col>
                        <Col>
                            <TextWidget title="Users" value={this.state.users} description="Current Users."></TextWidget>
                        </Col>
                        <Col>
                            <TextWidget title="New Users" value={this.state.newUsers} description="Users who joined this month."></TextWidget>
                        </Col>
                        </Row>
                        <Row>
                            <Col>
                            <BarWidget title="Source Comparison" data={this.state.sourceData}></BarWidget>
                            </Col>
                            <Col>
                            <Doughnut title="User Data" data={this.state.userData}></Doughnut>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="session-line">
                                <LineWidget title="Session Per Month" data={this.state.sess_data}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="view-line">
                               <LineWidget title="Page Views Per Month" data={this.state.views_data}/>
                            </Col>
                            <Col className="bounce-rte">
                                <TextWidget title="Bounce Rate" value={this.state.bounceRate} description="Users who left the page without viewing."/>
                            </Col>
                            
                        </Row>
                   </div>
                </Container>
            </div>
        )
    }
}

export default Dashboard;
