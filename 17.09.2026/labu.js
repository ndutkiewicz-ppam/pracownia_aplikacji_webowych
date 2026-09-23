const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function check(guess, target) {
  if (guess === target) {
    return 'correct';
  } else if (guess > target) {
    return 'too_high';
  } else {
    return 'too_low';
  }
}
async function play() {
  const rl = readline.createInterface({ input, output });
  const secretNumber = random(1, 10);
  let attempts = 0;                           
  let isGameOver = false;                    

  console.log('GRA W ZGADYWANIE');
  console.log('Zgadnij liczbe od 1 do 10\n');

  while (!isGameOver) {
    attempts++; 
    
    const answer = await rl.question('podaj liczbę: ');
    const guess = parseInt(answer, 10);

    if (isNaN(guess)) {
      console.log('nie podano liczby\n');
      continue; 
    }

    const result = check(guess, secretNumber);

    if (result === 'correct') {
      console.log(`\nzgadłeś, szukana liczba to ${secretNumber}.`);
      console.log(`ile prób: ${attempts}`);
      isGameOver = true;
    } else if (result === 'too_high') {
      console.log('trochę niżej\n');
    } else {
      console.log('troche wyżej\n');
    }
  }
  rl.close();
}

play();

