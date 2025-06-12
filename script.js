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

// Initialize Application
function init() {
    updateTabList();
    updateFAQItems();
    updatePreview();
    updateCustomizationSidebar();
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
    const tab = state.tabs.find(t => t.id === tabId);
    const newName = prompt('Enter new tab name:', tab.name);
    if (newName) {
        tab.name = newName;
        updateTabList();
        updatePreview();
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
}

function closeFAQModal() {
    document.getElementById('faq-modal').style.display = 'none';
    state.editingFAQ = null;
}

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
                    <button class="btn-small btn-edit" onclick="editFAQ(${index})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteFAQ(${index})">Delete</button>
                </div>
            </div>
            <div style="color: #6b7280; font-size: 14px;">${faq.answer}</div>
        `;
        container.appendChild(item);
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

function switchPreviewTab(tabIndex) {
    document.querySelectorAll('.faq-tab').forEach((tab, index) => {
        tab.classList.toggle('active', index === tabIndex);
    });
    document.querySelectorAll('.faq-content').forEach((content, index) => {
        content.classList.toggle('active', index === tabIndex);
    });
}

function togglePreviewFAQ(tabIndex, faqIndex) {
    const button = event.target;
    const answer = document.querySelector(`.faq-answer[data-tab="${tabIndex}"][data-faq="${faqIndex}"]`);
    
    const isActive = button.classList.contains('active');
    
    // Close all other FAQs in this tab
    document.querySelectorAll(`.faq-question`).forEach(q => q.classList.remove('active'));
    document.querySelectorAll(`.faq-answer`).forEach(a => a.classList.remove('active'));
    
    if (!isActive) {
        button.classList.add('active');
        answer.classList.add('active');
    }
}

function updatePreviewStyles() {
    const preview = document.getElementById('preview-widget');
    preview.style.setProperty('--primary-color', state.settings.primaryColor);
    preview.style.fontSize = state.settings.fontSize;
}

// Customization
function toggleCustomization() {
    const sidebar = document.getElementById('customization-sidebar');
    const isVisible = sidebar.style.display !== 'none';
    sidebar.style.display = isVisible ? 'none' : 'block';
}

function updatePrimaryColor(color) {
    state.settings.primaryColor = color;
    updatePreviewStyles();
}

function setDisplayStyle(style) {
    state.settings.displayStyle = style;
    document.querySelectorAll('.style-option').forEach(option => {
        option.classList.toggle('active', option.dataset.style === style);
    });
    updatePreview();
}

function updateFontSize(size) {
    state.settings.fontSize = size;
    updatePreviewStyles();
}

function updateCustomizationSidebar() {
    document.getElementById('primary-color').value = state.settings.primaryColor;
}

// Code Generation
function generateCode() {
    const code = generateEmbeddableCode();
    document.getElementById('code-content').textContent = code;
    document.getElementById('code-modal').style.display = 'block';
}

function generateEmbeddableCode() {
    const { primaryColor, fontSize } = state.settings;
    const tabsWithFAQs = state.tabs.filter(tab => tab.faqs.length > 0);
    
    if (tabsWithFAQs.length === 0) {
        return '<!-- No FAQ content to generate -->';
    }

    let html = `<!-- FAQ Widget - Generated by FAQ Builder -->
<div class="faq-widget" style="max-width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${fontSize};">`;

    // Add tabs if multiple sections
    if (tabsWithFAQs.length > 1) {
        html += `
    <div class="faq-tabs" style="display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem; overflow-x: auto;">`;
        
        tabsWithFAQs.forEach((tab, index) => {
            html += `
        <button class="faq-tab ${index === 0 ? 'active' : ''}" 
                onclick="switchFAQTab(${index})"
                style="padding: 10px 20px; border: none; background: none; cursor: pointer; font-weight: 500; white-space: nowrap; border-bottom: 2px solid transparent; transition: all 0.2s; ${index === 0 ? `border-bottom-color: ${primaryColor}; color: ${primaryColor};` : ''}"
                onmouseover="this.style.background='#f8fafc'"
                onmouseout="this.style.background='none'">
            ${tab.name}
        </button>`;
        });
        
        html += `
    </div>`;
    }

    // Add content for each tab
    tabsWithFAQs.forEach((tab, tabIndex) => {
        html += `
    <div class="faq-content ${tabIndex === 0 ? 'active' : ''}" data-tab="${tabIndex}" style="display: ${tabIndex === 0 ? 'block' : 'none'};">
        <div class="faq-accordion" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">`;

        tab.faqs.forEach((faq, faqIndex) => {
            html += `
            <button class="faq-question" 
                    onclick="toggleFAQ(${tabIndex}, ${faqIndex})"
                    style="background: #f8fafc; border: none; padding: 1rem; width: 100%; text-align: left; cursor: pointer; font-weight: 500; border-bottom: 1px solid #e2e8f0; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;"
                    onmouseover="this.style.background='#f1f5f9'"
                    onmouseout="if(!this.classList.contains('active')) this.style.background='#f8fafc'">
                ${faq.question}
                <span class="faq-icon" style="transition: transform 0.2s;">▼</span>
            </button>
            <div class="faq-answer" data-tab="${tabIndex}" data-faq="${faqIndex}" 
                 style="padding: 1rem; display: none; background: white; border-bottom: 1px solid #e2e8f0;">
                ${faq.answer}
            </div>`;
        });

        html += `
        </div>
    </div>`;
    });

    html += `
</div>

<script>
function switchFAQTab(tabIndex) {
    document.querySelectorAll('.faq-tab').forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
            tab.style.borderBottomColor = '${primaryColor}';
            tab.style.color = '${primaryColor}';
        } else {
            tab.classList.remove('active');
            tab.style.borderBottomColor = 'transparent';
            tab.style.color = 'inherit';
        }
    });
    document.querySelectorAll('.faq-content').forEach((content, index) => {
        content.style.display = index === tabIndex ? 'block' : 'none';
    });
}

function toggleFAQ(tabIndex, faqIndex) {
    const button = event.target.closest('.faq-question');
    const answer = document.querySelector(\`.faq-answer[data-tab="\${tabIndex}"][data-faq="\${faqIndex}"]\`);
    const icon = button.querySelector('.faq-icon');
    
    const isActive = button.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        q.style.background = '#f8fafc';
        q.style.color = 'inherit';
        q.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
    });
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    
    if (!isActive) {
        button.classList.add('active');
        button.style.background = '${primaryColor}';
        button.style.color = 'white';
        icon.style.transform = 'rotate(180deg)';
        answer.style.display = 'block';
    }
}
<\\/script>
<!-- End FAQ Widget -->`;

    return html;
}

function copyCode() {
    const code = document.getElementById('code-content').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

function closeCodeModal() {
    document.getElementById('code-modal').style.display = 'none';
}

// Utility Functions
function getCurrentTab() {
    return state.tabs.find(tab => tab.id === state.activeTab);
}

// Event Listeners
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);