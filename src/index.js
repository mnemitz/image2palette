import './styles/App.scss';
import App from './App.svelte';

window.app = new App({
	target: document.getElementById('app')
});
