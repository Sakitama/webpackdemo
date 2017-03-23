import css from './css/common.css';
import Layer from './components/layer/layer';

class App {
    constructor () {
        let dom = document.getElementById('app');
        let layer = new Layer();
        dom.innerHTML = layer.tpl;
    }
}

new App();