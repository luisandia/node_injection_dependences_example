// const csvFilePath = '/home/lap0020-2018/Downloads/Reporte_Enero_2019.csv';
const csvFilePath = '/home/zafiron/Descargas/Reporte_Enero_2019.csv';
const fs = require('fs');
const csv = require('fast-csv');
var stream = fs.createReadStream(csvFilePath);
var file = fs.createWriteStream('./data.json');



function Horario(id, date, begin) {
  var o = {};
  o.id = id;
  o.dates = {
    date: date,
    begin: begin,
    end: 'null'
  };
  o.printDate = function () {
    console.log(this.dates);
  };
  return o;
}


let arrayPersons = [];

let id = -1;
let i = -1;
let self = this;
let tmp;
let prev;
var csvStream = csv()
  .on("data", (data) => {
    if (Number(data[0])) {
      // file.write(data.join(' ') + '\n')
      if (id !== data[0]) {
        id = data[0];
        arrayPersons.push(new Horario(id, data[2], data[4] ))
        
        i++;
        if(i>0)
          arrayPersons[i-1].dates.end=prev[5]

      }
      else 
      {
        console.log("comparando " +
          data[2] + " " + (prev && prev[2]))
        if (prev && data[2] != prev[2]) {
          // console.log("entro")


          arrayPersons[i].dates.end = prev[5];

          arrayPersons.push(new Horario(data[0], data[2], data[4]))
          i++;
          // if (id !== data[0]) 
          // id=data[0]
        }
      }
      prev = data;
    }
  })
  .on("end", function () {
    for (let person of arrayPersons) {
      console.log(person.dates);
    }
    fs.writeFileSync('./datos.json', JSON.stringify(arrayPersons), 'utf-8');
    console.log("done");
  });


stream.pipe(csvStream);