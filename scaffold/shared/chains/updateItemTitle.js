// "copy" is an action factory that creates
// an action based on your arguments
import copy from 'cerebral-addons/copy'

export default [
  // Using "url-scheme" we copy the title value
  // from the input to the newItemTitle path in
  // our state tree
  copy('input:/title', 'state:/newItemTitle')
]
