import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import Axios from 'axios';
import Header from "./header";

const modelList = ["Flan_T5", "NExT-GPT"]

function DetectNews() {
  const [result, setResult] = useState('');
  const [news, setNews] = useState('');
  const [model, setModel] = useState(modelList[0]);
  const [file, setFile] = useState(null);
  const [scoreText, setScoreText] = useState('');

  const handleChange = (e) => {
    setNews(e.target.value)
  }

  const settings = {
    model: model,
    load_device: "cpu",
    use_search_engine: false
  }

  const handleFileUpload = (e) => {
    const inputFile = e.target.files[0];
    if (inputFile) {
      setFile(inputFile);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (news.length < 20) {
      return;
    }
    console.log(settings);
    Axios.post('http://127.0.0.1:8000/api/detect/', {"news":news, "settings": settings})
      .then((response) => {
        setResult(response.data.prediction);
        const realBar = document.getElementById("reliability-bar-result");
        realBar.style.backgroundColor = "lightgreen";
        realBar.style.width = 200 * response.data.score + "px";
        setScoreText(Math.round(response.data.score * 100));
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

  const renderUploadedFile = (<span style={{fontSize:"small"}}>{file?.name}</span>);

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
                <Form.Label className="detect-news-container-label">
                  Current loaded model: <span id="model_name">{model}</span>
                </Form.Label>
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
                <div>
                  <Button variant="primary" type="submit" className='detect-news-container-analyze_button'>
                    Analyze News
                  </Button>
                </div>
                <div style={{display:"flex", flexDirection:"column", textAlign:"center", maxWidth:"30%", justifySelf:"flex-end", overflow:"visible"}}>
                  <Form.Label className="detect-news-container-buttonContainer-uploadWrap">
                    <input onChange={handleFileUpload} type="file" accept=".pdf, .docx, .jpg, .png" style={{display:"none"}} />
                    {file ? renderUploadedFile : <span>Upload file</span>}
                  </Form.Label>
                </div>
              </Container>
            </Form>
          </Container>
          <Container className="detect-news-container-content_right">
            <div id="score-indicator">{scoreText}%</div>
            <div id="reliability-bar-wrap">
              <div id="reliability-bar-full"></div>
              <div id="reliability-bar-result"></div>
            </div>

            {result === "" ? <div id="result-indicator"></div>: <div id="result-indicator">Predicted as {result === "True" ? "real" : "fake"} information!</div>}

            <div id="explanation-indicator">
              This is the explanation div
            </div>
          </Container>
        </Container>
      </Container>
    </>
  );
}

export default DetectNews;