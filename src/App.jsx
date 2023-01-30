import { useState, useEffect } from "react";
import Card from "./Card";
import GenreForm from "./GenreForm";
import PlatformForm from "./PlatformForm";

export default function App () {

  // Initial variable to set
  const [data, setData] = useState([])  
  const [genre, getGenre] = useState([])
  const [platform, getPlatform] = useState([])
  const [pages, setPage] = useState({prev: '', next: ''})
  var url = 'https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f'
  var card = []
  var setGenre = []
  var setPlatform = []

  // Variable for search
  const [search, setSearch] = useState({
        search: "",
        genres: [],
        platform: []
  })  

  // Function to save url into session storage
  const saveURL = (url) => {
    return sessionStorage.setItem("url", JSON.stringify(url))
  }
    // =========================================================================================================

  // Function for previous button and next button
  const handleClick = (e) => {
    var whichDirection
        
    e.target.id === 'btn--next' ? whichDirection = pages.next : whichDirection = pages.prev
    
    fetch(whichDirection, {method: 'GET'})
      .then(response => response.json())
      .then(response => setData(prevData => prevData = response.results))
      .catch(err => console.error(err))

    fetch(whichDirection, {method: 'GET'})
      .then(response => response.json())
      .then(response => setPage(prevPage => {return {...prevPage, prev: response.previous, next: response.next}}))
      .catch(err => console.error(err))

    saveURL(whichDirection)
  }
  // =========================================================================================================

  // Function to add fetch for genre button inside card
  const handleClickCardGenre = (e) => {
    e.stopPropagation()

    fetch(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&genres=${e.target.name}`, {method: 'GET'})
      .then(response => response.json())
      .then(response => setData(prevData => prevData = response.results))
      .catch(err => console.error(err))

    fetch(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&genres=${e.target.name}`, {method: 'GET'})
      .then(response => response.json())
      .then(response => setPage(prevPage => {return {...prevPage, prev: response.previous, next: response.next}}))
      .catch(err => console.error(err))

    saveURL(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&genres=${e.target.name}`)
  }
  // =========================================================================================================

   // Function to add fetch for platform button inside card
  const handleClickPlatform = (e) => {
    e.stopPropagation()

    fetch(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&platforms=${e.target.name}`, {method: 'GET'})
      .then(response => response.json())
      .then(response => setData(prevData => prevData = response.results))
      .catch(err => console.error(err))

    fetch(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&platforms=${e.target.name}`, {method: 'GET'})
      .then(response => response.json())
      .then(response => setPage(prevPage => {return {...prevPage, prev: response.previous, next: response.next}}))
      .catch(err => console.error(err))
      
    saveURL(`https://api.rawg.io/api/games?key=30805e5cd343402b898187014be1b09f&platforms=${e.target.name}`)
  }
  // =========================================================================================================

  // Function to handle checkbox event for search
  const handleChange = (e) => {
    if (e.target.className === "genre--form form-check-input") {
      e.target.checked ? setSearch(prevSearch => {return {...prevSearch, genres: [...prevSearch.genres, e.target.name]}}) : 
      setSearch(prevSearch => {return {...prevSearch, genres: prevSearch.genres.filter(genre => genre !== e.target.name)}})
    }
    else if (e.target.className === "platform--form form-check-input"){
      e.target.checked ? setSearch(prevSearch => {return {...prevSearch, platform: [...prevSearch.platform, e.target.name]}}) :
      setSearch(prevSearch => {return {...prevSearch, platform: prevSearch.platform.filter(which => which !== e.target.name)}})
    } 
    else {
      setSearch(prevSearch => {return {...prevSearch, search: e.target.value}})
    }
  }
  // =========================================================================================================

  // Function to compose url based on search parameters
  const composeURL = () => {
    var tempSearch = ''
    var tempGenre = ''
    var tempPlatform = ''

    search.search !== '' ? tempSearch = search.search.replace(/\s/g, "%20") : ''
    search.genres.length > 0 ? tempGenre = JSON.stringify(search.genres).replace(/[\[\]']+/g, "").replace(/"/g, "") : ""
    search.platform.length > 0 ? tempPlatform = JSON.stringify(search.platform).replace(/[\[\]']+/g, "").replace(/"/g, "") : ""
    
    if (tempGenre !== '' && tempPlatform === '' ){
      url = url + `&search=${tempSearch}&search_precise=true&genres=${tempGenre}`
    } 
    else if (tempPlatform !== '' && tempGenre === ''){
      url = url + `&search=${tempSearch}&search_precise=true&platforms=${tempPlatform}`
    }
    else if (tempGenre === '' && tempGenre === ''){
      url = url + `&search=${tempSearch}&search_precise=true`
    }
    else {
      url = url + `&search=${tempSearch}&search_precise=true&genres=${tempGenre}&platforms=${tempPlatform}`
    }
  }
  // =========================================================================================================

  // Function for fetch data based on url from compose url function
  const searchClick = () => {
    composeURL()

    if (url !== undefined){
      fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(response => setData(prevData => prevData = response.results))
        .catch(err => console.error(err))      

      fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(response => setPage(prevPage => {return {...prevPage, prev: response.previous, next: response.next}}))
        .catch(err => console.error(err))
      
      saveURL(url)
    }
    else {
      alert ("Your search is empty")
    }
  }
  // =========================================================================================================

  if (data.length > 0){
    card = data.map(newData => {
      return(
        <Card 
          key = {newData.id}
          id = {newData.id}
          data = {newData}
          event = {handleClickCardGenre}
          event2 = {handleClickPlatform}
        />
      )
    })    
  }

  if (genre.length > 0){
    setGenre = genre.map(data => {
      return (
        <GenreForm 
            key = {data.id}
            data = {data}
            event = {handleChange}
        />
      )
    })
  }

  if (platform.length > 0){
    setPlatform = platform.map(data => {
      return (
        <PlatformForm 
            key = {data.id}
            data = {data}
            event = {handleChange}
        />
      )
    })
  }

  // Use effect for fetch initial data from api
  useEffect(() => {
    var tempUrl = ''

    sessionStorage.getItem("url") !== null ? tempUrl = JSON.parse(sessionStorage.getItem("url")) : tempUrl = url        

    saveURL(tempUrl)

    fetch(tempUrl, {method: 'GET'})
      .then(response => response.json())
      .then(response => setData(prevData => prevData = response.results))
      .catch(err => console.error(err))

    fetch(tempUrl, {method: 'GET'})
      .then(response => response.json())
      .then(response => setPage(prevPage => {return {...prevPage, prev: response.previous, next: response.next}}))
      .catch(err => console.error(err))

    fetch(`https://api.rawg.io/api/genres?key=30805e5cd343402b898187014be1b09f`, {method: 'GET'})
      .then(response => response.json())
      .then(response => getGenre(prevGenre => prevGenre = response.results))
      .catch(err => console.error(err))

    fetch(`https://api.rawg.io/api/platforms?key=30805e5cd343402b898187014be1b09f`, {method: 'GET'})
      .then(response => response.json())
      .then(response => getPlatform(prevPlatfrom => prevPlatfrom = response.results))
      .catch(err => console.error(err))
  }, [])
  // =========================================================================================================

  useEffect(() => {
    var input = document.getElementsByClassName("input--search")[0]

    input.addEventListener("keypress", (e) => {
      if (e.code === "Enter"){
        e.preventDefault()
      }
    })
  }, [])

  return(
    <div className="app d-flex flex-column my-5 mx-auto rounded" style={{height: "fit-content", width: "95%"}}>
      <div className="app--header d-flex flex-row align-items-center justify-content-center" style={{height: "100px"}}>
        <button type="button" className="btn btn-outline-secondary mx-2 d-flex align-items-center" data-bs-toggle="offcanvas" data-bs-target="#searchCanvas" style={{height: "38px"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
          </svg>
        </button>
        {pages.prev !== null && <button type="button" className="btn btn-outline-secondary mx-2" id="btn--prev" onClick={handleClick}>Previous</button>}
        {pages.next !== null && <button type="button" className="btn btn-outline-secondary mx-2" id="btn--next" onClick={handleClick}>Next</button>}
      </div>

      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="true" tabIndex="-1" id="searchCanvas" aria-labelledby="searchCanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="searchCanvas--title">Search</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">          
          <form className="offcanvas--form my-3">
            <input type="text" className="input--search ps-2 border border-bottom-0 w-100" placeholder="Search here" onChange={handleChange} style={{height: "37px"}}></input>

          {/* Check form */}
            {/* Genre */}
            <div className="check--genre border w-100" style={{height: "fit-content"}}>
              <button className="btn btn-outline-secondary m-0 w-100 border-0 rounded-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGenre" aria-expanded="false" aria-controls="collapseGenre">
                Genre
              </button>
              <div className="collapse" id="collapseGenre">
                <div className="card card-body p-4 border-0">
                    <div className="form-check row">
                        {genre.length > 0 && setGenre}
                    </div>
                </div>
              </div>
            </div>
            {/* ========================================================================================= */}

            {/* Platform */}
            <div className="check--platform border w-100" style={{height: "fit-content"}}>
              <button className="btn btn-outline-secondary m-0 w-100 border-0 rounded-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePlatform" aria-expanded="false" aria-controls="collapsePlatform">
                Platform
              </button>
              <div className="collapse" id="collapsePlatform">
                <div className="card card-body p-4 border-0">
                    <div className="form-check row">
                        {platform.length > 0 && setPlatform}
                    </div>
                </div>
              </div>
            </div>
            {/* ========================================================================================= */}
            <button type="button" className="btn btn-outline-success m-0 w-100 border rounded-0" data-bs-toggle="offcanvas" data-bs-target="#searchCanvas" onClick={searchClick}>Submit</button>
          </form>
        </div>
      </div>
      <div className="app--body row p-4">
        {data.length > 0 && card}
      </div>
    </div>
  )
}