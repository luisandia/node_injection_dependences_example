const PageSerializerRawQuery = {
  serialize(result,page,size) {
    resultados = result
    numeroRecords = result.length
    totalPaginas = numeroRecords == 0 ? 0 : Math.ceil(numeroRecords / size);
    datosPage = {
      totalDatos: numeroRecords,
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

module.exports = PageSerializerRawQuery;
