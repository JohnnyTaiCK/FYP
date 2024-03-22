import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import Axios from 'axios';
import Header from "./header";

function DetectNews() {
  const settings = {
    model: "flan_t5",
    load_device: "cpu",
    use_search_engine: false
  }
  const [result, setResult] = useState('');
  const [news, setNews] = useState('');
  const handleChange = (e) => {
    setNews(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://127.0.0.1:8000/api/detect/', {"news":news, "settings": settings})
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
    <Header/>
    <Container className="check-by-title-container" style={{width:'50%'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className='frm-opalq'>News Title</Form.Label>
            <Form.Control
              className='frm-moqpa'
              type="text"
              placeholder="Enter news..."
              as="textarea"
              rows={10}
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
        <span>hahaha</span><span>hehehehe</span><h1>kakaka</h1>
        {result}
      </Container>
    </>
  );
}

export default DetectNews;