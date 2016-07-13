import {Computed} from 'cerebral'

export default Computed({
  modules: 'config.modules'
}, ({modules}) => {
  return Object.keys(modules).filter(module => modules[module])
})
