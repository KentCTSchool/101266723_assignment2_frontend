import React, { Component } from 'react'
import axios from 'axios'
import {Col, Table, Button, Modal, Container, Row, InputGroup, FormControl, Alert} from 'react-bootstrap'
export default class Employee extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             employees : [],
             employee: [],
             showAlert: false,
             deleteAlert: false,
             updateAlert: false,
             delete: false,
             view: false,
             add: false,
             update: false
        }
        this.readData = this.readData.bind(this);
    }    
    
    showModalAdd = () => {
        this.setState({add: true});
    }
    closeModalUpdate = () => {
        this.setState({update: false});
    }
    closeModalDelete = () => {
        this.setState({delete: false});
    }
    closeModalView = () => {
        this.setState({view: false});
    }
    closeModalAdd = () => {
        this.setState({add: false});
    }


    componentDidMount = () =>{
        this.getUserData()
    }
    
    //Get Users
    getUserData = () => {
        axios.get("/api/v1/employees")
        .then(res =>  { 
            console.log(res.data)
            this.setState({...this.state, employees : res.data})
        })
        this.handleShowAlert()
    }

    //Create New User
    createNewUser = () =>{
        const newUser = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email
        }

        axios.post("/api/v1/employee", newUser)
        .then(res =>  { console.log(res.data)
        })
        this.closeModalAdd();
        this.getUserData();
    }

    //View of one data
   getEmployeeDataByID = (id) => {
    axios.get(`/api/v1/employee/${id}`)
    .then(response =>  { 
        const resData = response.data;
        console.log(resData)
        this.setState({
            view: true,
            employee: resData
         })
    })
}
     //UpdateUser

    readData(event){
        this.setState({[event.target.name] : event.target.value})
        event.preventDefault();
    }

    updateEmployee = (id) => {
        axios.get(`/api/v1/employee/${id}`)
        .then(response =>  { 
            const resData = response.data;
            console.log(resData)
            this.setState({
                update: true,
                employee: resData
             })
        })
    }
     getUserByID = (id) => {
        const updatedUser = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email
        }
        console.log(id)
        axios.put(`/api/v1/employee/${id}`, updatedUser)
        .then(res =>  { console.log(res.data)
        })
        this.closeModalUpdate();
        this.handleUpdateAlert();
        this.getUserData();
    }

    //Delete by ID
    deleteEmployee = (id) => {
        axios.get(`/api/v1/employee/${id}`)
        .then(response =>  { 
            const resData = response.data;
            console.log(resData)
            this.setState({
                delete: true,
                employee: resData
             })
        })
    }

    deleteUserDataByID = (id) => {
        axios.delete(`/api/v1/employee/${id}`)
        .then(res =>  { 
            console.log(res.data)
            let employeeList = this.state.employees.filter(u => {
                return u._id !== id
            })
            this.setState({...this.state, employees: employeeList})
        })
        this.closeModalDelete();
        this.handleDeleteAlert();
        this.getUserData();
    }

    handleShowAlert = () => {
        this.setState({showAlert: true});
        setTimeout(()=> {
            this.setState({showAlert: false});
        }, 2000)
    } 
    handleDeleteAlert = () => {
        this.setState({deleteAlert: true});
        setTimeout(()=> {
            this.setState({deleteAlert: false});
        }, 2000)
    } 
    handleUpdateAlert = () => {
        this.setState({updateAlert: true});
        setTimeout(()=> {
            this.setState({updateAlert: false});
        }, 2000)
    } 
    render() {
        return (
            <>     
        <Container>

            <Row className="justify-content-md-center">
            <Alert show={this.state.showAlert} variant="success">
                Employee List Loaded Succefully!
            </Alert>
            <Alert show={this.state.deleteAlert} variant="danger">
                Deleted Successfully!
            </Alert>
            <Alert show={this.state.updateAlert} variant="info">
                Updated Successfully!
            </Alert>
            <div className="table-title">
            <div className="row">
                <div className="col-sm-6">
                    <h2>Manage <b>Employees</b></h2>
                    </div>
                    <div className="col-sm-6">
                    <Col md={{ span: 5, offset:  8}}><Button onClick={this.showModalAdd} className="btn btn-success" data-toggle="modal" as={Col}><i className="material-icons">&#xE147;</i> <span>Add New Employee</span></Button></Col>		
                </div>
            </div>
            </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Operations</th>
                        </tr>
                    </thead>        
                        <tbody>
                            {
                            this.state.employees.map(u => (
                                <>
                                    <tr>
                                    <td>{u.firstname} {u.lastname}</td>
                                    <td>{u.email}</td>
                                    <td width={300}>
                                        <Button variant="outline-warning" onClick={() => this.updateEmployee(u._id)}>Update</Button>{' '}
                                        <Button variant="outline-danger"  onClick={() => this.deleteEmployee(u._id)}>Delete</Button>{' '}
                                        <Button variant="outline-success" onClick={() => this.getEmployeeDataByID(u._id)}>View</Button>{' '}
                                    </td >
                                    </tr>
                                </>
                            ))
                            }
                        </tbody>
                </Table>
            </Row>

            <Modal show={this.state.add} onHide={this.closeModalAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>First and last name</InputGroup.Text>
                        <FormControl aria-label="First name" name="firstname" onChange={this.readData}/>
                        <FormControl aria-label="Last name" name="lastname" onChange={this.readData} />
                    </InputGroup> 
                    <InputGroup className="mb-3">
                    <FormControl
                    name="email"
                    onChange={this.readData}
                    placeholder="Recipient's email"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    />
                    <InputGroup.Text id="basic-addon2" >@example.com</InputGroup.Text>
                     </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModalAdd}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={this.createNewUser}>Submit</Button>{' '}
                </Modal.Footer>
            </Modal>


                            {/* Updating Modal */}
            <Modal show={this.state.update} onHide={this.closeModalUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>First and last name</InputGroup.Text>
                        <FormControl aria-label="First name" type="text" name="firstname" defaultValue={this.state.employee.firstname} onChange={this.readData}/>
                        <FormControl aria-label="Last name" name="lastname" defaultValue={this.state.employee.lastname} onChange={this.readData} />
                    </InputGroup> 
                    <InputGroup className="mb-3">
                    <FormControl
                    name="email"
                    onChange={this.readData}
                    defaultValue={this.state.employee.email}
                    placeholder="Recipient's email"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    />
                    <InputGroup.Text id="basic-addon2" >@example.com</InputGroup.Text>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModalUpdate}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={ (e) => this.getUserByID(this.state.employee._id)}>Submit</Button>{' '}
                </Modal.Footer>
            </Modal>
            {/* Modal for Viewing Data */}
            <Modal show={this.state.view} onHide={this.closeModalView}>
                <Modal.Header closeButton>
                    <Modal.Title>View Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>Name: </Col>
                            <Col>{this.state.employee.firstname} {this.state.employee.lastname}</Col>
                        </Row>
                        <Row>
                            <Col>Email: </Col>
                            <Col>{this.state.employee.email}</Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModalView}>
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Deleting Data */}
            <Modal show={this.state.delete} onHide={this.closeModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Employee</Modal.Title>
                </Modal.Header>
                        <Modal.Body>Are you sure you want to delete? {this.state.employee.firstname} {this.state.employee.lastname}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModalDelete}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={ (e) => this.deleteUserDataByID(this.state.employee._id)}>
                    Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
            </>
        )
    }
}
