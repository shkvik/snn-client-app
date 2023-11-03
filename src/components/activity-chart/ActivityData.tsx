
const dataMaxLengh = 200;


export function getZeroArray() {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      arr.push(1);
    }
    return arr;
}


function getDatasetLabels(){
    var dbg_labels = new Array<number>(); 

    for(var i = 0; i < dataMaxLengh; i++){
        dbg_labels.push(i);
    }

    return dbg_labels;
}


export const labels = getDatasetLabels();


export const dataSet = {
    labels: labels,
    datasets: [
        {
            borderColor: 'rgba(22, 119, 255, 1)',
            data: getZeroArray(),
            pointRadius: 0, // скрыть точки
            borderWidth: 1
        },
    ]
}