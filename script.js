document.getElementById('addRowBtn').addEventListener('click', function() {
    const table = document.getElementById('valuesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.innerHTML = '<input type="number" step="any" class="xValue" required>';
    cell2.innerHTML = '<input type="number" step="any" class="yValue" required>';
});

document.getElementById('errorCalcForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const xInputs = document.getElementsByClassName('xValue');
    const yInputs = document.getElementsByClassName('yValue');
    
    const xValues = Array.from(xInputs).map(input => parseFloat(input.value));
    const yValues = Array.from(yInputs).map(input => parseFloat(input.value));

    if (xValues.length !== yValues.length || xValues.length === 0) {
        alert('Please enter valid X and Y values.');
        return;
    }

    const n = xValues.length;
    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;

    let xySum = 0, xSumSq = 0, ySumSq = 0;
    for (let i = 0; i < n; i++) {
        xySum += (xValues[i] - xMean) * (yValues[i] - yMean);
        xSumSq += (xValues[i] - xMean) ** 2;
        ySumSq += (yValues[i] - yMean) ** 2;
    }

    const gradient = xySum / xSumSq;
    const intercept = yMean - gradient * xMean;

    let yErrorSum = 0;
    for (let i = 0; i < n; i++) {
        const yCalc = gradient * xValues[i] + intercept;
        yErrorSum += (yValues[i] - yCalc) ** 2;
    }

    const uncertaintyGradient = Math.sqrt((yErrorSum / (n - 2)) / xSumSq);
    const uncertaintyIntercept = uncertaintyGradient * Math.sqrt(xSumSq / n + xMean ** 2);
    const uncertaintyDependent = Math.sqrt(yErrorSum / (n - 2));

    document.getElementById('gradient').textContent = `Gradient: ${gradient.toFixed(4)}`;
    document.getElementById('intercept').textContent = `Intercept: ${intercept.toFixed(4)}`;
    document.getElementById('uncertaintyDependent').textContent = `Uncertainty in Dependent Variable (δy): ${uncertaintyDependent.toFixed(4)}`;
    document.getElementById('uncertaintyIntercept').textContent = `Uncertainty in Intercept (δc): ${uncertaintyIntercept.toFixed(4)}`;
    document.getElementById('uncertaintyGradient').textContent = `Uncertainty in Gradient (δm): ${uncertaintyGradient.toFixed(4)}`;
});

document.getElementById('savePdfBtn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('OUSL Physics Practicals - Error Calc', 10, 10);
    
    doc.setFontSize(12);
    const resultsText = `
    Gradient: ${document.getElementById('gradient').textContent}
    Intercept: ${document.getElementById('intercept').textContent}
    Uncertainty in Dependent Variable (δy): ${document.getElementById('uncertaintyDependent').textContent}
    Uncertainty in Intercept (δc): ${document.getElementById('uncertaintyIntercept').textContent}
    Uncertainty in Gradient (δm): ${document.getElementById('uncertaintyGradient').textContent}
    `;

    doc.text(resultsText, 10, 30);
    doc.text('Created by R. Abishek', 10, 90);
    doc.save('error_calc_results.pdf');
});
