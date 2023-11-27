function verificar(req, res) {
    res.send('Verificado');
}


function recibir(req, res) {
    res.send('Recibido');
}

module.exports = {
    verificar,
    recibir,
}