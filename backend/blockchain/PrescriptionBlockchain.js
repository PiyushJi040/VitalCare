import crypto from 'crypto';

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class PrescriptionBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addPrescription(prescription) {
    const block = new Block(
      this.chain.length,
      Date.now(),
      prescription,
      this.getLatestBlock().hash
    );
    
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    return block;
  }

  getPrescriptionsByPatient(patientId) {
    return this.chain
      .filter(block => block.data && block.data.patientId === patientId)
      .map(block => ({
        blockHash: block.hash,
        timestamp: block.timestamp,
        prescription: block.data
      }));
  }

  verifyPrescription(blockHash) {
    const block = this.chain.find(b => b.hash === blockHash);
    if (!block) return false;
    return block.hash === block.calculateHash();
  }
}

export default new PrescriptionBlockchain();