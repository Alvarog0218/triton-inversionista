export function initCalculator() {
    // Constants
    const SALES_PRICE = 80;
    const EQUITY_PERCENT = 0.05;

    // State
    let state = {
        units: 1,
        barrels: 1000,
        days: 24,
        opex: 30
    };

    // Format Currency USD
    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    // DOM Elements - Select them only when needed or cache them here
    // Since this runs after DOM content loaded (called from main), we can query safely.
    const els = {
        unitsInput: document.getElementById('unitsInput'),
        unitsDisplay: document.getElementById('unitsDisplay'),
        barrelsInput: document.getElementById('barrelsInput'),
        barrelsDisplay: document.getElementById('barrelsDisplay'),
        daysInput: document.getElementById('daysInput'),
        daysDisplay: document.getElementById('daysDisplay'),
        opexInput: document.getElementById('opexInput'),
        opexDisplay: document.getElementById('opexDisplay'),
        marginDisplay: document.getElementById('marginDisplay'),

        companyNet: document.getElementById('companyNet'),
        investorNet: document.getElementById('investorNet'),
        projectionTable: document.getElementById('projectionTable'),
        resetBtn: document.getElementById('resetBtn')
    };

    function calculate() {
        const margin = SALES_PRICE - state.opex;
        const dailyNetPerUnit = margin * state.barrels;
        const monthlyNetPerUnit = dailyNetPerUnit * state.days;

        const totalCompanyNet = monthlyNetPerUnit * state.units;
        const investorShare = totalCompanyNet * EQUITY_PERCENT;

        // Update UI
        if (els.marginDisplay) els.marginDisplay.innerText = currency.format(margin);
        if (els.companyNet) els.companyNet.innerText = currency.format(totalCompanyNet);
        if (els.investorNet) els.investorNet.innerText = currency.format(investorShare);

        if (els.unitsDisplay) els.unitsDisplay.innerText = state.units;
        if (els.barrelsDisplay) els.barrelsDisplay.innerText = state.barrels;
        if (els.daysDisplay) els.daysDisplay.innerText = state.days;
        if (els.opexDisplay) els.opexDisplay.innerText = "$" + state.opex;

        updateTable(monthlyNetPerUnit);
    }

    function updateTable(monthlyNetPerUnit) {
        if (!els.projectionTable) return;

        const scenarios = [1, 2, 3, 4, 5];
        let html = '';

        scenarios.forEach(unitCount => {
            const totalNet = monthlyNetPerUnit * unitCount;
            const share = totalNet * EQUITY_PERCENT;
            const annual = share * 12;

            const isCurrent = unitCount === state.units;
            // Highlighting the row if it matches current slider
            const rowClass = isCurrent
                ? "bg-emerald-500/10 border-l-4 border-emerald-500 font-bold text-white"
                : "hover:bg-white/5 text-slate-400";

            html += `
                <tr class="${rowClass} transition-colors text-xs md:text-sm">
                    <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">${unitCount} Equipo${unitCount > 1 ? 's' : ''}</td>
                    <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap hidden md:table-cell">${currency.format(totalNet)}</td>
                    <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap ${isCurrent ? 'text-emerald-400' : 'text-emerald-600'}">${currency.format(share)}</td>
                    <td class="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-slate-500">${currency.format(annual)}</td>
                </tr>
            `;
        });

        els.projectionTable.innerHTML = html;
    }

    function resetSim() {
        state = { units: 1, barrels: 1000, days: 24, opex: 30 };
        if (els.unitsInput) els.unitsInput.value = 1;
        if (els.barrelsInput) els.barrelsInput.value = 1000;
        if (els.daysInput) els.daysInput.value = 24;
        if (els.opexInput) els.opexInput.value = 30;
        calculate();
    }

    // Bind Listeners
    if (els.unitsInput) els.unitsInput.addEventListener('input', (e) => { state.units = parseInt(e.target.value); calculate(); });
    if (els.barrelsInput) els.barrelsInput.addEventListener('input', (e) => { state.barrels = parseInt(e.target.value); calculate(); });
    if (els.daysInput) els.daysInput.addEventListener('input', (e) => { state.days = parseInt(e.target.value); calculate(); });
    if (els.opexInput) els.opexInput.addEventListener('input', (e) => { state.opex = parseInt(e.target.value); calculate(); });

    // Bind Reset Button (since onclick inline was removed or needs to be handled)
    // Note: Inline onclick="resetSim()" in HTML will fail because resetSim is not global.
    // We attached 'resetBtn' id to the button in the HTML migration.
    if (els.resetBtn) els.resetBtn.addEventListener('click', resetSim);

    // Initial calculation
    calculate();
}
