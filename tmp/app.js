const csvFilePath = '/home/lap0020-2018/Downloads/Reporte_Enero_2019.csv';
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
    end: ''
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
      file.write(data.join(' ') + '\n')
      if (id !== data[0]) {
        id = data[0];
        arrayPersons.push(new Horario(id, data[2], data[4]))
        i++;
      }

      if (prev && arrayPersons[i].dates.date != prev[2]) {
        arrayPersons[i].dates.end = prev[5];
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