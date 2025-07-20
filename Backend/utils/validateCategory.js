// utils/validateCategory.js
module.exports = function validateCategory(data) {
  const errors = [];
  if (!data.name) errors.push('Name is required');
  if (!['Cat', 'Dog'].includes(data.pet_type)) errors.push('Pet type must be Cat or Dog');
  return errors;
};
