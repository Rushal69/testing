import { AnimationManager } from './utils/animations.js';
import { NavigationManager } from './utils/navigation.js';
import { ServicesManager } from './utils/services.js';
import { FAQManager } from './utils/faq.js';

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
    new NavigationManager();
    new ServicesManager();
    new FAQManager();
});