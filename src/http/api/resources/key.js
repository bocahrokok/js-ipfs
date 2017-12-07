'use strict'

exports = module.exports

function applyError (reply, err) {
  reply({
    Message: err.message,
    Code: 0
  }).code(500).takeover()
}

function toKeyInfo (key) {
  return {
    Name: key.name,
    Id: key.id
  }
}

exports.list = (request, reply) => {
  const ipfs = request.server.app.ipfs

  ipfs._keychain.listKeys((err, keys) => {
    if (err) {
      return applyError(reply, err)
    }

    keys = keys.map(toKeyInfo)
    return reply({ Keys: keys })
  })
}

exports.remove = (request, reply) => {
  const ipfs = request.server.app.ipfs
  const name = request.query.arg
  ipfs._keychain.removeKey(name, (err, key) => {
    if (err) {
      return applyError(reply, err)
    }

    // TODO: need key info from keychain
    return reply({ Keys: [] })
  })
}

exports.rename = (request, reply) => {
  const ipfs = request.server.app.ipfs
  const oldName = request.query.arg[0]
  const newName = request.query.arg[1]
  ipfs._keychain.renameKey(oldName, newName, (err, key) => {
    if (err) {
      return applyError(reply, err)
    }

    const result = {
      Was: oldName,
      Now: key.name,
      Id: key.id,
      Overwrite: false
    }
    return reply(result)
  })
}

exports.generate = (request, reply) => {
  const ipfs = request.server.app.ipfs
  const name = request.query.arg
  const type = request.query.type
  const size = request.query.size
  ipfs._keychain.createKey(name, type, size, (err, key) => {
    if (err) {
      return applyError(reply, err)
    }

    return reply(toKeyInfo(key))
  })
}
