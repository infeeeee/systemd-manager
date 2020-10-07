const Gettext          = imports.gettext
const Gio              = imports.gi.Gio
const Config           = imports.misc.config
const ExtensionUtils   = imports.misc.extensionUtils
const SystemdExtension = ExtensionUtils.getCurrentExtension()

function initTranslations(domain) {
  let textDomain = domain || SystemdExtension.metadata['gettext-domain']
  let localeDir  = SystemdExtension.dir.get_child('locale')

  if (localeDir.query_exists(null))
    localeDir = localeDir.get_path()
  else
    localeDir = Config.LOCALEDIR

  Gettext.bindtextdomain(textDomain, localeDir)
}

function getSettings(schema) {
  schema = schema || SystemdExtension.metadata['settings-schema']

  let gioSSS       = Gio.SettingsSchemaSource
  let schemaDir    = SystemdExtension.dir.get_child('schemas')
  let schemaSource = gioSSS.get_default()

  if (schemaDir.query_exists(null)) {
    schemaDir    = schemaDir.get_path()
    schemaSource = gioSSS.new_from_directory(schemaDir, schemaSource, false)
  }

  let schemaObj = schemaSource.lookup(schema, true)

  if (!schemaObj) {
    let metaId  = SystemdExtension.metadata.uuid
    let message = `Schema ${schema} could not be found for extension ${metaId}.`

    throw new Error(`${message} Please check your installation.`)
  }

  return new Gio.Settings({ settings_schema: schemaObj })
}
