import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import "./App.css";
import Axios from 'axios';

function App() {
  const [result, setResult] = useState('');
  const [news, setNews] = useState('');
  const handleChange = (e) => {
    setNews(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://127.0.0.1:8000/api/', {"news":news})
      .then((response) => {
        setResult(response.data.prediction);
        console.log(result);
      })
      .catch((error) => {
        console.error('Error submitting data: ', error);
      });
  };

  return (
    <>
    <Container fluid="lg" className="check-by-title-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className='frm-opalq'>News Title</Form.Label>
            <Form.Control
              className='frm-moqpa'
              type="text"
              placeholder="Enter news title..."
              as="textarea"
              rows={5}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className='button-17'>
            Check
          </Button>
        </Form>
      </Container>

      <Container className='prediction-result-container'>
        <br />
        <br />
        <br />
        {result}

      </Container>
    </>
  );
}

export default App;