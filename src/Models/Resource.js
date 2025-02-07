/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')

class Resource extends Model {
  defaultPermissions () {
    const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')

    return this.hasMany('Cerberus/Models/DefaultPermission', 'id', RESOURCE_ID)
  }
}

module.exports = Resource
