import './style.css'
import { initCalculator } from './calculator.js'
import { initMobileMenu } from './mobile-menu.js'

document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    initMobileMenu();
});
