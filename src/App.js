import { useState } from 'react';
import './App.css';
import axios from 'axios';
import RepoDetails from './Details.js';
import Modal from 'react-bootstrap/Modal'

function App() {

  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [details, setDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);



  function getDetails(i, breakpoint){
    setFullscreen(breakpoint);
    setShow(true);
    setDetailsLoading(true);
    var obj = {name: i.name, description: i.description, stargazers_count:i.stargazers_count, language:i.language, owner:i.owner.login}
    setDetails(obj);
    setDetailsLoading(false);
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
  };

  function searchRepos() {
    setLoading(true);
    axios({
      method : "get",
      url: `https://api.github.com/search/repositories?q=${keyword}`,
    }).then(res => {
      setLoading(false);
      setRepos(res.data.items)
    });
  }

  function handleDropdown(e) {
    if(e.target.value === "stars") {
      const copy = [...repos];
      const sortResults = copy.sort((a,b) => {
        return b.stargazers_count - a.stargazers_count  ;
      })
    setRepos(sortResults);
    }
  }

  function filterByLangauge(res) {
    const copy = [...repos];
    const filterResult = copy.filter((a) => {
      return a.language === res.target.value;
    })
    setRepos(filterResult)
    
  }
  
  return (
    <div className="page">
      <div className = "landing-page-container">
          <form className="form">
            <input className="input"
              value={keyword}
              placeholder="Search for repo here..."
              onChange={ e => setKeyword(e.target.value)}
            />
            <button className="button" onClick={(e) => handleSubmit(e)}>{loading ? "Searching..." : "Search"}</button>
            
            <span style={{textAlign: "center", paddingTop:"12px", paddingLeft:"40px", marginRight: "-3px"}} className="label"> Sort By : </span>
            <select className="button-sm" onChange={(e) => handleDropdown(e)}>
              <option value="bestMatch"> best match</option>
              <option value="stars"> stars</option>
            </select>

            <span style={{textAlign: "center", paddingTop:"12px", paddingLeft:"40px", marginRight: "-3px"}} className="label" placeholder="Choose Language"> Filter By Language : </span>
            <select className="button-sm" onChange={(e) => filterByLangauge(e)}>
            {repos.map((i,idx)=> { 
              return ( <option key={i.idx}> {i.language} </option>);
            })
            }
            </select>
          </form>

        <div className="results-container">
          <span style={{textAlign: "left", paddingTop:"7px"}}className="label"> Total : {repos.length} Repositories Found</span>
            { repos.map((i,idx)=> {
              return (
                <div className="row" onClick={() => getDetails(i)} key={idx}>
                  <h2 className = "repo-name">
                    {i.name}
                    <span className="label sm-text"> {i.owner.login} </span>
                  </h2>
                </div> );
              })
             }
        </div>

      </div>
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)} dialogClassName="custom-modal" bsClass="my-modal">
        <Modal.Title> <h2 style={{color:'grey'}}>Repository Details</h2></Modal.Title>
        <span className="close-btn"><Modal.Header closeButton> </Modal.Header> </span>
        <Modal.Body> <RepoDetails details={details} loading={detailsLoading}/> </Modal.Body>
      </Modal>
    </div>
    );
}

export default App;

