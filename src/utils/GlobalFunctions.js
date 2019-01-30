const dateFormat = require('dateformat');
const startOfWeek = require('date-fns/start_of_week');
const endOfWeek = require('date-fns/end_of_week');
const startOfMonth = require('date-fns/start_of_month');
const endOfMonth = require('date-fns/end_of_month');
const startOfYear = require('date-fns/start_of_year');
const endOfYear = require('date-fns/end_of_year');

module.exports = {
  removeItemFromArray: function (arr, item) {
    let found = arr.indexOf(item);
    while (found !== -1) {
      arr.splice(found, 1);
      found = arr.indexOf(item);
    }
    return arr;
  },

  /* Devuelve expresiones regulares para numeros con decimales */
  decimal(numberInt, numberDec){
    //const entero = new RegExp('^\\d{1,' + numberInt + '}?$');
    const decimal = new RegExp('^\\d{1,' + numberInt + '}(\\.\\d{1,' + numberDec + '})?$');
    return decimal;
  },

  /* Esta funcion convierte un string que contiene un arreglo y retorna y array */
  stringToArray: function(cadena){
    const array = JSON.parse(cadena);
    return array;
  },

  /* Esta funcion convierte un string a un double */
  stringToDouble: function(cadena){
    const num = parseFloat(cadena);
    return num;
  },

  getDates: function(selectedDate){
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var fechas, firstDay, lastDay;
    switch(selectedDate) {
      case 0: // DIA
          fechas = [date, date];
          break;
      case 1: // SEMANA
          //FirstDayOfWeek
          d = new Date();
              diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
              firstDay = new Date(d.setDate(diff));
          //LastDayOfWeek
          lastDay = new Date(firstDay);
          lastDay.setDate(firstDay.getDate()+6);
          //fechas = [firstDay, lastDay];
          fechas = [firstDay, lastDay];
          break;
      case 2: // MES
          firstDay = new Date(y, m, 1);
          lastDay = new Date(y, m + 1, 0);
          fechas = [firstDay, lastDay];
          break;
      case 3: // ANIO
          firstDay = new Date(y, 0, 1);
          //LastDayOfYear
          lastDay = new Date(y, 12, 0);
          fechas = [firstDay, lastDay];
          break;
      default:
          break;
    }
    return fechas;

  },

  getOnlyDateToday: function(date) {
    let today = new Date(+date);
    let next = String(Number(date) +  24*60*60*1000); // Milisegundos en un dia
    let nextDay = new Date(+next);
    const dates = [dateFormat(today, "isoDate"), dateFormat(nextDay, "isoDate")];
    return dates;
  },

  dateToPostgres: function (timestamp) {
    if (timestamp == null || timestamp == '')
      return null;
    return new Date(+timestamp);
  },

  dateFromPostgres: function (date) {
    if (date == null || date == '')
      return date;
    return dateFormat(new Date(date), "yyyy-mm-dd");
  },

  hourFromPostgres: function (date) {
    if (date == null || date == '')
      return date;
    return dateFormat(new Date(date), "HH:MM:ss");
  },

  dateToEntity: function (date) {
    if (date == null || date == '')
      return date;
    return (+new Date(date)).toString();
  },

  getStartEndWeek: function (date) {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const dates = [dateFormat(start, 'isoDate'), dateFormat(end, 'isoDate')];
    return dates;
  },

  getStartEndMonth: function (date) {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const dates = [dateFormat(start, 'isoDate'), dateFormat(end, 'isoDate')];
    return dates;
  },

  getStartEndYear: function (date) {
    const start = startOfYear(date);
    const end = endOfYear(date);
    const dates = [dateFormat(start, 'isoDate'), dateFormat(end, 'isoDate')];
    return dates;
  }
};
