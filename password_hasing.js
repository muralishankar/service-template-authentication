const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

console.log(bcrypt.compareSync(myPlaintextPassword, hash)); // true
console.log(bcrypt.compareSync(someOtherPlaintextPassword, hash)); // false



