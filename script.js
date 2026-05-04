// 1. Data Setup
const defaultData = [
    { id: "KAM-UTLÅN-RES-01", serial: "1T0196", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-02", serial: "IT0208", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-03", serial: "IT0271", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-04", serial: "IT0207", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-05", serial: "IT0137", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-06", serial: "85261838", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-07", serial: "85261837", dato: "", laner: "" },
    { id: "KAM-UTLÅN-RES-##", serial: "########", dato: "", laner: "" }
];

let pcData = JSON.parse(localStorage.getItem('myInventoryData')) || defaultData;
let letSelectedIndex = -1;

// 2. Render Sidebar
function renderList() {
    const listContainer = document.getElementById('pc-list');
    if (!listContainer) return;
    listContainer.innerHTML = "";

    pcData.forEach((pc, index) => {
        const div = document.createElement('div');
        
        // This line adds the 'selected' class if this is the active camera
        div.className = `pc-item ${index === letSelectedIndex ? 'selected' : ''}`;
        
        div.innerText = pc.id;
        div.onclick = () => {
            letSelectedIndex = index;
            
            // Update the display area
            document.getElementById('selected-id').innerText = pc.id;
            document.getElementById('title-input').value = pc.laner || "";
            document.getElementById('serial-input').value = pc.serial;
            
            // Re-run renderList to move the highlight to this button
            renderList(); 
        };
        listContainer.appendChild(div);
    });
}

// 3. Render Dashboard
function updateDashboard() {
    const statusBody = document.getElementById('status-body');
    if (!statusBody) return;
    statusBody.innerHTML = ""; 

    pcData.forEach((pc, index) => {
        const isBorrowed = (pc.dato && pc.dato.trim() !== "");
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold;">${pc.id}</td>
            <td>
                <button class="status-tag ${isBorrowed ? 'borrowed' : 'available'}" 
                        onclick="toggleStatus(${index})">
                    ${isBorrowed ? 'Utlånt' : 'Ledig'}
                </button>
            </td>
            <td>${isBorrowed ? (pc.laner || "Navn mangler") : "-"}</td>
            <td>${isBorrowed ? pc.dato : "-"}</td>
        `;
        statusBody.appendChild(row);
    });
}

// 4. Toggle function (Return Camera)
window.toggleStatus = function(index) {
    pcData[index].dato = "";
    pcData[index].laner = ""; // Clear name when returned
    localStorage.setItem('myInventoryData', JSON.stringify(pcData));
    updateDashboard();
};

// 5. Save Button Logic
const saveButton = document.getElementById('save-btn');
if (saveButton) {
    saveButton.onclick = () => {
        if (letSelectedIndex !== -1) {
            // GRAB THE NAME FROM THE INPUT
            const nameInput = document.getElementById('title-input').value;
            
            pcData[letSelectedIndex].laner = nameInput;
            pcData[letSelectedIndex].dato = new Date().toLocaleDateString(); 
            
            localStorage.setItem('myInventoryData', JSON.stringify(pcData));
            renderList();
            updateDashboard();
        } else {
            alert("Vennligst velg et kamera først!");
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    renderList();
    updateDashboard();
});