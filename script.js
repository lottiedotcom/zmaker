const root = document.documentElement;
const grid = document.getElementById('mainGrid');

let presets = {
    cherrySnow: { bg: '#fdf5f8', accent: '#f1d4df', text: '#333333', header: "'Playfair Display', serif", font: "'Inter', sans-serif" },
    slavicWinter: { bg: '#e6f2fa', accent: '#cce0f0', text: '#2c3e50', header: "'Playfair Display', serif", font: "'Inter', sans-serif" },
    summerModel: { bg: '#eefbe6', accent: '#d3ecd3', text: '#3d4035', header: "'Cinzel', serif", font: "'Inter', sans-serif" },
    medicalcore: { bg: '#ffffff', accent: '#b3cde0', text: '#011f4b', header: "'Courier New', monospace", font: "'Inter', sans-serif" },
    yamiKawaii: { bg: '#1a1a2e', accent: '#ffb6c1', text: '#e94560', header: "'Great Vibes', cursive", font: "'Inter', sans-serif" }
};

function saveState() {
    const blockStyles = [];
    document.querySelectorAll('.content-block').forEach(block => {
        blockStyles.push({ 
            gridCol: block.style.gridColumn, 
            gridRow: block.style.gridRow 
        });
    });

    const state = {
        title: document.getElementById('mainTitle').innerHTML,
        swordSrc: document.getElementById('swordImg').src,
        gridHtml: grid.innerHTML,
        gridClass: grid.className,
        blockStyles: blockStyles,
        controls: {
            bg: document.getElementById('bgColor').value,
            accent: document.getElementById('accentColor').value,
            hFont: document.getElementById('headerFont').value,
            pFont: document.getElementById('paragraphFont').value,
            columns: document.getElementById('layoutStyle').value,
            preset: document.getElementById('aestheticPreset').value
        }
    };
    localStorage.setItem('zineState', JSON.stringify(state));
}

function loadState() {
    const savedPresets = JSON.parse(localStorage.getItem('zinePresets')) || {};
    presets = { ...presets, ...savedPresets };
    const presetSelect = document.getElementById('aestheticPreset');
    Object.keys(savedPresets).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `* ${key} *`;
        presetSelect.appendChild(opt);
    });

    const saved = JSON.parse(localStorage.getItem('zineState'));
    if (saved) {
        document.getElementById('mainTitle').innerHTML = saved.title;
        document.getElementById('swordImg').src = saved.swordSrc;
        grid.innerHTML = saved.gridHtml;
        grid.className = saved.gridClass;
        
        const blocks = document.querySelectorAll('.content-block');
        if (saved.blockStyles && saved.blockStyles.length === blocks.length) {
            blocks.forEach((block, index) => {
                block.style.gridColumn = saved.blockStyles[index].gridCol;
                block.style.gridRow = saved.blockStyles[index].gridRow;
            });
        }
        
        document.getElementById('bgColor').value = saved.controls.bg;
        document.getElementById('accentColor').value = saved.controls.accent;
        document.getElementById('headerFont').value = saved.controls.hFont;
        document.getElementById('paragraphFont').value = saved.controls.pFont;
        document.getElementById('layoutStyle').value = saved.controls.columns;
        document.getElementById('aestheticPreset').value = saved.controls.preset;
        
        root.style.setProperty('--bg-color', saved.controls.bg);
        root.style.setProperty('--accent-border', saved.controls.accent);
        root.style.setProperty('--header-font', saved.controls.hFont);
        root.style.setProperty('--paragraph-font', saved.controls.pFont);
    } else {
        addDefaultTextBlocks();
    }
}

document.getElementById('canvas-container').addEventListener('input', saveState);

document.getElementById('aestheticPreset').addEventListener('change', (e) => {
    const preset = presets[e.target.value];
    if(preset) {
        root.style.setProperty('--bg-color', preset.bg);
        root.style.setProperty('--accent-border', preset.accent);
        root.style.setProperty('--text-color', preset.text);
        root.style.setProperty('--header-font', preset.header);
        root.style.setProperty('--paragraph-font', preset.font);
        
        document.getElementById('bgColor').value = preset.bg;
        document.getElementById('accentColor').value = preset.accent;
        document.getElementById('headerFont').value = preset.header;
        document.getElementById('paragraphFont').value = preset.font;
        saveState();
    }
});

document.getElementById('savePresetBtn').addEventListener('click', () => {
    const name = prompt("Enter a name for this custom preset:");
    if (name) {
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const newPreset = {
            bg: document.getElementById('bgColor').value,
            accent: document.getElementById('accentColor').value,
            text: '#333333', 
            header: document.getElementById('headerFont').value,
            font: document.getElementById('paragraphFont').value
        };
        
        presets[safeName] = newPreset;
        const savedPresets = JSON.parse(localStorage.getItem('zinePresets')) || {};
        savedPresets[safeName] = newPreset;
        localStorage.setItem('zinePresets', JSON.stringify(savedPresets));

        const opt = document.createElement('option');
        opt.value = safeName;
        opt.textContent = `* ${name} *`;
        document.getElementById('aestheticPreset').appendChild(opt);
        document.getElementById('aestheticPreset').value = safeName;
        saveState();
    }
});

const updateVar = (id, cssVar) => {
    document.getElementById(id).addEventListener('input', (e) => {
        root.style.setProperty(cssVar, e.target.value);
        document.getElementById('aestheticPreset').value = 'custom';
        saveState();
    });
};

updateVar('bgColor', '--bg-color');
updateVar('accentColor', '--accent-border');
updateVar('headerFont', '--header-font');
updateVar('paragraphFont', '--paragraph-font');

document.getElementById('scrambleBtn').addEventListener('click', () => {
    grid.className = 'layout-grid collage-mode';
    document.getElementById('layoutStyle').value = 'collage';
    
    const blocks = document.querySelectorAll('.content-block');
    blocks.forEach(block => {
        const colSpan = Math.random() > 0.6 ? 2 : 1;
        const rowSpan = Math.random() > 0.6 ? 2 : 1;
        
        block.style.gridColumn = `span ${colSpan}`;
        block.style.gridRow = `span ${rowSpan}`;
    });
    saveState();
});

function updateColumns(val) {
    grid.className = 'layout-grid'; 
    const blocks = document.querySelectorAll('.content-block');
    blocks.forEach(b => {
        b.style.gridColumn = '';
        b.style.gridRow = '';
    });

    if (val === '1') grid.classList.add('one-col');
    if (val === '3') grid.classList.add('three-col');
    if (val === '4') grid.classList.add('four-col');
    saveState();
}

document.getElementById('layoutStyle').addEventListener('change', (e) => {
    if (e.target.value !== 'collage') {
        updateColumns(e.target.value);
    }
});

function addDefaultTextBlocks() {
    grid.innerHTML = '';
    const defaults = [
        { header: "The Essentials:", text: "Item one<br>Item two" },
        { header: "Think:", text: "Descriptors here..." },
        { header: "Scents:", text: "Note one<br>Note two" }
    ];
    defaults.forEach(d => createTextBlock(d.header, d.text));
    saveState();
}

function createTextBlock(headerText = "New Section:", bodyText = "Type text here...") {
    const newBlock = document.createElement('div');
    newBlock.className = 'content-block';
    newBlock.innerHTML = `
        <button class="delete-btn" onclick="deleteSection(this)">×</button>
        <h3 contenteditable="true">${headerText}</h3>
        <div contenteditable="true" style="flex-grow: 1;">${bodyText}</div>
    `;
    grid.appendChild(newBlock);
    if (grid.classList.contains('collage-mode')) {
        newBlock.style.gridColumn = `span ${Math.random() > 0.6 ? 2 : 1}`;
        newBlock.style.gridRow = `span ${Math.random() > 0.6 ? 2 : 1}`;
    }
    saveState();
}

document.getElementById('addTextBtn').addEventListener('click', () => createTextBlock());

window.deleteSection = function(btn) {
    btn.parentElement.remove();
    saveState();
}

document.getElementById('swordUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('swordImg').src = event.target.result;
            saveState();
        };
        reader.readAsDataURL(file);
    }
});

const bulkUploadInput = document.getElementById('hiddenBulkUpload');

document.getElementById('bulkUploadBtn').addEventListener('click', () => {
    bulkUploadInput.click();
});

bulkUploadInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newBlock = document.createElement('div');
                newBlock.className = 'content-block image-block';
                newBlock.innerHTML = `
                    <button class="delete-btn" onclick="deleteSection(this)">×</button>
                    <img src="${event.target.result}" alt="Zine Image">
                `;
                grid.appendChild(newBlock);
                
                if (grid.classList.contains('collage-mode')) {
                    newBlock.style.gridColumn = `span ${Math.random() > 0.5 ? 2 : 1}`;
                    newBlock.style.gridRow = `span ${Math.random() > 0.5 ? 2 : 1}`;
                }
                saveState();
            };
            reader.readAsDataURL(file);
        });
    }
    e.target.value = ''; 
});

function triggerDownload(callback = null) {
    const canvasContainer = document.getElementById('canvas-container');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    deleteBtns.forEach(btn => btn.style.display = 'none');

    html2canvas(canvasContainer, { useCORS: true, scale: 2 }).then(canvas => {
        deleteBtns.forEach(btn => btn.style.display = 'flex');

        const link = document.createElement('a');
        link.download = `zine_layout_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (callback) callback();
    });
}

document.getElementById('downloadBtn').addEventListener('click', () => triggerDownload());

document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the page? It will download your current canvas first just in case!")) {
        triggerDownload(() => {
            localStorage.removeItem('zineState');
            location.reload();
        });
    }
});

window.onload = loadState;

