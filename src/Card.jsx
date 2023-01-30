import CardGenre from "./CardGenre"
import CardPlatform from "./CardPlatform"
import "./css/card.css"
import { useState, useEffect } from "react"

export default function Card (props) {    
    const [click, isClicked] = useState(false)
    const [detailData, setData] = useState('')
    var dotIndex, cardGenre, cardPlatform

    if (props.data.genres !== null) {
        cardGenre = props.data.genres.map(genre => {
            return (
                <CardGenre 
                    key = {genre.id}
                    genre = {genre}
                    event = {props.event}
                />
            )
        })
    }

    if (props.data.platforms !== null) {
        cardPlatform = props.data.platforms.map(platform => {
            return (
                <CardPlatform 
                    key = {platform.platform.id}
                    platform = {platform.platform}
                    event = {props.event2}
                />
            )
        })
    }    

    const composeDetailData = () => {
        dotIndex = 0
        var index

        for (let i = 0; i < 3; i++){
            dotIndex === 0 ? index = detailData.indexOf('.', dotIndex) : index = detailData.indexOf('.', dotIndex + 1)
            dotIndex = index    
        }
    }   

    const handleClick = (id) => {
        isClicked(prevState => !prevState)

        fetch(`https://api.rawg.io/api/games/${id}?key=30805e5cd343402b898187014be1b09f`, {method: 'GET'})
            .then(response => response.json())
            .then(response => setData(prevData => prevData = response.description_raw))
            .catch(err => console.error(err))            
    }

    useEffect(() => {
        $(`#card--img--top--${props.id}`).hover(() => {
            var carousel = document.getElementById(`card--img--top--${props.id}`).getElementsByClassName("carousel-indicators")[0]
            carousel.style.visibility  === "hidden" ? carousel.style.visibility  = "visible" : ''
        }, () => {
            var carousel = document.getElementById(`card--img--top--${props.id}`).getElementsByClassName("carousel-indicators")[0]
            carousel.style.visibility  === "visible" ? carousel.style.visibility  = "hidden" : ''
        })
    })

    const simpleGame = () => {
        return (
            <div>
                {props.data.short_screenshots.length >= 4 && <div id={`card--img--top--${props.id}`} className="carousel slide carousel-fade" data-bs-ride="true">
                    <div className="carousel-indicators" style={{visibility : "hidden"}}>
                        <button type="button" data-bs-target={`#card--img--top--${props.id}`} data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target={`#card--img--top--${props.id}`} data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target={`#card--img--top--${props.id}`} data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active" data-bs-interval="3000">
                        <img src={props.data.background_image} className="d-block w-100 rounded-top" alt="..." style={{height: "187px"}}/>
                        </div>
                        <div className="carousel-item" data-bs-interval="3000">
                        <img src={props.data.short_screenshots[1].image} className="d-block w-100 rounded-top" alt="..." style={{height: "187px"}}/>
                        </div>
                        <div className="carousel-item" data-bs-interval="3000">
                        <img src={props.data.short_screenshots[2].image} className="d-block w-100 rounded-top" alt="..." style={{height: "187px"}}/>
                        </div>
                    </div>
                    <button className="carousel-control-prev w-50" type="button" data-bs-target={`#card--img--top--${props.id}`} data-bs-slide="prev"></button>
                    <button className="carousel-control-next w-50" type="button" data-bs-target={`#card--img--top--${props.id}`} data-bs-slide="next"></button>                 
                </div>}

                {props.data.short_screenshots.length < 4 && <img className="card-img-top" src={props.data.background_image} alt='...' style={{height: "187px"}}></img>}

                <div className="card-body" onClick={() => handleClick(props.id)}>
                    <h5 className="card-title">{props.data.name}</h5>
                    <div className="card--top--desc d-flex flex-row">
                        {props.data.released !== null ? <p className="card-text">{props.data.released.slice(0, 4)}</p> : <p className="card-text">Not Available</p>}
                        <p className="mx-3">|</p>
                        {props.data.rating !== 0  ? <p className="card-text">{props.data.rating}</p> : <p className="card-text">No Rating</p>}
                    </div>
                    <div className="card--genres d-flex flex-row flex-wrap border-top border-dark pt-3">
                        {cardGenre}
                    </div>
                </div>
            </div>
        )
    }

    const detailGame = () => {
        return (
            <div className="card-body" onClick={() => handleClick(props.id)}>
                <div className="card--platform--title border-bottom border-dark">
                    <h5 className="card-title">{props.data.name}</h5>
                </div>
                {detailData !== '' && <p className="p-2 my-2">{detailData.slice(0, dotIndex + 1)}</p>}
                <div className="card--platform d-flex flex-row flex-wrap border-top border-dark pt-3">
                    {cardPlatform}
                </div>
            </div>
        )
    }

    if (detailData.length > 0){
        composeDetailData()
    }

    return(
        <div className="col-sm-3 p-3" >
            <div className="card shadow">
                {click ? detailGame() : simpleGame()}
            </div>
        </div>
    )
}