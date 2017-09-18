import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './Main.css'

import AppSidebar from './AppSidebar'
import ProjectList from './Projects/ProjectList'
import ProjectEditor from './Projects/ProjectEditor'
import GroupList from './Groups/GroupList'
import GroupEditor from './Groups/GroupEdit/GroupEditor'
import DatacenterList from './Datacenters/DatacenterList'
import DatacenterEditor from './Datacenters/DatacenterEditor'
import HostList from './Hosts/HostList'
import HostEditor from './Hosts/HostEdit/HostEditor'
import HostView from './Hosts/HostView'
import { AlertBox } from '../library/AlertBox'

class Main extends Component {
    render() {
        return (
            <div className="main">
                <AppSidebar />
                <div className="content">
                    <AlertBox />
                    <Route exact path="/projects" component={ProjectList} />
                    <Route exact path="/projects/:id" component={ProjectEditor} />
                    <Route exact path="/groups" component={GroupList} />
                    <Route exact path="/groups/:id" component={GroupEditor} />
                    <Route exact path="/datacenters" component={DatacenterList} />
                    <Route exact path="/datacenters/:id" component={DatacenterEditor} />
                    <Route exact path="/hosts" component={HostList} />
                    <Route exact path="/hosts/:id" component={HostView} />
                    <Route exact path="/hosts/:id/edit" component={HostEditor} />
                </div>
            </div>
        )
    }
}

export default Main;