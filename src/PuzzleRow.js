export function PuzzleRow(props){
    let cells = []
    console.log(props.rowNum)
    let cellWidth = "calc(100% / " + props.rowNum + " )" 
    for (let i = 0; i < props.rowNum; i++){
        let cell = <div style={{border:"1px solid purple", width:cellWidth}}>{i}</div>
        cells.push(cell)
    }
    let row = <div className="row" style={{display:"flex",height:cellWidth}}>{cells}</div>
    return(row)
}
export default PuzzleRow