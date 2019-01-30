const pg = require('pg');

const options = {
  user: 'labber',
  password: 'labber',
  database: 'people',
};

const client = new pg.Client(options);

const listPeople = (db, cb) => {
  const query = `SELECT * FROM people;`;

  db.query(query, (err, res) => {
    for (const personObj of res.rows) {
      cb(personObj);
    }
    db.end();
  });
};

const createNewPerson = (db, firstName, lastName) => {
  const query = `INSERT INTO people (first_name, last_name) VALUES ($1::text, $2::text)`;

  db.query(query, [firstName, lastName], (err, res) => {
    if (err) {
      throw err;
    }

    console.log(`${res.rowCount} rows have been inserted`);
    client.end();
  });
};

client.connect(err => {
  console.log(`Connected to ${client.database}`);

  const [node, path, command, fName, lName] = process.argv;

  if (command === 'C') {
    createNewPerson(client, fName, lName);
  } else {
    listPeople(client, personObj => {
      console.log(
        `id: ${personObj.id} - First Name: ${personObj.first_name} Last Name: ${
          personObj.last_name
        }`
      );
    });
  }
});
