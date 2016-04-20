import {Component, render} from 'cerebral-view-snabbdom';
import App from './components/App';
import controller from './controller';

render(() => App(), document.querySelector('#root'), controller);
