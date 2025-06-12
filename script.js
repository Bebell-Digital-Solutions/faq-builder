// FAQ Builder JavaScript

// Application State
let state = {
    tabs: [
        { id: 0, name: 'General', faqs: [] }
    ],
    activeTab: 0,
    editingFAQ: null,
    settings: {
        primaryColor: '#DF1783',
        displayStyle: 'accordion',
        fontSize: '16px'
    }
};

// Utility Function to Get Current Tab
function getCurrentTab() {
    return state.tabs.find(tab => tab.id === state.activeTab);
}

// Initialize Application
function init() {
    updateTabList();
    updateFAQItems();
    updatePreview();
    updateCustomizationSidebar();
    setupEventListeners();
}

// Event Listener Setup
function setupEventListeners() {
    // Save FAQ Button
    const saveBtn = document.getElementById('faq-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveFAQ);
    }

    // Close Modal When Clicking Outside
    const modal = document.getElementById('faq-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFAQModal();
            }
        });
    }

    // Other Event Listeners...
    document.getElementById('add-tab-btn').addEventListener('click', addTab);
    document.getElementById('add-faq-btn').addEventListener('click', addFAQItem);
    // Add more event listeners as needed
}

// Tab Management
function addTab() {
    const name = prompt('Enter tab name:');
    if (name) {
        const newTab = {
            id: Date.now(),
            name: name,
            faqs: []
        };
        state.tabs.push(newTab);
        updateTabList();
        switchTab(newTab.id);
    }
}

function switchTab(tabId) {
    state.activeTab = tabId;
    updateTabList();
    updateFAQItems();
    updatePreview();
}

function updateTabList() {
    const tabList = document.getElementById('tab-list');
    tabList.innerHTML = '';

    state.tabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = `tab-button ${tab.id === state.activeTab ? 'active' : ''}`;
        button.textContent = tab.name;
        button.onclick = () => switchTab(tab.id);
        button.ondblclick = () => renameTab(tab.id);
        tabList.appendChild(button);
    });
}

function renameTab(tabId) {
    const tab = getCurrentTab();
    if (tab.id === tabId) {
        const newName = prompt('Enter new tab name:', tab.name);
        if (newName) {
            tab.name = newName;
            updateTabList();
            updatePreview();
        }
    }
}

// FAQ Management
function addFAQItem() {
    state.editingFAQ = null;
    document.getElementById('faq-modal-title').textContent = 'Add Question';
    document.getElementById('faq-question-input').value = '';
    document.getElementById('faq-answer-input').value = '';
    document.getElementById('faq-modal').style.display = 'block';
}

function editFAQ(index) {
    const currentTab = getCurrentTab();
    const faq = currentTab.faqs[index];

    state.editingFAQ = index;
    document.getElementById('faq-modal-title').textContent = 'Edit Question';
    document.getElementById('faq-question-input').value = faq.question;
    document.getElementById('faq-answer-input').value = faq.answer;
    document.getElementById('faq-modal').style.display = 'block';
}

function deleteFAQ(index) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
        const currentTab = getCurrentTab();
        currentTab.faqs.splice(index, 1);
        updateFAQItems();
        updatePreview();
    }
}

function saveFAQ() {
    const question = document.getElementById('faq-question-input').value.trim();
    const answer = document.getElementById('faq-answer-input').value.trim();

    if (!question || !answer) {
        alert('Please fill in both question and answer');
        return;
    }

    const currentTab = getCurrentTab();
    const faq = { question, answer };

    if (state.editingFAQ !== null) {
        currentTab.faqs[state.editingFAQ] = faq;
    } else {
        currentTab.faqs.push(faq);
    }

    closeFAQModal();
    updateFAQItems();
    updatePreview();
    alert('FAQ saved successfully!');
}

function closeFAQModal() {
    document.getElementById('faq-modal').style.display = 'none';
    state.editingFAQ = null;
    // Clear inputs
    document.getElementById('faq-question-input').value = '';
    document.getElementById('faq-answer-input').value = '';
}

// FAQ Items Update
function updateFAQItems() {
    const container = document.getElementById('faq-items');
    const currentTab = getCurrentTab();

    if (currentTab.faqs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No questions added yet. Click "Add Question" to get started.</p></div>';
        return;
    }

    container.innerHTML = '';
    currentTab.faqs.forEach((faq, index) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <div class="faq-item-header">
                <div class="faq-item-title">${faq.question}</div>
                <div class="faq-actions">
                    <button class="btn-small btn-edit" data-index="${index}">Edit</button>
                    <button class="btn-small btn-delete" data-index="${index}">Delete</button>
                </div>
            </div>
            <div style="color: #6b7280; font-size: 14px;">${faq.answer}</div>
        `;
        container.appendChild(item);
    });

    // Add Event Listeners for Edit and Delete Buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            editFAQ(index);
        });
    });

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteFAQ(index);
        });
    });
}

// Preview Management
function updatePreview() {
    const preview = document.getElementById('preview-widget');
    const allTabs = state.tabs;

    if (allTabs.every(tab => tab.faqs.length === 0)) {
        preview.innerHTML = `
            <div class="empty-state">
                <h3>No FAQ items yet</h3>
                <p>Add some questions and answers to see the preview</p>
            </div>
        `;
        return;
    }

    let html = '';

    if (allTabs.length > 1) {
        html += '<div class="faq-tabs">';
        allTabs.forEach((tab, index) => {
            html += `<button class="faq-tab ${index === 0 ? 'active' : ''}" onclick="switchPreviewTab(${index})">${tab.name}</button>`;
        });
        html += '</div>';
    }

    allTabs.forEach((tab, tabIndex) => {
        if (tab.faqs.length > 0) {
            html += `<div class="faq-content ${tabIndex === 0 ? 'active' : ''}" data-tab="${tabIndex}">`;
            html += '<div class="faq-accordion">';

            tab.faqs.forEach((faq, index) => {
                html += `
                    <button class="faq-question" onclick="togglePreviewFAQ(${tabIndex}, ${index})">
                        ${faq.question}
                        <span class="faq-icon">▼</span>
                    </button>
                    <div class="faq-answer" data-tab="${tabIndex}" data-faq="${index}">
                        ${faq.answer}
                    </div>
                `;
            });

            html += '</div></div>';
        }
    });

    preview.innerHTML = html;
    updatePreviewStyles();
}

// Rest of the code remains the same...

// Ensure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', init);
