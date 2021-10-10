'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // reset to empty before adding new movements__row.

  movements.forEach(function (mov, i) {

    //creating  div element with class movements__row in each iteration. and change some class OR data according
    // mov val.
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
       <div class="movements__row">                         
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__value">${mov}€</div>
       </div>
       `;
    // adding html into given element.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
// displayMovements(account1.movements);

const calcAndDisplayBalance = function (acc) {
  const balance = acc.movements.reduce(function (acu, curr) {
    return acu + curr;
  }, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
}
// calcAndDisplayBalance(account1.movements);

//calc and display summary.
const calcDisplaySummary = function (acc) {

  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acum, movement) => acum + movement, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acum, movement) => acum + movement, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => {
      // interest rate  = 1.2%; on each deposit.
      return (deposit * acc.interestRate) / 100;
    })
    .filter((interest) => {
      //bank decide to give interest only when it greater than 1
      return interest >= 1;
    })
    .reduce((acum, currval) => acum + currval, 0);
  labelSumInterest.textContent = `${interest}€`;
}
// calcDisplaySummary(account1.movements);


//creating username and add new property to every account object;
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    //add new property by computing user name                 
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
}
createUserNames(accounts); // pass array of account objects;

const updateUI = function(acc){
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcAndDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
}


//add event handler's. && implementing login.
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form form submitting
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  // use of optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //correct credentials login the current user.

    //Display UI and welcome msg
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // method use to blur focus of cursor after user login

    //update UI
    updateUI(currentAccount);
  }

});


// implement transfer.
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc =>acc.username===inputTransferTo.value);
  
  inputTransferTo.value = inputTransferAmount.value = '';
  
  if(amount>0 && currentAccount.balance>=amount && receiverAcc && receiverAcc.username!==currentAccount.username){
        //valid transfer.
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        updateUI(currentAccount);
  }
});




/////////////////////////////////////////////////
/////////////////////////////////////////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];