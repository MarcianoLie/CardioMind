let model;
const continuousCols = ['age', 'height', 'weight', 'ap_hi', 'ap_lo'];
const categoricalCols = ['gender', 'cholesterol', 'gluc', 'smoke', 'alco', 'active'];

async function loadModel() {
  model = await tf.loadGraphModel('../cardio/model.json');
  console.log("Model loaded.");
}

function preprocessInput(formData) {
  // Convert input to float and normalize manually (replace with real scaler values)
  const means = {
    age: 16000, height: 165, weight: 70, ap_hi: 120, ap_lo: 80
  };
  const stds = {
    age: 6000, height: 10, weight: 15, ap_hi: 20, ap_lo: 10
  };

  let input = [];
  for (let col of continuousCols) {
    const val = parseFloat(formData[col]);
    const norm = (val - means[col]) / stds[col];
    input.push(norm);
  }

  for (let col of categoricalCols) {
    input.push(parseInt(formData[col]));
  }
  console.log(input)

  return tf.tensor2d([input]);
}

document.getElementById('cardio-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  // Fix checkbox values (HTML unchecked checkboxes are not in formData)
  for (let key of ['smoke', 'alco', 'active']) {
    formData[key] = formData[key] === 'on' ? 1 : 0;
  }

  const inputTensor = preprocessInput(formData);

  const prediction = await model.predict(inputTensor).data();
  const risk = prediction[0] < 0.5 ? 'Sehat' : 'Berpotensi';
  document.getElementById('result').innerText = `Prediction: ${risk}`;
});

loadModel();
