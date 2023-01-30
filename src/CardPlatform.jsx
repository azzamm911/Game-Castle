export default function CardPlatform (props) {
    return (
        <button type="button" className="btn btn-outline-dark m-2"  name={props.platform.id} onClick={props.event}>{props.platform.name}</button>        
    )
}