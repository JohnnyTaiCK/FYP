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
      <Container className="detect-news-wrap">
        <Container className="detect-news-container">
          <Container className="detect-news-container-content_left">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className='detect-news-container-label'>Select the models</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className='detect-news-container-label'>Content</Form.Label>
                <Form.Control
                  className='detect-news-container-textinput'
                  type="textarea"
                  placeholder="Paste text or write here..."
                  as="textarea"
                  rows={15}
                  spellCheck="false"
                  onChange={handleChange}
                />
              </Form.Group>

              <Container className="detect-news-container-buttonContainer">
                <Button variant="primary" type="submit" className='detect-news-container-analyze_button'>
                  Analyze News
                </Button>
              </Container>
            </Form>
          </Container>
          <Container className="detect-news-container-content_right" style={{display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2em"}}>{result}</Container>
        </Container>
      </Container>
    </>
  );
}

export default DetectNews;