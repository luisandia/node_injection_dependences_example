const Operation = require('src/app/Operation');

class GetAllUsuarios extends Operation {
  constructor({ usuariosRepository }) {
    super();
    this.usuariosRepository = usuariosRepository;
  }

  async execute( page, size) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const usuarios = await this.usuariosRepository.getAllUsuarios( page, size);
      usuarios['size'] = size;
      console.log("resultadooooo")
      console.log(usuarios.rows[0].dataValues)
      this.emit(SUCCESS, usuarios);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllUsuarios.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllUsuarios;
