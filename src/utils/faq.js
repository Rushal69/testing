import { faqs } from '../data/faqs.js';

export class FAQManager {
    constructor() {
        this.init();
    }

    init() {
        this.initFilterButtons();
        this.loadFaqs('general'); // Load general FAQs by default
    }

    initFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.loadFaqs(button.getAttribute('data-category'));
            });
        });
    }

    loadFaqs(category) {
        const faqContainer = document.getElementById('faq-container');
        faqContainer.innerHTML = '';

        const filteredFaqs = faqs.filter(faq => faq.category === category);

        if (filteredFaqs.length === 0) {
            faqContainer.innerHTML = '<p>No FAQs available for this category.</p>';
            return;
        }

        filteredFaqs.forEach(faq => {
            const faqItem = this.createFaqItem(faq);
            faqContainer.appendChild(faqItem);
        });
    }

    createFaqItem(faq) {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        faqItem.setAttribute('data-category', faq.category);

        const faqHeader = document.createElement('div');
        faqHeader.classList.add('faq-header');

        const faqQuestion = document.createElement('h3');
        faqQuestion.textContent = faq.question;

        const toggleBtnWrapper = document.createElement('div');
        toggleBtnWrapper.classList.add('toggle-btn-wrapper');

        const toggleBtn = document.createElement('span');
        toggleBtn.classList.add('toggle-btn');
        toggleBtn.textContent = '+';

        toggleBtnWrapper.appendChild(toggleBtn);
        faqHeader.appendChild(faqQuestion);
        faqHeader.appendChild(toggleBtnWrapper);
        faqItem.appendChild(faqHeader);

        const faqAnswer = document.createElement('p');
        faqAnswer.textContent = faq.answer;
        faqAnswer.style.maxHeight = '0';
        faqAnswer.style.overflow = 'hidden';

        faqItem.appendChild(faqAnswer);

        // Add event listener
        faqHeader.addEventListener('click', () => {
            this.toggleFaq(faqHeader, faqAnswer, toggleBtn);
        });

        return faqItem;
    }

    toggleFaq(header, answer, toggleBtn) {
        // Close all other FAQs
        document.querySelectorAll('.faq-item p').forEach(otherAnswer => {
            if (otherAnswer !== answer) {
                otherAnswer.style.maxHeight = '0';
                otherAnswer.previousElementSibling.querySelector('.toggle-btn').textContent = '+';
                otherAnswer.previousElementSibling.querySelector('.toggle-btn').classList.remove('active');
            }
        });

        // Toggle current FAQ
        if (answer.style.maxHeight === '0px' || !answer.style.maxHeight) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            toggleBtn.textContent = '-';
            toggleBtn.classList.add('active');
        } else {
            answer.style.maxHeight = '0px';
            toggleBtn.textContent = '+';
            toggleBtn.classList.remove('active');
        }
    }
}