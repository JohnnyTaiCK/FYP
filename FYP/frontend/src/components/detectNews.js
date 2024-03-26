import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import Axios from 'axios';
import Header from "./header";

const modelList = ["flan_t5", "next_gpt"]

function DetectNews() {
  const [result, setResult] = useState('');
  const [news, setNews] = useState('');
  const [model, setModel] = useState(modelList[0]);

  const handleChange = (e) => {
    setNews(e.target.value)
  }

  const settings = {
    model: model,
    load_device: "cpu",
    use_search_engine: false
  }

  const handleSubmit = (e) => {
    console.log(settings);
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

  const handleModelSelect = (e) => {
    const element = e.target
    const selectedModelNum = element.getAttribute('value');
    setModel(modelList[selectedModelNum]);
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
                <Container className="detect-news-container-content_left-models_group">
                  <span onClick={handleModelSelect} value="0">Flan_T5</span>
                  <span onClick={handleModelSelect} value="1">NExT-GPT</span>
                </Container>

                <Container>Current selected model: {model}</Container>
                
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