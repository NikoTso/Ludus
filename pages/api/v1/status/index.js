function status(request, response) {
  response.status(200).json({chave : "Panquecas são otimas"});
}

export default status;