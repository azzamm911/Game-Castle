export default function GenreForm (props) {
    return(
        <div className="col-sm-12 my-2">
            <input className="genre--form form-check-input" type="checkbox" value="" onChange={props.event} name={props.data.id} id={props.data.slug}/>
            <label className="genre--form form-check-label d-block ps-3" htmlFor={props.data.slug}>{props.data.name}</label>
        </div>
    )
}