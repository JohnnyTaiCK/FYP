import {React} from "react";
import { Navbar, Container, Nav} from 'react-bootstrap';
import  { LinkContainer } from 'react-router-bootstrap';

function Header() {
    return (
        <header>
            <Container>
                <Navbar bg="" expand="lg">
                    <Container>
                        <LinkContainer to='/'>
                            <Navbar.Brand href="/">
                                <span style={{fontWeight: 1000,fontSize: "25px", color: '#136996'}}>Misinformation Detector</span> 
                            </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle/>
                        <Navbar.Collapse id="hearder-navbar" className="justify-content-end">
                            <Nav>
                                <LinkContainer to='/'>
                                    <Nav.Link>
                                        <div>
                                            <li>
                                                <div className="nav-bar-item">Detect News</div>
                                            </li>
                                        </div>
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav>
                            <Nav>
                                <LinkContainer to='/'>
                                    <Nav.Link>
                                        <div>
                                            <li>
                                                <div className="nav-bar-item">Help</div>
                                            </li>
                                        </div>
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>
        </header>
    )
};

export default Header;