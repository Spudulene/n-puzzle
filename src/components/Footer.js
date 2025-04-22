import "../styles/Footer.css"
const Footer = ({ moves, AIMoves, time}) => {
    return(
        <footer className="footer">
            {AIMoves > 0 && <div>AI Moves: {AIMoves}</div>}
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