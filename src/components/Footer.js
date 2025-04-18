import "../styles/Footer.css"
const Footer = ({ moves, time}) => {
    return(
        <footer className="footer">
            <div>Moves: {moves}</div>
            <div>
                {time < 60 ? 
                `Time: ${time}s` : 
                `Time: ${Math.floor(time / 60)}m ${time % 60}s`}
            </div>
        </footer>
    )
}

export default Footer