'use strict'

const { Command } = require('@adonisjs/ace')
const Resource = use('Cerberus/Models/Resource')
const Database = use('Database')
const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const path = require('path')
const { asyncForEach } = require('../util/Util')

class ResourceCommand extends Command {
  /**
   * The command signature getter to define the
   * command name, arguments and options.
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature () {
    return 'cerberus:resource { name?: Name of the resource } { slug?: Short name for resource } { --from-migrations: Create a resource for each Model }'
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  static get description () {
    return 'Create new Cerberus Resource'
  }

  /**
   * Creates the resource
   *
   * @method createResource
   *
   * @param  {String} name
   * @param  {String} slug
   *
   * @return {void}
   */
  async createResource (name, slug) {
    // If there's no slug, uses the resource name instead
    if (!slug) slug = name

    await Database.transaction(async (trx) => {
      // Create the resource
      await Resource.create({ name, slug })
    })

    this.success(`${this.icon('success')} resource ${name} created.`)

    // Close Databse connection
    await Database.close()

    return true
  }

  /**
   * The handle method to be executed
   * when running command
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle ({ name, slug }, { fromMigrations }) {
    try {
      if (fromMigrations) {
        const modelsPath = path.join(Helpers.appRoot(), 'app/Models')

        let models = await fs.readdir(modelsPath)
        models = models.filter((val) => val.split('.')[1] === 'js')

        await asyncForEach((models), async (model) => {
          const modelName = model.split('.')[0]

          await this.createResource(modelName, modelName)
        })
      } else {
        await this.createResource(name, slug)
      }
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = ResourceCommand
