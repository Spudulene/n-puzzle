import "../styles/Footer.css"
const Footer = ({ moves, time}) => {
    return(
        <footer className="footer">
            <div>Moves: {moves}</div>
            <div>Time: 
                {time < 60 ? 
                `${time}s` : `
                ${Math.floor(time / 60)}m ${time % 60}s`}
            </div>
        </footer>
    )
}

export default Footer