import "./Product.css"

function Button(props){

     return(
        <button className="btn" onClick={props.onClick}>
            {props.buttonText}
            <span className="material-symbols-outlined">
                {props.iconName}
            </span>
        </button>
     
    )
}
export default Button;