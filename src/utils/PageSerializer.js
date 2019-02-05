const PageSerializer = {
  serialize({
    count,//size
    rows,
    size,
    page
  }) {
    resultados = rows;
    numeroRecords = Number(rows.length);
    totalPaginas = numeroRecords == 0 ? 0 : Math.ceil(count / size);
    datosPage = {
      totalDatos: count,
      inicioDatos: (size * page) + 1,
      finDatos: (size * page) + numeroRecords 
    }
    return {
      resultados,
      totalPaginas,
      datosPage
    };
  }
};

module.exports = PageSerializer;
