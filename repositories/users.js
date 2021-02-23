const fs = require("fs"),
  crypto = require("crypto"),
  util = require("util"),
  Repository = require("../repositories/repository");

// Turn callback hashing function into promise based function
const scrypt = util.promisify(crypto.scrypt);

// Users Repository
class UsersRepository extends Repository {
  // Create user
  async create(attrs) {
    attrs.id = this.randomId();
    // Generate Salt
    const salt = crypto.randomBytes(8).toString("hex");
    // Use salt + password to generate hash
    const buf = await scrypt(attrs.password, salt, 64);
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`,
    };
    records.push(record);
    await this.writeAll(records);
    return record;
  }
  // Compare Hashed Passwords for authentication
  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
    return hashed === hashedSuppliedBuf.toString("hex");
  }
}

// Export Instance
module.exports = new UsersRepository("users.json");
