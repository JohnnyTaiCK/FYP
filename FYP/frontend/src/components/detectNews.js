import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import Axios from 'axios';
import Header from "./header";

const modelList = ["Flan_T5", "NExT-GPT"]

function DetectNews() {
  const [result, setResult] = useState('');
  const [newsTitle, setNewsTitle] = useState('');
  const [news, setNews] = useState('');
  const [model, setModel] = useState(0);
  const [file, setFile] = useState(null);
  const [scoreText, setScoreText] = useState('');
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [reasonText, setReasonText] = useState('')

  const handleNewsTitleChange = (e) => {
    setNewsTitle(e.target.value);
  }

  const handleNewsChange = (e) => {
    setNews(e.target.value)
  }

  const settings = {
    model: model,
    load_device: "cpu",
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

    setScoreText("");
    setReasonText("");
    setResult("");
    const realBar = document.getElementById("reliability-bar-result");
    realBar.style.width = "0";
    
    Axios.post('http://127.0.0.1:8000/api/detect/', {"title": newsTitle,"news":news})
      .then((response) => {
        setResult(response.data.prediction);
        const realBar = document.getElementById("reliability-bar-result");
        realBar.style.backgroundColor = "lightgreen";
        realBar.style.width = 200 * response.data.score + "px";
        setScoreText(Math.round(response.data.score * 100));
        setReasonText(response.data.reason);
      })
      .catch((error) => {
        console.error('Error submitting data: ', error);
      }).finally(() => {setFile(null);});
  };

  const handleModelSelect = (e) => {
    const element = e.target
    const selectedModelNum = element.getAttribute('value');
    if (selectedModelNum === model) {
      return;
    }
    settings['model'] = selectedModelNum;
    setIsLoadingModel(true);
    Axios.post('http://127.0.0.1:8000/api/detect/', {"settings": settings}, {timeout:5000})
      .then((response) => {
        setModel(selectedModelNum);
      })
      .catch((error) => {
        console.error('Error submitting data: ', error);
        settings['model'] = model;
      }).finally(() => {
        setIsLoadingModel(false)
      });
  };

  const renderUploadedFile = (<span style={{fontSize:"small"}}>{file?.name}</span>);

  return (
    <>
    <div className="main-wrap">
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
                Current loaded model: <span id="model_name">{isLoadingModel ? "Loading..." : modelList[model]}</span>
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='detect-news-container-label'>Title</Form.Label>
              <Form.Control type="text" onChange={handleNewsTitleChange} />
              <Form.Label className='detect-news-container-label'>Content</Form.Label>
              <Form.Control
                className='detect-news-container-textinput'
                type="textarea"
                placeholder="Paste text or write here..."
                as="textarea"
                rows={13} 
                spellCheck="false"
                onChange={handleNewsChange}
              />
            </Form.Group>

              <Container className="detect-news-container-buttonContainer">
                <div>
                  <Button variant="primary" type="submit" className='detect-news-container-analyze_button'>
                    Analyze
                  </Button>
                </div>
                <div style={{display:"flex", flexDirection:"column", textAlign:"center", maxWidth:"30%", justifySelf:"flex-end", overflow:"visible"}}>
                  <Form.Label className="detect-news-container-buttonContainer-uploadWrap">
                    <input onChange={handleFileUpload} type="file" accept=".jpg, .png" style={{display:"none"}} />
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
              {reasonText}
            </div>
          </Container>
        </Container>
      </Container>
    </div>
    </>
  );
}

export default DetectNews;