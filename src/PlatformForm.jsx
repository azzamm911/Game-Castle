export default function PlatformForm (props) {
    return (
        <div className="col-sm-12 my-2">
            <input className="platform--form form-check-input" type="checkbox" onChange={props.event} value="" name={props.data.id} id={props.data.slug}/>
            <label className="platform--form form-check-label d-block ps-3" htmlFor={props.data.slug}>{props.data.name}</label>
        </div>
    )
}