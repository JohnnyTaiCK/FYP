import {React} from "react";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import  { LinkContainer } from 'react-router-bootstrap';

function Header() {
    return (
        <header>
            <Container>
                <Navbar bg="" expand="lg">
                    <Container>
                        <LinkContainer to='/'>
                            <Navbar.Brand href="/">
                                <span style={{fontWeight: 1000, color: '#136996'}}>Misinformation Detector</span> 
                            </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="hearder-navbar" />
                        <Navbar.Collapse id="hearder-navbar" className="justify-content-end">
                            <Nav>
                                <LinkContainer to='/'>
                                    <Nav.Link>
                                        <div>
                                            <li>
                                                <div>Detect News</div>
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
                                                <div>Help</div>
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