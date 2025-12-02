import InsuranceCompany from "./company.model.js";

export const createInsuranceCompany = (data) => {
  return InsuranceCompany.create(data);
};

export const listInsuranceCompanies = () => {
  return InsuranceCompany.find();
};

export const updateInsuranceCompany = (id, data) => {
  return InsuranceCompany.findByIdAndUpdate(id, data, { new: true });
};

export const disableInsuranceCompany = (id) => {
  return InsuranceCompany.findByIdAndUpdate(id, { active: false }, { new: true });
};
