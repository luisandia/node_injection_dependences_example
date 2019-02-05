const PersonalPageSerializer = {
  serialize({
    count,
    rows,
    size,
    page,
  }) {
    //resultados = rows;
    numeroRecords = count;
    totalPaginas = numeroRecords == 0 ? 0 : Math.ceil(count / size);
    resultados = rows
    total = (size * page) + count;
    datosPage = {
      totalDatos: count,
      inicioDatos: (size * page) + 1,
      finDatos: total>count?count:total
    }
    return {
      resultados,
      totalPaginas,
      datosPage
    };
  }
};

module.exports = PersonalPageSerializer;