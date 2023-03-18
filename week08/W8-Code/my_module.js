const NAME = 'Bundit5'

const add = (a, b) => a + b
const substract = (a, b) => a - b

// module.exports.NAME = NAME
// module.exports.add = add
// module.exports.substract = substract

// Shortcut -> exports = module.exports
//การนำตัวแปร ไปใช้ใน file อื่น
exports.NAME = NAME  // การตั้งชื่อไม่จำเป็นต้อง ซ้ำกัน
exports.add = add
exports.substract = substract

