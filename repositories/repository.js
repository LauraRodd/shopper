const fs = require("fs"),
  crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    // Check  if file name is provided otherwise throw error
    if (!filename) {
      throw new Error("Creating a repository requires a file name");
    }
    // Take provided filename and store it in an instance variable
    this.filename = filename;
    // Check if file exists in our hardrive otherwise create new one
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  // Create new item
  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  // Get list of all records
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  // Write all records to a users.json file
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
  // Generate random ID
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
  // Find user by ID
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }
  // Delete user by ID
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  // Update user's data
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  // Find user by filter
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
