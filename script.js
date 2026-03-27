const form = document.getElementById('filterForm');
const feedback = document.getElementById('feedback');
const resultTable = document.getElementById('resultTable');

// 🔹 Tableau affiché dès l'ouverture (avant même le calcul)
resultTable.innerHTML = `
  <table border="1" style="width:100%; margin-top:10px; border-collapse:collapse;">
    <tr>
      <th>Trafic (A)</th>
      <th>Probabilité de rejet (Pr %)</th>
      <th>Nombre de canaux (N)</th>
    </tr>
    <tr>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </table>
`;

// ------------------------
// Fonction Factorielle
// ------------------------
function factorial(n) {
  if (n === 0) return 1;
  let f = 1;
  for (let i = 1; i <= n; i++) f *= i;
  return f;
}

// ------------------------
// Formule Erlang B
// ------------------------
function erlangB(N, A) {
  let sum = 0;
  for (let k = 0; k <= N; k++) {
    sum += Math.pow(A, k) / factorial(k);
  }
  return (Math.pow(A, N) / factorial(N)) / sum;
}

// ------------------------
// Calcul de N à partir de A et Pr
// ------------------------
function calculerCanaux(A, Pr) {
  let N = 1;
  let B = erlangB(N, A);

  Pr = Pr / 100; // conversion %

  while (B > Pr) {
    N++;
    B = erlangB(N, A);
  }

  return N;
}

// ------------------------
// Gestion du formulaire
// ------------------------
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const percent = form.percent.value.trim();
  const montant = form.montant.value.trim();

  const errors = [];

  if (percent && (Number(percent) < 0 || Number(percent) > 100)) {
    errors.push('Le % doit être entre 0 et 100.');
  }
  if (montant && Number(montant) < 0) {
    errors.push('Le trafic A doit être positif.');
  }

  if (errors.length > 0) {
    feedback.textContent = errors.join(' ');
    feedback.style.color = '#b3342b';
    return;
  }

  const A = Number(montant);
  const Pr = Number(percent);

  const N = calculerCanaux(A, Pr);

  // ----------------------------
  // Mise à jour du tableau après le calcul
  // ----------------------------
  resultTable.innerHTML = `
    <table border="1" style="width:100%; margin-top:10px; border-collapse:collapse;">
      <tr>
        <th>Trafic (A)</th>
        <th>Probabilité de rejet (Pr %)</th>
        <th>Nombre de canaux (N)</th>
      </tr>
      <tr>
        <td>${A}</td>
        <td>${Pr}%</td>
        <td><b>${N}</b></td>
      </tr>
    </table>
  `;
});