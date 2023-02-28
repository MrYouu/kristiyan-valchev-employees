function Button({ text = "button", onClick = () => null, className = "" }) {
   return (
      <button type="button" onClick={onClick} className={`Button${className !== "" ? ` ${className}` : ""}`}>
         {text}
      </button>
   );
}

export default Button;