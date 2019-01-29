const pg = require('pg');

const config = {
  user: 'labber',
  password: 'labber',
  database: 'people',
};

const client = new pg.Client(config);

const listPeople = (db, cb) => {
  const query = `SELECT * FROM people;`;

  db.query(query, (err, res) => {
    for (const peopleObj of res.rows) {
      cb(peopleObj);
    }
    db.end();
  });
};

const createPerson = (db, fName, lName) => {
  const query = `INSERT INTO people (first_name, last_name) VALUES ($1::text, $2::text);`;

  db.query(query, [fName, lName], (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`${res.rowCount} inserted`);
    db.end();
  });
};

client.connect(err => {
  console.log(`connected to '${client.database}'`);

  const [node, path, command, firstName, lastName] = process.argv;

  if (command === 'C') {
    createPerson(client, firstName, lastName);
  } else {
    listPeople(client, personObj =>
      console.log(
        `id: ${personObj.id} - First Name: ${personObj.first_name} Last Name: ${
          personObj.last_name
        }`
      )
    );
  }
});
