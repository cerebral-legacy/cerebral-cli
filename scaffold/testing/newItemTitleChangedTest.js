import { Controller } from 'cerebral-testable'
import updateItemTitle from 'chains/updateItemTitle'

describe('Chain: newItemTitleChanged', () => {
  let controller, signals;

  beforeEach(() => {
    [controller, signals] = Controller({
      // state
    }, {
      // module: Module()
    })
    controller.addSignals({
      newItemTitleChanged: {
        chain: updateItemTitle,
        immediate: true
      }
    })
  })

  it('sets the new item title in the state tree', () => {
    return controller.test(() => {
      signals.newItemTitleChanged({title: 'Livin the dream'})
    }).then(output => {
      expect(controller.get('newItemTitle')).to.eql('Livin the dream')
    })
  })
})
