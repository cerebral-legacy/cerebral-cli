import Inferno from 'inferno'
import {connect} from 'cerebral-view-inferno'

export default connect({
  newItemTitle: 'newItemTitle',
  items: 'items'
},
  function App(props) {

    const onFormSubmit = event => {
      event.preventDefault()
      props.signals.newItemTitleSubmitted()
    }

    const onInputChange = event => {
      props.signals.newItemTitleChanged({
        title: event.target.value
      })
    }

    return (
      <div>
        <form onSubmit={onFormSubmit}>
          <input
            type="text"
            value={props.newItemTitle}
            onChange={onInputChange}
          />
        </form>
        <ul>
          {props.items.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }
)
