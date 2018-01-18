const companyStore = require("json-fs-store")("store/companies");
const states = require("../utilities/states").states_hash;

class Company {
  constructor(body, company_type) {
    this.name = body.name;
    this.email = body.email;
    this.phone_number = body.phone_number;
    this.city = body.city;
    this.state = body.state;
    this.company_type = company_type;
    body.id ? (this.id = body.id) : null;
  }

  static getAll(company_type, res) {
    companyStore.list((err, company) => {
      if (err) return res.sendStatus(404);
      //filter by company type
      let filtered = company.filter(corp => {
        return corp.company_type === company_type;
      });
      filtered.length > 0 ? res.json(filtered) : res.sendStatus(404);
    });
  }

  static search(searchQuery, company_type, res) {
    companyStore.list((err, company) => {
      if (err) return res.sendStatus(404);

      //get the first name that matches and is a brand or factory
      let match = company.find(corp => {
        if (corp.name === searchQuery && corp.company_type === company_type) {
          return corp;
        }
      });
      //return the first match or blank
      match ? res.json(match) : res.sendStatus(404);
    });
  }

  static searchByState(state, company_type, res) {
    //checking if they sent a valid state
    if (!states[state]) {
      res
        .status(404)
        .send(
          "The state you entered was not reconized. Please make sure all words are capitalized and in snake case. Ex. 'New_York'"
        );
    }
    companyStore.list((err, company) => {
      if (err) return res.sendStatus(404);
      //get company with matching states
      let match = company.filter(corp => {
        if (corp.state === state && corp.company_type === "brand") {
          return corp;
        }
      });
      //this will only be reached if a valid state was entered
      //checks if "database" returned values
      match.length > 0
        ? res.json(match)
        : res.send(`Sorry, no ${company_type} for entered state.`);
    });
  }

  static update(id, company_type, body, res) {
    //assign the prior id
    body.id = id;
    const newCompany = new Company(body);

    companyStore.remove(id, err => {
      if (err) return res.sendStatus(404);
      companyStore.add({ ...newCompany }, error => {
        if (error) res.sendStatus(404);
        res.json({ ...newCompany });
      });
    });
  }

  static delete(id, res) {
    companyStore.remove(id, err => {
      if (err) return res.sendStatus(404);

      res.sendStatus(200);
    });
  }

  static show(id, res) {
    companyStore.load(id, (err, company) => {
      if (err) return res.sendStatus(400);
      res.json(company);
    });
  }

  static createCompany(body, company_type, res) {
    const newCompany = new Company(body);
    newCompany.company_type = company_type;
    companyStore.add(newCompany, err => {
      if (err) return res.sendStatus(404);
      res.status(201).json(newCompany);
    });
  }
}

module.exports = Company;
