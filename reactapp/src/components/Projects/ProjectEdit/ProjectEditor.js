import React, { Component } from 'react'
import Axios from 'axios'
import HttpErrorHandler from '../../../library/HttpErrorHandler'
import AlertStore from '../../../library/AlertBox'
import Loading from '../../common/Loading'

import Api from '../../../library/Api'
import ProjectForm from './ProjectForm'
import ProjectMembersForm from './ProjectMembersForm'

export default class ProjectEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "New Project",
            project: {
                name: ""
            },
            isNew: true,
            isLoading: true
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params
        let { EditorFields } = Api.Projects
        EditorFields = EditorFields.join(",")
        if (id && id !== "new") {
            Axios.get(`/api/v1/projects/${id}?_fields=${EditorFields}`)
                .then((response) => {
                    this.setState({
                        project: response.data.data[0],
                        title: "Edit Project",
                        isNew: false,
                        isLoading: false
                    })
                })
                .catch(HttpErrorHandler);
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    handleSubmit(project) {
        let action = project._id ? 
            Axios.put(`/api/v1/projects/${project._id}`, project) :
            Axios.post('/api/v1/projects/', project)

        action.then((response) => {
            AlertStore.Notice(`Project ${project.name} has been successfully saved`)
            this.props.history.push('/projects')
        })
        .catch(HttpErrorHandler)
    }

    handleMembersSubmit(members) {
        console.log(members)
    }

    handleDestroy(project) {
        Axios.delete(`/api/v1/projects/${project._id}`)
            .then( response => {
                AlertStore.Notice(`Project ${project.name} has been successfully deleted`)

            })
            .catch(HttpErrorHandler)
    }

    render() {
        return (
            <div className="max vertcenter">
            {
                this.state.isLoading ? <Loading /> :
                <div className="max">
                    <h2>{this.state.title}</h2>
                    <div className="row">
                        <div className="col-sm-6">
                            <ProjectForm isNew={this.state.isNew} 
                                        onDestroy={this.handleDestroy.bind(this)} 
                                        project={this.state.project} 
                                        onSubmit={this.handleSubmit.bind(this)} />
                        </div>
                        <div className="col-sm-6">
                        {
                            this.state.isNew ? "" :
                            <ProjectMembersForm 
                                project={this.state.project}
                                onSubmitData={this.handleMembersSubmit.bind(this)} />
                        }
                        </div>
                    </div>
                </div>
            }
            </div>
        )
    }
}
