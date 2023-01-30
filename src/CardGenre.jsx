export default function CardGenre (props) {
    return (
        <button type="button" className="btn btn-outline-dark m-2" name={props.genre.id} onClick={props.event}>{props.genre.name}</button>        
    )
}